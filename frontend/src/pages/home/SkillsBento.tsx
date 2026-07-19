import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Database, Sparkles, Workflow, ShieldCheck, Layers, Cpu, Laptop, Zap, LucideIcon } from "lucide-react";

type Category = "all" | "frontend" | "backend" | "architecture";

interface SkillItem {
  name: string;
  category: "frontend" | "backend" | "architecture";
  level: number; // percentage
  icon: LucideIcon;
  description: string;
}

const skillsData: SkillItem[] = [
  { name: "React & TS", category: "frontend", level: 95, icon: Laptop, description: "Component state management, hooks, custom layouts." },
  { name: "Tailwind CSS", category: "frontend", level: 98, icon: Code2, description: "Highly responsive layouts, fluid grids, premium custom themes." },
  { name: "Express & Node", category: "backend", level: 90, icon: Cpu, description: "Robust RESTful architectures, JWT authentication, server security." },
  { name: "MongoDB & SQL", category: "backend", level: 86, icon: Database, description: "Database optimization, structured indexing, reactive validation schemas." },
  { name: "Framer Motion", category: "frontend", level: 88, icon: Sparkles, description: "High-performance gestures, scroll reveal, staggered micro-animations." },
  { name: "Secure Admin CMS", category: "architecture", level: 92, icon: ShieldCheck, description: "Access level locks, dashboard statistics, file upload, message cues." },
  { name: "CI/CD & Deploy", category: "architecture", level: 85, icon: Zap, description: "Continuous integration workflows, container orchestration, serverless hosting." },
  { name: "Clean Architecture", category: "architecture", level: 90, icon: Layers, description: "Maintainable directory scaling, modular imports, optimized network calls." }
];

export default function SkillsBento() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredSkills = skillsData.filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <section className="w-full bg-[var(--color-bg)] px-4 py-20 sm:px-8 md:px-12 relative overflow-hidden" id="skills">
      {/* Dynamic Background Spotlight Spot */}
      <div className="absolute bottom-1/4 right-1/4 -z-10 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Masteries</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl font-display">
              My Toolkit & Philosophy
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-[color:var(--color-muted)]">
              I balance clean, responsive interface execution on the frontend with reliable database structures on the backend.
            </p>
          </div>

          {/* Filtering Toggles */}
          <div className="flex flex-wrap gap-2 self-start md:self-end">
            {(["all", "frontend", "backend", "architecture"] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider border transition-all duration-300 cursor-pointer select-none ${
                  activeCategory === cat
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-soft"
                    : "bg-[color:var(--color-surface)] border-[color:var(--color-border)] text-[color:var(--color-muted)] hover:border-[color:var(--color-text)] hover:text-[color:var(--color-text)]"
                }`}
                id={`skill-filter-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Bento Core Card (Spans 2 columns on wide screens) */}
          <div className="md:col-span-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 sm:p-8 flex flex-col justify-between shadow-soft hover:shadow-lift duration-300 relative overflow-hidden group">
            {/* Background floating gradient circle */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:scale-125 duration-500 pointer-events-none" />
            
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                <Code2 size={20} />
              </div>
              <h3 className="text-2xl font-bold text-[color:var(--color-text)] font-display">
                High fidelity, meticulously engineered systems.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted)] max-w-xl">
                I do not just throw code together. Every component is designed to render efficiently, support light/dark modes natively, and feel smooth through deliberate Framer Motion animation easing.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[color:var(--color-border)] pt-6">
              <div>
                <div className="text-2xl font-bold text-primary font-display">100%</div>
                <div className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mt-1">Responsive Coverage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[color:var(--color-text)] font-display">Full-Stack</div>
                <div className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mt-1">End-to-End Delivery</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-[color:var(--color-text)] font-display">95+ Performance</div>
                <div className="text-xs uppercase tracking-wider text-[color:var(--color-muted)] mt-1">Lighthouse Standards</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Block (Spans 1 column) */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 flex flex-col justify-between shadow-soft hover:shadow-lift duration-300 relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 text-primary/10 group-hover:-translate-y-2 group-hover:-translate-x-2 duration-500 pointer-events-none">
              <Workflow size={160} />
            </div>

            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                <Workflow size={20} />
              </div>
              <h3 className="text-lg font-bold text-[color:var(--color-text)]">Product Delivery</h3>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-muted)]">
                Highly adaptive workflow focusing on shipping features quickly. No over-engineered layers, just robust production standards that solve user pain points.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl p-3 shadow-soft relative z-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-[color:var(--color-text)]">Currently crafting full-stack apps</span>
            </div>
          </div>

          {/* Render Active Skills Matrix (8 boxes) */}
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 flex flex-col justify-between shadow-soft hover:shadow-lift transition-all duration-300"
              id={`skill-card-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--color-bg)] border border-[color:var(--color-border)] text-primary">
                    <skill.icon size={16} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-primary font-mono bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {skill.category}
                  </span>
                </div>
                <h4 className="text-base font-bold text-[color:var(--color-text)]">{skill.name}</h4>
                <p className="mt-2 text-xs leading-relaxed text-[color:var(--color-muted)]">{skill.description}</p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-mono font-semibold text-[color:var(--color-text)] mb-1.5">
                  {/* <span>Level</span> */}
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
