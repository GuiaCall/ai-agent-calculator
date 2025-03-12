
import { useEffect, useState } from "react";
import { useThemePreference } from "./useThemePreference";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if theme is stored in local storage
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme) {
      return storedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return "dark";
    }
    
    return "light";
  });
  
  // Loading state for Supabase operations
  const [isLoading, setIsLoading] = useState(false);

  // Use the useThemePreference hook to persist theme choice to Supabase
  useThemePreference(theme, isLoading);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Update document with the theme class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
}
