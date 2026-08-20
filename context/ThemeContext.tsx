"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  themes,
  type ThemeName,
} from "@/themes/themes";


type ThemeContextType = {
  theme: ThemeName;
  changeTheme: () => void;
};


const ThemeContext =
  createContext<ThemeContextType | null>(null);


export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] =
    useState<ThemeName>("florio");


  function applyTheme(selectedTheme: ThemeName) {
    const colors =
      themes[selectedTheme].colors;


    document.body.style.background =
      colors.background;

    document.body.style.color =
      colors.foreground;


    document.documentElement.style.setProperty(
      "--background",
      colors.background
    );

    document.documentElement.style.setProperty(
      "--foreground",
      colors.foreground
    );

    document.documentElement.style.setProperty(
      "--primary",
      colors.primary
    );

    document.documentElement.style.setProperty(
      "--accent",
      colors.accent
    );

    document.documentElement.style.setProperty(
      "--card",
      colors.card
    );

    document.documentElement.style.setProperty(
      "--card-border",
      colors.cardBorder
    );

    document.documentElement.style.setProperty(
      "--muted",
      colors.muted
    );

    document.documentElement.dataset.theme =
      selectedTheme;

    document.documentElement.style.colorScheme =
      selectedTheme === "night"
        ? "dark"
        : "light";
  }


  useEffect(() => {
    const savedTheme =
      localStorage.getItem("floriotr_theme");


    const initialTheme: ThemeName =
      savedTheme === "night"
        ? "night"
        : "florio";


    setTheme(initialTheme);

    applyTheme(initialTheme);
  }, []);


  function changeTheme() {
    const nextTheme: ThemeName =
      theme === "florio"
        ? "night"
        : "florio";


    setTheme(nextTheme);

    localStorage.setItem(
      "floriotr_theme",
      nextTheme
    );

    applyTheme(nextTheme);
  }


  return (
    <ThemeContext.Provider
      value={{
        theme,
        changeTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  const context =
    useContext(ThemeContext);


  if (!context) {
    throw new Error(
      "useTheme ThemeProvider içinde kullanılmalı"
    );
  }


  return context;
}