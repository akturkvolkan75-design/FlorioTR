"use client";

import { useTheme } from "@/context/ThemeContext";
import type { ThemeName } from "@/themes/themes";

const trustPalettes: Record<
  ThemeName,
  { outer: string; outerText: string; middle: string; middleText: string }
> = {
  zumrutSampanya: {
    outer: "#0E4A3B",
    outerText: "#FFF9E9",
    middle: "#E8D5A8",
    middleText: "#17382F",
  },
  pudra: {
    outer: "#B84272",
    outerText: "#FFFFFF",
    middle: "#FFE3ED",
    middleText: "#252235",
  },
  geceBahcesi: {
    outer: "#1C2B25",
    outerText: "#F7F3E9",
    middle: "#D7AF67",
    middleText: "#101916",
  },
  ayYildiz: {
    outer: "#C9283B",
    outerText: "#FFFFFF",
    middle: "#FFFFFF",
    middleText: "#2B1B20",
  },
  lacivertSari: {
    outer: "#173E8D",
    outerText: "#FFFFFF",
    middle: "#F0C400",
    middleText: "#13234B",
  },
  sariKirmizi: {
    outer: "#B21F3B",
    outerText: "#FFFFFF",
    middle: "#F5C518",
    middleText: "#3A1820",
  },
  siyahBeyaz: {
    outer: "#242424",
    outerText: "#FFFFFF",
    middle: "#FFFFFF",
    middleText: "#171717",
  },
  bordoMavi: {
    outer: "#791E3C",
    outerText: "#FFFFFF",
    middle: "#215A9B",
    middleText: "#FFFFFF",
  },
};


const cards = [

  {
    icon: "🌹",
    title: "Özenle Hazırlanan Tasarımlar",
    text:
      "Her çiçek tasarımı özel anlarınıza değer katmak için hazırlanır."
  },

  {
    icon: "🚚",
    title: "Zamanında Teslimat",
    text:
      "Sevdiklerinize mutluluğu doğru zamanda ulaştırıyoruz."
  },

  {
    icon: "💝",
    title: "Özel Anlara Özel Çiçekler",
    text:
      "Doğum günü, yıldönümü ve tüm özel günler için zarif seçimler."
  },

];


export default function TrustCards(){


  const { theme } = useTheme();
  const palette = trustPalettes[theme];


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
          cards.map((card, index)=>{

            const isMiddleCard = index === 1;
            const cardBackground = isMiddleCard
              ? palette.middle
              : palette.outer;
            const cardText = isMiddleCard
              ? palette.middleText
              : palette.outerText;

            return (


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

                background:
                cardBackground,

                border:
                `2px solid ${isMiddleCard ? palette.outer : palette.middle}`,

                boxShadow:
                `0 14px 30px ${palette.outer}26`

              }}

            >


              <div className="text-5xl">

                {card.icon}

              </div>


              <h3

                className="
                mt-5
                text-xl
                font-bold
                "

                style={{

                  color:
                  cardText

                }}

              >

                {card.title}

              </h3>



              <p

                className="
                mt-3
                text-sm
                leading-relaxed
                "

                style={{

                  color: cardText

                }}

              >

                {card.text}

              </p>


            </div>


            );
          })

        }


      </div>


    </section>

  );

}
