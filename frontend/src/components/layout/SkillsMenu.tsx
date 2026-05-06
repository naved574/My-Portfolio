// InfiniteSkills.jsx

import React from "react";
import { motion } from "framer-motion";

const skills = [
  { name: "React.js", color: "from-blue-500/20" },
  { name: "Node.js", color: "from-green-500/20" },
  { name: "MongoDB", color: "from-emerald-500/20" },
  { name: "TypeScript", color: "from-blue-600/20" },
  { name: "Next.js", color: "from-slate-400/20" },
  { name: "Tailwind", color: "from-cyan-400/20" },
  { name: "Express", color: "from-gray-500/20" },
  { name: "Redux", color: "from-purple-500/20" },
  { name: "Firebase", color: "from-yellow-500/20" },
  { name: "Docker", color: "from-blue-400/20" },
];

const SkillsMenu = () => {
  return (
    <div className="w-full py-1 dark:bg-[color:var(--color-text)] transition-colors duration-700 overflow-hidden relative">
      
      {/* Background Decorative Mesh (Subtle) */}
      <div className="absolute top-0 left-2/5 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full mx-auto relative z-10">
        
        {/* Infinite Scrolling Layout */}
        <div className="relative group">
          {/* Side Fades - More aggressive for depth */}
          <div className="absolute inset-y-0 left-0 w-40 md:w-96 bg-gradient-to-r from-[#fafafa] dark:from-[#080808] to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 md:w-96 bg-gradient-to-l from-[#fafafa] dark:from-[#080808] to-transparent z-20 pointer-events-none" />

          {/* Marquee Container */}
          <div className="flex flex-col gap-8 select-none">
            
            {/* Row 1 */}
            <motion.div 
              animate={{ x: [0, -2000] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 items-center"
            >
              {[...skills, ...skills, ...skills].map((skill, i) => (
                <SkillPill key={i} skill={skill} />
              ))}
            </motion.div>

            {/* Row 2 (Delayed and Different Speed) */}
            <motion.div 
              animate={{ x: [-2000, 0] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 items-center"
            >
              {[...skills, ...skills, ...skills].reverse().map((skill, i) => (
                <SkillPill key={i} skill={skill} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillPill = ({ skill }) => {
  return (
    <div className={`
      relative group/card cursor-pointer
      px-12 py-3 mt-4 md:py-8 rounded-[2rem]
      bg-[color:var(--color-text)] text-[color:var(--sec-color-text)]
      border border-black/[0.03] dark:border-white/[0.03]
      shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
      hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]
      hover:-translate-y-2 transition-all duration-500
      overflow-hidden flex items-center justify-center min-w-[140px]  md:min-w-[240px] 
    `}>
      {/* Dynamic Hover Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`} />
      
      {/* Skill Text */}
      <span className="text-2xl font-bold tracking-tight   group-hover/card:scale-110 transition-transform duration-500 relative z-10">
        {skill.name}
      </span>

      {/* Decorative Light Streak */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover/card:animate-[shine_1.5s_ease-in-out]" />
    </div>
  );
};

export default SkillsMenu;