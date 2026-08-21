"use client";

import Link from "next/link";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function Hero() {
  const { theme } = useTheme();

  const colors = themes[theme].colors;

  const cards = [
    {
      image: "/images/floriotr-florist-banner-v2.png",
      title: "Özel Buketler",
    },
    {
      image: "/images/floriotr-hero-realistic-roses.png",
      title: "Gül Koleksiyonu",
    },
    {
      image: "/images/floriotr-hero-peonies.png",
      title: "Zarif Tasarımlar",
    },
  ];

  return (
    <section
      className="
        mx-auto
        max-w-7xl
        px-4
        py-6
        sm:px-6
      "
    >
      <div
        className="
          grid
          gap-4
          lg:grid-cols-3
        "
      >
        {/* ANA BANNER */}

        <div
          className="
            relative
            min-h-[340px]
            overflow-hidden
            rounded-[32px]
            lg:col-span-2
          "
        >
          <img
            src="/images/floriotr-florist-banner-v2.png"
            alt="FlorioTR çiçek buketi"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/60
              via-black/30
              to-transparent
            "
          />

          <div
            className="
              relative
              z-10
              flex
              h-full
              items-center
              p-8
              sm:p-12
            "
          >
            <div className="max-w-md">
              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[.3em]
                  text-white/80
                "
              >
                FlorioTR
              </p>

              <div
                className="
                  mt-3
                  flex
                  items-end
                  gap-3
                "
              >
                <h1
                  className="
                    text-4xl
                    font-black
                    leading-tight
                    text-white
                    sm:text-5xl
                  "
                >
                  Sevdiklerinize
                  <br />
                  çiçek gönderin
                </h1>

                <div className="mb-1 shrink-0 text-white">
                  <FlorioLogo
                    primary="#ffffff"
                    accent={colors.accent}
                    compact
                    iconOnly
                    light
                  />
                </div>
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  text-white/80
                "
              >
                Zarif tasarımlar,
                güvenli teslimat.
              </p>

              <Link
                href="/kategori/en-cok-tercih-edilenler"
                className="
                  mt-6
                  inline-block
                  rounded-full
                  px-6
                  py-3
                  font-black
                "
                style={{
                  background: colors.actionPrimary,
                  color: colors.actionPrimaryText,
                }}
              >
                Çiçekleri Keşfet
              </Link>
            </div>
          </div>
        </div>

        {/* KÜÇÜK KARTLAR */}

        <div
          className="
            grid
            gap-4
          "
        >
          {cards
            .slice(1)
            .map((card) => (
              <div
                key={card.title}
                className="
                  relative
                  min-h-[160px]
                  overflow-hidden
                  rounded-[28px]
                "
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/35
                  "
                />

                <h2
                  className="
                    absolute
                    bottom-5
                    left-5
                    text-xl
                    font-black
                    text-white
                  "
                >
                  {card.title}
                </h2>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}