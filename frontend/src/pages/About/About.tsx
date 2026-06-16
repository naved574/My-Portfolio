import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Code2, Database, GitBranch, Layers, Palette, Server, Sparkles, Workflow } from "lucide-react";

const skills = [
  {
    icon: Code2,
    label: "React & TypeScript",
    desc: "Component architecture, hooks, state patterns.",
  },
  {
    icon: Palette,
    label: "Tailwind CSS",
    desc: "Design-token-first UI, responsive layouts.",
  },
  {
    icon: Server,
    label: "Node.js & REST",
    desc: "Express APIs, auth, validation, and clean route design.",
  },
  {
    icon: Database,
    label: "MongoDB & Mongoose",
    desc: "Schemas, indexes, pagination, and admin data flows.",
  },
  {
    icon: Sparkles,
    label: "Framer Motion",
    desc: "Subtle, performant interface animation.",
  },
  {
    icon: GitBranch,
    label: "Git & Deployment",
    desc: "GitHub workflow with Vercel and Render deployments.",
  },
  {
    icon: Layers,
    label: "Reusable UI",
    desc: "Shared components, layout primitives, and accessible states.",
  },
  {
    icon: Workflow,
    label: "Product Thinking",
    desc: "Shipping for real users, not just specs.",
  },
];

const timeline = [
  {
    year: "2023",
    title: "Started coding seriously",
    desc: "Self-taught React and built my first landing pages.",
  },
  {
    year: "2024",
    title: "First real project",
    desc: "Built full-stack features with React, Node.js, Express, and MongoDB.",
  },
  {
    year: "2025",
    title: "Portfolio CMS",
    desc: "Added admin login, project management, image uploads, and contact messages.",
  },
  {
    year: "2025",
    title: "Full-stack focus",
    desc: "Building motion-rich, production-grade apps end to end.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="About"
          title="Calm interfaces, carefully engineered."
          description="I care about the small details - motion curves, spacing, and how copy reads. I care even more about shipping: interfaces that load fast, feel intuitive, and stay maintainable."
        />

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="group rounded-[14px] border border-[color:var(--color-border)] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--color-surface)] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <skill.icon size={18} />
              </div>
              <div className="mt-3 text-sm font-semibold text-[color:var(--color-text)]">{skill.label}</div>
              <div className="mt-1 text-xs leading-relaxed text-[color:var(--color-muted)]">{skill.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
          <div>
            <h3 className="font-display text-2xl font-bold">Journey</h3>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">A short timeline of how I got here.</p>
          </div>
          <ol className="relative space-y-8 border-l border-[color:var(--color-border)] pl-6">
            {timeline.map((item, index) => (
              <motion.li
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[29px] top-1.5 grid h-4 w-4 place-items-center rounded-full border-2 border-white bg-primary shadow-soft" />
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.year}</div>
                <div className="mt-1 text-lg font-semibold text-[color:var(--color-text)]">{item.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-[color:var(--color-muted)]">{item.desc}</div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
