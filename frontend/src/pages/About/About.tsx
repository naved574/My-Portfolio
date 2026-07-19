import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  Code2,
  Database,
  GitBranch,
  Layers,
  Palette,
  Server,
  Sparkles,
  Workflow,
  Cpu,
  Laptop,
  Terminal,
  Coffee,
  Award,
  Activity,
  User,
  MapPin,
  Clock,
  Briefcase,
  Music,
  Heart,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";

export default function About() {
  const [activeTab, setActiveTab] = useState<"philosophy" | "stack" | "fun-facts">("philosophy");

  const currentYear = new Date().getFullYear();

  // Premium interactive metrics stats
  const stats = [
    { label: "Completed Projects", value: "24+", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Hours of Crafting", value: "3,200+", icon: Clock, color: "text-sky-500", bg: "bg-sky-500/10" },
    { label: "Total Git Commits", value: "1,850+", icon: GitBranch, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Coffee Consumed", value: "850+ L", icon: Coffee, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  // Structured detailed developer skill categories
  const skillCategories = [
    {
      title: "Frontend Engineering",
      icon: Laptop,
      color: "text-blue-500",
      skills: [
        { name: "React & TypeScript", level: 92 },
        { name: "Next.js / SSR & SSG", level: 85 },
        { name: "Tailwind CSS & Styling", level: 95 },
        { name: "Framer Motion Animations", level: 88 },
      ],
    },
    {
      title: "Backend & Systems",
      icon: Server,
      color: "text-purple-500",
      skills: [
        { name: "Node.js & Express.js", level: 90 },
        { name: "MongoDB & Schema Design", level: 88 },
        { name: "RESTful API Architecture", level: 93 },
        { name: "JWT Auth & Session Guarding", level: 85 },
      ],
    },
    {
      title: "DevOps & Workflows",
      icon: Cpu,
      color: "text-emerald-500",
      skills: [
        { name: "Git & Version Control", level: 90 },
        { name: "CI / CD & Workflows", level: 75 },
        { name: "Vercel, Render & Docker", level: 80 },
        { name: "Vite, ESBuild & Bundling", level: 85 },
      ],
    },
  ];

  // Interactive Detailed Timeline
  const timeline = [
    {
      year: "2026",
      role: "Full-Stack Software Craftsman",
      company: "Freelance & Independent Client Pipelines",
      desc: "Architecting high-performance client dashboards, custom portfolio systems, and motion-rich e-commerce portals. Mastering state performance and atomic asset pipelines.",
      highlights: [
        "Constructed advanced admin panels with real-time analytics graphs.",
        "Engineered secure OAuth authorization integrations with external providers.",
        "Refined rendering latency and bundle structures in production sites.",
      ],
      icon: Sparkles,
      color: "from-primary to-indigo-600",
    },
    {
      year: "2025",
      role: "Full-Stack Portfolio CMS Architect",
      company: "Independent Developer Sandbox",
      desc: "Engineered responsive full-stack portals featuring custom CMS pipelines, fully responsive image uploading pipelines, real-time feedback forms, and protected route handlers.",
      highlights: [
        "Built responsive local file storage caches and asset optimization routines.",
        "Implemented robust server-side schema verification policies using Zod.",
        "Designed rich bento-style responsive layout architectures.",
      ],
      icon: Terminal,
      color: "from-indigo-500 to-purple-600",
    },
    {
      year: "2024",
      role: "MERN Stack Specialist",
      company: "Client-Focused Product Sprints",
      desc: "Transitioned to full-stack applications with robust express routers, database index fine-tuning, aggregation pipelines, and fully dynamic interactive user journeys.",
      highlights: [
        "Learned database aggregation techniques to compute complex metrics.",
        "Constructed intuitive responsive sidebars, cards, and modal systems.",
        "Deployed complex backends to Render and cloud instances.",
      ],
      icon: Database,
      color: "from-purple-500 to-rose-500",
    },
    {
      year: "2023",
      role: "Self-Taught Interface Enthusiast",
      company: "Foundational Code Academy",
      desc: "Embarked on a self-guided journey to master semantic HTML, CSS-in-JS patterns, responsive media boundaries, and core React patterns. Fostered a passion for aesthetic design systems.",
      highlights: [
        "Crafted over 40+ responsive mockups and landing pages.",
        "Mastered the physics of Framer Motion spring transitions.",
        "Developed custom helper routines to speed up standard style bindings.",
      ],
      icon: Code2,
      color: "from-rose-500 to-amber-500",
    },
  ];

  const funFacts = [
    { title: "Preferred Editor", value: "VS Code with Slate Grey themes", icon: Laptop },
    { title: "Music Vibe", value: "Lofi Beats & Synthwave", icon: Music },
    { title: "Core Design Value", value: "Utmost simplicity & high accessibility", icon: Heart },
    { title: "Preferred Beverage", value: "Premium Green Tea & Hot Coffee", icon: Coffee },
    { title: "Active Focus", value: "System latency & layout micro-animations", icon: Activity },
    { title: "Primary Target", value: "Full-stack cloud applications", icon: Terminal },
  ];

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden bg-[color:var(--color-bg)]">
      
      {/* Background radial glowing effects */}
      <div className="absolute top-1/4 -right-20 -z-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 -z-10 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title Section */}
        <SectionHeading
          eyebrow="My Background"
          title="Pixel-perfect layout. Robust, scale-ready system architecture."
          description="I construct software platforms focusing intensely on the tiny boundaries. The motion speed, active states, custom layout spacing, and readable developer comments — all executed to a stellar standard."
        />

        {/* Premium Profile Hero Split */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Interactive Card Presentation (5 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-soft relative group overflow-hidden"
          >
            {/* Ambient background accent bubble */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-br from-primary/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-110 duration-500 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              
              {/* Profile Avatar Representation Card */}
              <div className="flex items-center gap-4.5 pb-6 border-b border-[color:var(--color-border)]">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg relative shrink-0">
                  <User size={24} className="animate-pulse" />
                  <span className="absolute bottom-[-2px] right-[-2px] block h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-[color:var(--color-text)]">Mohmad Naved</h3>
                  <div className="text-xs font-semibold text-[color:var(--color-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-primary" />
                    <span>Based in India • Open to Remote</span>
                  </div>
                </div>
              </div>

              {/* Developer Credentials Details Info */}
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl px-4 py-3">
                  <span className="text-[color:var(--color-muted)] font-medium">Role</span>
                  <span className="font-bold text-primary dark:text-white flex items-center gap-1.5 text-xs">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    Full-Stack Engineer
                  </span>
                </div>

                <div className="flex justify-between items-center bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl px-4 py-3">
                  <span className="text-[color:var(--color-muted)] font-medium">Core Frameworks</span>
                  <span className="font-bold text-[color:var(--color-text)] text-xs">React, TS, Express</span>
                </div>

                <div className="flex justify-between items-center bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl px-4 py-3">
                  <span className="text-[color:var(--color-muted)] font-medium">Active Code Style</span>
                  <span className="font-bold text-[color:var(--color-text)] font-mono text-xs">Strict Prettier / ESLint</span>
                </div>
              </div>

              {/* Fun Quote Box */}
              <div className="bg-primary/[0.03] dark:bg-white/[0.02] border border-primary/10 rounded-2xl p-4 text-xs italic text-[color:var(--color-muted)] leading-relaxed">
                "Software engineering isn't just about outputting syntactically correct code blocks. It is the art of crafting clean pipelines that survive real users and scale transparently."
              </div>

            </div>
          </motion.div>

          {/* Interactive Navigation Details Panel (7 columns on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Tab Switcher buttons */}
            <div className="flex p-1 bg-black/[0.03] dark:bg-white/[0.03] border border-[color:var(--color-border)] rounded-2xl w-fit">
              {(["philosophy", "stack", "fun-facts"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 capitalize select-none cursor-pointer ${
                    activeTab === tab
                      ? "bg-white dark:bg-gray-800 text-[color:var(--color-text)] shadow-sm border border-gray-100/50 dark:border-gray-700/50"
                      : "text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {tab === "fun-facts" ? "Developer Trivia" : tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[280px]">
              {activeTab === "philosophy" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-bold text-[color:var(--color-text)] font-display">Philosophy & Methodology</h4>
                  <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
                    My engineering approach is rooted in standard modern best practices. I start by reviewing the core layout architecture before writing a single line of state.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="border border-[color:var(--color-border)] rounded-2xl p-4.5 bg-[color:var(--color-surface)]">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <TrendingUp size={16} />
                      </div>
                      <h5 className="text-sm font-bold text-[color:var(--color-text)]">Performance Metrics</h5>
                      <p className="text-xs text-[color:var(--color-muted)] mt-1.5 leading-relaxed">
                        Keeping web platform load speeds low using fine-tuned assets, code-splitting modules, and optimized React re-renders.
                      </p>
                    </div>

                    <div className="border border-[color:var(--color-border)] rounded-2xl p-4.5 bg-[color:var(--color-surface)]">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                        <Palette size={16} />
                      </div>
                      <h5 className="text-sm font-bold text-[color:var(--color-text)]">Visual Polish</h5>
                      <p className="text-xs text-[color:var(--color-muted)] mt-1.5 leading-relaxed">
                        Translating complex wireframes into precise CSS implementations with balanced color weight and spacing details.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "stack" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-bold text-[color:var(--color-text)] font-display">Technology Architecture</h4>
                  <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
                    I leverage verified production packages to assemble robust platforms. Here's my core execution setup:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    {skillCategories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.title}
                          className="border border-[color:var(--color-border)] rounded-2xl p-4 bg-[color:var(--color-surface)] hover:border-primary/20 duration-300"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Icon size={16} className={cat.color} />
                            <span className="text-xs font-bold text-[color:var(--color-text)] uppercase tracking-wider">{cat.title}</span>
                          </div>
                          <ul className="space-y-2">
                            {cat.skills.slice(0, 3).map((s) => (
                              <li key={s.name} className="space-y-1">
                                <div className="flex justify-between text-[11px]">
                                  <span className="text-[color:var(--color-muted)] font-medium">{s.name}</span>
                                  <span className="font-mono text-[color:var(--color-text)]">{s.level}%</span>
                                </div>
                                <div className="h-1 w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.level}%` }} />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "fun-facts" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="text-lg font-bold text-[color:var(--color-text)] font-display">Developer Trivia</h4>
                  <p className="text-sm leading-relaxed text-[color:var(--color-muted)]">
                    A glance inside my sandbox workspace environment settings:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {funFacts.map((fact) => {
                      const Icon = fact.icon;
                      return (
                        <div
                          key={fact.title}
                          className="border border-[color:var(--color-border)] rounded-2xl p-4 bg-[color:var(--color-surface)] flex flex-col justify-between hover:scale-102 duration-300"
                        >
                          <Icon size={16} className="text-primary" />
                          <div className="mt-3">
                            <div className="text-[10px] uppercase tracking-wider text-[color:var(--color-muted)] font-mono">{fact.title}</div>
                            <div className="text-xs font-bold text-[color:var(--color-text)] mt-0.5">{fact.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

          </div>

        </div>

        {/* Dynamic interactive metric blocks */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 flex items-center gap-4 hover:border-primary/20 hover:shadow-soft duration-300"
              >
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-muted)] mt-0.5">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Premium Timeline Section */}
        <div className="mt-28 border-t border-[color:var(--color-border)] pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Header Info Panel */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary uppercase tracking-widest">
                <Briefcase size={12} />
                Professional Growth
              </span>
              <h3 className="text-3xl font-bold font-display tracking-tight text-[color:var(--color-text)]">
                The Career Road
              </h3>
              <p className="text-sm text-[color:var(--color-muted)] leading-relaxed">
                An overview of my growth as an engineer, stepping up from custom visual mockups into fully realized production MERN stack environments.
              </p>
              
              <div className="hidden lg:block bg-primary/[0.02] dark:bg-white/[0.01] border border-[color:var(--color-border)] rounded-2xl p-4.5 text-xs text-[color:var(--color-muted)] space-y-2">
                <span className="font-bold text-[color:var(--color-text)] block">Core Philosophy:</span>
                "Code is written for humans to read first, and microprocessors to execute second. High standards are mandatory."
              </div>
            </div>

            {/* Right Interactive Timeline Line */}
            <div className="lg:col-span-8 relative">
              {/* Core Vertical Timeline Line */}
              
              {/* <div className="absolute left-[21px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-indigo-500 to-transparent" /> */}

              <div className="space-y-10">
                {timeline.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative pl-14 group"
                    >
                      {/* Timeline Icon Node */}
                      <div className="absolute left-0 top-1.5 h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-indigo-600/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 duration-300 shadow-soft">
                        <Icon size={18} className="animate-pulse" />
                      </div>

                      {/* Timeline Year Badge */}
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold font-mono tracking-widest text-primary uppercase">
                        {item.year}
                      </div>

                      {/* Description Header */}
                      <h4 className="text-lg font-bold text-[color:var(--color-text)] font-display mt-2">
                        {item.role}
                      </h4>
                      <p className="text-xs font-bold text-primary mt-0.5">
                        {item.company}
                      </p>

                      <p className="text-sm leading-relaxed text-[color:var(--color-muted)] mt-2">
                        {item.desc}
                      </p>

                      {/* Mini highlights bullets */}
                      <ul className="mt-3.5 space-y-1.5 border-l border-[color:var(--color-border)] pl-4">
                        {item.highlights.map((hl, hIdx) => (
                          <li key={hIdx} className="text-xs text-[color:var(--color-muted)] flex items-start gap-1.5">
                            <ChevronRight size={12} className="text-primary mt-0.5 shrink-0" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>

                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
