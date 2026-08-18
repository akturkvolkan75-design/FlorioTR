"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


const cards = [

  {
    icon: "🌹",
    title: "Özenle Hazırlanan Tasarımlar",
    text:
      "Her çiçek tasarımı özel anlarınıza değer katmak için hazırlanır.",
  },

  {
    icon: "🚚",
    title: "Zamanında Teslimat",
    text:
      "Sevdiklerinize mutluluğu doğru zamanda ulaştırıyoruz.",
  },

  {
    icon: "💝",
    title: "Özel Anlara Özel Çiçekler",
    text:
      "Doğum günü, yıldönümü ve tüm özel günler için zarif seçimler.",
  },

];



export default function TrustCards(){


  const { theme } = useTheme();

  const colors = themes[theme].colors;



  return (

    <section

      className="
      mx-auto
      max-w-6xl
      px-6
      py-12
      "

    >


      <div

        className="
        grid
        gap-6
        md:grid-cols-3
        "

      >


        {
          cards.map((card)=>(


            <div

              key={card.title}

              className="
              rounded-3xl
              p-8
              text-center
              shadow-lg
              transition
              hover:-translate-y-2
              "

              style={{

                background: colors.card,

                border:
                `2px solid ${colors.cardBorder}`,

                boxShadow:
                `0 14px 30px ${colors.primary}22`

              }}

            >


              <div className="text-5xl">

                {card.icon}

              </div>



              <h3

                className="
                mt-5
                text-xl
                font-black
                "

                style={{

                  color:
                  colors.primary

                }}

              >

                {card.title}

              </h3>



              <p

                className="
                mt-3
                text-sm
                leading-relaxed
                font-medium
                "

                style={{

                  color:
                  colors.muted

                }}

              >

                {card.text}

              </p>



            </div>


          ))

        }


      </div>


    </section>

  );

}