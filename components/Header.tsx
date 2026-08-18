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
  { href: "/", label: "Ana Sayfa", icon: "🏠" },
  { href: "/favoriler", label: "Favoriler", icon: "❤️" },
  { href: "/sepet", label: "Sepet", icon: "🛒" },
  { href: "/siparislerim", label: "Siparişlerim", icon: "📦" },
  { href: "/hesabim/adreslerim", label: "Adreslerim", icon: "📍" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  if (pathname.startsWith("/admin") || pathname.startsWith("/cicekci")) return null;

  return (
    <header
      className="relative z-50 border-b shadow-sm"
      style={{
        background: colors.card,
        borderColor: colors.cardBorder,
        color: colors.foreground,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="FlorioTR ana sayfa">
          <FlorioLogo primary={colors.primary} accent={colors.accent} compact />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-bold transition hover:-translate-y-0.5"
              style={{ color: colors.foreground }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block"><CustomerAccount /></div>
          <ThemeSwitcher />
          <button
            onClick={() => setMenuOpen((current) => !current)}
            className="rounded-xl border px-3 py-2 text-xl lg:hidden"
            style={{ borderColor: colors.cardBorder }}
            aria-label="Menüyü aç"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="grid gap-2 border-t px-4 py-4 lg:hidden" style={{ borderColor: colors.cardBorder }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 font-bold"
              style={{ background: colors.actionSecondary, color: colors.actionSecondaryText }}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <CustomerAccount mobile />
        </nav>
      )}
    </header>
  );
}
