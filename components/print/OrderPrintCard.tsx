"use client";


type Props = {

order:any;

};



export default function OrderPrintCard({
order
}:Props){


return (

<div className="
print-card
border
border-gray-400
h-[65mm]
grid
grid-cols-3
overflow-hidden
mb-3
">


{/* ALICI */}

<div className="
p-4
border-r
border-gray-300
">


<h2 className="
font-bold
text-lg
mb-3
">

ALICI

</h2>



<p className="font-bold">

👤 {order.customer.name}

</p>


<p>

☎ {order.customer.phone}

</p>



<p className="mt-2">

📍 {order.customer.district}

</p>



<p>

{order.customer.address}

</p>



<div className="
mt-3
pt-3
border-t
font-bold
">

🌹 {order.product.name} x{order.product.quantity}

</div>



</div>







{/* ÇİÇEKÇİ NOTU */}


<div className="
p-4
border-r
border-gray-300
">


<h2 className="
font-bold
text-lg
mb-3
">

ÇİÇEKÇİ NOTU

</h2>



<p className="
text-sm
leading-6
">

📋 {order.customerNote || "-"}

</p>




<div className="
mt-10
text-center
text-3xl
">

🌸

</div>


</div>








{/* KART */}


<div className="
p-5
relative
text-center
">




<div className="
absolute
inset-2
border
border-red-300
">

</div>




<div className="
relative
z-10
pt-6
">


<div className="
text-3xl
">

❤️

</div>



<p className="
mt-5
font-serif
italic
text-xl
leading-8
">

{order.flowerNote || 
"Mutluluklar dilerim"}

</p>



</div>



</div>




</div>


);


}