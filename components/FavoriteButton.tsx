"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function FavoriteButton({
  slug,
}: {
  slug: string;
}) {

  const [favorite, setFavorite] = useState(false);
  const { theme } = useTheme();
  const colors = themes[theme].colors;


  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("favorites") || "[]");

    // Tarayıcıda kayıtlı favori durumunu ilk açılışta eşitle.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorite(saved.includes(slug));

  }, [slug]);



  function toggleFavorite() {

    const saved =
      JSON.parse(localStorage.getItem("favorites") || "[]");


    let updated;


    if (saved.includes(slug)) {

      updated = saved.filter(
        (item: string) => item !== slug
      );

    } else {

      updated = [
        ...saved,
        slug
      ];

    }


    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );

    window.dispatchEvent(new CustomEvent("floriotr:favorites-changed"));


    setFavorite(!favorite);

  }



  return (

    <button

      onClick={toggleFavorite}

      className="mt-4 w-full rounded-xl border-2 p-3 font-bold transition hover:scale-[1.02]"
      style={{
        background: colors.actionPrimary,
        borderColor: colors.actionPrimary,
        color: colors.actionPrimaryText,
        boxShadow: `0 8px 20px ${colors.actionPrimary}33`,
      }}

    >

      {favorite
        ? "❤️ Favorilerde"
        : "🤍 Favorilere Ekle"}

    </button>

  );

}
