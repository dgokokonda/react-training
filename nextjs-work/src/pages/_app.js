import "@/styles/globals.css";
import "@/styles/Tooltip.css";
import { useState, createContext, useEffect, useCallback } from "react";

export const ThemeContext = createContext(null);

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Синхронизация с системной темой (опционально)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Устанавливаем системную тему если нет сохраненной
    if (!localStorage.getItem("theme")) {
      setTheme(mediaQuery.matches ? "dark" : "light");
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  // Добавляем класс темы на body для избежания мерцания
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 bg-blue-500 text-white rounded"
        title={theme === "dark" ? "Темная" : "Светлая"}
        aria-label="Переключить тему"
      >
        Тема: {theme === "dark" ? "🌙" : "☀️"}
      </button>
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
}
