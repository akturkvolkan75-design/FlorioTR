"use client";

import { useState } from "react";
import { assignFlorist } from "@/lib/orderAssign";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import { useRouter } from "next/navigation";


export default function SiparisPage() {


  const router = useRouter();


  const { theme } = useTheme();

  const colors = themes[theme].colors;



  const [form,setForm] = useState({

    receiverName:"",
    phone:"",
    city:"İstanbul",
    district:"",
    address:"",

    flowerNote:"",
    customerNote:"",

    date:"",
    time:"",

    payment:""

  });





function handleChange(

e:React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement

>

){


setForm({

...form,

[e.target.name]:
e.target.value

});


}








function submitOrder(){



if(

!form.receiverName ||
!form.phone ||
!form.district ||
!form.address ||
!form.payment

){


alert(
"🌸 Lütfen zorunlu alanları doldurun."
);


return;


}







const florist = assignFlorist(

form.district

);






const cart = JSON.parse(

localStorage.getItem("cart") || "[]"

);





const total = cart.reduce(

(sum:any,item:any)=>

sum +

item.price *
item.quantity,

0

);






const order = {


id:

"FL-" + Date.now(),




customer:{


...form


},





products:

cart,





total,





floristId:

florist?.id ?? null,





status:

"Hazırlanıyor",





createdAt:

new Date()

.toLocaleString("tr-TR")



};







localStorage.setItem(

"order",

JSON.stringify(order)

);






localStorage.removeItem(

"cart"

);






alert(

"🌸 Siparişiniz başarıyla alındı."

);





router.push(

"/siparis-onay"

);



}









const inputStyle={


background:

colors.background,


color:

colors.foreground,


border:

`1px solid ${colors.primary}`


};







return (


<main

className="
min-h-screen
px-6
py-16
"

style={{

background:
colors.background

}}

>





<div


className="
mx-auto
max-w-3xl
rounded-[40px]
p-8
shadow-2xl
"

style={{


background:

colors.secondary,


border:

`2px solid ${colors.primary}`


}}



>







<h1

className="
mb-10
text-center
text-4xl
font-extrabold
"

style={{

color:
colors.primary

}}

>

🌸 FlorioTR Sipariş


</h1>









<section className="mb-10">


<h2

className="
mb-5
text-xl
font-bold
"

style={{

color:

colors.foreground

}}

>

👤 Alıcı Bilgileri

</h2>






<input

name="receiverName"

placeholder="Alıcı Ad Soyad"

value={form.receiverName}

onChange={handleChange}

className="
mb-4
w-full
rounded-2xl
p-4
outline-none
"

style={inputStyle}


/>







<input

name="phone"

placeholder="Telefon Numarası"

value={form.phone}

onChange={handleChange}

className="
w-full
rounded-2xl
p-4
outline-none
"

style={inputStyle}


/>



</section>









<section className="mb-10">


<h2

className="
mb-5
text-xl
font-bold
"

style={{

color:
colors.foreground

}}

>

🚚 Teslimat Bilgileri

</h2>






<select

name="district"

value={form.district}

onChange={handleChange}

className="
mb-4
w-full
rounded-2xl
p-4
"

style={inputStyle}


>

<option value="">

İlçe Seçiniz

</option>


<option>Kadıköy</option>

<option>Beşiktaş</option>

<option>Bakırköy</option>

<option>Üsküdar</option>

<option>Şişli</option>

<option>Maltepe</option>



</select>







<textarea

name="address"

placeholder="Teslimat açık adresi"

value={form.address}

onChange={handleChange}

className="
h-32
w-full
rounded-2xl
p-4
"

style={inputStyle}


/>



</section>









<section className="mb-10">


<h2

className="
mb-5
text-xl
font-bold
"

style={{

color:
colors.foreground

}}

>

💌 Mesajlar

</h2>






<textarea

name="flowerNote"

placeholder="Çiçek kartı mesajı"

value={form.flowerNote}

onChange={handleChange}

className="
mb-4
h-24
w-full
rounded-2xl
p-4
"

style={inputStyle}


/>





<textarea

name="customerNote"

placeholder="Çiçekçi için özel not"

value={form.customerNote}

onChange={handleChange}

className="
h-24
w-full
rounded-2xl
p-4
"

style={inputStyle}


/>



</section>









<section className="mb-10">


<h2

className="
mb-5
text-xl
font-bold
"

style={{

color:
colors.foreground

}}

>

⏰ Teslimat Zamanı

</h2>






<input

type="date"

name="date"

value={form.date}

onChange={handleChange}

className="
mb-4
w-full
rounded-2xl
p-4
"

style={inputStyle}


/>





<select

name="time"

value={form.time}

onChange={handleChange}

className="
w-full
rounded-2xl
p-4
"

style={inputStyle}

>


<option>

Saat Seçiniz

</option>


<option>
09:00 - 12:00
</option>

<option>
12:00 - 15:00
</option>

<option>
15:00 - 18:00
</option>

<option>
18:00 - 21:00
</option>



</select>



</section>









<section>


<h2

className="
mb-5
text-xl
font-bold
"

style={{

color:

colors.foreground

}}

>

💳 Ödeme


</h2>






<select

name="payment"

value={form.payment}

onChange={handleChange}

className="
mb-8
w-full
rounded-2xl
p-4
"

style={inputStyle}


>


<option value="">

Ödeme Yöntemi

</option>


<option>

Kredi Kartı

</option>


<option>

Banka Kartı

</option>



</select>






<button

onClick={submitOrder}

className="
w-full
rounded-2xl
py-5
text-lg
font-extrabold
transition
hover:scale-105
"

style={{


background:

colors.primary,


color:

colors.background


}}

>

🌸 Siparişi Tamamla


</button>





</section>






</div>


</main>



);


}