"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "next/navigation";

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

export default function ProductReviewsPage() {
  const params =
    useParams<{
      productSlug: string;
    }>();

  const productSlug =
    params.productSlug;

  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [loading, setLoading] =
    useState(true);

  const { theme } = useTheme();

  const colors =
    themes[theme].colors;


  useEffect(() => {
    if (!productSlug) {
      return;
    }


    fetch(
      `/api/reviews?productSlug=${encodeURIComponent(
        productSlug
      )}`,
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
  }, [productSlug]);


  const product =
    reviews[0];


  const averageRating =
    useMemo(() => {
      if (
        reviews.length === 0
      ) {
        return 0;
      }

      return (
        reviews.reduce(
          (
            total,
            review
          ) =>
            total +
            review.rating,
          0
        ) /
        reviews.length
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
          max-w-5xl
        "
      >
        <Link
          href="/yorumlar"
          className="
            inline-flex
            items-center
            rounded-full
            border
            px-4
            py-2
            text-xs
            font-bold
          "
          style={{
            background:
              colors.actionSecondary,

            color:
              colors.actionSecondaryText,

            borderColor:
              colors.cardBorder,
          }}
        >
          ← Yorumlara dön
        </Link>


        {loading ? (
          <div
            className="
              mt-5
              rounded-2xl
              p-8
              text-center
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
        ) : !product ? (
          <div
            className="
              mt-5
              rounded-2xl
              p-8
              text-center
            "
            style={{
              background:
                colors.card,

              border:
                `1px solid ${colors.cardBorder}`,
            }}
          >
            Bu ürüne ait yayınlanmış
            yorum bulunamadı.
          </div>
        ) : (
          <>

            {/* ÜRÜN BAŞLIĞI */}

            <section
              className="
                mt-5
                grid
                gap-5
                rounded-3xl
                p-4
                sm:grid-cols-[180px_1fr]
                sm:items-center
              "
              style={{
                background:
                  colors.card,

                border:
                  `1px solid ${colors.cardBorder}`,
              }}
            >
              <Link
                href={`/urunler/${product.productSlug}`}
              >
                <img
                  src={
                    product.productImage
                  }
                  alt={
                    product.productName
                  }
                  className="
                    h-48
                    w-full
                    rounded-2xl
                    object-cover
                    transition
                    hover:scale-[1.02]
                    sm:h-44
                    sm:w-[180px]
                  "
                />
              </Link>


              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color:
                      colors.accent,
                  }}
                >
                  Ürün Yorumları
                </p>

                <h1
                  className="
                    mt-1
                    text-2xl
                    font-bold
                  "
                >
                  {
                    product.productName
                  }
                </h1>

                <div
                  className="
                    mt-3
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >
                  <span
                    className="
                      text-sm
                    "
                    style={{
                      color:
                        colors.accent,
                    }}
                  >
                    ★★★★★
                  </span>

                  <strong>
                    {averageRating.toFixed(
                      1
                    )}
                  </strong>

                  <span
                    className="
                      text-xs
                    "
                    style={{
                      color:
                        colors.muted,
                    }}
                  >
                    {reviews.length}{" "}
                    yorum
                  </span>
                </div>


                <Link
                  href={`/urunler/${product.productSlug}`}
                  className="
                    mt-4
                    inline-flex
                    rounded-full
                    px-4
                    py-2
                    text-xs
                    font-bold
                  "
                  style={{
                    background:
                      colors.actionPrimary,

                    color:
                      colors.actionPrimaryText,
                  }}
                >
                  Ürünü İncele →
                </Link>
              </div>
            </section>


            {/* TÜM YORUMLAR */}

            <section
              className="
                mt-5
                space-y-3
              "
            >
              {reviews.map(
                (review) => (
                  <article
                    key={
                      review.id
                    }
                    className="
                      rounded-2xl
                      p-4
                    "
                    style={{
                      background:
                        colors.card,

                      border:
                        `1px solid ${colors.cardBorder}`,
                    }}
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div>
                        <p
                          className="
                            text-sm
                            font-bold
                          "
                        >
                          {review.customerName ||
                            "FlorioTR Müşterisi"}
                        </p>

                        <div
                          className="
                            mt-1
                            text-xs
                          "
                          style={{
                            color:
                              colors.accent,
                          }}
                        >
                          {"★".repeat(
                            review.rating
                          )}
                          {"☆".repeat(
                            5 -
                              review.rating
                          )}
                        </div>
                      </div>

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
                          review.createdAt
                        ).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    </div>


                    <p
                      className="
                        mt-3
                        text-sm
                        leading-6
                      "
                    >
                      {review.comment}
                    </p>


                    <div
                      className="
                        mt-3
                        text-[10px]
                      "
                      style={{
                        color:
                          colors.muted,
                      }}
                    >
                      ♡{" "}
                      {review.likeCount}{" "}
                      beğeni
                    </div>


                    {/* CEVAPLAR */}

                    {review.replies.length >
                      0 && (
                      <div
                        className="
                          mt-4
                          space-y-2
                          border-l-2
                          pl-4
                        "
                        style={{
                          borderColor:
                            colors.cardBorder,
                        }}
                      >
                        {review.replies.map(
                          (
                            reply
                          ) => (
                            <div
                              key={
                                reply.id
                              }
                              className="
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
                                  justify-between
                                  gap-3
                                "
                              >
                                <strong
                                  className="
                                    text-[11px]
                                  "
                                >
                                  ↳{" "}
                                  {
                                    reply.customerName
                                  }
                                </strong>

                                <span
                                  className="
                                    text-[8px]
                                  "
                                  style={{
                                    color:
                                      colors.muted,
                                  }}
                                >
                                  {new Date(
                                    reply.createdAt
                                  ).toLocaleDateString(
                                    "tr-TR"
                                  )}
                                </span>
                              </div>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  leading-5
                                "
                              >
                                {
                                  reply.message
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}

                  </article>
                )
              )}
            </section>

          </>
        )}
      </div>
    </main>
  );
}