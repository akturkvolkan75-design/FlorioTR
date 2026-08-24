"use client";

import Link from "next/link";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function Footer() {
  const { theme } = useTheme();

  const colors = themes[theme].colors;

  const isNight = theme === "night";

  return (
    <footer
      className="
        mt-3
        border-t
        transition-colors
        duration-300
      "
      style={{
        background: isNight
          ? colors.card
          : colors.surfaceSoft,

        borderColor: colors.cardBorder,

        color: colors.foreground,
      }}
    >
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-4
          py-4
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <FlorioLogo
              primary={colors.primary}
              accent={colors.accent}
              compact
            />

            <div
              className="
                hidden
                h-7
                w-px
                sm:block
              "
              style={{
                background: colors.cardBorder,
              }}
            />

            <p
              className="
                text-[11px]
                font-semibold
              "
              style={{
                color: colors.muted,
              }}
            >
              Sevdiklerinize duygularınızı çiçeklerle anlatın.
            </p>
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-2
              text-[10px]
              font-bold
            "
            style={{
              color: colors.muted,
            }}
          >
            <Link
              href="/uyelik-sozlesmesi"
              className="
                transition-opacity
                hover:opacity-70
              "
            >
              Üyelik Sözleşmesi
            </Link>

            <span
              style={{
                color: colors.accent,
              }}
            >
              •
            </span>

            <Link
              href="/kvkk-aydinlatma-metni"
              className="
                transition-opacity
                hover:opacity-70
              "
            >
              KVKK
            </Link>

            <span
              style={{
                color: colors.accent,
              }}
            >
              •
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1
              "
            >
              <FlorioLogo
                primary={colors.primary}
                accent={colors.accent}
                compact
                iconOnly
              />

              <span>
                Özenle hazırlanır
              </span>
            </span>

            <span
              style={{
                color: colors.accent,
              }}
            >
              •
            </span>

            <span>
              © {new Date().getFullYear()} FlorioTR
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}