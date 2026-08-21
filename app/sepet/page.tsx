"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type CartProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] =
    useState<CartProduct[]>([]);

  const { theme } =
    useTheme();

  const colors =
    themes[theme].colors;

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("cart") ||
        "[]"
    );

    setCart(saved);
  }, []);

  function updateCart(
    data: CartProduct[]
  ) {
    setCart(data);

    localStorage.setItem(
      "cart",
      JSON.stringify(data)
    );
  }

  function increase(id: number) {
    updateCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  function decrease(id: number) {
    updateCart(
      cart.map((item) =>
        item.id === id &&
        item.quantity > 1
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
    );
  }

  function removeProduct(
    id: number
  ) {
    updateCart(
      cart.filter(
        (item) =>
          item.id !== id
      )
    );
  }

  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

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

        color:
          colors.foreground,
      }}
    >
      <h1
        className="
          mb-12
          text-center
          text-4xl
          font-extrabold
        "
        style={{
          color:
            colors.primary,
        }}
      >
        🛒 FlorioTR Sepetim
      </h1>

      {cart.length === 0 ? (
        <div
          className="
            mx-auto
            max-w-xl
            rounded-3xl
            p-10
            text-center
            shadow-2xl
          "
          style={{
            background:
              colors.secondary,
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
              mt-5
              text-2xl
              font-bold
            "
          >
            Sepetiniz boş
          </h2>

          <p
            className="
              mt-4
              opacity-80
            "
          >
            Beğendiğiniz özel
            çiçekleri sepete
            ekleyerek sipariş
            oluşturabilirsiniz.
          </p>

          <Link
            href="/"
            className="
              mt-8
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              px-8
              py-3
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
              Çiçekleri Keşfet
            </span>
          </Link>
        </div>
      ) : (
        <div
          className="
            mx-auto
            max-w-5xl
          "
        >
          <div className="space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="
                  flex
                  items-center
                  gap-5
                  rounded-3xl
                  p-5
                  shadow-xl
                "
                style={{
                  background:
                    colors.secondary,

                  border:
                    `1px solid ${colors.primary}`,
                }}
              >
                <img
                  src={
                    item.image
                  }
                  alt={
                    item.name
                  }
                  className="
                    h-28
                    w-28
                    rounded-2xl
                    object-cover
                  "
                />

                <div className="flex-1">
                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    {item.name}
                  </h2>

                  <p
                    className="
                      mt-2
                      font-bold
                    "
                    style={{
                      color:
                        colors.primary,
                    }}
                  >
                    {item.price} TL
                  </p>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        decrease(
                          item.id
                        )
                      }
                      className="
                        rounded-lg
                        bg-black/20
                        px-3
                        py-1
                      "
                    >
                      -
                    </button>

                    <b>
                      {
                        item.quantity
                      }
                    </b>

                    <button
                      type="button"
                      onClick={() =>
                        increase(
                          item.id
                        )
                      }
                      className="
                        rounded-lg
                        bg-black/20
                        px-3
                        py-1
                      "
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeProduct(
                      item.id
                    )
                  }
                  className="
                    rounded-xl
                    bg-red-500/20
                    px-4
                    py-2
                    font-bold
                    text-red-400
                  "
                >
                  Sil
                </button>
              </div>
            ))}
          </div>

          <div
            className="
              mt-10
              rounded-3xl
              p-8
              shadow-2xl
            "
            style={{
              background:
                colors.secondary,

              border:
                `1px solid ${colors.primary}`,
            }}
          >
            <h3
              className="
                text-xl
                font-bold
              "
            >
              🚚 Teslimat Bilgisi
            </h3>

            <p
              className="
                mt-3
                opacity-80
              "
            >
              Siparişiniz FlorioTR
              teslimat ağı üzerinden
              hazırlanır ve teslimat
              süreci hesabınızdan
              takip edilir.
            </p>

            <div
              className="
                mt-8
                flex
                justify-between
                text-2xl
                font-bold
              "
            >
              <span>
                Toplam
              </span>

              <span
                style={{
                  color:
                    colors.primary,
                }}
              >
                {total} TL
              </span>
            </div>

            <Link
              href="/siparis"
              className="
                mt-8
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                py-4
                text-center
                font-bold
                transition
                hover:scale-[1.01]
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
                Siparişi Tamamla
              </span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}