import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Github, Linkedin } from "lucide-react";
import portrait from "@/assets/images/portrait.webp";
import bgVideo from "@/assets/videos/hero-bg.webm";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top, behavior: "smooth" });
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsSmall(
        window.matchMedia("(max-width: 640px)").matches ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-24 md:pt-28 "
      aria-label="Introduction"
    >
      {/* Video background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {!isSmall && (
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            src={bgVideo}
            autoPlay
            loop
            muted
            preload="none"
            poster={portrait}
            onCanPlay={() => setVideoReady(true)}
          />
        )}
        {/* Light overlays for readability */}
        <div className="absolute inset-0 bg-white/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-white" />
        <div className="absolute inset-0 bg-grid opacity-[0.35]" />
      </div>

      <div className=" rounded-xl mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-8 md:pb-28 md:pt-16">
        {/* On mobile we want image first; on desktop text first */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 md:order-1"
        >
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white/80 px-3 py-1 text-xs font-medium text-[color:var(--color-muted)] backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/70" />
              <span className="relative h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for new projects
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="font-display mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text)] md:text-6xl"
          >
            Hi, I'm <span className="text-primary">Mohmad Naved</span> —<br className="hidden md:block" />{" "}
            a full-stack developer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-muted)] md:text-lg"
          >
            I build modern, responsive, and user-friendly web experiences. Day to day I work
            with <b className="text-[color:var(--color-text)] font-semibold">React</b>,{" "}
            <b className="text-[color:var(--color-text)] font-semibold">Tailwind</b>, and{" "}
            <b className="text-[color:var(--color-text)] font-semibold">Node.js</b> to ship
            interfaces that feel fast and calm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-text)] px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-black"
            >
              View Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-medium text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
            >
              <Mail size={16} /> Contact Me
            </button>
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/15"
            >
              <Download size={16} /> Download Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex items-center gap-4 text-[color:var(--color-muted)]"
          >
            <a
              href="https://github.com/naved574"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-[color:var(--color-text)]"
            >
              <Github size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/mohmmad-naved-0475783a3/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-[color:var(--color-text)]"
            >
              <Linkedin size={18} />
            </a>
            <span className="text-xs uppercase tracking-[0.2em]">Based remotely</span>
          </motion.div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 mx-auto w-full max-w-sm md:order-2 md:max-w-none"
        >
          <div className="absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-2xl" />
          <div className="group relative overflow-hidden rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-soft transition-transform duration-500 hover:scale-[1.02] hover:shadow-lift">
            <img
              src={portrait}
              alt="Portrait of Mohmad Naved"
              width={900}
              height={900}
              loading="eager"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-xs backdrop-blur">
              <span className="font-medium text-[color:var(--color-text)]">Mohmad Naved</span>
              <span className="text-[color:var(--color-muted)]">Full-Stack Dev</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}