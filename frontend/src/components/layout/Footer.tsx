import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ArrowUp, Sparkles, Code2, Heart, ExternalLink, Cpu, Terminal } from "lucide-react";
import Logo from "@/assets/icons/navLogo.svg";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const socials = [
    { icon: Github, href: "https://github.com/naved574", label: "GitHub", color: "hover:text-black dark:hover:text-white" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/mohmmad-naved-0475783a3/", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Mail, href: "mailto:naved.ansari0003@gmail.com", label: "Email", color: "hover:text-primary" },
  ];

  const exploreLinks = [
    { label: "Home", path: "/" },
    { label: "About Me", path: "/about" },
    { label: "Projects", path: "/projects" },
    { label: "Contact", path: "/contact" },
  ];

  const toolkit = [
    { name: "React & TS", desc: "Interactive client applications" },
    { name: "Tailwind CSS", desc: "Design-system-first responsive layouts" },
    { name: "Node.js & Express", desc: "Secure robust REST APIs" },
    { name: "MongoDB", desc: "Optimized database structures" },
  ];

  return (
    <footer className="relative bg-[color:var(--color-bg)] border-t border-[color:var(--color-border)] overflow-hidden transition-colors duration-500">

      
      {/* Background elegant gradient blooms */}
      <div className="absolute bottom-0 right-1/4 -z-10 w-[500px] h-[250px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-10 -z-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Top Accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic CTA Header section inside Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[color:var(--color-border)] pb-12 mb-12 gap-6"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <Sparkles size={11} className="animate-pulse" />
              Collaboration
            </span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-bold font-display tracking-tight text-[color:var(--color-text)]">
              Let's create something exceptional together.
            </h3>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">
              Open for full-time roles, freelance pipelines, and design system consulting.
            </p>
          </div>
          <Link
            to="/contact"
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 px-5 py-3.5 text-sm font-semibold transition-all duration-300 shadow-soft select-none hover:shadow-lift hover:-translate-y-0.5"
            id="footer-cta-btn"
          >
            Start a Conversation
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
          </Link>
        </motion.div>

        {/* Multi-column grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-12"
        >
          {/* Column 1: Brand details (5 columns wide on desktop) */}
          <motion.div variants={itemVariants} className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-auto h-auto ">
                <div>
                  <img src={Logo} alt="Logo" className="h-full w-full" />
                </div>
                <span className="text-[10px] pl-4 block font-mono text-[color:var(--color-muted)] uppercase tracking-widest leading-none">
                  Developer Portfolio
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[color:var(--color-muted)] max-w-sm">
              Highly passionate Full-Stack developer constructing fast, robust REST architectures matched with delightful interfaces.
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-muted)] transition-colors duration-200 cursor-pointer ${social.color}`}
                    id={`footer-social-${social.label.toLowerCase()}`}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Navigation Links (2 columns wide on desktop) */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-text)] font-mono border-l-2 border-primary pl-2.5">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-[color:var(--color-muted)] hover:text-[color:var(--color-text)] transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Toolkit info (3 columns wide on desktop) */}
          <motion.div variants={itemVariants} className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-text)] font-mono border-l-2 border-primary pl-2.5">
              Platform Toolkit
            </h4>
            <div className="space-y-3">
              {toolkit.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <span className="text-xs font-semibold text-[color:var(--color-text)]">{item.name}</span>
                  <span className="text-[11px] text-[color:var(--color-muted)]">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Column 4: Status Indicator Panel (2 columns wide on desktop) */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-text)] font-mono border-l-2 border-primary pl-2.5">
              System State
            </h4>
            
            <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-[color:var(--color-text)]">Active & Ready</span>
              </div>
              
              <div className="text-[10px] font-mono text-[color:var(--color-muted)] space-y-1">
                <div className="flex justify-between">
                  <span>Env:</span>
                  <span className="text-[color:var(--color-text)]">Production</span>
                </div>
                <div className="flex justify-between">
                  <span>HMR:</span>
                  <span className="text-[color:var(--color-text)]">Disabled</span>
                </div>
              </div>
            </div>

            {/* Back to Top Floating Action */}
            <button
              onClick={handleScrollToTop}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-[color:var(--color-text)] transition-colors cursor-pointer select-none"
              id="footer-back-to-top"
            >
              <ArrowUp size={14} className="animate-bounce" />
              Back to Top
            </button>
          </motion.div>

        </motion.div>

        {/* Lower copyright bar */}
        <div className="border-t border-[color:var(--color-border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[color:var(--color-muted)]">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Mohmad Naved. Built with pride using React, Tailwind & TS.</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart size={12} className="text-red-500 fill-current animate-pulse inline mx-0.5" />
            <span>by</span>
            <span className="font-semibold text-[color:var(--color-text)]">Mohmad Naved</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
