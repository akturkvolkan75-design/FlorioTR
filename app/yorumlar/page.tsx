"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


type Reply = {

  id:number;

  message:string;

  customerName:string;

};


type Review = {

  id:number;

  productSlug:string;

  productName:string;

  productImage:string;

  rating:number;

  comment:string | null;

  customerName:string;

  likeCount:number;

  replies:Reply[];

};



export default function YorumlarPage(){


const [reviews,setReviews]=useState<Review[]>([]);

const [replyOpen,setReplyOpen]=useState<number|null>(null);

const [replyText,setReplyText]=useState("");

const {theme}=useTheme();

const colors=themes[theme].colors;




async function loadReviews(){

const res =
await fetch("/api/reviews");


const data =
await res.json();


if(data.success){

setReviews(data.reviews);

}

}




useEffect(()=>{

loadReviews();

},[]);





async function sendReply(
reviewId:number
){


if(!replyText.trim()){

alert("Lütfen cevap yazın.");

return;

}



const res =
await fetch(
"/api/reviews",
{

method:"POST",

headers:{

"Content-Type":
"application/json",

},

body:JSON.stringify({

reviewId,

reply:
replyText,

})

}

);



const data =
await res.json();



if(!data.success){

alert(data.message);

return;

}



setReplyText("");

setReplyOpen(null);

loadReviews();


}





return (


<main

className="
min-h-screen
px-5
py-10
"

style={{

background:colors.background

}}

>


<div

className="
mx-auto
max-w-6xl
"

>


<div

className="
mb-8
rounded-full
px-6
py-4
text-center
"

style={{

background:colors.secondary

}}

>


<h1

className="
text-3xl
font-black
"

style={{

color:colors.primary

}}

>

🌸 Sizden Gelen Yorumlar

</h1>


</div>





<div

className="
grid
gap-6
md:grid-cols-2
"

>


{

reviews.map((review)=>(


<article

key={review.id}

className="
overflow-hidden
rounded-3xl
"

style={{

background:colors.card,

border:
`2px solid ${colors.cardBorder}`

}}

>


<img

src={review.productImage}

alt={review.productName}

className="
h-56
w-full
object-cover
"

/>





<div

className="
p-6
"

>


<h2

className="
text-xl
font-black
"

style={{

color:colors.primary

}}

>

{review.productName}

</h2>




<div

className="
mt-3
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

"{review.comment}"

</p>





<p

className="
mt-4
font-black
"

style={{

color:colors.primary

}}

>

{review.customerName}

</p>




<div

className="
mt-3
text-sm
font-bold
"

>

❤️ {review.likeCount} beğeni

</div>





<div

className="
mt-5
space-y-3
rounded-2xl
p-4
"

style={{

background:colors.background

}}

>


<p

className="
font-black
"

>

💬 Cevaplar

</p>



{

review.replies.length===0 && (

<p className="text-sm">

Henüz cevap yok.

</p>

)

}





{

review.replies.map(reply=>(


<div

key={reply.id}

className="
text-sm
"

>


<span className="font-black">

{reply.customerName}:

</span>


{" "}

{reply.message}


</div>


))


}



<button

onClick={()=>{

setReplyOpen(
replyOpen===review.id
?
null
:
review.id
);

}}

className="
mt-3
rounded-xl
bg-emerald-700
px-4
py-2
font-black
text-white
"

>

💬 Cevap yaz

</button>





{

replyOpen===review.id && (


<div

className="
mt-3
space-y-2
"

>


<textarea

value={replyText}

onChange={(e)=>
setReplyText(e.target.value)
}

className="
w-full
rounded-xl
border
p-3
"

placeholder="Cevabınızı yazın..."

rows={3}

/>



<button

onClick={()=>
sendReply(review.id)
}

className="
rounded-xl
bg-blue-950
px-5
py-2
font-black
text-white
"

>

Gönder

</button>


</div>


)

}





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