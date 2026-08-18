"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


function TitleBar({
  children,
  colors,
}:{
  children:React.ReactNode;
  colors:any;
}){

  return (

    <div

      className="
      mb-6
      flex
      justify-center
      "

    >

      <div

        className="
        rounded-full
        px-8
        py-3
        "

        style={{

          background: colors.secondary,

          color: colors.primary

        }}

      >

        <h2

          className="
          text-2xl
          font-black
          md:text-3xl
          "

        >

          {children}

        </h2>


      </div>


    </div>

  );

}



function ProductGrid({
  products,
  colors,
}:{
  products:any[];
  colors:any;
}){


  return (

    <div

      className="
      grid
      grid-cols-2
      gap-4
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-6
      "

    >

      {
        products.map((product)=>(


          <Link

            key={product.id}

            href={`/urunler/${product.slug}`}

            className="
            block
            "

          >


            <article


              className="
              group
              overflow-hidden
              rounded-2xl
              transition
              duration-300
              hover:-translate-y-1
              "

              style={{

                background:colors.card,

                border:
                `1px solid ${colors.cardBorder}`,

                boxShadow:
                `0 8px 20px ${colors.cardBorder}22`

              }}

            >


              <div

                className="
                h-32
                overflow-hidden
                "

              >

                <img

                  src={product.image}

                  alt={product.name}

                  className="
                  h-full
                  w-full
                  object-cover
                  transition
                  duration-500
                  group-hover:scale-105
                  "

                />


              </div>



              <div className="p-3">


                <h3

                  className="
                  truncate
                  text-sm
                  font-black
                  "

                  style={{

                    color:colors.foreground

                  }}

                >

                  {product.name}


                </h3>



                <p

                  className="
                  mt-2
                  font-black
                  "

                  style={{

                    color:colors.primary

                  }}

                >

                  {product.price.toLocaleString("tr-TR")} TL


                </p>


              </div>


            </article>


          </Link>


        ))
      }


    </div>


  );


}



export default function FeaturedFlowers(){


  const products = useProducts();

  const {theme}=useTheme();

  const colors=themes[theme].colors;



  const featuredProducts =
  products.slice(0,6);



  return (

    <section

      className="
      mx-auto
      max-w-7xl
      px-4
      py-8
      "

    >


      <TitleBar colors={colors}>

        ✨ En Çok Tercih Edilenler

      </TitleBar>



      <ProductGrid

        products={featuredProducts}

        colors={colors}

      />



      <div className="mt-10">


        <ProductGrid

          products={products}

          colors={colors}

        />


      </div>


    </section>

  );


}