"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

const items = [
  {
    icon: "🌷",
    title: "Özenle Hazırlanır",
    text: "Her sipariş özenle hazırlanır",
  },
  {
    icon: "🚚",
    title: "Zamanında Teslimat",
    text: "Siparişiniz zamanında ulaşır",
  },
  {
    icon: "💝",
    title: "Özel Anlara Özel",
    text: "Her ana uygun çiçek seçenekleri",
  },
];

export default function TrustCards() {
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  return (
    <section className="w-full py-1">
      <div
        className="
          grid
          gap-3
          md:grid-cols-3
        "
      >
        {items.map((item) => (
          <div
            key={item.title}
            className="
              flex
              items-center
              justify-center
              gap-2.5
              rounded-xl
              px-3
              py-2
            "
            style={{
              background: colors.card,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <span className="text-base">
              {item.icon}
            </span>

            <div>
              <h3
                className="
                  text-xs
                  font-black
                  leading-4
                "
                style={{
                  color: colors.primary,
                }}
              >
                {item.title}
              </h3>

              <p
                className="
                  text-[9px]
                  leading-3
                  opacity-60
                "
              >
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}