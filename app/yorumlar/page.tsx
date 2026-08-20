"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Reply = {
  id: number;
  message: string;
  customerName: string;
  createdAt: string;
};

type Review = {
  id: number;
  productSlug: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string | null;
  customerName: string | null;
  createdAt: string;
  likeCount: number;
  replies: Reply[];
};

type ProductSummary = {
  productSlug: string;
  productName: string;
  productImage: string;
  latestReview: Review;
  reviewCount: number;
  averageRating: number;
};

export default function YorumlarPage() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const { theme } = useTheme();

  const colors =
    themes[theme].colors;

  const isNight =
    theme === "night";


  useEffect(() => {
    fetch(
      "/api/reviews",
      {
        cache: "no-store",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(
            data.reviews ?? []
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const products =
    useMemo<ProductSummary[]>(() => {
      const grouped =
        new Map<
          string,
          {
            reviews: Review[];
          }
        >();


      for (const review of reviews) {
        const existing =
          grouped.get(
            review.productSlug
          );

        if (existing) {
          existing.reviews.push(
            review
          );
        } else {
          grouped.set(
            review.productSlug,
            {
              reviews: [review],
            }
          );
        }
      }


      return Array.from(
        grouped.entries()
      )
        .map(
          ([
            productSlug,
            group,
          ]) => {
            const latestReview =
              group.reviews[0];

            const averageRating =
              group.reviews.reduce(
                (
                  total,
                  review
                ) =>
                  total +
                  review.rating,
                0
              ) /
              group.reviews.length;


            return {
              productSlug,

              productName:
                latestReview.productName,

              productImage:
                latestReview.productImage,

              latestReview,

              reviewCount:
                group.reviews.length,

              averageRating,
            };
          }
        )
        .sort(
          (a, b) =>
            new Date(
              b.latestReview.createdAt
            ).getTime() -
            new Date(
              a.latestReview.createdAt
            ).getTime()
        );
    }, [reviews]);


  return (
    <main
      className="
        min-h-screen
        px-4
        py-8
      "
      style={{
        background:
          colors.background,

        color:
          colors.foreground,
      }}
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >

        {/* BAŞLIK */}

        <div className="mb-7">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
            "
            style={{
              color:
                colors.accent,
            }}
          >
            FlorioTR Topluluğu
          </p>

          <h1
            className="
              mt-2
              text-2xl
              font-bold
              md:text-3xl
            "
          >
            Sizden Gelen Yorumlar
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
            "
            style={{
              color:
                colors.muted,
            }}
          >
            Yorum yapılan ürünleri
            keşfedin ve gerçek müşteri
            deneyimlerini inceleyin.
          </p>
        </div>


        {loading ? (
          <div
            className="
              rounded-2xl
              p-8
              text-center
              text-sm
            "
            style={{
              background:
                colors.card,

              border:
                `1px solid ${colors.cardBorder}`,
            }}
          >
            Yorumlar yükleniyor...
          </div>
        ) : products.length === 0 ? (
          <div
            className="
              rounded-2xl
              p-10
              text-center
            "
            style={{
              background:
                colors.card,

              border:
                `1px solid ${colors.cardBorder}`,
            }}
          >
            Henüz yayınlanmış
            yorum bulunmuyor.
          </div>
        ) : (
          <div
            className="
              space-y-3
            "
          >
            {products.map(
              (product) => (
                <Link
                  key={
                    product.productSlug
                  }
                  href={`/yorumlar/${product.productSlug}`}
                  className="
                    group
                    block
                    rounded-2xl
                    transition
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-lg
                  "
                >
                  <article
                    className="
                      grid
                      gap-4
                      rounded-2xl
                      p-3
                      sm:grid-cols-[150px_1fr]
                      sm:items-center
                    "
                    style={{
                      background:
                        colors.card,

                      border:
                        `1px solid ${colors.cardBorder}`,
                    }}
                  >

                    {/* ÜRÜN */}

                    <img
                      src={
                        product.productImage
                      }
                      alt={
                        product.productName
                      }
                      className="
                        h-40
                        w-full
                        rounded-xl
                        object-cover
                        sm:h-32
                        sm:w-[150px]
                      "
                    />


                    <div
                      className="
                        min-w-0
                      "
                    >
                      <div
                        className="
                          flex
                          flex-wrap
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <h2
                            className="
                              text-base
                              font-bold
                            "
                          >
                            {
                              product.productName
                            }
                          </h2>

                          <div
                            className="
                              mt-1
                              flex
                              items-center
                              gap-2
                              text-xs
                            "
                          >
                            <span
                              style={{
                                color:
                                  colors.accent,
                              }}
                            >
                              ★★★★★
                            </span>

                            <span
                              style={{
                                color:
                                  colors.muted,
                              }}
                            >
                              {product.averageRating.toFixed(
                                1
                              )}{" "}
                              ·{" "}
                              {
                                product.reviewCount
                              }{" "}
                              yorum
                            </span>
                          </div>
                        </div>


                        <span
                          className="
                            rounded-full
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                          "
                          style={{
                            background:
                              colors.secondary,

                            color:
                              isNight
                                ? colors.primary
                                : colors.foreground,
                          }}
                        >
                          Tüm yorumlar →
                        </span>
                      </div>


                      {/* SON YORUM */}

                      <div
                        className="
                          mt-3
                          rounded-xl
                          px-3
                          py-2.5
                        "
                        style={{
                          background:
                            colors.surfaceSoft,
                        }}
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          <span
                            className="
                              text-[11px]
                              font-bold
                            "
                          >
                            Son yorum
                          </span>

                          <span
                            className="
                              text-[9px]
                            "
                            style={{
                              color:
                                colors.muted,
                            }}
                          >
                            {new Date(
                              product.latestReview.createdAt
                            ).toLocaleDateString(
                              "tr-TR"
                            )}
                          </span>
                        </div>

                        <p
                          className="
                            mt-1
                            line-clamp-2
                            text-xs
                            leading-5
                          "
                          style={{
                            color:
                              colors.muted,
                          }}
                        >
                          “
                          {product
                            .latestReview
                            .comment ||
                            "Yorum bulunmuyor."}
                          ”
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            font-semibold
                          "
                          style={{
                            color:
                              colors.foreground,
                          }}
                        >
                          ⭐{" "}
                          {
                            product
                              .latestReview
                              .rating
                          }
                          /5
                        </p>
                      </div>
                    </div>

                  </article>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}