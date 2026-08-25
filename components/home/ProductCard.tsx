"use client";


import Link from "next/link";
import Image from "next/image";

import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import ProductRating from "@/components/reviews/ProductRating";



type Product = {

  id:number;

  slug:string;

  name:string;

  category:string;

  price:number;

  rating:number;

  image:string;

  description:string;

  vip:boolean;

};





export default function ProductCard({

  product,

}:{

  product:Product;

}){


  const { theme } = useTheme();

  const colors = themes[theme].colors;
  const isOrchid = product.category === "Orkideler";



  return (



    <article


      className="
      group
      overflow-hidden
      rounded-2xl
      shadow-xl
      transition-all
      duration-500
      hover:-translate-y-3
      hover:shadow-2xl
      "

      style={{


        background:
        colors.card,


        border:
        `2px solid ${colors.cardBorder}`,

        boxShadow:
        `0 14px 34px ${colors.cardBorder}22`


      }}


    >





      {/* Görsel */}



      <div

        className={`
        relative
        overflow-hidden
        ${isOrchid
          ? "aspect-[3/4]"
          : "h-56 sm:h-64 lg:h-72"}
        `}

      >



        <Image

          src={product.image}

          alt={product.name}

          fill

          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"

          className={`
          transition
          duration-700
          ${isOrchid
            ? "object-contain group-hover:scale-[1.015]"
            : "object-cover group-hover:scale-110"}
          `}

        />




        {!isOrchid && (

          <div

            className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            via-transparent
            to-transparent
            "

          />

        )}







        {product.vip && (


          <span

            className="
            absolute
            right-4
            top-4
            rounded-full
            px-4
            py-2
            text-xs
            font-bold
            "

            style={{


              background:
              colors.primary,


              color:
              colors.background


            }}

          >

            ✨ VIP Koleksiyon


          </span>


        )}





      </div>








      {/* Bilgiler */}



      <div className="p-4">





        <p

          className="
          text-xs
          font-bold
          "

          style={{


            color:
            colors.primary


          }}

        >

          {product.category}


        </p>







        <h3

          className="
          mt-2
          text-lg
          font-extrabold
          "

          style={{


            color:
            colors.foreground


          }}

        >

          {product.name}


        </h3>







        <p

          className="
          mt-2
          line-clamp-2
          text-xs
          font-medium
          leading-relaxed
          "

          style={{


            color: colors.muted


          }}

        >

          {product.description}


        </p>









        <div

          className="
          mt-4
          flex
          items-center
          justify-between
          "

        >



          <span

            className="
            text-xl
            font-black
            "

            style={{


              color:
              colors.primary


            }}

          >

            {product.price} TL


          </span>







          <span

            className="
            rounded-full
            px-3
            py-1.5
            text-xs
            font-bold
            "

            style={{


              background:
              colors.secondary,


              color:
              colors.foreground


            }}

          >

            <ProductRating productSlug={product.slug} fallback={product.rating} />


          </span>




        </div>








        <div className="mt-3">


          <FavoriteButton

            slug={product.slug}

          />


        </div>









        <Link


          href={`/urunler/${product.slug}`}


          className="
          mt-3
          block
          rounded-xl
          py-2
          text-center
          text-sm
          font-bold
          transition
          hover:scale-105
          "


          style={{


            background:
            colors.actionSecondary,


            color:
            colors.actionSecondaryText,

            border:
            `2px solid ${colors.actionPrimary}`


          }}

        >

          🌸 Ürünü İncele


        </Link>







        <div className="mt-3">


          <AddToCartButton

            compact


            product={{


              id:product.id,

              slug:product.slug,

              name:product.name,

              price:product.price,

              image:product.image,


            }}


          />


        </div>





      </div>





    </article>



  );

}
