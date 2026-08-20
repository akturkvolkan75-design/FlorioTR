"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


type Reply = {

  id:number;

  message:string;

  customerName:string;

  createdAt:string;

};



type Review = {

  id:number;

  rating:number;

  comment:string | null;

  customerName:string;

  createdAt:string;

  replies:Reply[];

};



export default function ProductReviews({

productSlug

}:{

productSlug:string;

}){


const [reviews,setReviews] =
useState<Review[]>([]);


const [average,setAverage] =
useState<number | null>(null);



const [rating,setRating] =
useState(5);



const [comment,setComment] =
useState("");



const [replyText,setReplyText] =
useState<Record<number,string>>({});



const [message,setMessage] =
useState("");



const {theme} =
useTheme();


const colors =
themes[theme].colors;






async function loadReviews(){


try{


const res =
await fetch(
`/api/reviews?productSlug=${encodeURIComponent(productSlug)}`
);


const data =
await res.json();



if(data.success){

setReviews(data.reviews);

setAverage(data.average ?? null);

}


}

catch(error){

console.log(error);

}


}






useEffect(()=>{


loadReviews();


},[productSlug]);









async function sendReview(){


if(!comment.trim()){

return;

}



const res =
await fetch("/api/reviews",{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

productSlug,

rating,

comment,

orderId:null

})


});



const data =
await res.json();


setMessage(data.message);



if(data.success){

setComment("");

setRating(5);

}



}









async function sendReply(reviewId:number){



const text =
replyText[reviewId];


if(!text?.trim()){

return;

}



const res =
await fetch("/api/reviews",{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

reviewId,

reply:text

})


});



const data =
await res.json();


setMessage(data.message);



if(data.success){


setReplyText({

...replyText,

[reviewId]:""

});


}



}









return (

<section

className="
mt-12
rounded-3xl
p-6
"

style={{

background:colors.background

}}

>


<div className="
flex
justify-between
items-center
flex-wrap
gap-3
">


<h2

className="
text-2xl
font-black
"

style={{

color:colors.primary

}}

>

⭐ Müşteri Yorumları

</h2>



<span

className="
font-black
"

style={{

color:colors.foreground

}}

>

{

reviews.length

?

`⭐ ${average?.toFixed(1) ?? "0"} (${reviews.length})`

:

"Henüz yorum yok"

}

</span>


</div>







<div

className="
mt-6
grid
gap-4
"

>


{

reviews.map((review)=>(


<div

key={review.id}

className="
rounded-2xl
border
p-4
"

style={{

background:colors.card,

borderColor:colors.cardBorder

}}

>


<div className="
flex
justify-between
gap-3
">


<strong

style={{

color:colors.foreground

}}

>

{review.customerName}

</strong>



<span>

{"⭐".repeat(review.rating)}

</span>


</div>



{

review.comment &&

<p

className="
mt-3
font-medium
"

style={{

color:colors.muted

}}

>

{review.comment}

</p>

}







{

review.replies.length > 0 &&


<div className="
mt-4
rounded-xl
bg-slate-100
p-3
">


<h4 className="
font-black
text-sm
">

💬 Cevaplar

</h4>



{

review.replies.map((reply)=>(


<p

key={reply.id}

className="
mt-2
text-sm
"

>

<b>{reply.customerName}:</b>

{" "}

{reply.message}

</p>


))

}


</div>


}






<div className="
mt-4
flex
gap-2
">


<input

value={replyText[review.id] || ""}

onChange={(e)=>

setReplyText({

...replyText,

[review.id]:e.target.value

})

}

placeholder="Cevap yaz..."

className="
flex-1
rounded-lg
border
px-3
py-2
text-sm
"

/>



<button

onClick={()=>sendReply(review.id)}

className="
rounded-lg
bg-emerald-700
px-3
py-2
text-xs
font-black
text-white
"

>

Gönder

</button>


</div>





</div>


))


}



</div>








<div

className="
mt-8
rounded-2xl
border
p-5
"

style={{

background:colors.card,

borderColor:colors.cardBorder

}}

>


<h3 className="
font-black
text-lg
">

✍️ Yorum Yaz

</h3>



<div className="
mt-3
flex
gap-2
text-2xl
">

{

[1,2,3,4,5].map((star)=>(


<button

key={star}

onClick={()=>setRating(star)}

>

{star <= rating ? "⭐":"☆"}

</button>


))

}


</div>





<textarea

value={comment}

onChange={(e)=>setComment(e.target.value)}

placeholder="Deneyiminizi paylaşın..."

className="
mt-3
h-28
w-full
rounded-xl
border
p-3
"

/>





<button

onClick={sendReview}

className="
mt-3
rounded-xl
bg-emerald-700
px-5
py-3
font-black
text-white
"

>

Yorumu Gönder

</button>



{

message &&

<p className="
mt-3
text-sm
font-bold
">

{message}

</p>

}



</div>





</section>


);


}