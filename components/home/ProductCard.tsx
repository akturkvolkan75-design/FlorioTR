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
        rounded-[22px]
        transition-all
        duration-300
        hover:-translate-y-1
      "
      style={{
        background: colors.card,
        border: `1px solid ${colors.cardBorder}`,
        boxShadow: `0 6px 16px ${colors.cardBorder}16`,
      }}
    >
      {/* ÜRÜN FOTOĞRAFI - KARTIN ANA ALANI */}

      <div
        className="
          relative
          h-[260px]
          overflow-hidden
          sm:h-[300px]
          lg:h-[320px]
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
            group-hover:scale-[1.03]
          "
        />

        {product.vip && (
          <span
            className="
              absolute
              left-2
              top-2
              rounded-full
              px-2.5
              py-1
              text-[10px]
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

        <div
          className="
            absolute
            bottom-2
            right-2
            scale-90
          "
        >
          <FavoriteButton slug={product.slug} />
        </div>
      </div>

      {/* KOMPAKT BİLGİ ALANI */}

      <div className="px-3 pb-3 pt-2.5">
        <p
          className="
            text-[10px]
            font-bold
            leading-none
          "
          style={{
            color: colors.primary,
          }}
        >
          {product.category}
        </p>

        <h3
          className="
            mt-1
            truncate
            text-[14px]
            font-black
            leading-tight
          "
          style={{
            color: colors.foreground,
          }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p
            className="
              mt-1
              truncate
              text-[10px]
              leading-tight
            "
            style={{
              color: colors.muted,
            }}
          >
            {product.description}
          </p>
        )}

        {/* FİYAT + PUAN */}

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            gap-2
          "
        >
          <span
            className="
              text-[17px]
              font-black
              leading-none
            "
            style={{
              color: colors.primary,
            }}
          >
            {product.price.toLocaleString("tr-TR")} TL
          </span>

          <span
            className="
              scale-90
              text-[10px]
              origin-right
            "
          >
            <ProductRating
              productSlug={product.slug}
              fallback={product.rating}
            />
          </span>
        </div>

        {/* ÇOK KOMPAKT BUTONLAR */}

        <div
          className="
            mt-2
            grid
            grid-cols-[0.8fr_1.2fr]
            gap-2
          "
        >
          <Link
            href={`/urunler/${product.slug}`}
            className="
              flex
              h-9
              items-center
              justify-center
              gap-1
              rounded-lg
              px-2
              text-[11px]
              font-black
              transition
              hover:scale-[1.01]
            "
            style={{
              background: colors.actionSecondary,
              color: colors.actionSecondaryText,
            }}
          >
            <FlorioLogo
              primary={colors.actionSecondaryText}
              accent={colors.accent}
              compact
              iconOnly
            />

            <span>İncele</span>
          </Link>

          <div
            className="
              [&_button]:!h-9
              [&_button]:!min-h-0
              [&_button]:!rounded-lg
              [&_button]:!px-2
              [&_button]:!py-0
              [&_button]:!text-[11px]
              [&_button]:!font-black
            "
          >
            <AddToCartButton
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
      </div>
    </article>
  );
}