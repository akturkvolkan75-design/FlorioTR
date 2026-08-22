"use client";

import Link from "next/link";
import { useState } from "react";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { flowers } from "@/data/flowers";
import { themes } from "@/themes/themes";


export default function SearchBox() {

  const [search,setSearch] = useState("");

  const {theme} = useTheme();

  const colors = themes[theme].colors;



  const results = Object.entries(flowers).filter(
    ([,flower]) =>
      flower.name
      .toLowerCase()
      .includes(search.toLowerCase())

      ||

      flower.location
      .toLowerCase()
      .includes(search.toLowerCase())
  );



  return (

    <div className="relative w-full">


      <input

        type="text"

        value={search}

        onChange={(e)=>setSearch(e.target.value)}

        placeholder="Ürün ara"

        className="
          w-full
          rounded-2xl
          border
          border-[#efc979]
          bg-white
          px-6
          py-3
          text-lg
          text-gray-900
          shadow-md
          outline-none
          transition
          focus:border-[#123f34]
        "

      />





      {search && (

        <div

          className="
            absolute
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-xl
          "

        >


          {
            results.length > 0 ?

            results.map(([slug,flower])=>(

              <Link

                key={slug}

                href={`/cicekci/${slug}`}

                className="
                  block
                  border-b
                  border-gray-100
                  p-4
                  hover:bg-yellow-50
                "

              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <FlorioLogo

                    primary={colors.primary}

                    accent={colors.accent}

                    compact

                    iconOnly

                  />


                  <div>

                    <h3 className="font-bold text-gray-800">

                      {flower.name}

                    </h3>


                    <p className="text-sm text-gray-500">

                      📍 {flower.location}

                    </p>


                  </div>


                </div>


              </Link>

            ))

            :

            (

              <div className="p-5 text-center text-gray-500">

                Çiçekçi bulunamadı

              </div>

            )

          }


        </div>

      )}


    </div>

  );

}