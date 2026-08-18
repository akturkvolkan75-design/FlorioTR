"use client";

import { useState } from "react";
import { flowers } from "@/data/flowers";
import Link from "next/link";


export default function SearchBox() {

  const [search, setSearch] = useState("");


  const results = Object.entries(flowers).filter(
    ([, flower]) =>
      flower.name.toLowerCase().includes(search.toLowerCase()) ||
      flower.location.toLowerCase().includes(search.toLowerCase())
  );


  return (

    <div className="relative w-full max-w-xl">


      <input

        type="text"

        value={search}

        onChange={(e) => setSearch(e.target.value)}

        placeholder="Çiçekçi veya konum ara 🌸"

        className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-lg shadow-lg outline-none focus:border-pink-500"

      />



      {search && (

        <div className="absolute z-50 mt-3 w-full rounded-2xl bg-white shadow-xl">


          {results.length > 0 ? (

            results.map(([slug, flower]) => (

              <Link

                key={slug}

                href={`/cicekci/${slug}`}

                className="block cursor-pointer border-b p-5 hover:bg-pink-50"

              >

                <div>

                  <h3 className="font-bold text-gray-800">

                    🌸 {flower.name}

                  </h3>


                  <p className="text-gray-600">

                    📍 {flower.location}

                  </p>


                </div>


              </Link>


            ))


          ) : (

            <div className="p-5 text-center text-gray-500">

              Çiçekçi bulunamadı 🌸

            </div>

          )}



        </div>

      )}


    </div>

  );

}