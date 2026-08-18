"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function Hero() {
  const { theme } = useTheme();
  const colors = themes[theme].colors;
  const overlay = `linear-gradient(90deg, ${colors.actionPrimary} 0%, ${colors.actionPrimary} 30%, ${colors.actionPrimary}dc 42%, ${colors.actionPrimary}70 54%, ${colors.actionPrimary}20 64%, transparent 72%)`;

  return (
    <section className="relative isolate overflow-hidden transition-colors duration-500" style={{ background: colors.actionPrimary, color: colors.actionPrimaryText }}>
      <div className="absolute inset-0 hidden lg:block">
        <img src="/images/floriotr-florist-banner-v2.png" alt="Atölyesinde zarif bir gül buketi hazırlayan kadın çiçekçi ustası" className="floriotr-hero-motion h-full w-full object-cover object-center" />
        <div className="floriotr-hero-light absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0 transition-all duration-500" style={{ background: overlay }} />
      </div>
      <div className="relative mx-auto flex min-h-[535px] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border px-4 py-2 text-xs font-bold tracking-wide" style={{ borderColor: `${colors.actionPrimaryText}55`, background: `${colors.actionPrimaryText}12`, color: colors.actionPrimaryText }}>Aynı gün güvenli teslimat</span>
          <h1 className="mt-7 text-5xl font-black leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Duyguların en güzel hâli, çiçeklerle.</h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-7 opacity-80 sm:text-lg">Özenle seçilen tasarımlar, bölgenizdeki güvenilir çiçekçiler ve her adımda takip edilebilir teslimat.</p>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold opacity-75">
            <span>✓ Güvenli ödeme</span><span>✓ Sipariş takibi</span><span>✓ Yerel çiçekçi ağı</span>
          </div>
        </div>
      </div>
    </section>
  );
}
