"use client";

import { useRouter } from "next/navigation";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function AddToCartButton({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const router = useRouter();

  const { theme } = useTheme();

  const colors = themes[theme].colors;

  function addToCart() {
    const cart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingProduct = cart.find(
      (
        item: Product & {
          quantity: number;
        }
      ) => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    router.push("/sepet");
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      className={
        compact
          ? `
            flex
            h-8
            w-full
            items-center
            justify-center
            gap-1
            rounded-lg
            px-2
            text-[10px]
            font-black
            leading-none
            transition
            hover:scale-[1.02]
          `
          : `
            mt-5
            w-full
            rounded-2xl
            py-4
            font-extrabold
            transition
            hover:scale-[1.03]
          `
      }
      style={{
        background:
          colors.actionPrimary,

        color:
          colors.actionPrimaryText,

        boxShadow: compact
          ? "none"
          : `0 10px 30px ${colors.actionPrimary}55`,
      }}
    >
      <span className={compact ? "text-[9px]" : ""}>
        🛒
      </span>

      <span>
        {compact
          ? "Sepete Ekle"
          : "Sepete Ekle"}
      </span>
    </button>
  );
}