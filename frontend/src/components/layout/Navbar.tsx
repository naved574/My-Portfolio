import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/assets/icons/navLogo.svg";
import ThemeToggle from "@/components/layout/ThemeToggle";

const links = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/projects", label: "Projects" },
  { path: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header
      className={`fixed inset-x-0  top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[color:var(--color-border)] [background-color:color-mix(in_srgb,var(--color-bg)_80%,transparent)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight"
          aria-label="Home"
          onClick={() => setOpen(false)}
        >
          <div className="grid place-items-center w-45 rounded-[10px] cursor-pointer">
           <img src={Logo} alt="Logo" className="w-full h-full" />
          </div>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = pathname === l.path;
            return (
              <li key={l.path}>
                <button
                  onClick={() => go(l.path)}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
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
          <ThemeToggle />
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-2 text-sm font-medium text-[color:var(--color-text)] transition-all hover:border-[color:var(--color-text)] hover:-translate-y-0.5"
          >
            <Download size={14} /> Resume
          </a>
          <button
            onClick={() => go("/contact")}
            className="rounded-full bg-[color:var(--color-text)] px-4 py-2 text-sm border border-[color:var(--color-border)] font-medium text-[color:var(--sec-color-text)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--sec-color-text)] hover:text-[color:var(--color-text)] hover:border-[color:var(--color-text)] "
          >
            Hire Me
          </button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] md:hidden"
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
            className="border-t border-[color:var(--color-border)] bg-[color:var(--color-bg)] md:hidden"
          >
            <div className="mx-auto max-w-6xl px-5 py-3">
              {links.map((l) => (
                <button
                  key={l.path}
                  onClick={() => go(l.path)}
                  className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-medium ${
                    pathname === l.path
                      ? "bg-[color:var(--color-surface)] text-[color:var(--color-text)]"
                      : "text-[color:var(--color-muted)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <div className="mt-2 flex gap-2">
                <ThemeToggle />
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-medium"
                >
                  <Download size={14} /> Resume
                </a>
                <button
                  onClick={() => go("/contact")}
                  className="flex-1 rounded-full bg-[color:var(--color-surface)] px-4 py-2.5 text-sm font-medium text-white"
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
