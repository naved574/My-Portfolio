import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdminProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "@/hooks/useProjects";
import { clearAdminToken, getAdminToken } from "@/lib/auth";
import { cloudinaryReady, uploadToCloudinary } from "@/lib/cloudinary";
import type { Project, ProjectPayload } from "@/types/project";

const defaultForm: ProjectPayload = {
  title: "",
  slug: "",
  bio: "",
  overview: "",
  purpose: "",
  work: "",
  description: "",
  features: [],
  challenges: [],
  stack: [],
  image: "",
  gallery: [],
  live: "",
  code: "",
  featured: false,
  isPublished: true,
};

const fromCsv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const toCsv = (arr: string[]) => arr.join(", ");

export default function AdminProjects() {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectPayload>(defaultForm);
  const [error, setError] = useState("");
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const { data, isLoading, isError } = useAdminProjects(page, 10, status);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const isSubmitting = createProject.isPending || updateProject.isPending;
  const canUploadGallery = useMemo(() => form.gallery.length < 8, [form.gallery.length]);

  useEffect(() => {
    if (!token) navigate("/admin/login");
  }, [navigate, token]);

  if (!token) return null;

  const resetForm = () => {
    setEditing(null);
    setForm(defaultForm);
    setError("");
  };

  const onEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      slug: project.slug,
      bio: project.bio,
      overview: project.overview,
      purpose: project.purpose,
      work: project.work,
      description: project.description,
      features: project.features,
      challenges: project.challenges,
      stack: project.stack,
      image: project.image,
      gallery: project.gallery,
      live: project.live || "",
      code: project.code || "",
      featured: project.featured,
      isPublished: project.isPublished,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this project?");
    if (!confirmed) return;
    await deleteProject.mutateAsync(id);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.image) {
      setError("Main image is required.");
      return;
    }

    try {
      if (editing) {
        await updateProject.mutateAsync({ id: editing.id, payload: form });
      } else {
        await createProject.mutateAsync(form);
      }
      resetForm();
    } catch (err: unknown) {
      setError("Failed to save project. Please verify all fields.");
    }
  };

  const uploadMainImage = async (file: File) => {
    setUploadingMain(true);
    setError("");
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setError((err as Error).message || "Image upload failed.");
    } finally {
      setUploadingMain(false);
    }
  };

  const uploadGalleryImages = async (files: FileList) => {
    setUploadingGallery(true);
    setError("");
    try {
      const remaining = 8 - form.gallery.length;
      const selected = Array.from(files).slice(0, remaining);
      const urls = await Promise.all(selected.map((file) => uploadToCloudinary(file)));
      setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
    } catch (err) {
      setError((err as Error).message || "Gallery upload failed.");
    } finally {
      setUploadingGallery(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin Projects</h1>
        <div className="flex gap-2">
          <button type="button" className="rounded-lg border px-4 py-2" onClick={onLogout}>
            Logout
          </button>
          {editing && (
            <button type="button" className="rounded-lg border px-4 py-2" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {!cloudinaryReady && (
        <p className="mt-4 rounded-lg border border-amber-500 bg-amber-100 p-3 text-amber-700">
          Cloudinary env missing. Set `VITE_CLOUDINARY_CLOUD_NAME` and
          `VITE_CLOUDINARY_UPLOAD_PRESET`.
        </p>
      )}

      <form onSubmit={submit} className="mt-6 rounded-2xl border p-5">
        <h2 className="text-xl font-semibold">{editing ? "Edit Project" : "Add New Project"}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Title" 
          value={form.title} 
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Slug (optional)" 
          value={form.slug} 
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Bio" 
          value={form.bio} 
          onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Live URL" 
          value={form.live || ""} 
          onChange={(e) => setForm((p) => ({ ...p, live: e.target.value }))} />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Code URL" 
          value={form.code || ""} 
          onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Stack (comma separated)" 
          value={toCsv(form.stack)} 
          onChange={(e) => setForm((p) => ({ ...p, stack: fromCsv(e.target.value) }))} />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Features (comma separated)" 
          value={toCsv(form.features)} 
          onChange={(e) => setForm((p) => ({ ...p, features: fromCsv(e.target.value) }))} />

          <input 
          className="rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Challenges (comma separated)" 
          value={toCsv(form.challenges)} 
          onChange={(e) => setForm((p) => ({ ...p, challenges: fromCsv(e.target.value) }))} />
        </div>

        <div className="mt-4 grid gap-4">
          <textarea 
          className="min-h-20 rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Overview" value={form.overview} 
          onChange={(e) => setForm((p) => ({ ...p, overview: e.target.value }))} />

          <textarea 
          className="min-h-20 rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Purpose" value={form.purpose} 
          onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))} />

          <textarea 
          className="min-h-20 rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Work" value={form.work} 
          onChange={(e) => setForm((p) => ({ ...p, work: e.target.value }))} />

          <textarea 
          className="min-h-24 rounded-lg border bg-transparent px-3 py-2" 
          placeholder="Description" value={form.description} 
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} 
          required />
        </div>

        <div className="mt-6 rounded-xl border p-4">
          <p className="text-sm font-medium">Main Image</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadMainImage(file);
              }}
            />
            {uploadingMain && <span className="text-sm">Uploading...</span>}
          </div>
          {form.image && (
            <img src={form.image} alt="Main preview" className="mt-4 h-40 w-64 rounded-lg border object-cover" />
          )}
        </div>

        <div className="mt-4 rounded-xl border p-4">
          <p className="text-sm font-medium">Gallery Images ({form.gallery.length}/8)</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={!canUploadGallery}
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length) uploadGalleryImages(files);
              }}
            />
            {uploadingGallery && <span className="text-sm">Uploading gallery...</span>}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {form.gallery.map((img, index) => (
              <div key={`${img}-${index}`} className="relative">
                <img src={img} alt="Gallery preview" className="aspect-square w-full rounded-lg border object-cover" />
                <div className="mt-1 flex gap-1">
                  <button
                    type="button"
                    className="rounded border px-2 py-1 text-xs"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remove
                  </button>
                  {index > 0 && (
                    <button
                      type="button"
                      className="rounded border px-2 py-1 text-xs"
                      onClick={() =>
                        setForm((prev) => {
                          const next = [...prev.gallery];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          return { ...prev, gallery: next };
                        })
                      }
                    >
                      Up
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
            Published
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {isSubmitting ? "Saving..." : editing ? "Update Project" : "Create Project"}
        </button>
      </form>

      <div className="mt-8 rounded-2xl border p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">All Projects</h2>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="rounded-lg border bg-transparent px-3 py-2"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {isLoading && <p>Loading projects...</p>}
        {isError && <p className="text-red-500">Unable to load admin projects.</p>}

        {!isLoading && !isError && (
          <div className="space-y-3">
            {data?.projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{project.title}</p>
                  <p className="text-sm text-[color:var(--color-muted)]">{project.slug}</p>
                  <span
                    className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs ${
                      project.isPublished ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {project.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-2"
                    onClick={() => onEdit(project)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-400 px-3 py-2 text-red-600"
                    onClick={() => onDelete(project.id)}
                    disabled={deleteProject.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-lg border px-3 py-1 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <button
              type="button"
              className="rounded-lg border px-3 py-1 disabled:opacity-50"
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
