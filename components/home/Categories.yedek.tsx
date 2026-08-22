"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


const categories = [

{
name:"Gül Buketleri",
slug:"gul-buketleri",
image:"/images/categories/gul-buketleri.jpg",
description:"Sevginin en zarif hali"
},

{
name:"Özel Buketler",
slug:"ozel-buketler",
image:"/images/categories/ozel-buket.jpg",
description:"Her özel ana uygun tasarımlar"
},

{
name:"Papatya Buketleri",
slug:"papatya-buketleri",
image:"/images/categories/papatya.jpg",
description:"Doğallığın ve mutluluğun simgesi"
},

{
name:"Mevsim Buketleri",
slug:"mevsim-buketleri",
image:"/images/categories/mevsim.jpg",
description:"Mevsimin en güzel renkleri"
},

{
name:"Orkideler",
slug:"orkideler",
image:"/images/categories/orkide.jpg",
description:"Zarafet ve şıklığın simgesi"
},

{
name:"Saksı Çiçekleri",
slug:"saksi-cicekleri",
image:"/images/categories/saksi.jpg",
description:"Yaşam alanlarına doğal güzellik"
},

{
name:"Çelenkler",
slug:"celenkler",
image:"/images/categories/celenk.jpg",
description:"Anlamlı günler için özel tasarımlar"
}

];



export default function Categories(){


const {theme}=useTheme();

const colors=themes[theme].colors;



return (

<section

className="
w-full
"

style={{
background:colors.background
}}

>


<div

className="
rounded-[30px]
"

style={{
background:colors.card,
border:`1px solid ${colors.cardBorder}`
}}

>


<div

className="
mb-5
rounded-full
px-5
py-3
text-center
"

style={{
background:colors.secondary
}}

>

<h2

className="
text-2xl
font-black
"

style={{
color:colors.primary
}}

>

🌸 Çiçek Kategorileri

</h2>

</div>




<div

className="
grid
gap-4
lg:grid-cols-2
"

>


{
categories.slice(0,4).map((category)=>(


<Link

key={category.slug}

href={`/kategori/${category.slug}`}

className="
group
relative
h-36
overflow-hidden
rounded-[26px]
"

>


<img

src={category.image}

alt={category.name}

className="
absolute
inset-0
h-full
w-full
object-cover
transition
duration-700
group-hover:scale-110
"

/>


<div

className="
absolute
inset-0
bg-gradient-to-r
from-black/70
to-transparent
"

/>


<div

className="
absolute
bottom-5
left-6
text-white
"

>


<h3

className="
text-2xl
font-black
"

>

{category.name}

</h3>


<p

className="
text-sm
font-semibold
"

>

{category.description}

</p>


</div>


</Link>


))
}


</div>




<div

className="
mt-4
grid
gap-4
sm:grid-cols-3
"

>


{
categories.slice(4).map((category)=>(


<Link

key={category.slug}

href={`/kategori/${category.slug}`}

className="
group
relative
h-32
overflow-hidden
rounded-[24px]
"

>


<img

src={category.image}

alt={category.name}

className="
absolute
inset-0
h-full
w-full
object-cover
transition
duration-700
group-hover:scale-110
"

/>



<div

className="
absolute
inset-0
bg-black/45
"

/>



<h3

className="
absolute
bottom-4
left-5
text-xl
font-black
text-white
"

>

{category.name}

</h3>


</Link>


))

}


</div>



</div>


</section>


);


}