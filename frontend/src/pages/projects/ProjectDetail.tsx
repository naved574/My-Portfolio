import { ExternalLink, Github } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useProjectBySlug } from "@/hooks/useProjects";
import { getUserToken } from "@/lib/auth";

const ListSection = ({ title, items }: { title: string; items: string[] }) => {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-[color:var(--color-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError } = useProjectBySlug(slug);
  const userToken = getUserToken();
  const project = data?.project;
  const intent = searchParams.get("intent");

  useEffect(() => {
    if (!userToken || !intent || !project) return;

    const target = intent === "code" ? project.code : intent === "live" ? project.live : "";
    if (target) {
      window.open(target, "_blank", "noopener,noreferrer");
    }

    const next = new URLSearchParams(searchParams);
    next.delete("intent");
    setSearchParams(next, { replace: true });
  }, [intent, project, searchParams, setSearchParams, userToken]);

  if (isLoading) return <p className="mx-auto max-w-7xl px-4 py-12">Loading project...</p>;
  if (isError || !project)
    return <p className="mx-auto max-w-7xl px-4 py-12 text-red-500">Project not found.</p>;

  const loginToUnlock = (targetIntent: "code" | "live") =>
    `/login?redirect=${encodeURIComponent(`/projects/${project.slug}`)}&intent=${targetIntent}`;

  return (
    <section className="mx-auto max-w-7xl mt-10 px-4 py-15 sm:px-6 lg:px-8 duration-500">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-hidden rounded-2xl border">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="mt-4 text-[color:var(--color-muted)]">
            {project.bio || project.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="rounded-full border px-3 py-1 text-xs">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {project.live &&
              (userToken ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
                >
                  <ExternalLink size={16} />
                  Live
                </a>
              ) : (
                <Link
                  to={loginToUnlock("live")}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
                >
                  <ExternalLink size={16} />
                  Login to Open Live Demo
                </Link>
              ))}
            {project.code &&
              (userToken ? (
                <a
                  href={project.code}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
                >
                  <Github size={16} />
                  Code
                </a>
              ) : (
                <Link
                  to={loginToUnlock("code")}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
                >
                  <Github size={16} />
                  Login to View Code
                </Link>
              ))}
          </div>
        </div>
      </div>

      {project.gallery.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {project.gallery.map((img) => (
              <img
                key={img}
                src={img}
                alt={`${project.title} preview`}
                className="aspect-[4/3] w-full rounded-xl border object-cover"
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {project.overview && (
          <div>
            <h3 className="text-xl font-semibold">Overview</h3>
            <p className="mt-3 text-[color:var(--color-muted)]">{project.overview}</p>
          </div>
        )}
        {project.purpose && (
          <div>
            <h3 className="text-xl font-semibold">Purpose</h3>
            <p className="mt-3 text-[color:var(--color-muted)]">{project.purpose}</p>
          </div>
        )}
        {project.work && (
          <div>
            <h3 className="text-xl font-semibold">Work</h3>
            <p className="mt-3 text-[color:var(--color-muted)]">{project.work}</p>
          </div>
        )}
        {project.description && (
          <div>
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="mt-3 text-[color:var(--color-muted)]">{project.description}</p>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <ListSection title="Features" items={project.features} />
        <ListSection title="Challenges" items={project.challenges} />
      </div>
    </section>
  );
}
