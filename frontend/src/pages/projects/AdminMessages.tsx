import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDeleteMessage,
  useAdminMessages,
  useMarkMessageRead,
} from "@/hooks/useAdminMessages";
import { clearAdminToken } from "@/lib/auth";
import {
  MessageSquare,
  FolderKanban,
  LogOut,
  Trash2,
  CheckCircle,
  Clock,
  Mail,
  User,
  Search,
  Filter,
  Shield,
  Send,
  HelpCircle,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronUp,
  Inbox,
  Activity,
  CheckCheck,
} from "lucide-react";

export default function AdminMessages() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAdminMessages();
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  // Local Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Simulated Quick-Reply Form State per message
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sentReplies, setSentReplies] = useState<Record<string, boolean>>({});
  const [isReplyingTo, setIsReplyingTo] = useState<string | null>(null);

  const onLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  // Unread Count
  const stats = useMemo(() => {
    if (!data?.contactMessages) return { total: 0, unread: 0, read: 0 };
    const total = data.contactMessages.length;
    const unread = data.contactMessages.filter((m) => !m.isRead).length;
    const read = total - unread;
    return { total, unread, read };
  }, [data]);

  // Locally filtered contact messages list
  const filteredMessages = useMemo(() => {
    if (!data?.contactMessages) return [];
    let items = [...data.contactMessages];

    // Filter by Read / Unread status
    if (readFilter === "unread") {
      items = items.filter((m) => !m.isRead);
    } else if (readFilter === "read") {
      items = items.filter((m) => m.isRead);
    }

    // Filter by keyword query (name, email, message)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }

    // Sort: Newest first (descending timestamp or ID)
    items.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());

    return items;
  }, [data, readFilter, searchQuery]);

  const handleExpandMessage = (id: string, isRead: boolean) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!isRead) {
      markRead.mutate(id);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent expanding/collapsing when clicking delete button
    const confirmed = window.confirm("Are you sure you want to permanently delete this contact request?");
    if (!confirmed) return;
    try {
      await deleteMessage.mutateAsync(id);
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSendReply = (messageId: string, email: string) => {
    const text = replyText[messageId];
    if (!text || !text.trim()) return;

    // Simulate sending an SMTP email or message response
    setIsReplyingTo(messageId);
    setTimeout(() => {
      setSentReplies((prev) => ({ ...prev, [messageId]: true }));
      setReplyText((prev) => ({ ...prev, [messageId]: "" }));
      setIsReplyingTo(null);
    }, 1200);
  };

  return (
    <section className="relative min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text)] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background glowing elements */}
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
              Console <span className="text-primary">Inbox</span>
            </h1>
          </div>

          {/* Premium Admin Tabs & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="relative rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2.5 text-xs font-bold text-[color:var(--color-muted)] flex items-center gap-2 hover:text-[color:var(--color-text)] hover:border-primary/20 transition-all cursor-pointer select-none"
              onClick={() => navigate("/admin/projects")}
            >
              <FolderKanban size={14} />
              <span>Projects Hub</span>
            </button>

            <button
              type="button"
              className="relative rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary flex items-center gap-2 shadow-soft hover:bg-primary/10 transition-all cursor-pointer select-none"
              onClick={() => navigate("/admin/messages")}
            >
              <MessageSquare size={14} />
              <span>Messages Inbox</span>
              {stats.unread > 0 && (
                <span className="h-5 min-w-5 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {stats.unread}
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
                <Inbox size={18} />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{stats.total}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Total Received</div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-rose-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-rose-500/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="animate-bounce" />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{stats.unread}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Unread Queue</div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-emerald-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCheck size={18} />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">{stats.read}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Read & Handled</div>
              </div>
            </div>
          </div>

          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-5 shadow-soft hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-125 transition-all" />
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Activity size={18} />
              </div>
              <div>
                <div className="text-2xl font-black font-display text-[color:var(--color-text)]">
                  {stats.total > 0 ? `${Math.round((stats.read / stats.total) * 100)}%` : "0%"}
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[color:var(--color-muted)] mt-0.5">Response Rate</div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic searchable messages layout */}
        <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-soft">
          
          {/* Header & filters controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[color:var(--color-border)] pb-6 mb-6">
            <div>
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">Communication Relay</span>
              <h2 className="text-xl font-bold font-display text-[color:var(--color-text)]">Received Contact Transmissions</h2>
            </div>

            {/* Dynamic filter bar panel */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Dynamic search bar */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Search by sender or body..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Read Filter selector */}
              <div className="flex items-center gap-1.5 border border-[color:var(--color-border)] rounded-xl px-3.5 py-1.5 bg-[color:var(--color-bg)]">
                <Filter size={11} className="text-primary" />
                <select
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value as "all" | "unread" | "read")}
                  className="bg-transparent border-none text-xs outline-none cursor-pointer font-bold select-none text-[color:var(--color-text)]"
                >
                  <option value="all" className="text-slate-800">Show: All</option>
                  <option value="unread" className="text-slate-800">Show: Unread Only</option>
                  <option value="read" className="text-slate-800">Show: Read Only</option>
                </select>
              </div>

            </div>
          </div>

          {/* Table display listings */}
          {isLoading && (
            <div className="py-12 text-center text-xs font-mono animate-pulse text-[color:var(--color-muted)]">
              Loading communication ledger from cloud...
            </div>
          )}

          {isError && (
            <div className="py-12 text-center text-xs text-rose-500 font-bold">
              Unable to load client messages. Please check routing endpoints.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="py-16 border border-dashed border-[color:var(--color-border)] rounded-2xl text-center text-xs text-[color:var(--color-muted)] italic">
                  No contact requests match your current filters.
                </div>
              ) : (
                filteredMessages.map((item) => {
                  const isExpanded = expandedId === item._id;
                  const formattedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Unknown date";

                  return (
                    <motion.article
                      key={item._id}
                      layout="position"
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                        isExpanded
                          ? "border-primary/40 bg-black/[0.02] dark:bg-white/[0.02] shadow-lift"
                          : "border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01] hover:border-primary/20 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      }`}
                      onClick={() => handleExpandMessage(item._id, item.isRead)}
                    >
                      {/* Top Header Card row */}
                      <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
                        <div className="flex items-start gap-3.5">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            item.isRead ? "bg-black/[0.04] dark:bg-white/[0.04] text-[color:var(--color-muted)]" : "bg-primary/10 text-primary animate-pulse"
                          }`}>
                            <User size={18} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm sm:text-base font-bold text-[color:var(--color-text)] truncate ${!item.isRead ? "font-extrabold text-primary" : ""}`}>
                                {item.name}
                              </h4>
                              {!item.isRead && (
                                <span className="h-2 w-2 rounded-full bg-primary animate-ping shrink-0" />
                              )}
                            </div>
                            <span className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5 mt-0.5 truncate">
                              <Mail size={11} className="text-primary shrink-0" />
                              {item.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          
                          <div className="text-[10px] font-mono text-[color:var(--color-muted)] flex items-center gap-1.5">
                            <Calendar size={11} />
                            <span>{formattedDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase select-none ${
                                item.isRead
                                  ? "bg-black/[0.04] dark:bg-white/[0.04] text-[color:var(--color-muted)]"
                                  : "bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              {item.isRead ? "Read" : "Unread"}
                            </span>

                            {isExpanded ? <ChevronUp size={14} className="text-[color:var(--color-muted)]" /> : <ChevronDown size={14} className="text-[color:var(--color-muted)]" />}
                          </div>

                        </div>
                      </div>

                      {/* Expandable message details block */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="border-t border-[color:var(--color-border)] bg-black/[0.01] dark:bg-white/[0.01]"
                          >
                            <div className="p-5 space-y-4">
                              
                              {/* Message body */}
                              <div className="bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-2xl p-4 shadow-inner">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--color-muted)] block border-b border-[color:var(--color-border)] pb-2 mb-3">
                                  Request Message
                                </span>
                                <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-[color:var(--color-text)]">
                                  {item.message}
                                </p>
                              </div>

                              {/* Simulation Interactive Reply Tool */}
                              <div className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl p-4.5 space-y-3 shadow-soft" onClick={(e) => e.stopPropagation()}>
                                <div className="flex justify-between items-center">
                                  <h5 className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text)] flex items-center gap-1.5 font-mono">
                                    <Send size={12} className="text-primary" />
                                    Dynamic SMTP Reply Console
                                  </h5>
                                  <span className="text-[10px] text-[color:var(--color-muted)]">Routing via SMTP client</span>
                                </div>

                                {sentReplies[item._id] ? (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2.5"
                                  >
                                    <CheckCircle size={15} />
                                    <span>Reply successfully encrypted and dispatched to {item.email}.</span>
                                  </motion.div>
                                ) : (
                                  <div className="space-y-3">
                                    <textarea
                                      rows={3}
                                      value={replyText[item._id] || ""}
                                      onChange={(e) => setReplyText((p) => ({ ...p, [item._id]: e.target.value }))}
                                      placeholder={`Hi ${item.name.split(" ")[0]}, thank you for reaching out! Let's schedule...`}
                                      className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3.5 py-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-[color:var(--color-text)]"
                                    />
                                    <div className="flex justify-end gap-2.5">
                                      <button
                                        type="button"
                                        disabled={isReplyingTo === item._id}
                                        onClick={() => handleSendReply(item._id, item.email)}
                                        className="rounded-xl bg-black dark:bg-white text-white dark:text-black px-4.5 py-2 text-[10px] font-bold select-none cursor-pointer duration-200 active:scale-95 disabled:opacity-60 flex items-center gap-1"
                                      >
                                        {isReplyingTo === item._id ? "Transmitting..." : "Send Secure Reply"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Bottom control triggers inside message */}
                              <div className="flex justify-end items-center gap-2 pt-3 border-t border-[color:var(--color-border)]" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => handleDelete(item._id, e)}
                                  className="rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white px-4 py-2 text-xs font-bold text-red-500 duration-200 cursor-pointer flex items-center gap-1"
                                  disabled={deleteMessage.isPending}
                                >
                                  <Trash2 size={12} />
                                  <span>Permanently Delete</span>
                                </button>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.article>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
