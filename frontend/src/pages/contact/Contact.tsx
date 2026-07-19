import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  Send,
  Github,
  Linkedin,
  MapPin,
  Clock,
  MessageSquare,
  User,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  Heart,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import { api } from "@/lib/api";
import { contactSchema, type ContactForm } from "@/utils/validators";

const CONTACT_SEND_TIMEOUT_MS = 10000;

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

  // Stagger entry animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-text)]">
      
      {/* Visual background ambient glowing elements */}
      <div className="absolute top-1/4 -right-10 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -left-10 -z-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Responsive dual split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Premium Details, Links & Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">
                <Sparkles size={11} className="animate-pulse" />
                Let's Connect
              </span>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[color:var(--color-text)] font-display leading-[1.15]">
                Let's construct something <span className="text-primary">extraordinary</span> together.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[color:var(--color-muted)]">
                Have a client project, a role openings proposal, or looking to schedule a visual design consultation? Shoot over a message and I'll jump right on it.
              </p>
            </div>

            {/* Quick interactive contact details */}
            <div className="space-y-3.5">
              
              {/* Email Connection Card */}
              <a
                href="mailto:dev.naved@gmail.com"
                id="contact-email-card"
                className="flex items-center gap-4.5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 hover:border-primary/30 hover:scale-[1.02] active:scale-98 transition-all duration-300 shadow-soft group"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)]">Direct Mailbox</span>
                  <span className="font-bold text-sm sm:text-base text-[color:var(--color-text)] truncate block">dev.naved@gmail.com</span>
                </div>
                <ArrowRight size={14} className="text-[color:var(--color-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </a>

              {/* Grid cards for typical responses and location */}
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Location card */}
                <div className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl p-4 flex flex-col justify-between h-28">
                  <MapPin size={16} className="text-indigo-500" />
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[color:var(--color-muted)]">Based in</span>
                    <h4 className="text-xs font-bold text-[color:var(--color-text)] mt-0.5">India (Remote Friendly)</h4>
                  </div>
                </div>

                {/* Speed card */}
                <div className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl p-4 flex flex-col justify-between h-28">
                  <Clock size={16} className="text-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-[color:var(--color-muted)]">Response Speed</span>
                    <h4 className="text-xs font-bold text-[color:var(--color-text)] mt-0.5">Under 12 hours</h4>
                  </div>
                </div>

              </div>
            </div>

            {/* Structured "Why collaborate" row */}
            <div className="bg-primary/[0.02] dark:bg-white/[0.01] border border-[color:var(--color-border)] rounded-2xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-text)] font-mono border-l-2 border-primary pl-2.5">
                Collaboration Perks
              </h4>
              <ul className="space-y-2.5 text-xs text-[color:var(--color-muted)]">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Production-ready, highly organized TypeScript code.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Clean layouts matching exact responsive guidelines.</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Consistent communications & version log updates.</span>
                </li>
              </ul>
            </div>

            {/* Social Connection Badges */}
            <div className="space-y-2.5">
              <span className="text-[10px] block font-mono text-[color:var(--color-muted)] uppercase tracking-widest">
                External Networks
              </span>
              <div className="flex gap-2">
                <a
                  href="https://github.com/naved574"
                  target="_blank"
                  rel="noreferrer"
                  id="contact-social-github"
                  className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2.5 text-xs font-semibold hover:border-primary/40 hover:-translate-y-0.5 duration-200 select-none text-[color:var(--color-text)]"
                >
                  <Github size={14} className="text-primary" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mohmmad-naved-0475783a3/"
                  target="_blank"
                  rel="noreferrer"
                  id="contact-social-linkedin"
                  className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2.5 text-xs font-semibold hover:border-primary/40 hover:-translate-y-0.5 duration-200 select-none text-[color:var(--color-text)]"
                >
                  <Linkedin size={14} className="text-primary" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Side: High-polish Interactive Form Card */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 sm:p-8 shadow-soft relative overflow-hidden group"
            >
              {/* Subtle accent background circle */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

              {status === "accepted" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-4.5 py-12 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={32} className="animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-black text-[color:var(--color-text)]">Transmission Secured</h3>
                    <p className="max-w-md text-sm text-[color:var(--color-muted)] mt-2 leading-relaxed">
                      Thank you for reaching out! Your message has been encrypted and logged inside the active communication queue.
                    </p>
                  </div>

                  {/* Diagnostic status list */}
                  <div className="w-full max-w-sm bg-black/[0.02] dark:bg-white/[0.02] border border-[color:var(--color-border)] rounded-2xl p-4.5 font-mono text-[10px] text-[color:var(--color-muted)] text-left space-y-2">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-emerald-500 font-bold">202 ACCEPTED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Routing Node:</span>
                      <span>inbox-relayer-secure</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diagnostics:</span>
                      <span>handshake complete</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] px-4.5 py-2 text-xs font-semibold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 cursor-pointer select-none shadow-sm active:scale-95"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-5 relative z-10" noValidate>
                  
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                      <User size={12} className="text-primary" />
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={onChange("name")}
                      placeholder="Name"
                      maxLength={100}
                      autoComplete="name"
                      className={`w-full rounded-xl border bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        errors.name ? "border-red-400 focus:ring-red-500/10" : "border-[color:var(--color-border)]"
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs font-semibold text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                      <Mail size={12} className="text-primary" />
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange("email")}
                      placeholder="Email"
                      maxLength={255}
                      autoComplete="email"
                      className={`w-full rounded-xl border bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        errors.email ? "border-red-400 focus:ring-red-500/10" : "border-[color:var(--color-border)]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs font-semibold text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                      <MessageSquare size={12} className="text-primary" />
                      Message Details
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      maxLength={1000}
                      value={form.message}
                      onChange={onChange("message")}
                      placeholder="What project goals or role parameters can we dive into?"
                      className={`w-full resize-none rounded-xl border bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        errors.message ? "border-red-400 focus:ring-red-500/10" : "border-[color:var(--color-border)]"
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-semibold text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submission Error Block */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-950/50 rounded-xl p-3 flex items-start gap-2"
                    >
                      <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </motion.div>
                  )}

                  {/* Submit trigger button */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full relative overflow-hidden group inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 px-5 py-3.5 text-sm font-semibold transition-all duration-300 shadow-soft select-none disabled:opacity-65 hover:shadow-lift hover:-translate-y-0.5 cursor-pointer"
                  >
                    {status === "sending" ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Secure Message</span>
                      </>
                    )}
                  </button>

                  {/* Tiny security warning caption */}
                  <p className="text-[10px] text-center text-[color:var(--color-muted)] flex items-center justify-center gap-1">
                    <Terminal size={10} className="text-primary" />
                    <span>Protected by CSRF tokens & standard SSL encryption policies</span>
                  </p>

                </form>
              )}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
