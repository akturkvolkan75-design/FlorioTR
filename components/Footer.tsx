"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import FlorioLogo from "@/components/FlorioLogo";

const groups = [
  {
    title: "Alışveriş",
    links: [
      ["Çiçekleri keşfet", "/#koleksiyon"],
      ["Favorilerim", "/favoriler"],
      ["Sepetim", "/sepet"],
    ],
  },
  {
    title: "Hesabım",
    links: [
      ["Kişisel bilgilerim", "/hesabim"],
      ["Siparişlerim", "/siparislerim"],
      ["Adreslerim", "/hesabim/adreslerim"],
      ["Giriş yap / Kayıt ol", "/musteri/giris"],
    ],
  },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/cicekci") ||
    pathname.includes("/yazdir")
  ) {
    return null;
  }

  return (
    <footer
      className="relative isolate overflow-hidden border-t-2 transition-colors duration-500"
      style={{
        background: `linear-gradient(145deg, ${colors.actionPrimary}, ${colors.foreground})`,
        borderColor: colors.cardBorder,
        color: colors.actionPrimaryText,
      }}
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{ background: colors.actionSecondary }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{ background: colors.card }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex"
              aria-label="FlorioTR ana sayfa"
            >
              <FlorioLogo
                primary={colors.actionPrimaryText}
                accent={colors.cardBorder}
                light
              />
            </Link>

            <p className="mt-5 max-w-md text-sm font-medium leading-7 opacity-80">
              Özel anları, özenle hazırlanan çiçeklerle güzelleştiren yerel
              çiçekçi ağı.
            </p>

            <div
              className="mt-7 inline-flex items-center gap-3 rounded-full border px-4 py-2.5 text-xs font-black"
              style={{
                borderColor: `${colors.actionPrimaryText}40`,
                background: `${colors.actionPrimaryText}10`,
              }}
            >
              <span aria-hidden="true">✓</span>
              Güvenli ödeme ve takip edilebilir teslimat
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {groups.map((group) => (
              <div key={group.title}>
                <h2
                  className="text-xs font-black uppercase tracking-[.2em]"
                  style={{ color: colors.cardBorder }}
                >
                  {group.title}
                </h2>

                <nav
                  className="mt-4 space-y-3"
                  aria-label={group.title}
                >
                  {group.links.map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block text-sm font-bold opacity-75 transition hover:translate-x-1 hover:opacity-100"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs font-semibold opacity-70 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: `${colors.actionPrimaryText}25`,
          }}
        >
          <p>
            © {new Date().getFullYear()} FlorioTR. Tüm hakları saklıdır.
          </p>

          <p>
            Türkiye&apos;nin yerel çiçekçileriyle, özenle hazırlandı.
          </p>
        </div>
      </div>
    </footer>
  );
}