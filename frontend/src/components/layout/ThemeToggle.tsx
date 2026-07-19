import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const title =
    theme === "light"
      ? "Switch to Dark Theme"
      : "Switch to Light Theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={title}
      title={title}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text)] transition-all hover:scale-105 active:scale-95 duration-200"
    >
      {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
    </button>
  );
}
