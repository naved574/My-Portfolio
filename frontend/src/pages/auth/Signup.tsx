import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, unwrapData } from "@/lib/api";
import { setUserToken } from "@/lib/auth";

type SignupResponse = {
  token: string;
  user: { id: string; fullName: string; email: string };
};

type ApiErrorResponse = {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
};

const parseSafeRedirect = (value: string | null) => {
  if (!value || !value.startsWith("/")) return "/projects";
  if (value.startsWith("//")) return "/projects";
  return value;
};

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = useMemo(() => parseSafeRedirect(params.get("redirect")), [params]);
  const intent = params.get("intent") || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = unwrapData<SignupResponse>(
        await api.post("/auth/signup", { fullName, email, password, confirmPassword })
      );
      setUserToken(data.token);

      const query = intent ? `?intent=${encodeURIComponent(intent)}` : "";
      navigate(`${redirect}${query}`);
    } catch (err: unknown) {
      const apiError = err as ApiErrorResponse;
      const message = apiError.response?.data?.error?.message || "Signup failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="animate-[fade-in_0.35s_ease-out]">
        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          {/* Sign up to unlock source code and live demos for all projects. */}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-4 rounded-2xl border p-6 transition-all duration-300 ease-out"
      >
        <div>
          <label className="mb-1 block text-sm">Full Name</label>
          <input
            type="text"
            required
            minLength={2}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border bg-transparent px-3 py-2"
          />
        </div>

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

        <div>
          <label className="mb-1 block text-sm">Confirm Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border bg-transparent px-3 py-2"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-white transition-all duration-300 disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-[color:var(--color-muted)]">
        Already have an account?{" "}
        <Link
          to={`/login?redirect=${encodeURIComponent(redirect)}${intent ? `&intent=${encodeURIComponent(intent)}` : ""}`}
          className="font-medium underline"
        >
          Log in
        </Link>
      </p>
    </section>
  );
}
