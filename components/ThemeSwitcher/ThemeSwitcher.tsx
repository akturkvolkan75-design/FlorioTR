"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes, type ThemeName } from "@/themes/themes";

const themeList: Array<{
  id: ThemeName;
  name: string;
  colors: [string, string];
}> = [
  { id: "zumrutSampanya", name: "Zümrüt & Şampanya", colors: ["#0E4A3B", "#D9B86C"] },
  { id: "pudra", name: "Pudra", colors: ["#B84272", "#FFE3ED"] },
  { id: "geceBahcesi", name: "Gece Bahçesi", colors: ["#D7AF67", "#1C2B25"] },
  { id: "ayYildiz", name: "Ay-Yıldız", colors: ["#C9283B", "#FFFFFF"] },
  { id: "lacivertSari", name: "Lacivert & Sarı", colors: ["#173E8D", "#F0C400"] },
  { id: "sariKirmizi", name: "Sarı & Kırmızı", colors: ["#B21F3B", "#F5C518"] },
  { id: "siyahBeyaz", name: "Siyah & Beyaz", colors: ["#242424", "#FFFFFF"] },
  { id: "bordoMavi", name: "Bordo & Mavi", colors: ["#791E3C", "#215A9B"] },
];

export default function ThemeSwitcher() {
  const { theme, changeTheme } = useTheme();
  const activeTheme = themeList.find((item) => item.id === theme);

  return (
    <details className="group relative z-[100]">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-extrabold shadow-lg backdrop-blur transition hover:-translate-y-0.5"
        style={{
          background: `${themes[theme].colors.secondary}F2`,
          borderColor: `${themes[theme].colors.primary}66`,
          color: themes[theme].colors.foreground,
        }}
      >
        <span aria-hidden="true">🎨</span>
        <span>Tema Seç</span>
        <span className="text-xs font-semibold">({activeTheme?.name})</span>
        <span className="transition group-open:rotate-180">▾</span>
      </summary>

      <div
        aria-label="Tema seçimi"
        className="absolute right-0 mt-2 w-56 rounded-2xl border p-2 shadow-2xl backdrop-blur"
        style={{
          background: `${themes[theme].colors.secondary}FA`,
          borderColor: `${themes[theme].colors.primary}66`,
        }}
      >
        {themeList.map((item) => {
          const active = theme === item.id;

          return (
            <button
              key={item.id}
              onClick={(event) => {
                changeTheme(item.id);
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
              title={item.name}
              aria-label={`${item.name} temasını seç`}
              className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-extrabold transition hover:translate-x-0.5"
              style={{
                background: active ? themes[theme].colors.primary : "transparent",
                borderColor: active ? themes[theme].colors.primary : `${themes[theme].colors.foreground}26`,
                color: active ? themes[theme].colors.background : themes[theme].colors.foreground,
              }}
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border border-black/10"
                style={{
                  background: `linear-gradient(135deg, ${item.colors[0]} 0 50%, ${item.colors[1]} 50% 100%)`,
                }}
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </details>
  );
}
