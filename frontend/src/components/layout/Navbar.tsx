import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  Download,
  FileText,
  Home,
  Info,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Palette,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  UserCog,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/assets/icons/navLogo.svg";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { clearAdminToken, clearUserToken, getAdminToken, getUserToken } from "@/lib/auth";
import { api, unwrapData } from "@/lib/api";
import { useThemeStore } from "@/stores/useThemeStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMe = {
  user: {
    id?: string;
    fullName?: string;
    email?: string;
  };
};

const navLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: Info },
  { path: "/projects", label: "Projects", icon: PanelsTopLeft },
  { path: "/contact", label: "Contact", icon: MessageCircle },
];

function getInitials(name: string, email?: string) {
  const trimmed = name.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || "").join("");
  }
  if (email) return email[0]?.toUpperCase() || "U";
  return "U";
}

export default function Navbar() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const userToken = getUserToken();
  const adminToken = getAdminToken();
  const isLoggedIn = Boolean(userToken);
  const isAdmin = Boolean(adminToken);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let active = true;

    const hydrateUser = async () => {
      if (!userToken) {
        setUserName("");
        setUserEmail("");
        return;
      }

      try {
        const data = unwrapData<UserMe>(await api.get("/auth/me"));
        if (!active) return;
        setUserName(data.user.fullName || "");
        setUserEmail(data.user.email || "");
      } catch {
        if (!active) return;
        setUserName("");
        setUserEmail("");
      }
    };

    hydrateUser();
    return () => {
      active = false;
    };
  }, [userToken]);

  const go = (path: string) => {
    setPanelOpen(false);
    navigate(path);
  };

  const initials = useMemo(() => getInitials(userName, userEmail), [userEmail, userName]);

  const logout = async () => {
    try {
      if (isLoggedIn) {
        await api.post("/auth/logout");
      }
    } catch {
      // Logout on API is optional for client session teardown.
    }

    clearUserToken();
    clearAdminToken();
    setPanelOpen(false);
    navigate("/");
  };

  const ActionAuth = ({ insidePanel = false }: { insidePanel?: boolean }) => {
    if (!isLoggedIn) {
      return (
        <button
          onClick={() => go("/login")}
          className={`rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] px-3.5 py-2 text-sm font-medium text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)] ${insidePanel ? "w-full text-left" : ""}`}
        >
          Login
        </button>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-sm font-semibold text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
            aria-label="Open account menu"
          >
            {initials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl border-[color:var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_88%,transparent)] p-1.5 shadow-xl backdrop-blur-md"
        >
          <DropdownMenuItem onClick={() => go("/projects")} className="rounded-lg">
            My Access
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg">Manage Account</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="rounded-lg text-red-500 focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const SettingsMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
          aria-label="Open settings menu"
        >
          <Menu size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="w-64 rounded-2xl border-[color:var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_88%,transparent)] p-1.5 shadow-xl backdrop-blur-md"
      >
        <DropdownMenuItem className="rounded-lg">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg">
            <FileText className="mr-2 h-4 w-4" /> Resume
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-xl border-[color:var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
            <DropdownMenuItem asChild className="rounded-lg">
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                View Resume
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg">
              <a href="/resume.pdf" download>
                <Download className="mr-2 h-4 w-4" /> Download Resume
              </a>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg">
            <Moon className="mr-2 h-4 w-4" /> Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-xl border-[color:var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_92%,transparent)] backdrop-blur-md">
            <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg">
              Light {theme === "light" ? "•" : ""}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg">
              Dark {theme === "dark" ? "•" : ""}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-lg">
              System {theme === "system" ? "•" : ""}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem className="rounded-lg">Privacy & Policy</DropdownMenuItem>
        <DropdownMenuItem className="rounded-lg">
          <UserCog className="mr-2 h-4 w-4" /> Manage Account
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => go("/admin/projects")} className="rounded-lg">
              <ShieldCheck className="mr-2 h-4 w-4" /> Admin Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => go("/admin/messages")} className="rounded-lg">
              Contact Messages
            </DropdownMenuItem>
          </>
        )}
        {isLoggedIn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="rounded-lg text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (

    // ------- Navbar -----
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[color:var(--color-border)] [background-color:color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-2">
        <button
            onClick={() => setPanelOpen(true)}
            className="cursor-pointer grid h-10 w-10 place-items-center rounded-xl  bg-transparent text-[color:var(--color-text)] duration-300 hover:scale-110 "
            aria-label="Open navigation panel"
          >
            <Menu size={25} />
          </button>

        <Link to="/" className="font-display text-lg font-bold tracking-tight" aria-label="Home" onClick={() => setPanelOpen(false)}>
          <div className="grid w-40 cursor-pointer place-items-center rounded-[10px] transition-opacity hover:opacity-90 sm:w-44">
            <img src={Logo} alt="Logo" className="h-full w-full" />
          </div>
        </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <div className="hidden lg:block">
            <ActionAuth />
          </div>
          
        </div>
      </nav>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.button
              aria-label="Close panel backdrop"
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed left-3 top-16 z-50 flex h-[min(82vh,680px)] w-[min(88vw,340px)] flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:color-mix(in_srgb,var(--color-bg)_90%,transparent)] p-3 shadow-xl backdrop-blur-md"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-sm font-medium text-[color:var(--color-muted)]">Navigation</span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
                  aria-label="Close side panel"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1">
                {navLinks.map((l) => {
                  const isActive = pathname === l.path;
                  const Icon = l.icon;
                  return (
                    <button
                      key={l.path}
                      onClick={() => go(l.path)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base transition-colors ${
                        isActive
                          ? "bg-[color:var(--color-surface)] text-[color:var(--color-text)]"
                          : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
                      }`}
                    >
                      <Icon size={17} />
                      {l.label}
                    </button>
                  );
                })}
              </div>

              {isAdmin && (
                <div className="mt-3 space-y-1 border-t border-[color:var(--color-border)] pt-3">
                  <button
                    onClick={() => go("/admin/projects")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
                  >
                    <ShieldCheck size={17} />
                    Admin Dashboard
                  </button>
                  <button
                    onClick={() => go("/admin/messages")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
                  >
                    <MessageCircle size={17} />
                    Contact Messages
                  </button>
                  <button
                    onClick={() => go("/admin/projects")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base text-[color:var(--color-muted)] transition-colors hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text)]"
                  >
                    <PanelsTopLeft size={17} />
                    Projects CMS
                  </button>
                </div>
              )}

              <div className="mt-auto flex items-center gap-2 border-t border-[color:var(--color-border)] pt-3">
                <div className="flex-1">
                  <ActionAuth insidePanel />
                </div>
                <SettingsMenu />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
