"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function FeaturedFlowers() {

  const products = useProducts();

  const featuredProducts = products.slice(0,8);

  const { theme } = useTheme();

  const colors = themes[theme].colors;


  return (

    <section
      className="
      mx-auto
      max-w-7xl
      px-4
      py-8
      "
    >


      <div className="mb-6 text-center">

        <h2
          className="
          text-2xl
          font-black
          md:text-3xl
          "
          style={{
            color: colors.primary
          }}
        >

          ✨ En Çok Tercih Edilenler

        </h2>

      </div>



      <div

        className="
        grid
        grid-cols-2
        gap-4
        sm:grid-cols-3
        lg:grid-cols-5
        "

      >


        {featuredProducts.map((product)=>(


          <article

            key={product.id}

            className="
            group
            overflow-hidden
            rounded-2xl
            transition
            duration-300
            hover:-translate-y-1
            "

            style={{

              background:colors.card,

              border:
              `1px solid ${colors.cardBorder}`,

              boxShadow:
              `0 8px 20px ${colors.cardBorder}22`

            }}

          >



            <div

              className="
              h-36
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

            </div>



            <div className="p-3">


              <h3

                className="
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



              <p

                className="
                mt-1
                text-base
                font-black
                "

                style={{
                  color:colors.primary
                }}

              >

                {product.price.toLocaleString("tr-TR")} TL

              </p>



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

                İncele

              </Link>


            </div>


          </article>


        ))}


      </div>


    </section>

  );

}