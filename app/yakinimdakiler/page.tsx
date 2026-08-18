"use client";

import Link from "next/link";
import { useState } from "react";


const flowershops = [

  {
    id:1,
    slug:"gul-bahcesi",
    name:"Gül Bahçesi Çiçekçilik",
    city:"Kadıköy, İstanbul",
    distance:"1.2 km",
    phone:"0555 555 55 55"
  },


  {
    id:2,
    slug:"renkli-bahce",
    name:"Renkli Bahçe",
    city:"Üsküdar, İstanbul",
    distance:"2.5 km",
    phone:"0555 555 55 56"
  }

];





export default function YakinimdakilerPage(){


const [location,setLocation]=useState(
  "Konum alınmadı"
);



function getLocation(){


 if(!navigator.geolocation){

  setLocation("Tarayıcı desteklemiyor");

  return;

 }


 navigator.geolocation.getCurrentPosition(

(position)=>{

setLocation(
`Konum bulundu: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`
);


},

()=>{

setLocation(
"Konum izni verilmedi"
);

}

);


}





return (


<main className="min-h-screen bg-pink-50 p-6">


<div className="mx-auto max-w-6xl">



<h1 className="
text-center
text-4xl
font-bold
text-pink-600
">

📍 Yakınımdaki Çiçekçiler

</h1>





<div className="
mt-8
rounded-3xl
bg-white
p-6
shadow-xl
">


<button

onClick={getLocation}

className="
rounded-xl
bg-pink-600
px-6
py-3
font-bold
text-white
"

>

📍 Konumumu Bul

</button>



<p className="mt-4 text-gray-600">

{location}

</p>


</div>







<div className="
mt-8
grid
gap-6
md:grid-cols-2
">



{

flowershops.map((shop)=>(


<div

key={shop.id}

className="
rounded-3xl
bg-white
p-6
shadow-lg
"

>


<div className="text-6xl">

🌸

</div>



<h2 className="
mt-4
text-2xl
font-bold
">

{shop.name}

</h2>




<p className="mt-2 text-gray-600">

📍 {shop.city}

</p>




<p className="mt-2 font-bold text-pink-600">

📏 {shop.distance}

</p>





<div className="mt-5 grid gap-3 md:grid-cols-2">



<a

href={`tel:${shop.phone}`}

className="
rounded-xl
bg-pink-600
py-3
text-center
font-bold
text-white
"

>

☎ Ara

</a>




<Link

href={`/cicekci/${shop.slug}`}

className="
rounded-xl
border-2
border-pink-600
py-3
text-center
font-bold
text-pink-600
"

>

🌸 Detayları Gör

</Link>



</div>




</div>


))


}



</div>




</div>


</main>


);


}