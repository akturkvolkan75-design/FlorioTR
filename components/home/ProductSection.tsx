"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import FeaturedFlowers from "./FeaturedFlowers";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function ProductSection() {

  const products = useProducts();

  const [activeFilter, setActiveFilter] =
    useState<"all" | "popular" | "new" | "special">("all");


  const { theme } = useTheme();

  const colors = themes[theme].colors;


  const filteredProducts =
    activeFilter === "popular"
      ? products.filter((product) => product.rating >= 4.8)
      : activeFilter === "new"
      ? products.slice(-10).reverse()
      : activeFilter === "special"
      ? products.filter(
          (product) =>
            product.vip ||
            product.category === "Düğün Sepetleri" ||
            product.category === "Çelenkler"
        )
      : products;



  const filters = [
    {
      id: "all" as const,
      label: "Tümü",
      icon: "🌸",
    },
    {
      id: "popular" as const,
      label: "Popüler",
      icon: "❤️",
    },
    {
      id: "new" as const,
      label: "Yeni",
      icon: "✨",
    },
    {
      id: "special" as const,
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
            color: colors.primary,
          }}
        >
          FlorioTR Çiçek Koleksiyonu
        </h2>


      </div>



      <div
        className="
        mb-8
        flex
        justify-center
        gap-3
        flex-wrap
        "
      >

        {filters.map((filter)=>{

          const active =
            activeFilter === filter.id;


          return (

            <button

              key={filter.id}

              onClick={() =>
                setActiveFilter(filter.id)
              }

              className="
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
                `1px solid ${colors.cardBorder}`

              }}

            >

              {filter.icon} {filter.label}

            </button>

          );

        })}


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

        {filteredProducts.map((product)=>(

          <ProductCard

            key={product.id}

            product={product}

          />

        ))}


      </div>



    </section>

  );

}