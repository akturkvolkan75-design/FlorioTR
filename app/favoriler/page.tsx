"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { products } from "@/data/products";
import ProductCard from "@/components/home/ProductCard";
import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function FavoritesPage() {
  const [favoriteSlugs, setFavoriteSlugs] =
    useState<string[]>([]);

  const { theme } = useTheme();

  const colors =
    themes[theme].colors;

  useEffect(() => {
    function loadFavorites() {
      const savedFavorites = JSON.parse(
        localStorage.getItem("favorites") ||
          "[]"
      );

      setFavoriteSlugs(
        savedFavorites
      );
    }

    // Tarayıcıda kayıtlı favorileri
    // ilk açılışta eşitle.
    loadFavorites();

    window.addEventListener(
      "floriotr:favorites-changed",
      loadFavorites
    );

    return () =>
      window.removeEventListener(
        "floriotr:favorites-changed",
        loadFavorites
      );
  }, []);

  const favoriteProducts =
    products.filter((product) =>
      favoriteSlugs.includes(
        product.slug
      )
    );

  return (
    <main
      className="
        min-h-screen
        px-6
        py-12
      "
      style={{
        background:
          colors.background,

        color:
          colors.foreground,
      }}
    >
      <section
        className="
          mx-auto
          max-w-6xl
        "
      >
        <h1
          className="
            mb-4
            text-center
            text-4xl
            font-bold
            sm:text-5xl
          "
          style={{
            color:
              colors.primary,
          }}
        >
          ❤️ Favorilerim
        </h1>

        <p
          className="
            mb-12
            text-center
            font-medium
          "
          style={{
            color:
              colors.muted,
          }}
        >
          Beğendiğiniz çiçeklere
          tekrar kolayca ulaşın.
        </p>

        {favoriteProducts.length ===
        0 ? (
          <div
            className="
              mx-auto
              max-w-xl
              rounded-3xl
              p-10
              text-center
              shadow-xl
            "
            style={{
              background:
                colors.card,

              border:
                `2px solid ${colors.cardBorder}`,
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
                mt-6
                text-2xl
                font-bold
              "
            >
              Henüz favori ürününüz
              yok
            </h2>

            <p
              className="mt-3"
              style={{
                color:
                  colors.muted,
              }}
            >
              Beğendiğiniz buketleri
              favorilere ekleyerek
              burada saklayabilirsiniz.
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
                Çiçekleri Keşfet
              </span>
            </Link>
          </div>
        ) : (
          <div
            className="
              grid
              gap-8
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {favoriteProducts.map(
              (product) => (
                <ProductCard
                  key={
                    product.id
                  }
                  product={
                    product
                  }
                />
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}