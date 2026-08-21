"use client";

import { useState } from "react";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { useProducts } from "@/hooks/useProducts";
import { themes } from "@/themes/themes";

import FeaturedFlowers from "./FeaturedFlowers";
import ProductCard from "./ProductCard";

type FilterId =
  | "all"
  | "popular"
  | "new"
  | "special";

type Filter = {
  id: FilterId;
  label: string;
  icon?: string;
  brand?: boolean;
};

export default function ProductSection() {
  const products = useProducts();

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<FilterId>("all");

  const { theme } = useTheme();

  const colors =
    themes[theme].colors;

  const filteredProducts =
    activeFilter === "popular"
      ? products.filter(
          (product) =>
            product.rating >= 4.8
        )
      : activeFilter === "new"
        ? products
            .slice(-10)
            .reverse()
        : activeFilter === "special"
          ? products.filter(
              (product) =>
                product.vip ||
                product.category ===
                  "Düğün Sepetleri" ||
                product.category ===
                  "Çelenkler"
            )
          : products;

  const filters: Filter[] = [
    {
      id: "all",
      label: "Tümü",
      brand: true,
    },
    {
      id: "popular",
      label: "Popüler",
      icon: "❤️",
    },
    {
      id: "new",
      label: "Yeni",
      icon: "✨",
    },
    {
      id: "special",
      label: "Özel",
      icon: "🎁",
    },
  ];

  return (
    <section
      id="koleksiyon"
      className="
        mx-auto
        max-w-7xl
        px-4
        py-10
      "
    >
      <div className="mb-8 text-center">
        <h2
          className="
            text-3xl
            font-black
          "
          style={{
            color:
              colors.primary,
          }}
        >
          FlorioTR Çiçek Koleksiyonu
        </h2>
      </div>

      <div
        className="
          mb-8
          flex
          flex-wrap
          justify-center
          gap-3
        "
      >
        {filters.map(
          (filter) => {
            const active =
              activeFilter ===
              filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    filter.id
                  )
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-1.5
                  rounded-full
                  px-5
                  py-2
                  text-sm
                  font-black
                  transition
                  hover:-translate-y-1
                "
                style={{
                  background:
                    active
                      ? colors.actionPrimary
                      : colors.card,

                  color:
                    active
                      ? colors.actionPrimaryText
                      : colors.foreground,

                  border:
                    `1px solid ${colors.cardBorder}`,
                }}
              >
                {filter.brand ? (
                  <FlorioLogo
                    primary={
                      active
                        ? colors.actionPrimaryText
                        : colors.primary
                    }
                    accent={
                      active
                        ? colors.actionPrimaryText
                        : colors.accent
                    }
                    compact
                    iconOnly
                    light={active}
                  />
                ) : (
                  <span>
                    {filter.icon}
                  </span>
                )}

                <span>
                  {filter.label}
                </span>
              </button>
            );
          }
        )}
      </div>

      <FeaturedFlowers />

      <div
        className="
          mt-10
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-5
        "
      >
        {filteredProducts.map(
          (product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          )
        )}
      </div>
    </section>
  );
}