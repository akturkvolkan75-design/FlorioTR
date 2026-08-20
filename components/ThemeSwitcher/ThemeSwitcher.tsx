"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function ThemeSwitcher() {
  const { theme, changeTheme } = useTheme();

  const colors = themes[theme].colors;

  const isNight = theme === "night";

  return (
    <button
      type="button"
      onClick={changeTheme}
      title={
        isNight
          ? "Açık temaya geç"
          : "Koyu temaya geç"
      }
      aria-label={
        isNight
          ? "Açık temaya geç"
          : "Koyu temaya geç"
      }
      className="
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        text-[13px]
        transition
        duration-200
        hover:-translate-y-0.5
        hover:scale-105
        active:scale-95
      "
      style={{
        background: isNight
          ? colors.secondary
          : colors.accentSoft,

        borderColor: colors.cardBorder,

        boxShadow:
          "0 2px 7px rgba(0,0,0,0.10)",
      }}
    >
      {isNight ? "☀️" : "🌙"}
    </button>
  );
}