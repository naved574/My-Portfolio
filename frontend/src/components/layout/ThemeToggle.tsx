import { Laptop, Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const title =
    theme === "light"
      ? "Theme: Light (click to switch)"
      : theme === "dark"
        ? "Theme: Dark (click to switch)"
        : `Theme: System (${resolvedTheme}) (click to switch)`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={title}
      title={title}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)] text-[color:var(--color-text)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-text)]"
    >
      {theme === "system" ? <Laptop size={16} /> : resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
