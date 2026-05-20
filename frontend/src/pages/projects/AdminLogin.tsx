import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, unwrapData } from "@/lib/api";
import { setAdminToken } from "@/lib/auth";

type LoginResponse = {
  token: string;
  user: { id: string; email: string; role: string };
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = unwrapData<LoginResponse>(
        await api.post("/auth/login", { email, password })
      );
      setAdminToken(data.token);
      navigate("/admin/projects");
    } catch (err) {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">Admin Login</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Sign in with your admin account to manage projects.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border p-6">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border bg-transparent px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border bg-transparent px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}

