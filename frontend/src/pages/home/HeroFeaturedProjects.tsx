import React from 'react';

// Sample project data matching your wireframe numbers
const projects = [
  { id: 1, title: 'Project 1', description: 'Hero showcase project with an expansive layout.' },
  { id: 2, title: 'Project 2', description: 'Innovative web application development.' },
  { id: 3, title: 'Project 3', description: 'E-commerce platform optimization.' },
  { id: 4, title: 'Project 4', description: 'UI/UX design system overhaul.' },
  { id: 5, title: 'Project 5', description: 'Mobile application cross-platform build.' },
];

export default function HeroFeaturedProjects() {
  return (
    <section className=" w-full min-h-screen p-4 sm:p-8 md:p-12 bg-[var(--color-bg)] transition-colors duration-300 flex items-center justify-center">
      
      {/* Main Container Outline */}
      <div className="w-full  p-6 sm:p-8 md:p-10 rounded-3xl  backdrop-blur-md  flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Featured Projects
          </h2>
        </div>

        {/* Projects Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 auto-rows-fr">
          {projects.map((project, index) => {
            // Project 1 spans across all columns on large screens to match the layout blueprint
            const isHero = index === 0;
            
            return (
              <div
                key={project.id}
                className={`
                  group relative flex flex-col justify-center items-center text-center p-6 sm:p-8 rounded-2xl transition-all duration-300 ease-out
                  /* Glassmorphism Light Mode */
                  bg-white/30 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
                  /* Glassmorphism Dark Mode */
                  dark:bg-slate-950/30 dark:border-slate-800/50 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                  /* Backdrop Blur */
                  backdrop-blur-md
                  /* Hover Interactions */
                  hover:-translate-y-1 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-slate-950/50
                  hover:border-indigo-500/30 dark:hover:border-indigo-400/30
                  /* Grid structural rules for Layout styling */
                  ${isHero ? 'sm:col-span-2 lg:col-span-2 min-h-[160px] sm:min-h-[400px]' : 'min-h-[160px]'}
                `}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-none" />

                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md hidden sm:block">
                  {project.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* View More Button Cta */}
        <div className="flex justify-center mt-2">
          <a 
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
            /* Button Glass Styles */
            bg-slate-900/10  hover:bg-slate-900/20 dark:hover:bg-white/20
            text-[var(--color-text) border border-slate-900/10
            hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View more</span>
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}