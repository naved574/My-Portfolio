import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import SectionHeading from "@/components/common/SectionHeading";

export default function Projects() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useProjects(page, 9);

  const projects = data?.projects ?? [];
  const pagination = data?.pagination;

  return (
    <section className="mx-auto max-w-7xl mt-10 px-4 py-12 sm:px-6 lg:px-8 duration-300">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Projects"
          title="All Projects"
          description="Browse featured work and open each project for complete details."
        />

        {isLoading && <p className="mt-10 text-center">Loading projects...</p>}
        {isError && <p className="mt-10 text-center text-red-500">Failed to load projects.</p>}

        {!isLoading && !isError && (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-soft transition-transform hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                      {project.bio || project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border px-3 py-1 text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="rounded-full border px-4 py-2 disabled:opacity-40"
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page === 1}
                >
                  Prev
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`h-10 w-10 rounded-full border ${n === page ? "bg-black text-white dark:bg-white dark:text-black" : ""
                      }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  className="rounded-full border px-4 py-2 disabled:opacity-40"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === pagination.totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

