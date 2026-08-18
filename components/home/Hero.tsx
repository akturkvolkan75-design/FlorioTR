"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function Hero() {

  const { theme } = useTheme();

  const colors = themes[theme].colors;


  const cards = [
    {
      image: "/images/floriotr-florist-banner-v2.png",
      title: "Özel Buketler",
    },
    {
      image: "/images/floriotr-hero-realistic-roses.png",
      title: "Gül Koleksiyonu",
    },
    {
      image: "/images/floriotr-hero-peonies.png",
      title: "Zarif Tasarımlar",
    },
  ];



  return (

    <section

      className="
      mx-auto
      max-w-7xl
      px-4
      py-6
      sm:px-6
      "

    >


      <div

        className="
        grid
        gap-4
        lg:grid-cols-3
        "

      >



        {/* Ana banner */}

        <div

          className="
          relative
          overflow-hidden
          rounded-[32px]
          lg:col-span-2
          min-h-[340px]
          "

        >

          <img

            src="/images/floriotr-florist-banner-v2.png"

            alt="FlorioTR çiçek buketi"

            className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            "

          />


          <div

            className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/60
            via-black/30
            to-transparent
            "

          />


          <div

            className="
            relative
            z-10
            flex
            h-full
            items-center
            p-8
            sm:p-12
            "

          >

            <div className="max-w-md">


              <p

                className="
                text-xs
                font-black
                uppercase
                tracking-[.3em]
                text-white/80
                "

              >

                FlorioTR

              </p>


              <h1

                className="
                mt-3
                text-4xl
                font-black
                leading-tight
                text-white
                sm:text-5xl
                "

              >

                Sevdiklerinize
                çiçek gönderin 🌸


              </h1>


              <p

                className="
                mt-4
                text-sm
                font-medium
                text-white/80
                "

              >

                Zarif tasarımlar,
                güvenli teslimat.


              </p>


              <Link

                href="/urunler"

                className="
                mt-6
                inline-block
                rounded-full
                px-6
                py-3
                font-black
                "

                style={{
                  background:colors.actionPrimary,
                  color:colors.actionPrimaryText
                }}

              >

                Çiçekleri Keşfet


              </Link>


            </div>


          </div>


        </div>





        {/* Küçük kartlar */}

        <div

          className="
          grid
          gap-4
          "

        >

          {
            cards.slice(1).map((card)=>(


              <div

                key={card.title}

                className="
                relative
                overflow-hidden
                rounded-[28px]
                min-h-[160px]
                "

              >

                <img

                  src={card.image}

                  alt={card.title}

                  className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  "

                />


                <div

                  className="
                  absolute
                  inset-0
                  bg-black/35
                  "

                />


                <h2

                  className="
                  absolute
                  bottom-5
                  left-5
                  text-xl
                  font-black
                  text-white
                  "

                >

                  {card.title}

                </h2>


              </div>


            ))
          }


        </div>



      </div>


    </section>


  );

}