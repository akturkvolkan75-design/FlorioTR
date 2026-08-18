"use client";

import { useCallback, useEffect, useState } from "react";


type Reply = {

  id:number;

  message:string;

  customerName:string;

};


type Review = {

  id:number;

  orderId:number;

  productName:string;

  productImage:string;

  rating:number;

  comment:string | null;

  customerName:string;

  isApproved:boolean;

  createdAt:string;

  likeCount:number;

  replies:Reply[];

};



export default function AdminReviews(){


const [reviews,setReviews]=useState<Review[]>([]);



const loadReviews = useCallback(async()=>{


const res =
await fetch("/api/admin/reviews");


const data =
await res.json();


if(data.success){

setReviews(data.reviews);

}


},[]);




useEffect(()=>{

loadReviews();

},[loadReviews]);






async function update(
id:number,
isApproved:boolean
){


await fetch(
"/api/admin/reviews",
{

method:"PATCH",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id,

isApproved

})

}

);


loadReviews();


}







async function remove(id:number){


if(!confirm("Bu yorumu silmek istediğinize emin misiniz?"))

return;



await fetch(

"/api/admin/reviews",

{

method:"DELETE",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

id

})

}

);



loadReviews();


}






return (


<main

className="
min-h-screen
bg-slate-100
p-6
text-slate-950
"

>


<div

className="
mx-auto
max-w-6xl
"

>


<div

className="
rounded-3xl
bg-[#0c2f27]
p-8
text-white
"

>


<h1

className="
text-3xl
font-black
"

>

🌸 Müşteri Yorumları

</h1>


<p

className="
mt-2
font-semibold
text-white/80
"

>

Yorumları kontrol edin, onaylayın veya kaldırın.

</p>


</div>







<div

className="
mt-6
grid
gap-6
"

>


{

reviews.length===0 &&

<div

className="
rounded-3xl
bg-white
p-10
text-center
font-black
shadow
"

>

Henüz müşteri yorumu yok.

</div>


}






{

reviews.map((review)=>(


<article

key={review.id}

className="
overflow-hidden
rounded-3xl
bg-white
shadow
"

>


<div

className="
grid
md:grid-cols-[220px_1fr]
"

>


<img

src={review.productImage}

alt={review.productName}

className="
h-52
w-full
object-cover
"

/>





<div

className="
p-6
"

>


<div

className="
flex
items-start
justify-between
gap-4
"

>


<div>


<h2

className="
text-xl
font-black
"

>

{review.productName}

</h2>


<p

className="
mt-2
font-black
"

>

{review.customerName}

</p>


</div>



<span

className="
rounded-full
px-4
py-2
text-xs
font-black
"

style={{

background:
review.isApproved
?
"#dcfce7"
:
"#fef3c7"

}}

>

{

review.isApproved
?
"Yayında"
:
"Onay Bekliyor"

}

</span>



</div>






<div

className="
mt-4
text-xl
"

>

{"⭐".repeat(review.rating)}

</div>





<p

className="
mt-4
font-semibold
leading-7
"

>

{review.comment || "Sadece puan verildi."}

</p>





<p

className="
mt-4
text-sm
font-bold
text-slate-500
"

>

❤️ {review.likeCount} beğeni

</p>





{

review.replies.length>0 &&

<div

className="
mt-5
rounded-2xl
bg-slate-100
p-4
"

>


<p

className="
font-black
"

>

💬 Cevaplar

</p>


{

review.replies.map(reply=>(


<p

key={reply.id}

className="
mt-2
text-sm
"

>

<b>{reply.customerName}:</b>{" "}

{reply.message}

</p>


))

}


</div>


}







<div

className="
mt-6
flex
flex-wrap
gap-3
"

>


<button

onClick={()=>update(review.id,true)}

className="
rounded-xl
bg-emerald-700
px-5
py-3
font-black
text-white
"

>

✓ Onayla

</button>




<button

onClick={()=>update(review.id,false)}

className="
rounded-xl
bg-amber-400
px-5
py-3
font-black
"

>

Gizle

</button>




<button

onClick={()=>remove(review.id)}

className="
rounded-xl
bg-red-700
px-5
py-3
font-black
text-white
"

>

Sil

</button>


</div>




</div>


</div>


</article>


))


}



</div>


</div>


</main>


);


}