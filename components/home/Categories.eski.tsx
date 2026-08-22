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
},

{
name:"Kutu Güller",
slug:"kutu-guller",
image:"/images/categories/kutu-gul.jpg",
description:"Şık kutularda özel sürprizler"
}

];


export default function Categories(){


const {theme}=useTheme();

const colors=themes[theme].colors;


return (

<section
className="w-full"
style={{
background:colors.background
}}
>


<div

className="
rounded-[32px]
overflow-hidden
"

style={{
background:colors.card,
border:`1px solid ${colors.cardBorder}`
}}

>


<div

className="
grid
grid-cols-2
lg:grid-cols-4
gap-1
"

>


{
categories.map((category)=>(

<Link

key={category.slug}

href={`/kategori/${category.slug}`}

className="
group
relative
aspect-[4/5]
overflow-hidden
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
bg-gradient-to-t
from-black/75
via-black/20
to-transparent
"

/>


<div

className="
absolute
bottom-5
left-5
right-5
text-white
"

>


<h3

className="
text-xl
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


</div>


</section>


);


}