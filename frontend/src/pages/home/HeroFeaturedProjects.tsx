import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedProjects } from "@/hooks/useProjects";
import type { Project } from "@/types/project";

const FEATURED_LIMIT = 5;

const getProjectSummary = (project: Project) => project.bio || project.overview || project.description;

function FeaturedProjectSkeleton({ isHero = false }: { isHero?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] ${
        isHero ? "sm:col-span-2 lg:min-h-[420px]" : "min-h-[260px]"
      }`}
    >
      <div className={`${isHero ? "h-64 lg:h-72" : "h-40"} animate-pulse bg-black/10 dark:bg-white/10`} />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-black/10 dark:bg-white/10" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

{/* Main project card component for displaying featured projects, with a larger layout for the hero project and a consistent design for all projects. It includes an image, title, stack tags, summary, and a call-to-action to view the project details. */}

function FeaturedProjectCard({ project, isHero = false }: { project: Project; isHero?: boolean }) {
  const summary = getProjectSummary(project);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        isHero ? "sm:col-span-2 lg:grid lg:min-h-[420px] lg:grid-cols-[1.15fr_0.85fr]" : ""
      }`}
    >
      <div className={`${isHero ? "min-h-64 lg:min-h-full" : "aspect-[16/10]"} overflow-hidden bg-black/5`}>
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading={isHero ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      <div className={`flex flex-col p-5 ${isHero ? "justify-center lg:p-8" : ""}`}>
        <div className="mb-3 flex flex-wrap gap-2">
          {project.stack.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs text-[color:var(--color-muted)]">
              {item}
            </span>
          ))}
        </div>

        <h3 className={`${isHero ? "text-3xl md:text-4xl" : "text-xl"} font-bold tracking-tight text-[color:var(--color-text)]`}>
          {project.title}
        </h3>

        {summary && (
          <p className={`mt-3 line-clamp-3 text-sm leading-relaxed text-[color:var(--color-muted)] ${isHero ? "md:text-base" : ""}`}>
            {summary}
          </p>
        )}

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
          Open project
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function HeroFeaturedProjects() {
  const { data, isLoading, isError } = useFeaturedProjects(FEATURED_LIMIT);
  const projects = data?.projects ?? [];

  if (!isLoading && !isError && projects.length === 0) {
    return null;
  }

  return (
    /* Featured projects section on the homepage, showcasing a selection of highlighted projects with a call-to-action to view more. */

    <section className="w-full bg-[var(--color-bg)] px-4 py-20 transition-colors duration-300 sm:px-8 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Favorites</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
              Featured Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
          >
            View more
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            Featured projects could not be loaded right now.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {isLoading
            ? Array.from({ length: FEATURED_LIMIT }, (_, index) => (
                <FeaturedProjectSkeleton key={index} isHero={index === 0} />
              ))
            : projects.map((project, index) => (
                <FeaturedProjectCard key={project.id} project={project} isHero={index === 0} />
              ))}
        </div>
      </div>
    </section>
  );
}
