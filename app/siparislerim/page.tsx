"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Order = {
  id: number;
  productName: string;
  productSlug: string | null;
  quantity: number;
  price: number;
  status: string;
  paymentStatus: string;
  district: string;
  createdAt: string;
  preparationImage: string | null;
  review: null | {
    id: number;
    rating: number;
    comment: string | null;
  };
};

type Draft = {
  rating: number;
  comment: string;
};

export default function OrdersPage() {
  const { theme } = useTheme();

  const colors =
    themes[theme].colors;

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [drafts, setDrafts] =
    useState<Record<number, Draft>>({});

  const [message, setMessage] =
    useState<Record<number, string>>({});

  const loadOrders =
    useCallback(() => {
      fetch("/api/musteri/orders")
        .then((response) =>
          response.json()
        )
        .then((data) => {
          if (data.success) {
            setOrders(data.orders);
          }

          setLoading(false);
        })
        .catch(() =>
          setLoading(false)
        );
    }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function submitReview(
    order: Order
  ) {
    if (!order.productSlug) {
      return setMessage(
        (current) => ({
          ...current,
          [order.id]:
            "Bu ürün için değerlendirme açılamadı.",
        })
      );
    }

    const draft =
      drafts[order.id] ?? {
        rating: 5,
        comment: "",
      };

    const response =
      await fetch(
        "/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            orderId:
              order.id,

            productSlug:
              order.productSlug,

            rating:
              draft.rating,

            comment:
              draft.comment,
          }),
        }
      );

    const data =
      await response.json();

    setMessage(
      (current) => ({
        ...current,

        [order.id]:
          data.message ??
          (data.success
            ? "Değerlendirmeniz alındı."
            : "İşlem tamamlanamadı."),
      })
    );

    if (data.success) {
      loadOrders();
    }
  }

  return (
    <main
      className="
        min-h-screen
        px-4
        py-12
        sm:px-6
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
          max-w-4xl
        "
      >
        <p
          className="
            text-center
            text-xs
            font-black
            uppercase
            tracking-[.22em]
          "
          style={{
            color:
              colors.accent,
          }}
        >
          FlorioTR Hesabım
        </p>

        <h1
          className="
            mt-2
            text-center
            text-4xl
            font-black
          "
        >
          Siparişlerim
        </h1>

        {loading ? (
          <p
            className="
              mt-12
              text-center
              font-bold
            "
          >
            Siparişler yükleniyor...
          </p>
        ) : orders.length === 0 ? (
          <div
            className="
              mt-10
              rounded-[28px]
              p-10
              text-center
              shadow-xl
            "
            style={{
              background:
                colors.card,

              border:
                `1px solid ${colors.cardBorder}`,
            }}
          >
            {/* FLORIOTR MARKA İKONU */}

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

            <h2
              className="
                mt-4
                text-2xl
                font-black
              "
            >
              Henüz siparişin yok
            </h2>

            <p
              className="
                mt-2
                opacity-70
              "
            >
              İlk çiçeğini
              seçtiğinde
              siparişini buradan
              takip edebilirsin.
            </p>

            <Link
              href="/"
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                px-7
                py-3
                font-black
                transition
                hover:scale-105
              "
              style={{
                background:
                  colors.actionPrimary,

                color:
                  colors.actionPrimaryText,
              }}
            >
              <FlorioLogo
                primary={
                  colors.actionPrimaryText
                }
                accent={
                  colors.actionPrimaryText
                }
                compact
                iconOnly
                light
              />

              <span>
                Çiçeklere Bak
              </span>
            </Link>
          </div>
        ) : (
          <div
            className="
              mt-8
              grid
              gap-5
            "
          >
            {orders.map(
              (order) => (
                <article
                  key={
                    order.id
                  }
                  className="
                    rounded-[24px]
                    p-6
                    shadow-md
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
                      flex-wrap
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-widest
                        "
                        style={{
                          color:
                            colors.accent,
                        }}
                      >
                        Sipariş #
                        {order.id}
                      </p>

                      <h2
                        className="
                          mt-2
                          text-xl
                          font-black
                        "
                      >
                        {
                          order.productName
                        }
                      </h2>

                      <p
                        className="
                          mt-1
                          text-sm
                          opacity-70
                        "
                      >
                        {
                          order.quantity
                        }{" "}
                        adet ·{" "}
                        {
                          order.district
                        }{" "}
                        ·{" "}
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "tr-TR"
                        )}
                      </p>
                    </div>

                    <span
                      className="
                        rounded-full
                        px-4
                        py-2
                        text-sm
                        font-black
                      "
                      style={{
                        background:
                          colors.actionSecondary,

                        color:
                          colors.actionSecondaryText,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      border-t
                      pt-4
                    "
                    style={{
                      borderColor:
                        colors.cardBorder,
                    }}
                  >
                    <span
                      className="
                        text-sm
                        font-bold
                      "
                    >
                      Ödeme:{" "}
                      {
                        order.paymentStatus
                      }
                    </span>

                    <strong
                      className="
                        text-xl
                      "
                    >
                      {(
                        order.price *
                        order.quantity
                      ).toLocaleString(
                        "tr-TR"
                      )}{" "}
                      TL
                    </strong>
                  </div>

                  {order.preparationImage && (
                    <div
                      className="
                        mt-5
                        overflow-hidden
                        rounded-2xl
                        border-2
                      "
                      style={{
                        borderColor:
                          colors.cardBorder,
                      }}
                    >
                      <div
                        className="
                          p-3
                          text-sm
                          font-black
                        "
                        style={{
                          background:
                            colors.actionSecondary,

                          color:
                            colors.actionSecondaryText,
                        }}
                      >
                        📷 Siparişiniz
                        FlorioTR
                        tarafından
                        hazırlandı
                      </div>

                      <img
                        src={
                          order.preparationImage
                        }
                        alt={`${order.productName} hazırlık fotoğrafı`}
                        className="
                          max-h-[520px]
                          w-full
                          object-cover
                        "
                      />
                    </div>
                  )}

                  {order.review ? (
                    <p
                      className="
                        mt-4
                        rounded-xl
                        p-3
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
                      {"⭐".repeat(
                        order.review
                          .rating
                      )}{" "}
                      Değerlendirmen
                      alındı ve kontrol
                      ediliyor.
                    </p>
                  ) : order.status ===
                      "Teslim Edildi" &&
                    order.productSlug ? (
                    <div
                      className="
                        mt-5
                        rounded-2xl
                        border
                        p-4
                      "
                      style={{
                        borderColor:
                          colors.cardBorder,

                        background:
                          colors.background,
                      }}
                    >
                      <h3
                        className="
                          font-black
                        "
                      >
                        Ürünü değerlendir
                      </h3>

                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          items-center
                          gap-3
                        "
                      >
                        <select
                          value={
                            drafts[
                              order.id
                            ]?.rating ??
                            5
                          }
                          onChange={(
                            event
                          ) =>
                            setDrafts(
                              (
                                current
                              ) => ({
                                ...current,

                                [order.id]:
                                  {
                                    rating:
                                      Number(
                                        event
                                          .target
                                          .value
                                      ),

                                    comment:
                                      current[
                                        order
                                          .id
                                      ]
                                        ?.comment ??
                                      "",
                                  },
                              })
                            )
                          }
                          className="
                            rounded-xl
                            border-2
                            px-3
                            py-2
                            font-bold
                          "
                          style={{
                            background:
                              colors.card,

                            borderColor:
                              colors.cardBorder,

                            color:
                              colors.foreground,
                          }}
                        >
                          <option value="5">
                            5 yıldız
                          </option>

                          <option value="4">
                            4 yıldız
                          </option>

                          <option value="3">
                            3 yıldız
                          </option>

                          <option value="2">
                            2 yıldız
                          </option>

                          <option value="1">
                            1 yıldız
                          </option>
                        </select>

                        <textarea
                          value={
                            drafts[
                              order.id
                            ]?.comment ??
                            ""
                          }
                          onChange={(
                            event
                          ) =>
                            setDrafts(
                              (
                                current
                              ) => ({
                                ...current,

                                [order.id]:
                                  {
                                    rating:
                                      current[
                                        order
                                          .id
                                      ]
                                        ?.rating ??
                                      5,

                                    comment:
                                      event
                                        .target
                                        .value,
                                  },
                              })
                            )
                          }
                          maxLength={
                            500
                          }
                          placeholder="Çiçek ve teslimat hakkındaki düşünceniz"
                          className="
                            min-h-12
                            flex-1
                            rounded-xl
                            border-2
                            px-3
                            py-2
                            text-sm
                            font-medium
                          "
                          style={{
                            background:
                              colors.card,

                            borderColor:
                              colors.cardBorder,

                            color:
                              colors.foreground,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            submitReview(
                              order
                            )
                          }
                          className="
                            rounded-xl
                            px-5
                            py-3
                            font-black
                          "
                          style={{
                            background:
                              colors.actionPrimary,

                            color:
                              colors.actionPrimaryText,
                          }}
                        >
                          Yorumu Gönder
                        </button>
                      </div>

                      {message[
                        order.id
                      ] && (
                        <p
                          className="
                            mt-3
                            text-sm
                            font-bold
                          "
                          style={{
                            color:
                              colors.accent,
                          }}
                        >
                          {
                            message[
                              order.id
                            ]
                          }
                        </p>
                      )}
                    </div>
                  ) : null}
                </article>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}