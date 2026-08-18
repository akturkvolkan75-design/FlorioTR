"use client";

import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import AddToCartButton from "@/components/AddToCartButton";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import ProductRating from "@/components/reviews/ProductRating";


type Product = {

  id:number;

  slug:string;

  name:string;

  category:string;

  price:number;

  rating:number;

  image:string;

  description:string;

};



export default function ProductCard({

  product,

}:{

  product:Product;

}){


const {theme}=useTheme();

const colors=themes[theme].colors;



return (

<article

className="
group
overflow-hidden
rounded-2xl
transition-all
duration-300
hover:-translate-y-1
"

style={{

background:colors.card,

border:
`1px solid ${colors.cardBorder}`,

boxShadow:
`0 8px 22px ${colors.cardBorder}25`

}}

>


<Link

href={`/urunler/${product.slug}`}

className="block"

>


<div

className="
relative
h-44
overflow-hidden
"

>


<img

src={product.image}

alt={product.name}

className="
h-full
w-full
object-cover
transition
duration-500
group-hover:scale-105
"

/>



<div

className="
absolute
right-3
top-3
"

>

<FavoriteButton

slug={product.slug}

/>


</div>


</div>





<div className="p-3">


<p

className="
text-[11px]
font-bold
"

style={{

color:colors.primary

}}

>

{product.category}


</p>



<h3

className="
mt-1
truncate
text-sm
font-black
"

style={{

color:colors.foreground

}}

>

{product.name}

</h3>





<div

className="
mt-2
flex
items-center
justify-between
"

>


<span

className="
text-base
font-black
"

style={{

color:colors.primary

}}

>

{product.price.toLocaleString("tr-TR")} TL


</span>



<span

className="
text-xs
font-bold
"

>

<ProductRating

productSlug={product.slug}

fallback={product.rating}

/>


</span>



</div>



</div>


</Link>





<div className="px-3 pb-3">


<AddToCartButton

product={{

id:product.id,

slug:product.slug,

name:product.name,

price:product.price,

image:product.image,

}}

/>


</div>



</article>


);


}