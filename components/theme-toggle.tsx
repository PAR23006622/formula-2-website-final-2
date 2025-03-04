"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!theme || theme === "system") {
      setTheme(systemTheme || "light");
    }
  }, [systemTheme, theme, setTheme]);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium transition-colors ${isDark ? 'text-white/70' : 'text-white'}`}>
        Light
      </span>
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={`
          relative w-16 h-8 rounded-full transition-colors duration-300
          ${isDark ? 'bg-[#1a1a1a]' : 'bg-white/20'}
          flex items-center
        `}
        aria-label="Toggle theme"
      >
        <div
          className={`
            absolute w-6 h-6 rounded-full
            transform transition-transform duration-300 ease-spring
            flex items-center justify-center
            ${isDark ? 'translate-x-9 bg-[#3b82f6]' : 'translate-x-1 bg-[#fbbf24]'}
          `}
        >
          {isDark ? (
            <Moon className="h-3.5 w-3.5 text-white" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-white" />
          )}
        </div>
      </button>
      <span className={`text-sm font-medium transition-colors ${isDark ? 'text-white' : 'text-white/70'}`}>
        Dark
      </span>
    </div>
  );
}