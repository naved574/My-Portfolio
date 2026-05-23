import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`[env] Missing ${key}. Set it in .env before running the API.`);
  }
}

export const env = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  USER_JWT_EXPIRES_IN: process.env.USER_JWT_EXPIRES_IN || "7d",
  ADMIN_JWT_EXPIRES_IN: process.env.ADMIN_JWT_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
  CONTACT_QUEUE_MAX_SIZE: Number(process.env.CONTACT_QUEUE_MAX_SIZE || 200),
  CONTACT_QUEUE_MAX_RETRIES: Number(process.env.CONTACT_QUEUE_MAX_RETRIES || 3),
  CONTACT_QUEUE_BASE_DELAY_MS: Number(process.env.CONTACT_QUEUE_BASE_DELAY_MS || 500),
  CONTACT_QUEUE_CONCURRENCY: Number(process.env.CONTACT_QUEUE_CONCURRENCY || 1),
};
