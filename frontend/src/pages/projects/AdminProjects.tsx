import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  useAdminProjects,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "@/hooks/useProjects";
import { useAdminMessages } from "@/hooks/useAdminMessages";
import { clearAdminToken } from "@/lib/auth";
import { cloudinaryReady, uploadToCloudinary } from "@/lib/cloudinary";
import type { Project, ProjectPayload } from "@/types/project";
import {
  FolderKanban,
  MessageSquare,
  LogOut,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Star,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon,
  Check,
  Search,
  Filter,
  Layers,
  Code,
  Shield,
  BookOpen,
  ListPlus,
  Cpu,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectPayload>(defaultForm);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Search & dynamic sorting inputs
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "featured">("newest");

  // Tabbed project editor to prevent giant form clutter
  const [activeFormTab, setActiveFormTab] = useState<"metadata" | "copy" | "arrays" | "media">("metadata");

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Array item state for premium visual input pills
  const [newStackItem, setNewStackItem] = useState("");
  const [newFeatureItem, setNewFeatureItem] = useState("");
  const [newChallengeItem, setNewChallengeItem] = useState("");

  const { data, isLoading, isError } = useAdminProjects(page, 10, status);
  const { data: messagesData } = useAdminMessages();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const isSubmitting = createProject.isPending || updateProject.isPending;
  const canUploadGallery = useMemo(() => form.gallery.length < 8, [form.gallery.length]);

  // Messages count stats
  const unreadCount = useMemo(() => {
    return messagesData?.contactMessages.filter((m) => !m.isRead).length ?? 0;
  }, [messagesData]);

  // Compute dynamic stats based on current projects list
  const metrics = useMemo(() => {
    if (!data?.projects) return { total: 0, published: 0, drafts: 0, featured: 0 };
    const total = data.pagination.total || data.projects.length;
    const published = data.projects.filter((p) => p.isPublished).length;
    const drafts = data.projects.filter((p) => !p.isPublished).length;
    const featured = data.projects.filter((p) => p.featured).length;
    return { total, published, drafts, featured };
  }, [data]);

  // Compute technology frequency for premium Recharts chart
  const chartData = useMemo(() => {
    if (!data?.projects) return [];
    const counts: Record<string, number> = {};
    data.projects.forEach((proj) => {
      proj.stack.forEach((tech) => {
        const t = tech.trim();
        if (t) {
          counts[t] = (counts[t] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [data]);

  // Locally filtered and sorted projects list for premium user experience
  const processedProjects = useMemo(() => {
    if (!data?.projects) return [];
    let items = [...data.projects];

    // Filter by local search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.bio.toLowerCase().includes(query) ||
          p.stack.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Sort items
    if (sortBy === "title") {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "featured") {
      items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else {
      // Default newest
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return items;
  }, [data, searchQuery, sortBy]);

  const resetForm = () => {
    setEditing(null);
    setForm(defaultForm);
    setError("");
    setSuccessMsg("");
    setActiveFormTab("metadata");
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
    setSuccessMsg("");
    setError("");
    setActiveFormTab("metadata");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm("Are you absolutely sure you want to delete this project? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteProject.mutateAsync(id);
      setSuccessMsg("Project deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!form.title.trim()) {
      setError("Project title is required.");
      setActiveFormTab("metadata");
      return;
    }

    if (!form.image) {
      setError("Main showcase image is required. Go to the Media tab to upload.");
      setActiveFormTab("media");
      return;
    }

    if (!form.description.trim()) {
      setError("Full project description is required. Go to the Descriptions tab.");
      setActiveFormTab("copy");
      return;
    }

    try {
      if (editing) {
        await updateProject.mutateAsync({ id: editing.id, payload: form });
        setSuccessMsg("Project updated successfully!");
      } else {
        await createProject.mutateAsync(form);
        setSuccessMsg("New project created successfully!");
      }
      resetForm();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: unknown) {
      setError("Failed to save project. Please check if the slug is unique and verify all fields.");
    }
  };

  const uploadMainImage = async (file: File) => {
    setUploadingMain(true);
    setError("");
    try {
      const url = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, image: url }));
      setSuccessMsg("Main image uploaded successfully.");
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
      setSuccessMsg("Gallery images uploaded successfully.");
    } catch (err) {
      setError((err as Error).message || "Gallery upload failed.");
    } finally {
      setUploadingGallery(false);
    }
  };

  // Add items via chips
  const addStackChip = () => {
    if (newStackItem.trim() && !form.stack.includes(newStackItem.trim())) {
      setForm((prev) => ({ ...prev, stack: [...prev.stack, newStackItem.trim()] }));
      setNewStackItem("");
    }
  };

  const addFeatureChip = () => {
    if (newFeatureItem.trim() && !form.features.includes(newFeatureItem.trim())) {
      setForm((prev) => ({ ...prev, features: [...prev.features, newFeatureItem.trim()] }));
      setNewFeatureItem("");
    }
  };

  const addChallengeChip = () => {
    if (newChallengeItem.trim() && !form.challenges.includes(newChallengeItem.trim())) {
      setForm((prev) => ({ ...prev, challenges: [...prev.challenges, newChallengeItem.trim()] }));
      setNewChallengeItem("");
    }
  };

  return (
    <section className="relative min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text)] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background visual glowing ambient spots */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        
        {/* Modern Glassmorphism Admin Header bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-8 border-b border-[color:var(--color-border)] mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[color:var(--color-muted)] uppercase flex items-center gap-1">
                <Shield size={10} className="text-primary" />
                Security Level: Administrator Session
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mt-1">
              Console <span className="text-primary">Dashboard</span>
            </h1>
          </div>

          {/* Premium Admin Tabs & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="relative rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary flex items-center gap-2 shadow-soft hover:bg-primary/10 transition-all cursor-pointer select-none"
              onClick={() => navigate("/admin/projects")}
            >
              <FolderKanban size={14} />
              <span>Projects Hub</span>
            </button>

            <button
              type="button"
              className="relative rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2.5 text-xs font-bold text-[color:var(--color-muted)] flex items-center gap-2 hover:text-[color:var(--color-text)] hover:border-primary/20 transition-all cursor-pointer select-none"
              onClick={() => navigate("/admin/messages")}
            >
              <MessageSquare size={14} />
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="h-5 min-w-5 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 px-4.5 py-2.5 text-xs font-bold hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              onClick={onLogout}
            >
              <LogOut size={13} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Dynamic metrics widget board */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FolderKanban size={18} />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{metrics.total}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Total Projects</div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle size={18} />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{metrics.published}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Published Items</div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Star size={18} />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{metrics.featured}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Featured Stars</div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="animate-pulse" />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{unreadCount}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Unread Messages</div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Analytics Block with Recharts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            
            {/* Recharts Stack usage distribution card (8 cols on desktop) */}
            <div className="lg:col-span-8 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">Real-time stats</span>
                  <h3 className="text-lg font-bold font-display text-[color:var(--color-text)]">Technology Stack Utilization</h3>
                </div>
                <div className="h-8 px-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-[color:var(--color-border)] flex items-center gap-1.5 text-xs text-[color:var(--color-muted)]">
                  <TrendingUp size={12} className="text-primary" />
                  <span>Ranked frequency</span>
                </div>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={chartData} layout="horizontal" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--color-muted)", fontSize: 10, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
                      contentStyle={{
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "var(--color-text)",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {chartData.map((_entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "var(--color-primary)" : `rgba(var(--color-primary-rgb, 99, 102, 241), ${1 - index * 0.12})`}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick tips & env alert card (4 cols on desktop) */}
            <div className="lg:col-span-4 bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 shadow-soft flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-mono font-bold text-[color:var(--color-text)] uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} className="text-primary animate-pulse" />
                  Cloud Storage Node
                </h4>
                <p className="text-xs text-[color:var(--color-muted)] leading-relaxed mt-3">
                  Images and visual media are optimized dynamically and securely. Main showcase slides are published in modern WebP formats for reduced platform latency.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-[color:var(--color-border)]">
                {!cloudinaryReady ? (
                  <div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 p-3.5 text-xs text-rose-500 flex items-start gap-2.5">
                    <HelpCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Cloudinary Env Missing</p>
                      <p className="mt-0.5 text-[10px] opacity-80 leading-relaxed">
                        To upload pictures, configure your VITE_CLOUDINARY_CLOUD_NAME and preset variables in .env.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-3.5 text-xs text-emerald-500 flex items-center gap-2.5">
                    <CheckCircle size={16} className="shrink-0 text-emerald-500" />
                    <div>
                      <p className="font-bold">Cloudinary Connected</p>
                      <p className="text-[10px] opacity-80">Media pipelines are active and healthy.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Global Success / Error banner triggers */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2.5"
            >
              <CheckCircle size={16} className="animate-bounce" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2.5"
            >
              <HelpCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Premium Multi-tab Project Form */}
        <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-soft mb-10 overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-5 mb-6">
            <div>
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">Project Editor</span>
              <h2 className="text-xl font-bold font-display text-[color:var(--color-text)] flex items-center gap-2 mt-0.5">
                {editing ? <Edit2 size={18} className="text-primary" /> : <Plus size={18} className="text-primary animate-pulse" />}
                {editing ? `Modify Project: ${editing.title}` : "Construct New Showcase"}
              </h2>
            </div>

            {editing && (
              <button
                type="button"
                className="rounded-xl border border-[color:var(--color-border)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                onClick={resetForm}
              >
                Cancel Editing
              </button>
            )}
          </div>

          {/* Form Tabs Bar */}
          <div className="flex p-1 bg-black/[0.03] dark:bg-white/[0.03] border border-[color:var(--color-border)] rounded-2xl w-fit mb-6 flex-wrap gap-1">
            {[
              { id: "metadata", label: "Metadata & Links", icon: Shield },
              { id: "copy", label: "Descriptions & Content", icon: BookOpen },
              { id: "arrays", label: "Lists & Attributes", icon: ListPlus },
              { id: "media", label: "Showcase Media", icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id as "metadata" | "copy" | "arrays" | "media")}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
                    activeFormTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-[color:var(--color-text)] shadow-sm border border-gray-100/50 dark:border-gray-700/50"
                      : "text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  <Icon size={13} className={activeFormTab === tab.id ? "text-primary" : ""} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-6" noValidate>
            
            {/* TAB 1: Metadata */}
            {activeFormTab === "metadata" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1">
                    <Code size={12} className="text-primary" />
                    Project Title
                  </label>
                  <input
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="E.g., Financial Ledger Dashboard"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
                    Unique Route Slug (Optional)
                  </label>
                  <input
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="E.g., financial-ledger-dashboard"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
                    Short Catchy Bio
                  </label>
                  <input
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="A quick one-sentence summary to show on cards..."
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1">
                    <ArrowUpRight size={12} className="text-primary" />
                    Live URL Target
                  </label>
                  <input
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="https://dashboard-finance.vercel.app"
                    value={form.live || ""}
                    onChange={(e) => setForm((p) => ({ ...p, live: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
                    Source Code URL
                  </label>
                  <input
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="https://github.com/naved574/financial-ledger"
                    value={form.code || ""}
                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                  />
                </div>

                {/* Flags / Configuration checkboxes */}
                <div className="md:col-span-2 bg-black/[0.01] dark:bg-white/[0.01] border border-[color:var(--color-border)] rounded-2xl p-4 flex flex-wrap gap-6 items-center">
                  <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[color:var(--color-text)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                      className="h-4.5 w-4.5 rounded border-[color:var(--color-border)] text-primary focus:ring-primary/20"
                    />
                    <span className="flex items-center gap-1.5">
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      Featured Masterpiece (Pushes to Featured Lists)
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2.5 text-xs font-bold text-[color:var(--color-text)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                      className="h-4.5 w-4.5 rounded border-[color:var(--color-border)] text-primary focus:ring-primary/20"
                    />
                    <span className="flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-emerald-500" />
                      Published to Public Portfolio
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Text Copy & Explanations */}
            {activeFormTab === "copy" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1">
                    Full Description (Required)
                  </label>
                  <textarea
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter absolute complete details of the system..."
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
                      Project Overview
                    </label>
                    <textarea
                      rows={3}
                      className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Brief overview summarizing core value proposition..."
                      value={form.overview}
                      onChange={(e) => setForm((p) => ({ ...p, overview: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
                      Project Purpose
                    </label>
                    <textarea
                      rows={3}
                      className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="What problems does this project solve? Core targets..."
                      value={form.purpose}
                      onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
                      My Contributions & Work
                    </label>
                    <textarea
                      rows={3}
                      className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                      placeholder="Details of your specific contributions & tasks..."
                      value={form.work}
                      onChange={(e) => setForm((p) => ({ ...p, work: e.target.value }))}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Arrays & Chips lists */}
            {activeFormTab === "arrays" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5.5"
              >
                
                {/* 1. Technology stack list */}
                <div className="space-y-2 border border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] p-4.5 rounded-2xl">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] block">
                    1. Tech Stack Tools & Frameworks ({form.stack.length})
                  </label>
                  <p className="text-[10px] text-[color:var(--color-muted)]">Type a technology name and click 'Add' or press Enter to create a chip.</p>
                  
                  <div className="flex gap-2.5 mt-2">
                    <input
                      className="flex-1 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-2.5 text-sm outline-none focus:border-primary"
                      placeholder="E.g. Redux Toolkit"
                      value={newStackItem}
                      onChange={(e) => setNewStackItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addStackChip();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addStackChip}
                      className="rounded-xl bg-primary text-white px-4 py-2.5 text-xs font-bold hover:opacity-90 duration-200 cursor-pointer select-none"
                    >
                      Add Tool
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5 mt-3 min-h-[36px] items-center">
                    {form.stack.length === 0 ? (
                      <span className="text-xs text-[color:var(--color-muted)] italic">No tools added yet.</span>
                    ) : (
                      form.stack.map((item, idx) => (
                        <span key={item} className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-lg px-2.5 py-1 select-none">
                          <span>{item}</span>
                          <button
                            type="button"
                            className="text-primary hover:text-red-500 font-bold ml-1 transition-colors"
                            onClick={() => setForm((p) => ({ ...p, stack: p.stack.filter((_, i) => i !== idx) }))}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Core Features list */}
                <div className="space-y-2 border border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] p-4.5 rounded-2xl">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] block">
                    2. Principal Key Features ({form.features.length})
                  </label>
                  <div className="flex gap-2.5 mt-2">
                    <input
                      className="flex-1 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-2.5 text-sm outline-none focus:border-primary"
                      placeholder="E.g. OAuth 2.0 dual security gates"
                      value={newFeatureItem}
                      onChange={(e) => setNewFeatureItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeatureChip();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addFeatureChip}
                      className="rounded-xl bg-primary text-white px-4 py-2.5 text-xs font-bold hover:opacity-90 duration-200 cursor-pointer select-none"
                    >
                      Add Feature
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3">
                    {form.features.length === 0 ? (
                      <span className="text-xs text-[color:var(--color-muted)] italic">No features recorded yet.</span>
                    ) : (
                      form.features.map((item, idx) => (
                        <div key={item} className="flex justify-between items-center text-xs bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl px-3 py-2">
                          <span className="font-medium text-[color:var(--color-text)]">{item}</span>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 font-bold ml-2 font-mono"
                            onClick={() => setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }))}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Challenges overcome list */}
                <div className="space-y-2 border border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] p-4.5 rounded-2xl">
                  <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] block">
                    3. Project Challenges Overcome ({form.challenges.length})
                  </label>
                  <div className="flex gap-2.5 mt-2">
                    <input
                      className="flex-1 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-2.5 text-sm outline-none focus:border-primary"
                      placeholder="E.g. Reduced network re-rendering latency by 45%"
                      value={newChallengeItem}
                      onChange={(e) => setNewChallengeItem(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addChallengeChip();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addChallengeChip}
                      className="rounded-xl bg-primary text-white px-4 py-2.5 text-xs font-bold hover:opacity-90 duration-200 cursor-pointer select-none"
                    >
                      Add Challenge
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3">
                    {form.challenges.length === 0 ? (
                      <span className="text-xs text-[color:var(--color-muted)] italic">No challenges recorded.</span>
                    ) : (
                      form.challenges.map((item, idx) => (
                        <div key={item} className="flex justify-between items-center text-xs bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-xl px-3 py-2">
                          <span className="font-medium text-[color:var(--color-text)]">{item}</span>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 font-bold ml-2 font-mono"
                            onClick={() => setForm((p) => ({ ...p, challenges: p.challenges.filter((_, i) => i !== idx) }))}
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 4: Media Upload section */}
            {activeFormTab === "media" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                
                {/* Showcase banner uploading */}
                <div className="border border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl p-5">
                  <h4 className="text-xs font-mono font-bold text-[color:var(--color-text)] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-primary" />
                    Primary Showcase Banner
                  </h4>
                  <p className="text-[10px] text-[color:var(--color-muted)] mt-1">This represents the main visual background thumbnail inside listings.</p>

                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 px-4 py-2.5 text-xs font-semibold cursor-pointer select-none">
                      <Plus size={14} />
                      <span>{form.image ? "Change Picture" : "Select Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadMainImage(file);
                        }}
                      />
                    </label>
                    {uploadingMain && <span className="text-xs font-mono animate-pulse text-primary">Uploading image node...</span>}
                  </div>

                  {form.image && (
                    <div className="mt-5 relative max-w-lg rounded-2xl border border-[color:var(--color-border)] overflow-hidden shadow-soft">
                      <img src={form.image} alt="Main display preview" className="h-44 w-full object-cover" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/65 text-[9px] font-mono font-bold text-white uppercase tracking-wider select-none">
                        Active Banner URL
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional gallery assets */}
                <div className="border border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-mono font-bold text-[color:var(--color-text)] uppercase tracking-wider">
                      Additional Gallery Grid ({form.gallery.length}/8)
                    </h4>
                    <span className="text-[10px] font-bold text-primary font-mono">{8 - form.gallery.length} remaining slots</span>
                  </div>
                  <p className="text-[10px] text-[color:var(--color-muted)] mt-1">Supplementary slides displaying modular parts or code interfaces.</p>

                  <div className="mt-4">
                    <label className="relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 px-4 py-2.5 text-xs font-semibold cursor-pointer select-none disabled:opacity-50">
                      <Plus size={14} />
                      <span>Upload Supplementary Assets</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={!canUploadGallery}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files?.length) uploadGalleryImages(files);
                        }}
                      />
                    </label>
                    {uploadingGallery && <span className="text-xs font-mono ml-4 animate-pulse text-primary">Processing multiple assets...</span>}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {form.gallery.map((img, index) => (
                      <div key={`${img}-${index}`} className="relative border border-[color:var(--color-border)] rounded-2xl overflow-hidden bg-[color:var(--color-bg)] group">
                        <img src={img} alt="Gallery slide" className="aspect-video w-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-250 flex items-center justify-center gap-2">
                          
                          <button
                            type="button"
                            className="bg-red-500 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold hover:bg-red-600 transition-colors cursor-pointer"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                gallery: prev.gallery.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            Delete
                          </button>

                          {index > 0 && (
                            <button
                              type="button"
                              className="bg-white text-black rounded-lg px-2.5 py-1 text-[10px] font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() =>
                                setForm((prev) => {
                                  const next = [...prev.gallery];
                                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                  return { ...prev, gallery: next };
                                })
                              }
                            >
                              Shift Left
                            </button>
                          )}

                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* Action buttons triggers row */}
            <div className="flex justify-end gap-3.5 pt-5 border-t border-[color:var(--color-border)]">
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[color:var(--color-border)] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] px-5 py-3 text-xs font-bold transition-all duration-200 cursor-pointer select-none"
                >
                  Clear Edits
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative overflow-hidden group inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 px-6 py-3 text-xs font-bold transition-all duration-300 shadow-soft select-none disabled:opacity-65 cursor-pointer hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span>Saving to cloud...</span>
                ) : (
                  <>
                    <Check size={14} className="text-primary animate-pulse" />
                    <span>{editing ? "Save Project Modifications" : "Deploy Project Showcase"}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Dynamic searchable project listings table */}
        <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-soft">
          
          {/* Header & filters controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[color:var(--color-border)] pb-6 mb-6">
            <div>
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">Showcases Manager</span>
              <h2 className="text-xl font-bold font-display text-[color:var(--color-text)]">All Registered Portfolio Works</h2>
            </div>

            {/* Dynamic filter bar panel */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Dynamic search bar */}
              <div className="relative w-full sm:w-56">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Search local stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] outline-none focus:border-primary transition-all"
                />
              </div>

              {/* API status select filter */}
              <div className="flex items-center gap-1.5 border border-[color:var(--color-border)] rounded-xl px-3.5 py-1.5 bg-[color:var(--color-bg)]">
                <Filter size={11} className="text-primary" />
                <select
                  value={status}
                  onChange={(e) => {
                    setPage(1);
                    setStatus(e.target.value);
                  }}
                  className="bg-transparent border-none text-xs outline-none cursor-pointer font-bold select-none text-[color:var(--color-text)]"
                >
                  <option value="all" className="text-slate-800">API: All</option>
                  <option value="published" className="text-slate-800">API: Published</option>
                  <option value="draft" className="text-slate-800">API: Drafts</option>
                </select>
              </div>

              {/* Local sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "title" | "featured")}
                className="border border-[color:var(--color-border)] rounded-xl px-3.5 py-1.5 bg-[color:var(--color-bg)] text-xs font-bold text-[color:var(--color-text)] cursor-pointer select-none outline-none"
              >
                <option value="newest" className="text-slate-800">Sort: Newest</option>
                <option value="title" className="text-slate-800">Sort: Alphabetical</option>
                <option value="featured" className="text-slate-800">Sort: Featured First</option>
              </select>

            </div>
          </div>

          {/* Table display listings */}
          {isLoading && (
            <div className="py-12 text-center text-xs font-mono animate-pulse text-[color:var(--color-muted)]">
              Loading projects from storage database...
            </div>
          )}

          {isError && (
            <div className="py-12 text-center text-xs text-rose-500 font-bold">
              Unable to load admin projects from cloud storage. Check backend connection.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-3.5">
              {processedProjects.length === 0 ? (
                <div className="py-12 border border-dashed border-[color:var(--color-border)] rounded-2xl text-center text-xs text-[color:var(--color-muted)] italic">
                  No projects match your current filter parameters or search queries.
                </div>
              ) : (
                processedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] p-4 hover:border-primary/20 bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] duration-300 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4.5 min-w-0">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-14 w-20 shrink-0 rounded-xl object-cover border border-[color:var(--color-border)] bg-[color:var(--color-bg)]"
                        />
                      ) : (
                        <div className="h-14 w-20 shrink-0 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] border border-[color:var(--color-border)] flex items-center justify-center text-[color:var(--color-muted)]">
                          <ImageIcon size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[color:var(--color-text)] truncate">{project.title}</h4>
                          {project.featured && (
                            <span className="h-4.5 w-4.5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                              <Star size={11} className="fill-amber-500 text-amber-500" />
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-[color:var(--color-muted)] font-mono mt-0.5 truncate max-w-sm">
                          {project.slug || "no-slug-registered"}
                        </p>

                        <div className="flex items-center gap-3.5 mt-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              project.isPublished
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${project.isPublished ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {project.isPublished ? "Published" : "Draft"}
                          </span>

                          {project.stack.length > 0 && (
                            <div className="hidden sm:flex flex-wrap gap-1">
                              {project.stack.slice(0, 3).map((item) => (
                                <span key={item} className="text-[9px] font-bold font-mono bg-black/[0.04] dark:bg-white/[0.04] border border-[color:var(--color-border)] rounded px-1.5 py-0.5 text-[color:var(--color-muted)]">
                                  {item}
                                </span>
                              ))}
                              {project.stack.length > 3 && (
                                <span className="text-[9px] font-bold text-[color:var(--color-muted)]">+{project.stack.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-[color:var(--color-border)] pt-3 sm:border-t-0 sm:pt-0 shrink-0">
                      
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black p-2.5 text-xs text-[color:var(--color-muted)] duration-200"
                          title="View Live Site"
                        >
                          <Eye size={13} />
                        </a>
                      )}

                      <button
                        type="button"
                        className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-primary/10 hover:text-primary hover:border-primary/30 p-2.5 text-xs font-bold text-[color:var(--color-muted)] duration-200 cursor-pointer"
                        onClick={() => onEdit(project)}
                        title="Edit Project"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        className="rounded-xl border border-red-500/20 bg-[color:var(--color-surface)] hover:bg-red-500 hover:text-white p-2.5 text-xs font-bold text-red-500 duration-200 cursor-pointer"
                        onClick={() => onDelete(project.id)}
                        disabled={deleteProject.isPending}
                        title="Delete Showcase"
                      >
                        <Trash2 size={13} />
                      </button>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination controls */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3 pt-5 border-t border-[color:var(--color-border)]">
              <button
                type="button"
                className="rounded-xl border border-[color:var(--color-border)] px-4 py-2 text-xs font-bold disabled:opacity-40 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              
              <span className="text-xs font-mono text-[color:var(--color-muted)]">
                Page <strong className="text-[color:var(--color-text)]">{data.pagination.page}</strong> of {data.pagination.totalPages}
              </span>
              
              <button
                type="button"
                className="rounded-xl border border-[color:var(--color-border)] px-4 py-2 text-xs font-bold disabled:opacity-40 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all cursor-pointer"
                disabled={page === data.pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
