"use client";

import { useState } from "react";
import Link from "next/link";


export default function SupportChat() {


  const [open, setOpen] = useState(false);



  return (


    <>


      {/* Destek Butonu */}


      <button

        onClick={() => setOpen(!open)}

        className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-pink-600
        text-3xl
        text-white
        shadow-xl
        transition
        hover:scale-110
        "

      >

        🌸


      </button>







      {/* Chat Penceresi */}


      {open && (


        <div

          className="
          fixed
          bottom-24
          right-6
          z-50
          w-80
          rounded-3xl
          bg-white
          p-6
          shadow-2xl
          "

        >



          <div

            className="
            mb-5
            flex
            items-center
            justify-between
            "

          >


            <h2 className="text-xl font-bold text-pink-600">

              🌸 FlorioTR Destek

            </h2>


            <button

              onClick={() => setOpen(false)}

              className="text-gray-400"

            >

              ✕


            </button>


          </div>







          <p className="text-gray-600">


            Merhaba 👋

            <br />

            Size nasıl yardımcı olabilirim?


          </p>







          <div className="mt-5 space-y-3">



            <Link

              href="/kategori/buketler"

              className="
              block
              rounded-xl
              bg-pink-50
              p-3
              font-semibold
              text-pink-600
              "

            >

              🌹 Çiçek seçmek istiyorum


            </Link>







            <Link

              href="/siparislerim"

              className="
              block
              rounded-xl
              bg-pink-50
              p-3
              font-semibold
              text-pink-600
              "

            >

              📦 Siparişimi takip etmek istiyorum


            </Link>







            <div

              className="
              rounded-xl
              bg-pink-50
              p-3
              font-semibold
              text-pink-600
              "

            >

              💳 Ödeme hakkında bilgi


            </div>








            <div

              className="
              rounded-xl
              bg-pink-50
              p-3
              font-semibold
              text-pink-600
              "

            >

              🚚 Teslimat bilgileri


            </div>





          </div>








          <div

            className="
            mt-6
            rounded-xl
            bg-gray-50
            p-3
            text-sm
            text-gray-500
            "

          >

            Canlı destek yakında aktif olacak 🌸


          </div>





        </div>


      )}





    </>


  );

}