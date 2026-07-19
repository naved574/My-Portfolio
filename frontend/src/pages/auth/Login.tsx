import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Terminal, Activity, CheckCircle2, TrendingUp, Shield, Lock, Mail } from "lucide-react";
import { api, unwrapData } from "@/lib/api";
import axios from "axios";
import { setUserToken } from "@/lib/auth";
import Logo from "@/assets/icons/navLogo.svg"

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = unwrapData<LoginResponse>(
        await api.post("/auth/login", { email: email.trim(), password })
      );
      setUserToken(data.token);

      const query = intent ? `?intent=${encodeURIComponent(intent)}` : "";
      navigate(`${redirect}${query}`);
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : null;
      setError(message || "Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch bg-[color:var(--color-bg)] overflow-hidden">

      {/* Premium Side Mockup Panel - Hidden on Mobile, Beautifully Detailed on Desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-950 text-white p-12 flex-col justify-between overflow-hidden border-r border-gray-900">

        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand & Decorative Subtext */}
        <div className="relative z-10 mt-5 flex items-center gap-2.5">
          <div className="w-42 ">
            <div>
              <img src={Logo} alt="Logo" className="h-full w-full" />
            </div>
            <span className="text-[10px] pl-4 block font-mono text-gray-500 uppercase tracking-widest leading-none">
              Developer Workspace
            </span>
          </div>
        </div>

        {/* Live Mock Interactive Platform Dashboard */}
        <div className="relative z-10 my-auto max-w-lg w-full bg-gray-900/60 border border-gray-800 rounded-3xl p-6 backdrop-blur-md shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-xs text-gray-400">api-v2.main-server.online</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <div className="text-gray-500 text-[10px] uppercase font-mono tracking-wider">Ping Speed</div>
                <div className="text-sm font-bold text-emerald-400 mt-1 font-mono flex items-center gap-1">
                  <Activity size={12} />
                  12ms
                </div>
              </div>
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <div className="text-gray-500 text-[10px] uppercase font-mono tracking-wider">Uptime</div>
                <div className="text-sm font-bold text-white mt-1 font-mono">99.98%</div>
              </div>
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-3.5 flex flex-col justify-between">
                <div className="text-gray-500 text-[10px] uppercase font-mono tracking-wider">Client Reviews</div>
                <div className="text-sm font-bold text-amber-400 mt-1 font-mono flex items-center gap-1">
                  <TrendingUp size={12} />
                  5.0★
                </div>
              </div>
            </div>

            {/* Simulated Live Deployment Status Terminal */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4.5 font-mono text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-gray-500 border-b border-gray-900 pb-2 mb-3">
                <Terminal size={12} className="text-primary" />
                <span>Runtime Diagnostics</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>MongoDB Sandbox connection verified</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Express cluster processes healthy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                  <span>Awaiting developer login handshake...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in the sidebar */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gray-500 border-t border-gray-900 pt-6">
          <span>© 2026 Mohmad Naved. </span>
          <div className="flex items-center gap-1 font-mono">
            <Shield size={12} className="text-primary" />
            <span>SSL Secured Connection</span>
          </div>
        </div>

      </div>

      {/* Main Action Authorization Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 md:px-16 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] via-transparent to-transparent pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Greeting text */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <Lock size={11} />
              Secure Gateway
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[color:var(--color-text)] font-display">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              {intent ? "Sign in to unlock requested resource access." : "Sign in to review and manage portfolio modules."}
            </p>
          </div>

          {/* Core Login Card Form */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden group">
            {/* Ambient accent background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <form onSubmit={onSubmit} className="space-y-5 relative z-10">

              {/* Email address field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                  <Mail size={12} className="text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
                />
              </div>

              {/* Password field with Eye Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                  <Lock size={12} className="text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] pl-4 pr-11 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)] hover:text-[color:var(--color-text)] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error block if any */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-950/50 rounded-xl p-3"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group inline-flex items-center justify-center gap-2.5 rounded-xl bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 px-5 py-3.5 text-sm font-semibold transition-all duration-300 shadow-soft select-none disabled:opacity-65 hover:shadow-lift hover:-translate-y-0.5 cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In to Workspace"}
              </button>

            </form>
          </div>

          {/* Route redirect link */}
          <p className="text-center text-sm text-[color:var(--color-muted)]">
            New here?{" "}
            <Link
              to={`/signup?redirect=${encodeURIComponent(redirect)}${intent ? `&intent=${encodeURIComponent(intent)}` : ""}`}
              className="font-bold text-[color:var(--color-text)] hover:text-primary transition-colors underline"
            >
              Create an account
            </Link>
          </p>

        </motion.div>
      </div>

    </div>
  );
}
