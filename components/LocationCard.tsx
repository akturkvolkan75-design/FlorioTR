type LocationCardProps = {
  name: string;
  distance: string;
  address: string;
  status: string;
};


export default function LocationCard({
  name,
  distance,
  address,
  status,
}: LocationCardProps) {

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-2 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <h3 className="text-xl font-bold text-gray-800">
          {name}
        </h3>


        <span className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-600">
          📍 {distance}
        </span>

      </div>


      <p className="mt-4 text-gray-600">
        🏠 {address}
      </p>


      <p className="mt-3 text-green-600">
        🟢 {status}
      </p>


      <button className="mt-5 w-full rounded-xl bg-pink-600 py-3 text-white transition hover:bg-pink-700">
        Haritada Gör
      </button>


    </div>
  );
}