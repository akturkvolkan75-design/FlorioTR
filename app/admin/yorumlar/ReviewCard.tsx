import ReplyCard from "./ReplyCard";


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



type Props = {

  review:Review;

  update:(

    id:number,

    type:"review"|"reply",

    action:string

  )=>void;

};





export default function ReviewCard({

review,

update

}:Props){



function status(){


  if(review.isDeleted){

    return {

      text:"🔴 Silindi",

      color:"bg-red-100 text-red-800"

    };

  }



  if(review.isHidden){

    return {

      text:"🟠 Gizli",

      color:"bg-orange-100 text-orange-800"

    };

  }



  if(!review.isApproved){

    return {

      text:"🟡 Yeni / Onay Bekliyor",

      color:"bg-yellow-100 text-yellow-800"

    };

  }



  return {

    text:"🟢 Yayında",

    color:"bg-green-100 text-green-800"

  };


}




const badge=status();




return (

<div

className="
rounded-2xl
bg-white
p-5
shadow
border
"

>


<div className="
flex
gap-4
">


<img

src={review.productImage}

alt={review.productName}

className="
h-20
w-20
rounded-xl
object-cover
"

/>




<div className="
flex-1
">



<div className="
flex
justify-between
gap-3
">


<div>


<h2 className="
font-black
">

{review.productName}

</h2>



<p className="
text-sm
font-bold
">

{review.customerName}

</p>



<p>

{"⭐".repeat(review.rating)}

</p>


</div>





<span

className={`
rounded-full
px-3
py-1
text-xs
font-black
${badge.color}
`}

>

{badge.text}

</span>



</div>





{

review.createdAt &&

<p className="
mt-2
text-xs
font-bold
text-slate-500
">

📅 {new Date(review.createdAt).toLocaleDateString("tr-TR")}

</p>

}






<p className="
mt-3
text-sm
font-semibold
">

{review.comment || "Yorum yok"}

</p>







<div className="
mt-4
flex
flex-wrap
gap-2
">


<button

onClick={()=>update(
review.id,
"review",
"approve"
)}

className="
rounded-lg
bg-green-700
px-3
py-1
text-xs
font-black
text-white
"

>

Onayla

</button>




<button

onClick={()=>update(
review.id,
"review",
"hide"
)}

className="
rounded-lg
bg-yellow-400
px-3
py-1
text-xs
font-black
"

>

Gizle

</button>




<button

onClick={()=>update(
review.id,
"review",
"show"
)}

className="
rounded-lg
bg-blue-700
px-3
py-1
text-xs
font-black
text-white
"

>

Göster

</button>




<button

onClick={()=>update(
review.id,
"review",
"delete"
)}

className="
rounded-lg
bg-red-700
px-3
py-1
text-xs
font-black
text-white
"

>

Sil

</button>




{

review.isDeleted &&

<button

onClick={()=>update(
review.id,
"review",
"restore"
)}

className="
rounded-lg
bg-purple-700
px-3
py-1
text-xs
font-black
text-white
"

>

Geri Getir

</button>

}


</div>



</div>


</div>







{

review.replies.length > 0 &&

<div className="
mt-5
rounded-xl
bg-slate-100
p-3
">


<h3 className="
font-black
text-sm
">

💬 Cevaplar

</h3>



{

review.replies.map((reply)=>(


<ReplyCard

key={reply.id}

reply={reply}

update={update}

/>


))

}


</div>

}



</div>

);


}