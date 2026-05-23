import { clearAdminToken } from "@/lib/auth";
import { useDeleteMessage, useAdminMessages, useMarkMessageRead } from "@/hooks/useAdminMessages";
import { useNavigate } from "react-router-dom";

export default function AdminMessages() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useAdminMessages();
  const markRead = useMarkMessageRead();
  const deleteMessage = useDeleteMessage();

  const onLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin Messages</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border px-4 py-2"
            onClick={() => navigate("/admin/projects")}
          >
            Projects
          </button>
          <button type="button" className="rounded-lg border px-4 py-2" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {isLoading && <p>Loading messages...</p>}
      {isError && <p className="text-red-500">Unable to load contact messages.</p>}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {data?.contactMessages.length ? (
            data.contactMessages.map((item) => (
              <article key={item._id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-[color:var(--color-muted)]">{item.email}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      item.isRead ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {item.isRead ? "Read" : "Unread"}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm">{item.message}</p>
                <div className="mt-3 flex gap-2">
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead.mutate(item._id)}
                      className="rounded-lg border px-3 py-2 text-sm"
                      disabled={markRead.isPending}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteMessage.mutate(item._id)}
                    className="rounded-lg border border-red-400 px-3 py-2 text-sm text-red-600"
                    disabled={deleteMessage.isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p>No contact messages yet.</p>
          )}
        </div>
      )}
    </section>
  );
}
