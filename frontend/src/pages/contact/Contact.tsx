import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, Send, Github, Linkedin } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import { api } from "@/lib/api";
import { contactSchema, type ContactForm } from "@/utils/validators";

const CONTACT_SEND_TIMEOUT_MS = 7000;

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "accepted">("idle");
  const [submitError, setSubmitError] = useState("");
  const activeControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      activeControllerRef.current?.abort();
    };
  }, []);

  const onChange = (k: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setSubmitError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      parsed.error.issues.forEach((i) => {
        const key = i.path[0] as keyof ContactForm;
        if (!fieldErrors[key]) fieldErrors[key] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setStatus("sending");
    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;

    try {
      const response = await api.post("/contact", parsed.data, {
        signal: controller.signal,
        timeout: CONTACT_SEND_TIMEOUT_MS,
      });

      if (response.status !== 202) {
        throw new Error("Unexpected response status.");
      }

      if (activeControllerRef.current !== controller) return;
      setStatus("accepted");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      if (activeControllerRef.current !== controller) return;

      setStatus("idle");
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          setSubmitError("Request timed out. Please try again.");
        } else if (error.response?.status === 503) {
          setSubmitError("Message service is busy. Please retry in a few moments.");
        } else if (error.code === "ERR_CANCELED") {
          setSubmitError("Message send was interrupted. Please submit again.");
        } else {
          setSubmitError("Message could not be sent. Please try again.");
        }
      } else {
        setSubmitError("Message could not be sent. Please try again.");
      }
    } finally {
      if (activeControllerRef.current === controller) {
        activeControllerRef.current = null;
      }
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 text-black">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Let's build something good together."
              description="Have a project, a role, or just want to say hi? Drop a message - I usually reply within a day."
            />
            <div className="mt-8 space-y-3 text-sm">
              <a
                href="mailto:dev.naved@gmail.com"
                className="inline-flex items-center gap-3 rounded-[14px] border border-[color:var(--color-border)] bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--color-surface)] text-primary">
                  <Mail size={16} />
                </span>
                <span>
                  <span className="block text-xs text-[color:var(--color-muted)]">Email</span>
                  <span className="font-medium">dev.naved@gmail.com</span>
                </span>
              </a>
              <div className="flex gap-2 pt-1">
                <a
                  href="https://github.com/naved574"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-xs font-medium hover:border-[color:var(--color-text)]"
                >
                  <Github size={14} /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/mohmmad-naved-0475783a3/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-xs font-medium hover:border-[color:var(--color-text)]"
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            onSubmit={submit}
            className="rounded-[20px] border border-[color:var(--color-border)] bg-white p-6 shadow-soft md:p-8"
            noValidate
          >
            {status === "accepted" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-12 text-center"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-display text-2xl font-bold">Message accepted</h3>
                <p className="max-w-sm text-sm text-[color:var(--color-muted)]">
                  Thanks for reaching out - your message is in the queue and I will get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-xs font-medium hover:border-[color:var(--color-text)]"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <Field
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={onChange("name")}
                  error={errors.name}
                  placeholder="Enter your name"
                  maxLength={100}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  error={errors.email}
                  placeholder="Enter your email"
                  maxLength={255}
                  autoComplete="email"
                />
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-[color:var(--color-muted)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    maxLength={1000}
                    value={form.message}
                    onChange={onChange("message")}
                    placeholder="Tell me a bit about the project or role..."
                    className={`w-full resize-none rounded-[12px] border bg-white px-3.5 py-3 text-sm outline-none transition-all focus:border-[color:var(--color-text)] focus:ring-2 focus:ring-primary/20 ${
                      errors.message ? "border-red-400" : "border-[color:var(--color-border)]"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex w-full bg-[color:var(--color-text)] items-center justify-center gap-2 rounded-full  px-5 py-3 text-sm font-medium text-[color:var(--sec-color-text)] transition-all hover:-translate-y-0.5  hover:bg-black hover:text-white disabled:opacity-60"
                >
                  {status === "sending" ? "Sending..." : (<><Send size={14} /> Send message</>)}
                </button>
                {submitError && (
                  <p className="text-center text-xs text-red-500">{submitError}</p>
                )}
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
};

function Field({ label, name, value, onChange, error, type = "text", placeholder, maxLength, autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-[color:var(--color-muted)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`w-full rounded-[12px] border bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-[color:var(--color-text)] focus:ring-2 focus:ring-primary/20 ${
          error ? "border-red-400" : "border-[color:var(--color-border)]"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
