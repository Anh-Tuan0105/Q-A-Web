import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type ThemeState } from "../types/store";



export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      userThemes: {},
      setTheme: (theme, userId) => {
        set({ theme });
        if (userId) {
          set((state) => ({
            userThemes: { ...state.userThemes, [userId]: theme },
          }));
        }
      },
      toggleTheme: (userId) => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        if (userId) {
          set((state) => ({
            userThemes: { ...state.userThemes, [userId]: newTheme },
          }));
        }
      },
      loadUserTheme: (userId) => {
        const userThemes = get().userThemes || {};
        const userTheme = userThemes[userId] || "light";
        set({ theme: userTheme });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);
