import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
