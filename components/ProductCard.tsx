"use client";

import Link from "next/link";
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



  return (

    <article

      className="
      group
      overflow-hidden
      rounded-2xl
      transition-all
      duration-300
      hover:-translate-y-1
      "

      style={{

        background:colors.card,

        border:
        `1px solid ${colors.cardBorder}`,

        boxShadow:
        `0 8px 22px ${colors.cardBorder}25`

      }}

    >



      <div

        className="
        relative
        h-44
        overflow-hidden
        "

      >

        <img

          src={product.image}

          alt={product.name}

          className="
          h-full
          w-full
          object-cover
          transition
          duration-500
          group-hover:scale-105
          "

        />


        {product.vip && (

          <span

            className="
            absolute
            right-2
            top-2
            rounded-full
            px-2
            py-1
            text-[10px]
            font-black
            "

            style={{

              background:colors.primary,

              color:colors.background

            }}

          >

            VIP

          </span>

        )}


      </div>





      <div className="p-3">



        <p

          className="
          text-[11px]
          font-bold
          "

          style={{

            color:colors.primary

          }}

        >

          {product.category}

        </p>




        <h3

          className="
          mt-1
          truncate
          text-sm
          font-black
          "

          style={{

            color:colors.foreground

          }}

        >

          {product.name}

        </h3>




        <div

          className="
          mt-2
          flex
          items-center
          justify-between
          "

        >

          <span

            className="
            text-base
            font-black
            "

            style={{

              color:colors.primary

            }}

          >

            {product.price.toLocaleString("tr-TR")} TL

          </span>



          <span

            className="
            text-xs
            font-bold
            "

          >

            <ProductRating

              productSlug={product.slug}

              fallback={product.rating}

            />

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
          text-xs
          font-black
          "

          style={{

            background:
            colors.actionSecondary,

            color:
            colors.actionSecondaryText

          }}

        >

          🌸 İncele

        </Link>




        <div className="mt-2">

          <AddToCartButton

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