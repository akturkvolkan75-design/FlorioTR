"use client";

import { useState } from "react";
import { orders, OrderStatus } from "@/data/orders";


const statusSteps: OrderStatus[] = [
  "Yeni",
  "Kabul Edildi",
  "Hazırlanıyor",
  "Hazır",
  "Kuryede",
  "Teslim Edildi",
  "İptal"
];



export default function CicekciPanel(){


const [orderList,setOrderList] =
useState(orders);



function changeStatus(
id:number,
status:OrderStatus
){


setOrderList(

orderList.map(order =>

order.id === id

?

{
...order,
status
}

:

order

)

);


}





function printOrders(list:any[]){


const win = window.open("","_blank");


if(!win) return;



const printItems = list.slice(0,4).map(order => `


<div class="ticket">


<div class="receiver">


<div class="brand">
🌸 FlorioTR
</div>


<div class="title">
ALICI
</div>


<div class="name">
${order.customer.name}
</div>


<div>
☎ ${order.customer.phone}
</div>


<div>
📍 ${order.customer.district}
</div>


<div>
${order.customer.address}
</div>


<div class="flower">
🌹 ${order.product.name} x${order.product.quantity}
</div>


</div>



<div class="florist">


<div class="title">
ÇİÇEKÇİ NOTU
</div>


<div class="floristText">

${order.customerNote || "Özel not yok"}

</div>


<div class="prepare">
Hazırlayan:
__________
</div>


</div>





<div class="card">


<div class="heart">
♥
</div>


<div class="message">

${order.flowerNote || "Sevgilerimizle"}

</div>


<div class="flowerBottom">
🌸
</div>


</div>



</div>


`).join("");




win.document.write(`


<html>

<head>

<meta charset="UTF-8">


<style>


@page{

size:A4;

margin:6mm;

}



body{

font-family:Arial;

color:#111;

}



.ticket{

display:grid;

grid-template-columns:
36% 32% 32%;

height:62mm;

border:1px dashed #555;

margin-bottom:6mm;

page-break-inside:avoid;

}




.receiver,
.florist,
.card{

padding:10px;

}





.receiver{

border-right:1px solid #ddd;

}



.florist{

border-right:1px solid #ddd;

text-align:center;

}




.brand{

font-size:11px;

font-weight:bold;

color:#be123c;

margin-bottom:8px;

}



.title{

font-size:12px;

font-weight:900;

color:#be123c;

border-bottom:1px solid #ddd;

padding-bottom:4px;

margin-bottom:8px;

}




.name{

font-size:16px;

font-weight:bold;

margin-bottom:5px;

}



.receiver div{

font-size:11px;

line-height:1.5;

}



.flower{

margin-top:8px;

font-weight:bold;

font-size:12px;

}




.floristText{

font-size:14px;

font-weight:bold;

margin-top:15px;

}



.prepare{

margin-top:18px;

font-size:11px;

}



.card{

position:relative;

display:flex;

justify-content:center;

align-items:center;

text-align:center;

background:#fff8f8;

}



.heart{

position:absolute;

top:8px;

font-size:28px;

color:#e11d48;

}



.message{

font-family:Georgia;

font-size:18px;

font-style:italic;

font-weight:bold;

line-height:1.4;

}



.flowerBottom{

position:absolute;

bottom:8px;

font-size:22px;

}



</style>


</head>


<body>


${printItems}


</body>


</html>


`);


win.document.close();


win.print();


}



return (


<main

className="
min-h-screen
bg-gray-100
p-4
"

>


<div

className="
mx-auto
max-w-[1400px]
"

>



<div

className="
mb-5
flex
items-center
justify-between
"

>


<div>


<h1

className="
text-2xl
font-extrabold
text-blue-700
"

>

🌸 FlorioTR Çiçekçi Operasyon Paneli

</h1>


<p

className="
text-sm
text-gray-600
"

>

Sipariş yönetim ve teslim hazırlık ekranı

</p>


</div>





<button


onClick={()=>printOrders(orderList)}


className="
rounded-xl
bg-blue-700
px-5
py-3
font-bold
text-white
shadow
hover:bg-blue-800
"

>

🖨 Toplu Yazdır

</button>


</div>








<div

className="
overflow-hidden
rounded-xl
border
border-gray-200
bg-white
shadow-lg
"

>


<table

className="
w-full
text-sm
text-gray-900
"

>



<thead

className="
bg-blue-50
border-b
"

>


<tr>


<th

className="
p-3
text-left
font-bold
"

>

No

</th>



<th

className="
p-3
text-left
font-bold
"

>

Alıcı

</th>



<th

className="
p-3
text-left
font-bold
"

>

Ürün

</th>



<th

className="
p-3
text-left
font-bold
"

>

Durum

</th>



<th

className="
p-3
text-center
font-bold
"

>

Çıktı

</th>


</tr>


</thead>







<tbody>


{


orderList.map(order=>(


<tr


key={order.id}


className="
border-b
hover:bg-blue-50
transition
"

>


<td

className="
p-3
font-extrabold
text-gray-950
"

>

#{order.id}


</td>







<td

className="
p-3
"

>


<div

className="
font-bold
text-gray-950
"

>

{order.customer.name}

</div>



<div

className="
text-gray-700
"

>

☎ {order.customer.phone}

</div>



<div

className="
mt-1
font-bold
text-blue-700
"

>

📍 {order.customer.district}

</div>


<div

className="
text-xs
text-gray-600
"

>

{order.customer.address}

</div>


</td>








<td

className="
p-3
"

>


<div

className="
font-bold
text-gray-950
"

>

{order.product.name}

</div>



<div

className="
font-bold
text-blue-700
"

>

{order.product.price} TL

</div>



</td>






<td

className="
p-3
"

>


<div

className="
flex
max-w-[650px]
gap-1
overflow-x-auto
pb-1
"

>


{


statusSteps.map(step=>(


<button


key={step}


onClick={()=>changeStatus(order.id,step)}



className={`

rounded-lg

border

px-3

py-2

text-xs

font-bold

whitespace-nowrap


transition


${

order.status===step


?


"bg-blue-700 text-white border-blue-700"


:


"bg-white text-gray-800 hover:bg-blue-100"

}


`}


>


{step}


</button>


))


}


</div>





<div

className="
mt-2
text-xs
font-bold
text-blue-700
"

>


Aktif Durum:

{order.status}


</div>


</td>





<td

className="
p-3
text-center
"

>


<button


onClick={()=>printOrders([order])}


className="
rounded-xl
bg-gray-900
px-4
py-3
font-bold
text-white
shadow
hover:bg-black
"

>

🖨

</button>


</td>





</tr>


))


}


</tbody>


</table>


</div>


</div>


</main>


);


}