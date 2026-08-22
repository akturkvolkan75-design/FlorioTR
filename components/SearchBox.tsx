"use client";

import Link from "next/link";
import { useState } from "react";

import { useProducts } from "@/hooks/useProducts";


export default function SearchBox() {

  const [search,setSearch] = useState("");

  const products = useProducts();



  const results = products.filter((product)=>{

    const text = search.toLowerCase();


    return (

      product.name
        .toLowerCase()
        .includes(text)

      ||

      product.category
        .toLowerCase()
        .includes(text)

      ||

      product.description
        .toLowerCase()
        .includes(text)

    );

  });




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
          font-medium
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


            results.slice(0,8).map((product)=>(


              <Link

                key={product.slug}

                href={`/urunler/${product.slug}`}

                onClick={()=>setSearch("")}

                className="
                  block
                  border-b
                  border-gray-100
                  p-4
                  transition
                  hover:bg-yellow-50
                "

              >


                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >


                  <img

                    src={product.image}

                    alt={product.name}

                    className="
                      h-14
                      w-14
                      rounded-xl
                      object-cover
                    "

                  />



                  <div>


                    <h3
                      className="
                        font-bold
                        text-gray-800
                      "
                    >

                      {product.name}

                    </h3>



                    <p
                      className="
                        text-sm
                        text-gray-500
                      "
                    >

                      {product.category}

                    </p>


                  </div>


                </div>


              </Link>


            ))


            :


            (

              <div

                className="
                  p-5
                  text-center
                  text-gray-500
                "

              >

                Ürün bulunamadı

              </div>

            )


          }


        </div>


      )}


    </div>

  );

}