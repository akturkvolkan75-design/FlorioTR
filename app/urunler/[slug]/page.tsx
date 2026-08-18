"use client";

import { useProducts } from "@/hooks/useProducts";
import { useParams } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import ProductRating from "@/components/reviews/ProductRating";
import ProductReviews from "@/components/reviews/ProductReviews";


export default function ProductPage() {

  const products = useProducts();

  const params = useParams();
  const slug = params.slug as string;
  const { theme } = useTheme();
  const colors = themes[theme].colors;


  const product = products.find(

    (item)=>item.slug === slug

  );




  if(!product){


    return (

      <main

        className="
        min-h-screen
        flex
        items-center
        justify-center
        "

        style={{ background: colors.background }}

      >

        <h1

          className="
          text-3xl
          font-bold
          "

          style={{ color: colors.primary }}

        >

          🌸 Ürün bulunamadı


        </h1>


      </main>

    );

  }





  return (


    <main

      className="
      min-h-screen
      px-6
      py-16
      "

      style={{

        background:colors.background

      }}

    >



      <div

        className="
        mx-auto
        max-w-6xl
        rounded-[40px]
        border
        p-8
        shadow-2xl
        "

        style={{
          background: colors.card,
          borderColor: colors.cardBorder,
        }}

      >





        <div

          className="
          grid
          gap-10
          md:grid-cols-2
          "

        >





          {/* Ürün Görseli */}


          <div

            className="
            overflow-hidden
            rounded-[35px]
            "

          >


            <img

              src={product.image}

              alt={product.name}

              className="
              h-[500px]
              w-full
              object-cover
              transition
              duration-700
              hover:scale-105
              "

            />


          </div>








          {/* Bilgiler */}



          <div

            className="
            flex
            flex-col
            justify-center
            "

          >




            {
              product.vip && (


                <span

                  className="
                  mb-5
                  w-fit
                  rounded-full
                  px-5
                  py-2
                  text-sm
                  font-bold
                  "

                  style={{

                    background:colors.actionSecondary,

                    color:colors.actionSecondaryText

                  }}

                >

                  ✨ VIP Koleksiyon


                </span>


              )

            }







            <p

              className="
              font-bold
              "

              style={{

                color:colors.primary

              }}

            >

              {product.category}


            </p>






            <h1

              className="
              mt-4
              text-5xl
              font-extrabold
              "

              style={{

                color:colors.foreground

              }}

            >

              {product.name}


            </h1>







            <p

              className="
              mt-6
              text-lg
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
              mt-8
              flex
              items-center
              justify-between
              "

            >



              <span

                className="
                text-4xl
                font-black
                "

                style={{

                  color:colors.primary

                }}

              >

                {product.price} TL


              </span>






              <span

                className="
                rounded-full
                px-5
                py-3
                font-bold
                "

                style={{
                  background: colors.actionSecondary,
                  color: colors.actionSecondaryText,
                }}

              >

                <ProductRating productSlug={product.slug} fallback={product.rating} />


              </span>




            </div>









            <div className="mt-8">


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







            <div className="mt-5">


              <FavoriteButton

                slug={product.slug}

              />


            </div>





          </div>




        </div>

        <ProductReviews productSlug={product.slug} />









        {/* Güven Alanı */}



        <div

          className="
          mt-12
          grid
          gap-5
          md:grid-cols-4
          "

        >



          {

            [

              {
                icon:"🚚",
                text:"Aynı gün teslimat"
              },

              {
                icon:"🌹",
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

            ].map((item)=>(


              <div

                key={item.text}

                className="
                rounded-3xl
                p-5
                text-center
                "

                style={{
                  background: colors.actionSecondary,
                  color: colors.actionSecondaryText,
                  border: `1px solid ${colors.cardBorder}`,
                }}

              >

                <div className="text-3xl">

                  {item.icon}

                </div>


                <p

                  className="
                  mt-3
                  text-sm
                  font-semibold
                  "

                >

                  {item.text}


                </p>


              </div>


            ))

          }




        </div>






      </div>




    </main>


  );

}
