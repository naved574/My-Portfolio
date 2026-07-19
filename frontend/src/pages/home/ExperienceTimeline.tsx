import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Milestone, Sparkles, BookOpen, Terminal, Zap, LucideIcon } from "lucide-react";

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  desc: string;
  highlights: string[];
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    id: "afhaf",
    year: "2023",
    title: "The Genesis",
    subtitle: "Began Serious Programming Journey",
    icon: BookOpen,
    desc: "Began studying computer science core theories and software design methodologies. Mastered React component architecture, CSS variables, and clean document layouts.",
    highlights: ["React Hooks & Context patterns", "Asynchronous JavaScript models", "Responsive visual layouts"],
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "bfhbf",
    year: "2024",
    title: "Going Full-Stack",
    subtitle: "Express APIs & Document DB Schemas",
    icon: Terminal,
    desc: "Shifted focus to end-to-end full-stack architectures. Built secure REST APIs utilizing Express, MongoDB/Mongoose, and custom route validators.",
    highlights: ["Express server routers & rate-limiters", "Secure JWT & Cookie sessions", "Complex database aggregation queries"],
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "dfhdf",
    year: "2025",
    title: "CMS Integrations",
    subtitle: "Portfolio Content Management System",
    icon: Zap,
    desc: "Created modular management consoles where admins can perform CRUD operations on projects, review visitor contact cues, and upload file attachments.",
    highlights: ["Admin dashboard with analytical summaries", "Secure database route protections", "In-Memory fallback state managers"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "efhef",
    year: "2025",
    title: "Production Scaling",
    subtitle: "High Fidelity SaaS Interfaces",
    icon: Sparkles,
    desc: "Polishing dynamic user experiences with fine-tuned micro-interactions, seamless transitions, responsive sidebars, and fluid responsive grids.",
    highlights: ["Performance optimization standards", "Framer Motion layout transformations", "Production-grade code structuring"],
    color: "from-pink-500 to-rose-500"
  }
];

export default function ExperienceTimeline() {
  const [activeItem, setActiveItem] = useState<number>(timelineData.length - 1);
  const activeTimeline = timelineData[activeItem];

  return (
    <section className="w-full bg-[var(--color-bg)] px-4 py-20 sm:px-8 md:px-12 relative overflow-hidden" id="journey">
      {/* Dynamic light blob in background */}
      <div className="absolute top-1/2 left-10 -z-10 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <Milestone size={12} />
            My Journey
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-4xl font-display">
            Milestones & Career Timeline
          </h2>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[color:var(--color-muted)]">
            An interactive walk through how I learned to build, scale, and deliver full-stack SaaS interfaces.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Timeline Milestones Navigation (5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            {timelineData.map((item, index) => {
              const isActive = activeItem === index;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(index)}
                  className={`w-full text-left rounded-2xl border p-5 flex items-center justify-between transition-all duration-300 relative overflow-hidden cursor-pointer select-none ${
                    isActive
                      ? "bg-black border-black text-white dark:bg-white dark:border-white dark:text-black shadow-lift"
                      : "bg-[color:var(--color-surface)] border-[color:var(--color-border)] text-[color:var(--color-text)] hover:border-[color:var(--color-text)]"
                  }`}
                  id={`timeline-nav-${item.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Glowing Accent Indicator */}
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all ${
                        isActive
                          ? "bg-white/10 border-white/20 text-white dark:bg-black/10 dark:border-black/20 dark:text-black"
                          : "bg-[color:var(--color-bg)] border-[color:var(--color-border)] text-primary"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isActive ? "text-primary-50" : "text-primary"}`}>
                          {item.year}
                        </span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                        )}
                      </div>
                      <h4 className="text-base font-bold mt-0.5">{item.title}</h4>
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-300 ${isActive ? "translate-x-1 opacity-100" : "opacity-40 group-hover:opacity-100"}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Timeline Detail Card View (7 columns) */}
          <div className="lg:col-span-7 h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 sm:p-8 shadow-soft flex flex-col justify-between h-full min-h-[380px] relative overflow-hidden"
              >
                {/* Background colored glass blur overlay */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${activeTimeline.color} opacity-[0.08] blur-2xl pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-4 mb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary font-mono">
                        Milestone Spotlight
                      </span>
                      <h3 className="text-2xl font-bold text-[color:var(--color-text)] font-display mt-1">
                        {activeTimeline.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full px-3.5 py-1 text-xs font-semibold">
                      <Calendar size={13} />
                      <span>{activeTimeline.year}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-[color:var(--color-text)] uppercase tracking-wider mb-2">
                    {activeTimeline.subtitle}
                  </h4>
                  <p className="text-sm sm:text-base leading-relaxed text-[color:var(--color-muted)]">
                    {activeTimeline.desc}
                  </p>
                </div>

                <div className="mt-8">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text)] mb-3">
                    Core Technical Work
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTimeline.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-2.5 bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl px-4 py-3 shadow-soft"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-xs text-[color:var(--color-text)] font-medium">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
