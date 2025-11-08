import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>("dark");

    useEffect(() => {
        // initialize theme to dark by default
        const stored = (window.localStorage && window.localStorage.getItem("app-theme")) as Theme | null;
        const initial = stored || "dark";
        setThemeState(initial);
    }, []);

    useEffect(() => {
        const clsDark = "theme-dark";
        const clsLight = "theme-light";
        const el = document.documentElement || document.body;
        if (!el) return;
        el.classList.remove(clsDark, clsLight);
        el.classList.add(theme === "dark" ? clsDark : clsLight);
        try {
            window.localStorage.setItem("app-theme", theme);
        } catch (e) {
            // ignore
        }
    }, [theme]);

    const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

    const setTheme = (t: Theme) => setThemeState(t);

    return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};

export default ThemeContext;
