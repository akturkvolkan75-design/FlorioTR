"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function SiparisOnayPage() {
  const [order, setOrder] =
    useState<any>(null);

  const [
    paymentResult,
    setPaymentResult,
  ] = useState<
    "success" | "failed" | "unknown"
  >("unknown");

  const { theme } =
    useTheme();

  const colors =
    themes[theme].colors;

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const payment =
      params.get("payment");

    setPaymentResult(
      payment === "success"
        ? "success"
        : payment === "failed"
          ? "failed"
          : "unknown"
    );

    if (payment === "success") {
      localStorage.removeItem(
        "cart"
      );
    }

    const savedOrder =
      JSON.parse(
        localStorage.getItem(
          "order"
        ) || "null"
      );

    setOrder(savedOrder);
  }, []);

  if (
    paymentResult === "failed"
  ) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f5f2eb]
          p-6
        "
      >
        <div
          className="
            w-full
            max-w-xl
            rounded-[32px]
            border
            border-red-200
            bg-white
            p-9
            text-center
            shadow-xl
          "
        >
          <div className="text-6xl">
            ⚠️
          </div>

          <h1
            className="
              mt-5
              text-3xl
              font-black
              text-red-800
            "
          >
            Ödeme tamamlanamadı
          </h1>

          <p
            className="
              mt-3
              font-semibold
              text-slate-600
            "
          >
            Kartınızdan başarılı
            tahsilat doğrulanmadı.
            Siparişiniz işleme
            alınmadı.
          </p>

          <Link
            href="/siparis"
            className="
              mt-7
              inline-flex
              rounded-full
              bg-[#123f34]
              px-7
              py-3
              font-black
              text-white
            "
          >
            Tekrar Dene
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          p-6
        "
        style={{
          background:
            colors.background,
        }}
      >
        <div
          className="
            rounded-3xl
            p-10
            text-center
            shadow-xl
          "
          style={{
            background:
              colors.secondary,

            color:
              colors.foreground,
          }}
        >
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
          >
            Sipariş bulunamadı
          </h1>

          <Link
            href="/"
            className="
              mt-6
              inline-block
              rounded-xl
              px-8
              py-3
              font-bold
            "
            style={{
              background:
                colors.primary,

              color:
                colors.background,
            }}
          >
            Ana Sayfa
          </Link>
        </div>
      </main>
    );
  }

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
          max-w-3xl
          rounded-[40px]
          p-8
          shadow-2xl
        "
        style={{
          background:
            colors.secondary,

          border:
            `2px solid ${colors.primary}`,
        }}
      >
        {/* FLORIOTR MARKA İKONU */}

        <div
          className="
            flex
            h-24
            items-center
            justify-center
          "
        >
          <div className="scale-[2.6]">
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
            text-center
            text-4xl
            font-extrabold
          "
          style={{
            color:
              colors.primary,
          }}
        >
          Siparişiniz Alındı
        </h1>

        <p
          className="
            mt-4
            text-center
            text-lg
          "
          style={{
            color:
              colors.foreground,
          }}
        >
          Teşekkür ederiz.
          Siparişiniz FlorioTR
          tarafından alınmıştır.
        </p>

        {/* SİPARİŞ BİLGİLERİ */}

        <div
          className="
            mt-10
            rounded-3xl
            p-6
          "
          style={{
            background:
              colors.background,
          }}
        >
          <h2
            className="
              mb-6
              text-2xl
              font-bold
            "
            style={{
              color:
                colors.primary,
            }}
          >
            📦 Sipariş Bilgileri
          </h2>

          <div className="space-y-4">
            <p
              style={{
                color:
                  colors.foreground,
              }}
            >
              <strong>
                Sipariş No:
              </strong>

              <br />

              <span
                style={{
                  color:
                    colors.primary,
                }}
              >
                {order.id}
              </span>
            </p>

            <p
              style={{
                color:
                  colors.foreground,
              }}
            >
              <strong>
                Durum:
              </strong>

              <br />

              {order.status}
            </p>

            <p
              style={{
                color:
                  colors.foreground,
              }}
            >
              <strong>
                Tarih:
              </strong>

              <br />

              {order.createdAt}
            </p>
          </div>
        </div>

        {/* TESLİMAT */}

        <div
          className="
            mt-8
            rounded-3xl
            p-6
          "
          style={{
            background:
              colors.background,
          }}
        >
          <h2
            className="
              mb-5
              text-xl
              font-bold
            "
            style={{
              color:
                colors.primary,
            }}
          >
            👤 Teslimat Bilgileri
          </h2>

          <p
            style={{
              color:
                colors.foreground,
            }}
          >
            <strong>
              Alıcı:
            </strong>

            <br />

            {
              order.customer
                .receiverName
            }
          </p>

          <p
            className="mt-4"
            style={{
              color:
                colors.foreground,
            }}
          >
            <strong>
              Telefon:
            </strong>

            <br />

            {
              order.customer
                .receiverPhone
            }
          </p>

          <p
            className="mt-4"
            style={{
              color:
                colors.foreground,
            }}
          >
            <strong>
              Adres:
            </strong>

            <br />

            {order.customer.city}
            /
            {
              order.customer
                .district
            }

            <br />

            {
              order.customer
                .address
            }
          </p>
        </div>

        {/* ÜRÜNLER */}

        <div
          className="
            mt-8
            rounded-3xl
            p-6
          "
          style={{
            background:
              colors.background,
          }}
        >
          <div
            className="
              mb-5
              flex
              items-center
              gap-2
            "
          >
            <FlorioLogo
              primary={
                colors.primary
              }
              accent={
                colors.accent
              }
              compact
              iconOnly
            />

            <h2
              className="
                text-xl
                font-bold
              "
              style={{
                color:
                  colors.primary,
              }}
            >
              Ürünler
            </h2>
          </div>

          {order.products?.map(
            (item: any) => (
              <div
                key={item.id}
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  p-4
                "
                style={{
                  background:
                    colors.secondary,
                }}
              >
                <span
                  style={{
                    color:
                      colors.foreground,
                  }}
                >
                  {item.name}
                </span>

                <span
                  style={{
                    color:
                      colors.primary,
                  }}
                >
                  x{item.quantity}
                </span>
              </div>
            )
          )}
        </div>

        {/* TOPLAM */}

        <div
          className="
            mt-8
            text-right
            text-3xl
            font-extrabold
          "
          style={{
            color:
              colors.primary,
          }}
        >
          Toplam:{" "}
          {order.total} TL
        </div>

        {/* DEVAM */}

        <Link
          href="/"
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            py-4
            text-center
            font-bold
            transition
            hover:scale-105
          "
          style={{
            background:
              colors.primary,

            color:
              colors.background,
          }}
        >
          <FlorioLogo
            primary={
              colors.background
            }
            accent={
              colors.background
            }
            compact
            iconOnly
          />

          <span>
            Alışverişe Devam Et
          </span>
        </Link>
      </div>
    </main>
  );
}