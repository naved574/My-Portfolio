import { create } from "zustand";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = "theme";

const resolveTheme = (theme: Theme): ResolvedTheme => {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const resolvedTheme = resolveTheme(theme);

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
    return savedTheme;
  }
  return "system";
};

const persistTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  resolvedTheme: resolveTheme(initialTheme),
  setTheme: (theme) => {
    applyTheme(theme);
    persistTheme(theme);
    set({ theme, resolvedTheme: resolveTheme(theme) });
  },
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === "light" ? "dark" : state.theme === "dark" ? "system" : "light";
      applyTheme(theme);
      persistTheme(theme);
      return { theme, resolvedTheme: resolveTheme(theme) };
    }),
}));

if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", () => {
    const { theme, setTheme } = useThemeStore.getState();
    if (theme === "system") {
      setTheme("system");
    }
  });
}
