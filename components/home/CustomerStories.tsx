"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


type Review = {

  id:number;

  comment:string | null;

  productName:string;

  productSlug:string;

};



export default function CustomerStories(){


const [reviews,setReviews]=useState<Review[]>([]);


const {theme}=useTheme();

const colors=themes[theme].colors;



useEffect(()=>{


fetch("/api/reviews?featured=true")

.then(res=>res.json())

.then(data=>{


if(data.success){

setReviews(data.reviews);

}


})


.catch(()=>undefined);



},[]);



const review=reviews[0];



return (


<Link

href="/yorumlar"

className="
block
w-full
rounded-[30px]
p-6
transition
hover:-translate-y-1
"

style={{

background:colors.card,

border:`2px solid ${colors.cardBorder}`,

color:colors.foreground

}}

>



<div

className="
rounded-full
px-5
py-3
text-center
"

style={{

background:colors.secondary

}}

>


<h2

className="
text-2xl
font-black
"

style={{

color:colors.primary

}}

>

🌸 Sizden Gelen Güzel Yorumlar

</h2>


</div>





{

review ? (


<div

className="
mt-6
"

>


<div

className="
text-xl
"

>

⭐⭐⭐⭐⭐

</div>



<p

className="
mt-4
font-bold
italic
leading-7
"

>

“{review.comment}”

</p>




<p

className="
mt-4
text-sm
font-black
"

style={{

color:colors.primary

}}

>

🌷 {review.productName}

</p>



<p

className="
mt-5
text-xs
font-black
opacity-70
"

>

Tüm yorumları gör →

</p>


</div>


)


:(


<p

className="
mt-6
text-sm
font-semibold
"

>

İlk güzel yorumlarınızı bekliyoruz.

</p>


)


}



</Link>


);


}