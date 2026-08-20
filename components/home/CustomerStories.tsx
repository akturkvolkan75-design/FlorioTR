"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import { useProducts } from "@/hooks/useProducts";


type Review = {
  id: number;
  comment: string | null;
  productName: string;
  productSlug: string;
  rating?: number;
};


export default function CustomerStories() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const products =
    useProducts();

  const router =
    useRouter();

  const { theme } =
    useTheme();

  const colors =
    themes[theme].colors;


  useEffect(() => {
    fetch(
      "/api/reviews?featured=true",
      {
        cache: "no-store",
      }
    )
      .then(
        (res) => res.json()
      )
      .then((data) => {
        if (data.success) {
          setReviews(
            data.reviews ?? []
          );
        }
      })
      .catch(() => {});
  }, []);


  const review =
    reviews[0];


  const bestProduct =
    products.find(
      (product) =>
        product.slug ===
        review?.productSlug
    ) ||
    products.find(
      (product) =>
        product.name ===
        review?.productName
    ) ||
    products[0];


  if (!bestProduct) {
    return null;
  }


  function openReviews() {
    router.push("/yorumlar");
  }


  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openReviews}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          openReviews();
        }
      }}
      className="
        group
        flex
        h-full
        cursor-pointer
        flex-col
        rounded-[22px]
        p-5
        transition
        duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        focus:outline-none
      "
      style={{
        background:
          colors.card,

        border:
          `1px solid ${colors.cardBorder}`,

        color:
          colors.foreground,
      }}
      aria-label="Tüm müşteri yorumlarını görüntüle"
    >

      {/* BAŞLIK */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <span>
          🌸
        </span>

        <h2
          className="
            text-sm
            font-bold
          "
          style={{
            color:
              colors.foreground,
          }}
        >
          Sizden Gelen Yorumlar
        </h2>

        <div
          className="
            h-px
            flex-1
          "
          style={{
            background:
              colors.cardBorder,
          }}
        />

        <span
          className="
            text-xs
            transition
            duration-200
            group-hover:translate-x-1
          "
          style={{
            color:
              colors.primary,
          }}
        >
          →
        </span>
      </div>


      {/* SON YORUM */}

      <div
        className="
          mt-4
        "
      >
        <div
          className="
            text-xs
          "
          style={{
            color:
              colors.accent,
          }}
        >
          ★★★★★
        </div>

        <p
          className="
            mt-2
            line-clamp-2
            text-[12px]
            font-medium
            italic
            leading-5
          "
          style={{
            color:
              colors.foreground,
          }}
        >
          “
          {review?.comment ||
            "Çiçeğim çok güzel geldi, teşekkür ederim."}
          ”
        </p>

        <p
          className="
            mt-2
            text-[10px]
            font-bold
          "
          style={{
            color:
              colors.primary,
          }}
        >
          🌷{" "}
          {review?.productName ||
            "FlorioTR Çiçekleri"}
        </p>
      </div>


      {/* EN ÇOK BEĞENİLEN */}

      <div
        className="
          mt-4
          border-t
          pt-4
        "
        style={{
          borderColor:
            colors.cardBorder,
        }}
      >
        <h3
          className="
            mb-3
            text-[12px]
            font-bold
          "
          style={{
            color:
              colors.foreground,
          }}
        >
          👑 En Çok Beğenilen Çiçek
        </h3>


        {/* BU ALANA BASILIRSA ÜRÜNE GİDER */}

        <Link
          href={`/urunler/${bestProduct.slug}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            p-2
            transition
            hover:scale-[1.01]
          "
          style={{
            background:
              colors.surfaceSoft,
          }}
        >
          <img
            src={
              bestProduct.image
            }
            alt={
              bestProduct.name
            }
            className="
              h-20
              w-20
              shrink-0
              rounded-xl
              object-cover
            "
          />

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                truncate
                text-[11px]
                font-bold
              "
              style={{
                color:
                  colors.foreground,
              }}
            >
              {bestProduct.name}
            </p>

            <p
              className="
                mt-1
                text-[10px]
              "
              style={{
                color:
                  colors.muted,
              }}
            >
              ⭐{" "}
              {bestProduct.rating}
            </p>

            <p
              className="
                mt-1
                text-sm
                font-black
              "
              style={{
                color:
                  colors.primary,
              }}
            >
              {bestProduct.price.toLocaleString(
                "tr-TR"
              )}{" "}
              TL
            </p>
          </div>
        </Link>
      </div>


      {/* TÜM YORUMLAR */}

      <div
        className="
          mt-auto
          pt-4
        "
      >
        <div
          className="
            flex
            items-center
            justify-center
            rounded-full
            px-4
            py-2
            text-[10px]
            font-bold
            transition
            duration-200
            group-hover:scale-[1.02]
          "
          style={{
            background:
              colors.actionPrimary,

            color:
              colors.actionPrimaryText,
          }}
        >
          Tüm Yorumları Gör →
        </div>
      </div>

    </div>
  );
}