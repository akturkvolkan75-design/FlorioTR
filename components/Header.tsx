"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import CustomerAccount from "@/components/CustomerAccount";
import FlorioLogo from "@/components/FlorioLogo";


const links = [
  {
    href: "/",
    label: "Ana Sayfa",
    icon: "🏠",
  },
  {
    href: "/favoriler",
    label: "Favoriler",
    icon: "❤️",
  },
  {
    href: "/sepet",
    label: "Sepet",
    icon: "🛒",
  },
  {
    href: "/siparislerim",
    label: "Siparişlerim",
    icon: "📦",
  },
  {
    href: "/hesabim/adreslerim",
    label: "Adreslerim",
    icon: "📍",
  },
];


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const { theme } = useTheme();

  const colors = themes[theme].colors;


  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/cicekci")
  ) {
    return null;
  }


  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }


  return (
    <header
      className="
        relative
        z-50
        border-b
        backdrop-blur
      "
      style={{
        background: `${colors.card}F7`,
        borderColor: colors.cardBorder,
        color: colors.foreground,
        boxShadow: "0 2px 14px rgba(23,56,47,0.07)",
      }}
    >
      <div
        className="
          mx-auto
          flex
          max-w-[1600px]
          items-center
          justify-between
          gap-4
          px-4
          py-2.5
          sm:px-6
        "
      >

        {/* LOGO */}

        <Link
          href="/"
          className="
            shrink-0
            transition
            duration-200
            hover:scale-[1.02]
          "
          aria-label="FlorioTR ana sayfa"
        >
          <FlorioLogo
            primary={colors.primary}
            accent={colors.accent}
            compact
          />
        </Link>



        {/* DESKTOP MENÜ */}

        <nav
          className="
            hidden
            items-center
            gap-2
            lg:flex
          "
        >
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  px-3.5
                  py-2
                  text-xs
                  font-black
                  whitespace-nowrap
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
                style={{
                  background: active
                    ? colors.actionPrimary
                    : colors.card,

                  color: active
                    ? colors.actionPrimaryText
                    : colors.foreground,

                  borderColor: active
                    ? colors.actionPrimary
                    : colors.cardBorder,

                  boxShadow: active
                    ? "0 5px 14px rgba(7,98,78,0.18)"
                    : "0 2px 6px rgba(23,56,47,0.04)",
                }}
              >
                <span
                  className="
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    text-[12px]
                  "
                >
                  {link.icon}
                </span>

                <span>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>



        {/* SAĞ TARAF */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div className="hidden lg:block">
            <CustomerAccount />
          </div>

          <ThemeSwitcher />


          {/* MOBİL MENÜ BUTONU */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              text-lg
              font-black
              transition
              hover:-translate-y-0.5
              lg:hidden
            "
            style={{
              background: colors.actionPrimary,
              borderColor: colors.cardBorder,
              color: colors.actionPrimaryText,
            }}
            aria-label="Menüyü aç"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

      </div>



      {/* MOBİL MENÜ */}

      {menuOpen && (
        <div
          className="
            border-t
            px-4
            py-3
            lg:hidden
          "
          style={{
            borderColor: colors.cardBorder,
            background: colors.card,
          }}
        >

          <nav
            className="
              grid
              gap-2
            "
          >
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    px-4
                    py-2.5
                    text-sm
                    font-black
                    transition
                  "
                  style={{
                    background: active
                      ? colors.actionPrimary
                      : colors.secondary,

                    color: active
                      ? colors.actionPrimaryText
                      : colors.foreground,

                    borderColor: active
                      ? colors.actionPrimary
                      : colors.cardBorder,
                  }}
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      background: active
                        ? "rgba(255,255,255,0.12)"
                        : colors.card,
                    }}
                  >
                    {link.icon}
                  </span>

                  {link.label}
                </Link>
              );
            })}
          </nav>


          <div
            className="
              mt-3
              border-t
              pt-3
            "
            style={{
              borderColor: colors.cardBorder,
            }}
          >
            <CustomerAccount mobile />
          </div>

        </div>
      )}

    </header>
  );
}