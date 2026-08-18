"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


type Flower = {

  slug: string;

  name: string;

  location: string;

  latitude: number;

  longitude: number;

  rating: number;

  phone: string;

};



// 🔵 Kullanıcı ikonu

const userIcon = L.divIcon({

  className: "",

  html: `
    <div style="
      width:32px;
      height:32px;
      background:#2563eb;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 0 15px #2563eb;
    ">
    </div>
  `,

  iconSize:[32,32],

  iconAnchor:[16,16],

});




// 🌸 Çiçekçi ikonu

const flowerIcon = L.divIcon({

  className:"",

  html:`

    <div style="
      font-size:32px;
      filter:drop-shadow(0 2px 3px #777);
    ">
      🌸
    </div>

  `,

  iconSize:[35,35],

  iconAnchor:[17,35],

});





export default function Map({

  flowers,

  userLocation,

}:{

  flowers:Flower[];

  userLocation?:{

    lat:number;

    lng:number;

  } | null;

}) {



return (

<MapContainer


center={

userLocation

?

[

userLocation.lat,

userLocation.lng

]

:

[41.0132,28.9494]

}


zoom={13}

scrollWheelZoom={true}

className="h-[500px] w-full rounded-3xl"


>



<TileLayer

attribution="&copy; OpenStreetMap contributors"

url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

/>






{/* 🔵 Kullanıcı */}


{userLocation && (

<Marker

position={[

userLocation.lat,

userLocation.lng

]}

icon={userIcon}

>


<Popup>

📍 Buradasınız

</Popup>


</Marker>

)}







{/* 🌸 Çiçekçiler */}


{flowers.map((flower)=>(


<Marker

key={flower.slug}

position={[

flower.latitude,

flower.longitude

]}

icon={flowerIcon}

>


<Popup>


<div className="w-60 text-center">


<h3 className="text-lg font-bold text-pink-600">

🌸 {flower.name}

</h3>



<p className="mt-2">

📍 {flower.location}

</p>



<p className="mt-2 font-bold">

⭐ {flower.rating}

</p>




<div className="mt-4 grid gap-2">



<a

href={`/cicekci/${flower.slug}`}

className="rounded-lg bg-pink-600 p-2 font-bold text-white"

>

Detay 🌸

</a>





<a

href={`https://wa.me/9${flower.phone.replace(/\s/g,"").substring(1)}`}

target="_blank"

className="rounded-lg bg-green-500 p-2 font-bold text-white"

>

💬 WhatsApp

</a>





<a

href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(flower.location)}`}

target="_blank"

className="rounded-lg border-2 border-pink-600 p-2 font-bold text-pink-600"

>

🗺️ Yol Tarifi

</a>



</div>



</div>


</Popup>


</Marker>


))}





</MapContainer>


);

}