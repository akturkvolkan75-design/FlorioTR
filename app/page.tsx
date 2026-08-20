import Categories from "@/components/home/Categories";
import CustomerStories from "@/components/home/CustomerStories";
import TrustCards from "@/components/home/TrustCards";
import FeaturedFlowers from "@/components/home/FeaturedFlowers";

export default function Home() {
  return (
    <main className="min-h-screen">

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