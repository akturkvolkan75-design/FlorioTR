"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function FavoriteButton({
  slug,
}: {
  slug:string;
}) {


  const [favorite,setFavorite] = useState(false);

  const {theme}=useTheme();

  const colors=themes[theme].colors;



  useEffect(()=>{


    const saved =
    JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );


    setFavorite(
      saved.includes(slug)
    );


  },[slug]);





  function toggleFavorite(
    event:React.MouseEvent<HTMLButtonElement>
  ){


    event.preventDefault();

    event.stopPropagation();



    const saved =
    JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );



    let updated;



    if(saved.includes(slug)){


      updated =
      saved.filter(
        (item:string)=>item!==slug
      );


    }else{


      updated=[
        ...saved,
        slug
      ];


    }



    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );



    window.dispatchEvent(
      new CustomEvent(
        "floriotr:favorites-changed"
      )
    );



    setFavorite(!favorite);


  }





  return (


    <button


      type="button"


      onClick={toggleFavorite}


      className="
      grid
      h-10
      w-10
      place-items-center
      rounded-full
      border
      text-xl
      shadow-md
      transition
      hover:scale-110
      "


      style={{


        background:
        colors.card,


        borderColor:
        colors.cardBorder,


        color:
        favorite
        ? "#d6336c"
        : colors.primary,


      }}


      aria-label="Favorilere ekle"


    >


      {favorite ? "♥" : "♡"}


    </button>


  );


}