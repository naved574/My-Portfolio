import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import Logo from "@/assets/icons/logo.svg";

const links = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(links.map((l) => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0  top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[color:var(--color-border)] bg-white/80 backdrop-blur-md"
          : "border-b border-transparent bg-white/0"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <button
          onClick={() => go("home")}
          className="font-display text-lg font-bold tracking-tight"
          aria-label="Home"
        >
          <div className="grid place-items-center w-32 rounded-[10px] cursor-pointer">
           <img src={Logo} alt="Logo" className="w-full h-full" />
          </div>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[color:var(--color-text)]"
                      : "text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[color:var(--color-surface)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-text)] transition-all hover:border-[color:var(--color-text)] hover:-translate-y-0.5"
          >
            <Download size={14} /> Resume
          </a>
          <button
            onClick={() => go("contact")}
            className="rounded-full bg-[color:var(--color-text)] px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-black"
          >
            Hire Me
          </button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--color-border)] bg-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[color:var(--color-border)] bg-white md:hidden"
          >
            <div className="mx-auto max-w-6xl px-5 py-3">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-medium ${
                    active === l.id
                      ? "bg-[color:var(--color-surface)] text-[color:var(--color-text)]"
                      : "text-[color:var(--color-muted)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-2 flex gap-2">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-medium"
                >
                  <Download size={14} /> Resume
                </a>
                <button
                  onClick={() => go("contact")}
                  className="flex-1 rounded-full bg-[color:var(--color-text)] px-4 py-2.5 text-sm font-medium text-white"
                >
                  Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}