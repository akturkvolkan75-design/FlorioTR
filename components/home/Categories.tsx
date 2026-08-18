"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


const categories = [
  {
    name: "Gül Buketleri",
    slug: "gul-buketleri",
    icon: "🌹",
  },
  {
    name: "Orkideler",
    slug: "orkideler",
    icon: "🌸",
  },
  {
    name: "Papatya Buketleri",
    slug: "papatya-gul-buketleri",
    icon: "🌼",
  },
  {
    name: "Saksı Çiçekleri",
    slug: "saksi-cicekleri",
    icon: "🪴",
  },
  {
    name: "Özel Günler",
    slug: "ozel-gunler",
    icon: "🎁",
  },
  {
    name: "Düğün Çiçekleri",
    slug: "dugun-sepetleri",
    icon: "💍",
  },
  {
    name: "Çelenkler",
    slug: "celenkler",
    icon: "🌿",
  },
  {
    name: "VIP Koleksiyon",
    slug: "vip",
    icon: "✨",
  },
];


export default function Categories() {


  const products = useProducts();

  const { theme } = useTheme();

  const colors = themes[theme].colors;



  function getImage(category:string,index:number){

    const product =
      products.find(
        item =>
        item.category
        .toLocaleLowerCase("tr")
        .includes(
          category
          .split(" ")[0]
          .toLocaleLowerCase("tr")
        )
      );


    return (
      product?.image ||
      products[index % products.length]?.image ||
      "/images/renkli-bahce.jpg"
    );

  }




  return (


    <section

      className="
      mx-auto
      max-w-7xl
      px-4
      py-10
      sm:px-6
      "

    >



      <div className="mb-8 flex items-end justify-between">


        <div>

          <p

            className="
            text-xs
            font-black
            uppercase
            tracking-[.25em]
            "

            style={{
              color:colors.accent
            }}

          >

            FlorioTR

          </p>


          <h2

            className="
            mt-2
            text-3xl
            font-black
            "

            style={{
              color:colors.primary
            }}

          >

            Çiçek Kategorileri

          </h2>


        </div>



      </div>





      <div

        className="
        grid
        grid-cols-2
        gap-4
        sm:grid-cols-4
        "

      >


        {
          categories.map(
            (category,index)=>(


            <Link

              key={category.slug}

              href={`/kategori/${category.slug}`}

              className="
              group
              relative
              overflow-hidden
              rounded-3xl
              aspect-square
              shadow-md
              transition
              duration-300
              hover:-translate-y-1
              "

              style={{

                border:
                `1px solid ${colors.cardBorder}`,

                background:
                colors.card

              }}

            >


              <img

                src={getImage(category.name,index)}

                alt={category.name}

                className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition
                duration-500
                group-hover:scale-110
                "

              />



              <div

                className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                via-black/10
                to-transparent
                "

              />



              <div

                className="
                absolute
                bottom-0
                left-0
                right-0
                p-4
                "

              >

                <div

                  className="
                  text-xl
                  "

                >

                  {category.icon}

                </div>


                <h3

                  className="
                  mt-1
                  text-sm
                  font-black
                  text-white
                  "

                >

                  {category.name}

                </h3>


              </div>



            </Link>


          ))
        }


      </div>



    </section>


  );


}