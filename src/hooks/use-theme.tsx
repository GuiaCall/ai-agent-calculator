
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for stored theme preference
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    
    // Check for system preference if no stored preference
    if (!storedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    
    return storedTheme || "light";
  });

  useEffect(() => {
    // Update the document root with the current theme
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Save the theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
