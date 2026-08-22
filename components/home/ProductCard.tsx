"use client";

import Link from "next/link";

import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FlorioLogo from "@/components/FlorioLogo";
import ProductRating from "@/components/reviews/ProductRating";

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
  description: string;
  vip: boolean;
};

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const { theme } = useTheme();

  const colors = themes[theme].colors;

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[20px]
        transition-all
        duration-300
        hover:-translate-y-1
      "
      style={{
        background: colors.card,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: `0 5px 14px ${colors.cardBorder}14`,
      }}
    >
      {/* ÜRÜN FOTOĞRAFI */}

      <div
        className="
          relative
          h-[280px]
          overflow-hidden
          sm:h-[320px]
          lg:h-[340px]
        "
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

        {product.vip && (
          <span
            className="
              absolute
              left-2
              top-2
              rounded-full
              px-2
              py-1
              text-[9px]
              font-black
            "
            style={{
              background: colors.primary,
              color: colors.background,
            }}
          >
            ✨ VIP
          </span>
        )}

        {/* PUAN */}

        <div
          className="
            absolute
            bottom-2
            left-2
            rounded-full
            px-2
            py-1
            text-[9px]
            backdrop-blur-md
          "
          style={{
            background: `${colors.card}E8`,
            color: colors.foreground,
          }}
        >
          <ProductRating
            productSlug={product.slug}
            fallback={product.rating}
          />
        </div>

        {/* FAVORİ */}

        <div
          className="
            absolute
            bottom-2
            right-2
            scale-[0.82]
          "
        >
          <FavoriteButton slug={product.slug} />
        </div>
      </div>

      {/* ULTRA KOMPAKT ALT ALAN */}

      <div
        className="
          px-2.5
          pb-2.5
          pt-2
        "
      >
        {/* ÜRÜN ADI + FİYAT */}

        <div
          className="
            grid
            grid-cols-[minmax(0,1fr)_auto]
            items-center
            gap-2
          "
        >
          <h3
            className="
              truncate
              text-[12px]
              font-black
              leading-none
            "
            style={{
              color: colors.foreground,
            }}
          >
            {product.name}
          </h3>

          <span
            className="
              whitespace-nowrap
              text-[14px]
              font-black
              leading-none
            "
            style={{
              color: colors.primary,
            }}
          >
            {product.price.toLocaleString("tr-TR")} TL
          </span>
        </div>

        {/* MİNİ BUTONLAR */}

        <div
          className="
            mt-1.5
            grid
            grid-cols-2
            gap-1.5
          "
        >
          <Link
            href={`/urunler/${product.slug}`}
            className="
              flex
              h-8
              w-full
              items-center
              justify-center
              gap-1
              rounded-lg
              px-2
              text-[10px]
              font-black
              leading-none
              transition
              hover:scale-[1.02]
            "
            style={{
              background: colors.actionSecondary,
              color: colors.actionSecondaryText,
            }}
          >
            <span className="scale-[0.7]">
              <FlorioLogo
                primary={colors.actionSecondaryText}
                accent={colors.accent}
                compact
                iconOnly
              />
            </span>

            <span>İncele</span>
          </Link>

          <AddToCartButton
            compact
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>
    </article>
  );
}