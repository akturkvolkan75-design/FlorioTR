"use client";

import Link from "next/link";

import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
};

type CardColors = {
  card: string;
  cardBorder: string;
  foreground: string;
};

function ProductCard({ product, colors, isNight }: { product: Product; colors: CardColors; isNight: boolean }) {
  const titleColor = isNight ? "#FFF8EA" : "#40372B";
  const mutedColor = isNight ? "#CFC2AE" : "#746B5C";
  const priceColor = isNight ? "#F0C978" : "#C8952C";
  const isOrchid = product.category === "Orkideler";

  return (
    <Link href={`/urunler/${product.slug}`} className="group block min-w-0">
      <div
        className="relative aspect-[4/4.35] overflow-hidden rounded-xl border transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg"
        style={{ background: colors.card, borderColor: colors.cardBorder }}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full transition duration-500 ${
            isOrchid
              ? "object-contain p-2 group-hover:scale-[1.015]"
              : "object-cover group-hover:scale-[1.025]"
          }`}
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Favorilere ekle"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border text-[13px] shadow-sm backdrop-blur transition hover:scale-105"
          style={{
            background: `${colors.card}E8`,
            borderColor: colors.cardBorder,
            color: colors.foreground,
          }}
        >
          ♡
        </button>
      </div>

      <div className="px-0.5 pt-1.5">
        <h3 className="truncate text-[11px] font-bold leading-none" style={{ color: titleColor }}>
          {product.name}
        </h3>

        <div className="mt-1 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-[8px] font-medium leading-none" style={{ color: mutedColor }}>
            <span className="tracking-[-1px] text-amber-400">★★★★★</span>
            <span>{product.rating}</span>
          </div>

          <p
            className="whitespace-nowrap text-[12px] font-black leading-none tracking-[-0.01em]"
            style={{ color: priceColor }}
          >
            {product.price.toLocaleString("tr-TR")} TL
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedFlowers() {
  const products = useProducts();
  const { theme } = useTheme();
  const colors = themes[theme].colors;
  const isNight = theme === "night";

  return (
    <section className="w-full pb-6">
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} colors={colors} isNight={isNight} />
        ))}
      </div>
    </section>
  );
}
