"use client";

import { orders } from "@/data/orders";
import OrderPrintCard from "@/components/print/OrderPrintCard";



export default function YazdirPage(){



return (


<main className="print-area">


<div className="hidden print:block">


{
orders.slice(0,4).map((order)=>(


<OrderPrintCard

key={order.id}

order={order}

/>


))

}


</div>





<div className="print:hidden p-10">


<h1 className="text-3xl font-bold">

Yazdırma Önizleme

</h1>


<p className="mt-5">

4 sipariş A4 çıktısı olarak hazırlanacak.

</p>



<button

onClick={()=>window.print()}

className="
mt-6
rounded-xl
bg-black
px-6
py-3
text-white
font-bold
"

>

🖨 Yazdır


</button>


</div>



</main>


);


}