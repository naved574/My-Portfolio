import { randomUUID } from "crypto";
import { ContactMessage } from "../models/ContactMessage.js";
import { env } from "../config/env.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toSafePositiveInt = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const rounded = Math.floor(parsed);
  return rounded > 0 ? rounded : fallback;
};

const queueConfig = {
  maxSize: toSafePositiveInt(env.CONTACT_QUEUE_MAX_SIZE, 200),
  maxRetries: toSafePositiveInt(env.CONTACT_QUEUE_MAX_RETRIES, 3),
  baseDelayMs: toSafePositiveInt(env.CONTACT_QUEUE_BASE_DELAY_MS, 500),
  concurrency: toSafePositiveInt(env.CONTACT_QUEUE_CONCURRENCY, 1),
};

class ContactQueue {
  constructor(config) {
    this.config = config;
    this.queue = [];
    this.activeWorkers = 0;
    this.isProcessing = false;
  }

  enqueue(payload) {
    if (this.queue.length >= this.config.maxSize) {
      return null;
    }

    const job = {
      requestId: randomUUID(),
      payload,
      attempt: 0,
    };

    this.queue.push(job);
    this.log("queued", {
      requestId: job.requestId,
      queueLength: this.queue.length,
    });
    this.process();

    return job.requestId;
  }

  process() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    const tick = async () => {
      while (
        this.activeWorkers < this.config.concurrency &&
        this.queue.length > 0
      ) {
        const job = this.queue.shift();
        this.activeWorkers += 1;
        this.runJob(job).finally(() => {
          this.activeWorkers -= 1;
          this.process();
        });
      }

      this.isProcessing = false;
    };

    tick().catch((error) => {
      this.isProcessing = false;
      this.log("processor_error", { error: error.message });
    });
  }

  async runJob(job) {
    try {
      await ContactMessage.create(job.payload);
      this.log("persisted", { requestId: job.requestId, attempt: job.attempt + 1 });
    } catch (error) {
      const nextAttempt = job.attempt + 1;
      const shouldRetry = nextAttempt < this.config.maxRetries;

      if (!shouldRetry) {
        this.log("failed", {
          requestId: job.requestId,
          attempt: nextAttempt,
          error: error.message,
        });
        return;
      }

      const delayMs = this.config.baseDelayMs * 2 ** (nextAttempt - 1);
      this.log("retrying", {
        requestId: job.requestId,
        attempt: nextAttempt,
        retryInMs: delayMs,
        error: error.message,
      });

      await sleep(delayMs);
      this.queue.push({
        ...job,
        attempt: nextAttempt,
      });
    }
  }

  log(event, meta = {}) {
    console.info(
      JSON.stringify({
        scope: "contact_queue",
        event,
        timestamp: new Date().toISOString(),
        ...meta,
      })
    );
  }
}

const contactQueue = new ContactQueue(queueConfig);

export const enqueueContactMessage = (payload) => contactQueue.enqueue(payload);
