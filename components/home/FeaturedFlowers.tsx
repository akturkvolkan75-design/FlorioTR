"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function FeaturedFlowers() {

  const products = useProducts();


  const featuredProducts = products.slice(0,4);


  const { theme } = useTheme();

  const colors = themes[theme].colors;



  return (


    <section

      className="
      mx-auto
      max-w-6xl
      px-6
      py-16
      "

    >




      <h2

        className="
        mb-10
        text-center
        text-3xl
        font-extrabold
        md:text-4xl
        "

        style={{

          color:
          colors.primary

        }}

      >

        ✨ FlorioTR Seçkileri


      </h2>







      <div

        className="
        grid
        gap-8
        sm:grid-cols-2
        lg:grid-cols-4
        "

      >





        {

          featuredProducts.map((product)=>(



            <article


              key={product.id}


              className="
              group
              overflow-hidden
              rounded-[32px]
              shadow-2xl
              transition-all
              duration-500
              hover:-translate-y-3
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
                  bg-black/10
                  opacity-0
                  transition
                  duration-500
                  group-hover:opacity-100
                  "

                />



              </div>







              {/* Bilgi */}


              <div className="p-6">





                <h3

                  className="
                  text-xl
                  font-bold
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
                  text-2xl
                  font-extrabold
                  "

                  style={{

                    color:
                    colors.primary

                  }}

                >

                  {product.price} TL


                </p>







                <Link


                  href={`/urunler/${product.slug}`}


                  className="
                  mt-6
                  block
                  rounded-2xl
                  py-3
                  text-center
                  font-bold
                  transition-all
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

                  🌸 İncele


                </Link>





              </div>





            </article>




          ))

        }





      </div>




    </section>


  );

}
