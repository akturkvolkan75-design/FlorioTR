import SearchBox from "@/components/SearchBox";
import Categories from "@/components/home/Categories";
import CustomerStories from "@/components/home/CustomerStories";
import TrustCards from "@/components/home/TrustCards";
import FeaturedFlowers from "@/components/home/FeaturedFlowers";


export default function Home() {
  return (
    <main className="min-h-screen">


      {/* ARAMA ALANI */}

      <section
        className="
          mx-auto
          max-w-[1650px]
          px-4
          pt-6
        "
      >

        <div
          className="
            rounded-[30px]
            bg-white
            p-8
            text-center
            shadow-lg
          "
        >

          <h1
            className="
              text-3xl
              font-black
              text-[#123f34]
            "
          >
            Çiçeğinizi kolayca bulun 🌸
          </h1>


          <p
            className="
              mt-2
              text-gray-500
            "
          >
            Çiçekçi veya konum arayın
          </p>


          <div
            className="
              mt-6
              flex
              justify-center
            "
          >

            <SearchBox />

          </div>


        </div>

      </section>





      {/* KATEGORİLER + YORUMLAR */}

      <section
        className="
          mx-auto
          max-w-[1650px]
          px-4
          mt-5
        "
      >

        <div
          className="
            grid
            gap-5
            lg:grid-cols-[minmax(0,1fr)_420px]
            lg:items-stretch
          "
        >

          <Categories />

          <CustomerStories />

        </div>

      </section>





      {/* POPÜLER ÇİÇEKLER */}

      <section
        className="
          mx-auto
          mt-4
          max-w-[1650px]
          px-4
        "
      >

        <FeaturedFlowers />

      </section>





      {/* GÜVEN ALANI */}

      <section
        className="
          mx-auto
          mt-4
          max-w-[1650px]
          px-4
        "
      >

        <TrustCards />

      </section>


    </main>
  );
}