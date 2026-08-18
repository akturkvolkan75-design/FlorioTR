import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductSection from "@/components/home/ProductSection";
import AboutFlorio from "@/components/home/AboutFlorio";


export default function Home() {


  return (


    <main

      className="relative
      min-h-screen
      "

    >

      <div className="pointer-events-none absolute right-0 top-0 z-10 hidden w-[clamp(220px,25vw,360px)] overflow-hidden lg:block" aria-hidden="true">
        <img src="/images/ivy-daisy-page-edge.png" alt="" className="h-auto w-full object-contain object-right-top opacity-90 drop-shadow-[-7px_10px_12px_rgba(24,70,42,0.12)]" />
      </div>


      {/* FlorioTR Marka Hikayesi */}

      <Hero />



      {/* Çiçek Kategorileri */}

      <Categories />



      {/* FlorioTR Çiçek Koleksiyonu */}

      <ProductSection />



      {/* FlorioTR Hakkımızda */}

      <AboutFlorio />


    </main>


  );

}
