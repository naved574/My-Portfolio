import { create } from "zustand";

type Theme = "light" | "dark";

type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const THEME_STORAGE_KEY = "theme";

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "dark" ? "dark" : "light";
};

const persistTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    applyTheme(theme);
    persistTheme(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === "dark" ? "light" : "dark";
      applyTheme(theme);
      persistTheme(theme);
      return { theme };
    }),
}));
