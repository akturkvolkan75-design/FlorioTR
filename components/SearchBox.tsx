"use client";

import Link from "next/link";
import { useState } from "react";

import FlorioLogo from "@/components/FlorioLogo";
import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function SearchBox() {

  const [search,setSearch] = useState("");

  const products = useProducts();

  const {theme}=useTheme();

  const colors = themes[theme].colors;



  const results =
    search.trim().length > 1
    ?
    products.filter((product:any)=>

      product.name
      .toLowerCase()
      .includes(search.toLowerCase())

      ||

      product.category
      ?.toLowerCase()
      .includes(search.toLowerCase())

      ||

      product.description
      ?.toLowerCase()
      .includes(search.toLowerCase())

    ).slice(0,6)

    :

    [];





  return (

    <div className="
      relative
      w-full
      max-w-xl
    ">



      <div
        className="
        flex
        items-center
        rounded-2xl
        border
        bg-white
        px-5
        shadow-lg
        "
        style={{
          borderColor:colors.cardBorder
        }}
      >


        <span className="text-xl">
          🔎
        </span>



        <input

          type="text"

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          placeholder="Gül, orkide veya buket ara"

          className="
          w-full
          bg-transparent
          px-4
          py-4
          text-lg
          text-gray-900
          outline-none
          "

        />


      </div>






      {search && (

        <div

          className="
          absolute
          z-50
          mt-3
          w-full
          overflow-hidden
          rounded-2xl
          bg-white
          shadow-2xl
          "

        >



          {
          results.length > 0
          ?

          results.map((product:any)=>(


            <Link

              key={product.id}

              href={`/urunler/${product.slug}`}

              onClick={()=>setSearch("")}

              className="
              flex
              items-center
              gap-4
              border-b
              p-4
              transition
              hover:bg-pink-50
              "

            >



              <img

                src={product.image}

                alt={product.name}

                className="
                h-16
                w-16
                rounded-xl
                object-cover
                "

              />




              <div className="flex-1">


                <h3 className="
                font-black
                text-gray-800
                ">

                  {product.name}

                </h3>



                <p className="
                text-sm
                text-gray-500
                ">

                  {product.category}

                </p>




                <p className="
                font-bold
                text-pink-600
                ">

                  {product.price.toLocaleString("tr-TR")} TL

                </p>


              </div>



            </Link>


          ))



          :

          <div
            className="
            flex
            items-center
            justify-center
            gap-3
            p-5
            text-gray-500
            "
          >

            <FlorioLogo

              primary={colors.primary}

              accent={colors.accent}

              compact

              iconOnly

            />

            <span>
              Ürün bulunamadı
            </span>


          </div>


          }



        </div>


      )}



    </div>


  );

}