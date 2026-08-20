"use client";

import Link from "next/link";

import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


function ProductCard({
  product,
  colors,
  isNight,
}: {
  product: any;
  colors: any;
  isNight: boolean;
}) {
  const titleColor = isNight
    ? "#FFF8EA"
    : "#40372B";

  const mutedColor = isNight
    ? "#CFC2AE"
    : "#746B5C";

  const priceColor = isNight
    ? "#F0C978"
    : "#C8952C";


  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="
        group
        block
        min-w-0
      "
    >
      {/* FOTOĞRAF */}

      <div
        className="
          relative
          aspect-[4/4.35]
          overflow-hidden
          rounded-xl
          border
          transition
          duration-300
          group-hover:-translate-y-0.5
          group-hover:shadow-lg
        "
        style={{
          background: colors.card,
          borderColor: colors.cardBorder,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="
            h-full
            w-full
            object-cover
            transition
            duration-500
            group-hover:scale-[1.025]
          "
        />


        {/* FAVORİ */}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Favorilere ekle"
          className="
            absolute
            right-2
            top-2
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-lg
            border
            text-[13px]
            shadow-sm
            backdrop-blur
            transition
            hover:scale-105
          "
          style={{
            background: `${colors.card}E8`,
            borderColor: colors.cardBorder,
            color: colors.foreground,
          }}
        >
          ♡
        </button>
      </div>


      {/* ÜRÜN BİLGİLERİ */}

      <div className="px-0.5 pt-2">

        <h3
          className="
            line-clamp-2
            min-h-[30px]
            text-[12px]
            font-semibold
            leading-[15px]
          "
          style={{
            color: titleColor,
          }}
        >
          {product.name}
        </h3>


        <div
          className="
            mt-1
            flex
            items-center
            gap-1
            text-[10px]
            font-medium
          "
          style={{
            color: mutedColor,
          }}
        >
          <span className="text-amber-400">
            ★★★★★
          </span>

          <span>
            {product.rating}
          </span>
        </div>


        <p
          className="
            mt-1
            text-[14px]
            font-black
            tracking-[-0.01em]
          "
          style={{
            color: priceColor,
          }}
        >
          {product.price.toLocaleString("tr-TR")} TL
        </p>

      </div>
    </Link>
  );
}


export default function FeaturedFlowers() {
  const products = useProducts();

  const { theme } = useTheme();

  const colors =
    themes[theme].colors;

  const isNight =
    theme === "night";


  return (
    <section
      className="
        w-full
        pb-6
      "
    >
      <div
        className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-6

          sm:grid-cols-3

          md:grid-cols-4

          lg:grid-cols-5

          xl:grid-cols-6

          2xl:grid-cols-7
        "
      >
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            product={product}
            colors={colors}
            isNight={isNight}
          />
        ))}
      </div>
    </section>
  );
}