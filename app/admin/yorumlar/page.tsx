"use client";

import { useCallback, useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";


type Reply = {

  id:number;

  message:string;

  customerName:string;

  isApproved:boolean;

  isHidden:boolean;

  isDeleted:boolean;

};



type Review = {

  id:number;

  productName:string;

  productImage:string;

  rating:number;

  comment:string | null;

  customerName:string;

  isApproved:boolean;

  isHidden:boolean;

  isDeleted:boolean;

  createdAt?:string;

  replies:Reply[];

};





export default function AdminReviews(){


const [reviews,setReviews] =
useState<Review[]>([]);





const loadReviews =
useCallback(async()=>{


try{


const res =
await fetch("/api/admin/reviews");


const data =
await res.json();




if(data.success){


setReviews(

data.reviews.map((review:Review)=>({

...review,

createdAt:
review.createdAt ??
new Date().toISOString()

}))

);


}


}

catch(error){

console.log(error);

}



},[]);







useEffect(()=>{


loadReviews();


},[loadReviews]);








async function update(

id:number,

type:"review"|"reply",

action:string

){



try{


await fetch("/api/admin/reviews",{


method:"PATCH",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

id,

type,

action

})


});


loadReviews();



}

catch(error){

console.log(error);

}


}







const pendingCount =
reviews.filter(

(review)=>

!review.isApproved &&
!review.isHidden &&
!review.isDeleted

).length;



const activeCount =
reviews.filter(

(review)=>

review.isApproved &&
!review.isHidden &&
!review.isDeleted

).length;




const hiddenCount =
reviews.filter(

(review)=>

review.isHidden &&
!review.isDeleted

).length;




const deletedCount =
reviews.filter(

(review)=>

review.isDeleted

).length;







return (


<main

className="
min-h-screen
bg-slate-100
p-5
"

>


<div

className="
mx-auto
max-w-5xl
"

>



<div

className="
rounded-3xl
bg-[#0c2f27]
p-6
text-white
"

>


<h1

className="
text-2xl
font-black
"

>

🌸 Yorum Yönetimi

</h1>



<p

className="
mt-2
text-sm
font-semibold
"

>

Yorum ve cevap kontrol paneli

</p>



</div>









<div

className="
mt-5
grid
gap-3
md:grid-cols-4
"

>



<div

className="
rounded-2xl
bg-yellow-100
p-4
text-center
"

>

<p className="
text-xs
font-black
text-yellow-800
">

🟡 Bekleyen

</p>


<p className="
text-3xl
font-black
text-yellow-900
">

{pendingCount}

</p>


</div>







<div

className="
rounded-2xl
bg-green-100
p-4
text-center
"

>

<p className="
text-xs
font-black
text-green-800
">

🟢 Yayında

</p>


<p className="
text-3xl
font-black
text-green-900
">

{activeCount}

</p>


</div>








<div

className="
rounded-2xl
bg-orange-100
p-4
text-center
"

>

<p className="
text-xs
font-black
text-orange-800
">

🟠 Gizli

</p>


<p className="
text-3xl
font-black
text-orange-900
">

{hiddenCount}

</p>


</div>








<div

className="
rounded-2xl
bg-red-100
p-4
text-center
"

>

<p className="
text-xs
font-black
text-red-800
">

🔴 Silinen

</p>


<p className="
text-3xl
font-black
text-red-900
">

{deletedCount}

</p>


</div>



</div>








<div

className="
mt-5
grid
gap-4
"

>



{

reviews.map((review)=>(


<ReviewCard


key={review.id}


review={review}


update={update}


/>


))


}



</div>






</div>


</main>


);


}