type Reply = {

  id:number;

  message:string;

  customerName:string;

  isApproved:boolean;

  isHidden:boolean;

  isDeleted:boolean;

};



type Props = {

  reply:Reply;

  update:(

    id:number,

    type:"review"|"reply",

    action:string

  )=>void;

};




export default function ReplyCard({

reply,

update

}:Props){



return (

<div

className="
mt-3
rounded-xl
bg-white
p-3
"

>


<p

className="
text-sm
font-semibold
"

>

<b>{reply.customerName}</b>

{" "}

{reply.message}

</p>





<div

className="
mt-3
flex
flex-wrap
gap-2
"

>


<button

onClick={()=>update(

reply.id,

"reply",

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

Onay

</button>




<button

onClick={()=>update(

reply.id,

"reply",

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

reply.id,

"reply",

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

reply.id,

"reply",

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

reply.isDeleted &&

<button

onClick={()=>update(

reply.id,

"reply",

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

Geri

</button>

}



</div>


</div>

);


}