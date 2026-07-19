import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, Terminal, Activity, CheckCircle2, ShieldCheck, Cpu, User, Mail, Lock } from "lucide-react";
import { api, unwrapData } from "@/lib/api";
import { setUserToken } from "@/lib/auth";
import Logo from "@/assets/icons/navLogo.svg";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
              <span className="font-mono text-xs text-gray-400">auth-v2.handshake.online</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Quick Benefits Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Access</h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Full AES-256 secure encryption keys protection.</p>
                </div>
              </div>
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4 flex flex-col justify-between">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-3">
                  <Cpu size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Pipelines</h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">Instantly download compiled client source logs.</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Deployment Status Terminal */}
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4.5 font-mono text-xs text-gray-400">
              <div className="flex items-center gap-1.5 text-gray-500 border-b border-gray-900 pb-2 mb-3">
                <Terminal size={12} className="text-primary" />
                <span>Handshake Registration Diagnostics</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span>Interactive secure registration pipeline live</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
                  <span>Awaiting credentials submit handler...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in the sidebar */}
        <div className="relative z-10 flex items-center justify-between text-xs text-gray-500 border-t border-gray-900 pt-6">
          <span>© 2026 Mohmad Naved. </span>
          <div className="flex items-center gap-1 font-mono">
            <ShieldCheck size={12} className="text-primary" />
            <span>Encrypted Connection</span>
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
          className="w-full max-w-md space-y-6"
        >
          {/* Greeting text */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              <Sparkles size={11} className="animate-pulse" />
              Join the Network
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[color:var(--color-text)] font-display">
              Create Account
            </h1>
            <p className="mt-1.5 text-sm text-[color:var(--color-muted)]">
              Register below to open high-performance source downloads.
            </p>
          </div>

          {/* Core Signup Card Form */}
          <div className="bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden group">
            {/* Ambient accent background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

            <form onSubmit={onSubmit} className="space-y-4.5 relative z-10">
              
              {/* Full Name field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                  <User size={12} className="text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Name"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
                />
              </div>

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
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
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
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] pl-4 pr-11 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
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

              {/* Confirm Password field with Eye Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] flex items-center gap-1.5">
                  <Lock size={12} className="text-primary" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] pl-4 pr-11 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)] hover:text-[color:var(--color-text)] transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                className="w-full relative overflow-hidden group inline-flex items-center justify-center gap-2.5 rounded-xl bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100 px-5 py-3 text-sm font-semibold transition-all duration-300 shadow-soft select-none disabled:opacity-65 hover:shadow-lift hover:-translate-y-0.5 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Create Developer Account"}
              </button>

            </form>
          </div>

          {/* Route redirect link */}
          <p className="text-center text-sm text-[color:var(--color-muted)]">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}${intent ? `&intent=${encodeURIComponent(intent)}` : ""}`}
              className="font-bold text-[color:var(--color-text)] hover:text-primary transition-colors underline"
            >
              Log in
            </Link>
          </p>

        </motion.div>
      </div>

    </div>
  );
}

