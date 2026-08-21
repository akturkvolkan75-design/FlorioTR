"use client";

import { useParams } from "next/navigation";

import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FlorioLogo from "@/components/FlorioLogo";
import ProductRating from "@/components/reviews/ProductRating";
import ProductReviews from "@/components/reviews/ProductReviews";
import { useTheme } from "@/context/ThemeContext";
import { useProducts } from "@/hooks/useProducts";
import { themes } from "@/themes/themes";

type TrustItem = {
  text: string;
  icon?: string;
  brand?: boolean;
};

export default function ProductPage() {
  const products = useProducts();

  const params = useParams();

  const slug =
    params.slug as string;

  const { theme } =
    useTheme();

  const colors =
    themes[theme].colors;

  const product =
    products.find(
      (item) =>
        item.slug === slug
    );

  if (!product) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-6
        "
        style={{
          background:
            colors.background,
        }}
      >
        <div className="text-center">
          <div
            className="
              flex
              h-20
              items-center
              justify-center
            "
          >
            <div className="scale-[2.2]">
              <FlorioLogo
                primary={
                  colors.primary
                }
                accent={
                  colors.accent
                }
                iconOnly
              />
            </div>
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-bold
            "
            style={{
              color:
                colors.primary,
            }}
          >
            Ürün bulunamadı
          </h1>
        </div>
      </main>
    );
  }

  const trustItems: TrustItem[] =
    [
      {
        icon: "🚚",
        text: "Aynı gün teslimat",
      },
      {
        brand: true,
        text: "Profesyonel hazırlama",
      },
      {
        icon: "🔒",
        text: "Güvenli ödeme",
      },
      {
        icon: "💝",
        text: "Özel gün tasarımları",
      },
    ];

  return (
    <main
      className="
        min-h-screen
        px-6
        py-16
      "
      style={{
        background:
          colors.background,
      }}
    >
      <div
        className="
          mx-auto
          max-w-6xl
          rounded-[40px]
          border
          p-8
          shadow-2xl
        "
        style={{
          background:
            colors.card,

          borderColor:
            colors.cardBorder,
        }}
      >
        <div
          className="
            grid
            gap-10
            md:grid-cols-2
          "
        >
          {/* ÜRÜN GÖRSELİ */}

          <div
            className="
              overflow-hidden
              rounded-[35px]
            "
          >
            <img
              src={product.image}
              alt={product.name}
              className="
                h-[500px]
                w-full
                object-cover
                transition
                duration-700
                hover:scale-105
              "
            />
          </div>

          {/* ÜRÜN BİLGİLERİ */}

          <div
            className="
              flex
              flex-col
              justify-center
            "
          >
            {product.vip && (
              <span
                className="
                  mb-5
                  w-fit
                  rounded-full
                  px-5
                  py-2
                  text-sm
                  font-bold
                "
                style={{
                  background:
                    colors.actionSecondary,

                  color:
                    colors.actionSecondaryText,
                }}
              >
                ✨ VIP Koleksiyon
              </span>
            )}

            <p
              className="font-bold"
              style={{
                color:
                  colors.primary,
              }}
            >
              {product.category}
            </p>

            <h1
              className="
                mt-4
                text-5xl
                font-extrabold
              "
              style={{
                color:
                  colors.foreground,
              }}
            >
              {product.name}
            </h1>

            <p
              className="
                mt-6
                text-lg
                leading-relaxed
              "
              style={{
                color:
                  colors.muted,
              }}
            >
              {product.description}
            </p>

            <div
              className="
                mt-8
                flex
                items-center
                justify-between
                gap-5
              "
            >
              <span
                className="
                  text-4xl
                  font-black
                "
                style={{
                  color:
                    colors.primary,
                }}
              >
                {product.price} TL
              </span>

              <span
                className="
                  rounded-full
                  px-5
                  py-3
                  font-bold
                "
                style={{
                  background:
                    colors.actionSecondary,

                  color:
                    colors.actionSecondaryText,
                }}
              >
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

            <div className="mt-8">
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

            <div className="mt-5">
              <FavoriteButton
                slug={
                  product.slug
                }
              />
            </div>
          </div>
        </div>

        {/* YORUMLAR */}

        <ProductReviews
          productSlug={
            product.slug
          }
        />

        {/* GÜVEN ALANI */}

        <div
          className="
            mt-12
            grid
            gap-5
            md:grid-cols-4
          "
        >
          {trustItems.map(
            (item) => (
              <div
                key={
                  item.text
                }
                className="
                  rounded-3xl
                  p-5
                  text-center
                "
                style={{
                  background:
                    colors.actionSecondary,

                  color:
                    colors.actionSecondaryText,

                  border:
                    `1px solid ${colors.cardBorder}`,
                }}
              >
                <div
                  className="
                    flex
                    h-9
                    items-center
                    justify-center
                  "
                >
                  {item.brand ? (
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
                  ) : (
                    <span className="text-3xl">
                      {item.icon}
                    </span>
                  )}
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                  "
                >
                  {item.text}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}