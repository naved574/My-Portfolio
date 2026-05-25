import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, unwrapData } from "@/lib/api";
import { setUserToken } from "@/lib/auth";

type LoginResponse = {
  token: string;
  user: { id: string; fullName: string; email: string };
};

const parseSafeRedirect = (value: string | null) => {
  if (!value || !value.startsWith("/")) return "/projects";
  if (value.startsWith("//")) return "/projects";
  return value;
};

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = useMemo(() => parseSafeRedirect(params.get("redirect")), [params]);
  const intent = params.get("intent") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = unwrapData<LoginResponse>(await api.post("/auth/login", { email, password }));
      setUserToken(data.token);

      const query = intent ? `?intent=${encodeURIComponent(intent)}` : "";
      navigate(`${redirect}${query}`);
    } catch {
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md h-[90vh] px-4 py-16">
      <h1 className="text-3xl font-bold">Welcome Back</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Log in to unlock project source code and live demo links.
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border bg-transparent px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-white transition disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[color:var(--color-muted)]">
        New here?{" "}
        <Link
          to={`/signup?redirect=${encodeURIComponent(redirect)}${intent ? `&intent=${encodeURIComponent(intent)}` : ""}`}
          className="font-medium underline"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}
