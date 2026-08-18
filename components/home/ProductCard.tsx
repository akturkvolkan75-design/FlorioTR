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
      flex
      h-full
      flex-col
      overflow-hidden
      rounded-[32px]
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

        className="
        relative
          h-56
          sm:h-64
          lg:h-72
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
          duration-700
          group-hover:scale-110
          "

        />




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



      <div className="flex flex-1 flex-col p-6">





        <p

          className="
          text-sm
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
          mt-3
          min-h-[56px]
          text-xl
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
          mt-3
          line-clamp-2
          text-sm
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
          mt-6
          flex
          items-center
          justify-between
          "

        >



          <span

            className="
            text-2xl
            font-black
            "

            style={{


              color:
              colors.primary


            }}

          >

            {product.price.toLocaleString("tr-TR")} TL


          </span>







          <span

            className="
            rounded-full
            px-4
            py-2
            text-sm
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








        <div className="mt-auto pt-5">


          <FavoriteButton

            slug={product.slug}

          />


        </div>









        <Link


          href={`/urunler/${product.slug}`}


          className="
          mt-4
          block
          rounded-2xl
          py-3
          text-center
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
