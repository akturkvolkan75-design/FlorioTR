import Link from "next/link";


type FlowerCardProps = {
  name: string;
  location: string;
  rating: string;
  phone: string;
  image: string;
  slug: string;
};



export default function FlowerCard({
  name,
  location,
  rating,
  phone,
  image,
  slug,
}: FlowerCardProps) {


  return (

    <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">


      {/* Fotoğraf */}

      <div className="relative h-60">


        <img

          src={image}

          alt={name}

          className="h-full w-full object-cover"

        />



        {/* Favori */}

        <button

          className="absolute right-4 top-4 rounded-full bg-white p-3 text-xl shadow hover:scale-110 transition"

        >

          ❤️

        </button>





        {/* Puan */}

        <div className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 font-bold shadow">

          ⭐ {rating}

        </div>



      </div>







      {/* Bilgiler */}

      <div className="p-6">


        <h3 className="text-2xl font-bold text-gray-800">

          {name}

        </h3>



        <p className="mt-3 text-gray-600">

          📍 {location}

        </p>



        <p className="mt-3 font-semibold text-green-600">

          🟢 Açık

        </p>




        <p className="mt-2 text-gray-600">

          ☎️ {phone}

        </p>






        {/* Butonlar */}

        <div className="mt-6 grid grid-cols-2 gap-3">


          <a

            href={`tel:${phone}`}

            className="rounded-xl bg-pink-600 py-3 text-center font-bold text-white hover:bg-pink-700"

          >

            📞 Ara

          </a>





          <a

            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}

            target="_blank"

            className="rounded-xl border-2 border-pink-600 py-3 text-center font-bold text-pink-600 hover:bg-pink-50"

          >

            🗺️ Harita

          </a>



        </div>





        {/* Detay */}

        <Link

          href={`/cicekci/${slug}`}

          className="mt-4 block rounded-xl bg-gray-800 py-3 text-center font-bold text-white hover:bg-gray-900"

        >

          🌸 Detayları Gör

        </Link>




      </div>



    </div>

  );

}