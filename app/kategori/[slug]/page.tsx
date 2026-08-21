"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import FlorioLogo from "@/components/FlorioLogo";
import ProductCard from "@/components/home/ProductCard";
import { useTheme } from "@/context/ThemeContext";
import { useProducts } from "@/hooks/useProducts";
import { themes } from "@/themes/themes";

const categoryNames: Record<string, string> = {
  "gul-buketleri": "Gül Buketleri",
  "karisik-mevsim-buketleri": "Karışık Mevsim Buketleri",
  "papatya-gul-buketleri": "Papatya & Gül Buketleri",
  orkideler: "Orkideler",
  "saksi-cicekleri": "Saksı Çiçekleri",
  "dugun-sepetleri": "Düğün Sepetleri",
  celenkler: "Çelenkler",
  vip: "VIP",
};

export default function CategoryPage() {
  const products = useProducts();

  const params = useParams();

  const slug = params.slug as string;

  const { theme } = useTheme();

  const colors = themes[theme].colors;

  const isPopular =
    slug === "en-cok-tercih-edilenler";

  const categoryName = isPopular
    ? "En Çok Tercih Edilenler"
    : categoryNames[slug];

  const categoryProducts = isPopular
    ? [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8)
    : products.filter(
        (product) =>
          product.category === categoryName
      );

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6"
      style={{
        background: colors.background,
        color: colors.foreground,
      }}
    >
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-center gap-3">
          {isPopular ? (
            <span className="text-3xl">
              ⭐
            </span>
          ) : (
            <FlorioLogo
              primary={colors.primary}
              accent={colors.accent}
              compact
              iconOnly
            />
          )}

          <h1
            className="text-center text-3xl font-black sm:text-4xl"
            style={{
              color: colors.primary,
            }}
          >
            {categoryName || "Kategori"}
          </h1>
        </div>

        {categoryProducts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>
        ) : (
          <div
            className="mx-auto max-w-xl rounded-3xl p-10 text-center shadow-xl"
            style={{
              background: colors.card,
              border: `2px solid ${colors.cardBorder}`,
            }}
          >
            <div className="flex h-20 items-center justify-center">
              <div className="scale-[2.2]">
                <FlorioLogo
                  primary={colors.primary}
                  accent={colors.accent}
                  iconOnly
                />
              </div>
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Bu kategoride ürün bulunamadı
            </h2>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl px-8 py-3 font-bold"
              style={{
                background: colors.actionPrimary,
                color: colors.actionPrimaryText,
              }}
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}