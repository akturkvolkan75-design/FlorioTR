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
        rounded-3xl
        transition-all
        duration-300
        hover:-translate-y-2
      "
      style={{
        background: colors.card,

        border:
          `1px solid ${colors.cardBorder}`,

        boxShadow:
          `0 10px 25px ${colors.cardBorder}22`,
      }}
    >
      {/* FOTOĞRAF */}

      <div
        className="
          relative
          h-40
          overflow-hidden
          sm:h-44
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
            group-hover:scale-105
          "
        />

        {product.vip && (
          <span
            className="
              absolute
              right-2
              top-2
              rounded-full
              px-3
              py-1
              text-[11px]
              font-bold
            "
            style={{
              background:
                colors.primary,

              color:
                colors.background,
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
          "
        >
          <FavoriteButton
            slug={product.slug}
          />
        </div>
      </div>

      {/* BİLGİ */}

      <div className="p-4">
        <p
          className="
            text-xs
            font-bold
          "
          style={{
            color:
              colors.primary,
          }}
        >
          {product.category}
        </p>

        <h3
          className="
            mt-1
            truncate
            text-base
            font-black
          "
          style={{
            color:
              colors.foreground,
          }}
        >
          {product.name}
        </h3>

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-lg
              font-black
            "
            style={{
              color:
                colors.primary,
            }}
          >
            {product.price.toLocaleString(
              "tr-TR"
            )}{" "}
            TL
          </span>

          <span className="text-xs">
            <ProductRating
              productSlug={
                product.slug
              }
              fallback={
                product.rating
              }
            />
          </span>
        </div>

        <Link
          href={`/urunler/${product.slug}`}
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-1.5
            rounded-xl
            py-2
            text-center
            text-sm
            font-bold
            transition
            hover:scale-[1.02]
          "
          style={{
            background:
              colors.actionSecondary,

            color:
              colors.actionSecondaryText,
          }}
        >
          <FlorioLogo
            primary={
              colors.actionSecondaryText
            }
            accent={
              colors.accent
            }
            compact
            iconOnly
          />

          <span>
            İncele
          </span>
        </Link>

        <div className="mt-2">
          <AddToCartButton
            product={{
              id:
                product.id,

              slug:
                product.slug,

              name:
                product.name,

              price:
                product.price,

              image:
                product.image,
            }}
          />
        </div>
      </div>
    </article>
  );
}