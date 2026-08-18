import Categories from "@/components/home/Categories";
import CustomerStories from "@/components/home/CustomerStories";
import TrustCards from "@/components/home/TrustCards";
import FeaturedFlowers from "@/components/home/FeaturedFlowers";


export default function Home() {


  return (

    <main

      className="
      min-h-screen
      "

    >


      <section

        className="
        mx-auto
        grid
        max-w-7xl
        gap-6
        px-5
        py-8
        lg:grid-cols-[1fr_360px]
        "

      >


        <Categories />


        <CustomerStories />


      </section>



      <FeaturedFlowers />



      <TrustCards />


    </main>

  );

}