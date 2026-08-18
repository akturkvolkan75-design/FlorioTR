import { flowers } from "@/data/flowers";
import FavoriteButton from "@/components/FavoriteButton";


export default async function FlowerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {


  const { slug } = await params;


  const flower = flowers[slug as keyof typeof flowers];



  if (!flower) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-pink-50">

        <h1 className="text-4xl font-bold text-pink-600">
          Çiçekçi bulunamadı 🌸
        </h1>

      </main>

    );

  }



  const whatsappNumber = flower.phone.replace(/\s/g, "");



  return (

    <main className="min-h-screen bg-pink-50">


      <section className="relative h-[450px]">


        <img
          src={flower.image}
          alt={flower.name}
          className="h-full w-full object-cover"
        />


        <div className="absolute inset-0 flex items-end bg-black/40 p-10">


          <div className="text-white">


            <h1 className="text-5xl font-bold">
              🌸 {flower.name}
            </h1>


            <p className="mt-4 text-xl">
              📍 {flower.location}
            </p>


          </div>


        </div>


      </section>





      <section className="mx-auto max-w-5xl px-6 py-10">


        <div className="rounded-3xl bg-white p-8 shadow-xl">



          <div className="flex flex-wrap gap-4">


            <div className="rounded-full bg-yellow-100 px-5 py-3 font-bold">

              ⭐ {flower.rating}

            </div>


            <div className="rounded-full bg-green-100 px-5 py-3 font-bold text-green-700">

              🟢 Açık

            </div>


          </div>




          <p className="mt-6 text-2xl font-bold">

            📞 {flower.phone}

          </p>



          <p className="mt-5 text-gray-600">

            {flower.description}

          </p>





          <div className="mt-8 grid gap-4 md:grid-cols-3">


            <a
              href={`tel:${flower.phone}`}
              className="rounded-xl bg-pink-600 p-4 text-center font-bold text-white"
            >

              📞 Ara

            </a>




            <a
              href={`https://wa.me/9${whatsappNumber.substring(1)}`}
              target="_blank"
              className="rounded-xl bg-green-500 p-4 text-center font-bold text-white"
            >

              💬 WhatsApp

            </a>




            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                flower.location
              )}`}
              target="_blank"
              className="rounded-xl border-2 border-pink-600 p-4 text-center font-bold text-pink-600"
            >

              🗺️ Harita

            </a>


          </div>





          {/* GERÇEK FAVORİ BUTONU */}

          <FavoriteButton slug={slug} />



        </div>


      </section>





      <section className="mx-auto max-w-5xl px-6 pb-10">


        <div className="rounded-3xl bg-white p-8 shadow-xl">


          <h2 className="text-3xl font-bold">

            💐 Hizmetler

          </h2>




          <div className="mt-6 grid gap-4 md:grid-cols-3">


            {(flower.services ?? []).map((service) => (

              <div
                key={service}
                className="rounded-xl bg-pink-50 p-5 text-center font-semibold"
              >

                {service}

              </div>

            ))}


          </div>


        </div>


      </section>





      <section className="mx-auto max-w-5xl px-6 pb-10">


        <div className="rounded-3xl bg-white p-8 shadow-xl">


          <h2 className="text-3xl font-bold">

            ⏰ Çalışma Saatleri

          </h2>


          <p className="mt-4 text-gray-600">

            {flower.hours}

          </p>


        </div>


      </section>



    </main>

  );

}