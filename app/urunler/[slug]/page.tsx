"use client";

import { useParams } from "next/navigation";

import AddToCartButton from "@/components/AddToCartButton";
import FavoriteButton from "@/components/FavoriteButton";
import FlorioLogo from "@/components/FlorioLogo";
import ProductRating from "@/components/reviews/ProductRating";
import ProductReviews from "@/components/reviews/ProductReviews";

import { useTheme } from "@/context/ThemeContext";
import { useProducts } from "@/hooks/useProducts";
import { themes } from "@/themes/themes";


type TrustItem = {
  text:string;
  icon?:string;
  brand?:boolean;
};


export default function ProductPage(){

  const products = useProducts();

  const params = useParams();

  const slug = params.slug as string;


  const {theme}=useTheme();

  const colors = themes[theme].colors;



  const product =
    products.find(
      item=>item.slug===slug
    );



  if(!product){

    return (

      <main className="min-h-screen flex items-center justify-center">

        <h1
          className="text-3xl font-black"
          style={{
            color:colors.primary
          }}
        >
          Ürün bulunamadı
        </h1>

      </main>

    );

  }





  const trustItems:TrustItem[]=[

    {
      icon:"🚚",
      text:"Aynı gün teslimat"
    },

    {
      brand:true,
      text:"Profesyonel hazırlama"
    },

    {
      icon:"🔒",
      text:"Güvenli ödeme"
    },

    {
      icon:"💝",
      text:"Özel gün tasarımları"
    }

  ];





  return (

    <main

      className="
      min-h-screen
      px-4
      py-10
      "

      style={{
        background:colors.background
      }}

    >


      <div

        className="
        mx-auto
        max-w-7xl
        rounded-[32px]
        border
        p-5
        shadow-xl
        "

        style={{
          background:colors.card,
          borderColor:colors.cardBorder
        }}

      >



        <div

          className="
          grid
          gap-6
          lg:grid-cols-[1.7fr_0.7fr]
          "

        >





          {/* FOTOĞRAF */}


          <div

            className="
            relative
            overflow-hidden
            rounded-[28px]
            "

          >


            <img

              src={product.image}

              alt={product.name}

              className="
              h-[450px]
              w-full
              object-cover
              transition
              duration-700
              hover:scale-105
              "

            />



            <div

              className="
              absolute
              right-4
              top-4
              "

            >

              <FavoriteButton

                slug={product.slug}

              />

            </div>



          </div>







          {/* BİLGİ ALANI */}


          <div

            className="
            flex
            flex-col
            justify-center
            "

          >



            {product.vip && (

              <span

                className="
                mb-3
                w-fit
                rounded-full
                px-3
                py-1
                text-xs
                font-bold
                "

                style={{

                  background:colors.actionSecondary,

                  color:colors.actionSecondaryText

                }}

              >

                ✨ VIP


              </span>

            )}







            <h1

              className="
              text-3xl
              font-black
              leading-tight
              "

              style={{

                color:colors.foreground

              }}

            >

              {product.name}


            </h1>







            <p

              className="
              mt-2
              text-sm
              leading-relaxed
              "

              style={{

                color:colors.muted

              }}

            >

              {product.description}


            </p>







            <div

              className="
              mt-4
              flex
              items-center
              justify-between
              "

            >



              <span

                className="
                text-3xl
                font-black
                "

                style={{

                  color:colors.primary

                }}

              >

                {product.price.toLocaleString("tr-TR")} TL


              </span>





              <ProductRating

                productSlug={product.slug}

                fallback={product.rating}

              />


            </div>








            <div className="mt-3">


              <AddToCartButton

                product={{

                  id:product.id,

                  slug:product.slug,

                  name:product.name,

                  price:product.price,

                  image:product.image

                }}

              />


            </div>




          </div>



        </div>







        <ProductReviews

          productSlug={product.slug}

        />







        <div

          className="
          mt-8
          grid
          gap-4
          md:grid-cols-4
          "

        >


          {trustItems.map(item=>(


            <div

              key={item.text}

              className="
              rounded-2xl
              p-4
              text-center
              "

              style={{

                background:colors.actionSecondary,

                color:colors.actionSecondaryText,

                border:
                `1px solid ${colors.cardBorder}`

              }}

            >



              <div className="text-2xl">


                {item.brand ? (

                  <FlorioLogo

                    primary={
                      colors.actionSecondaryText
                    }

                    accent={
                      colors.accent
                    }

                    compact

                    iconOnly

                  />

                ):(

                  item.icon

                )}


              </div>



              <p className="mt-2 text-xs font-bold">

                {item.text}

              </p>



            </div>


          ))}


        </div>



      </div>



    </main>

  );

}