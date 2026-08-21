"use client";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type AboutItem = {
  title: string;
  text: string;
  icon?: string;
  brand?: boolean;
};

export default function AboutFlorio() {
  const { theme } = useTheme();

  const colors = themes[theme].colors;

  const items: AboutItem[] = [
    {
      brand: true,
      title: "Özenle Hazırlanan Tasarımlar",
      text:
        "Her buket özel anlarınıza değer katmak için hazırlanır.",
    },

    {
      icon: "🚚",
      title: "Zamanında Teslimat",
      text:
        "Mutluluğunuz doğru zamanda sevdiklerinize ulaşır.",
    },

    {
      icon: "💝",
      title: "Özel Anlara Özel Çiçekler",
      text:
        "Doğum günü, yıldönümü ve özel günler için zarif seçimler.",
    },
  ];

  return (
    <section
      className="
        mx-auto
        max-w-6xl
        px-6
        py-24
        text-center
      "
    >
      {/* BAŞLIK */}

      <div
        className="
          flex
          items-center
          justify-center
          gap-3
        "
      >
        <FlorioLogo
          primary={colors.primary}
          accent={colors.accent}
          iconOnly
        />

        <h2
          className="
            text-4xl
            font-extrabold
          "
          style={{
            color: colors.primary,
          }}
        >
          Neden FlorioTR?
        </h2>
      </div>

      <p
        className="
          mx-auto
          mt-6
          max-w-2xl
          text-base
          font-semibold
          leading-relaxed
        "
        style={{
          color: colors.muted,
        }}
      >
        Her çiçek özel bir an için hazırlanır.
        FlorioTR olarak sevdiklerinize ulaşan her tasarımda
        kalite, özen ve zarafeti ön planda tutuyoruz.
      </p>

      {/* KARTLAR */}

      <div
        className="
          mt-14
          grid
          gap-8
          md:grid-cols-3
        "
      >
        {items.map((item, index) => {
          const isMiddleCard =
            index === 1;

          const cardBackground =
            isMiddleCard
              ? colors.actionSecondary
              : colors.actionPrimary;

          const cardText =
            isMiddleCard
              ? colors.actionSecondaryText
              : colors.actionPrimaryText;

          const cardBorder =
            isMiddleCard
              ? colors.actionPrimary
              : colors.actionSecondary;

          return (
            <div
              key={item.title}
              className="
                rounded-3xl
                border
                p-8
                shadow-xl
                transition-all
                duration-300
                hover:-translate-y-2
              "
              style={{
                background:
                  cardBackground,

                borderColor:
                  cardBorder,

                borderWidth:
                  "2px",

                boxShadow:
                  `0 14px 32px ${colors.actionPrimary}2E`,
              }}
            >
              <div
                className="
                  flex
                  h-14
                  items-center
                  justify-center
                "
              >
                {item.brand ? (
                  <div className="scale-[1.45]">
                    <FlorioLogo
                      primary={cardText}
                      accent={cardText}
                      compact
                      iconOnly
                      light
                    />
                  </div>
                ) : (
                  <span className="text-5xl">
                    {item.icon}
                  </span>
                )}
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-bold
                "
                style={{
                  color: cardText,
                }}
              >
                {item.title}
              </h3>

              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  leading-relaxed
                "
                style={{
                  color: cardText,
                }}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}