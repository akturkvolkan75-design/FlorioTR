"use client";
import Link from "next/link";
import {useTheme} from "@/context/ThemeContext";
import {themes} from "@/themes/themes";
import {useProducts} from "@/hooks/useProducts";
import CustomerStories from "./CustomerStories";

const categories=[
 {name:"En Çok Tercih Edilenler",slug:"en-cok-tercih-edilenler",description:"Müşterilerimizin vazgeçemediği tasarımlar"},
 {name:"Gül Buketleri",slug:"gul-buketleri",description:"Aşkın en zarif hâli"},
 {name:"Karışık Mevsim Buketleri",slug:"karisik-mevsim-buketleri",description:"Mevsimin bütün renkleri"},
 {name:"Papatya & Gül Buketleri",slug:"papatya-gul-buketleri",description:"Sade, sıcak ve içten"},
 {name:"Orkideler",slug:"orkideler",description:"Uzun ömürlü zarafet"},
 {name:"Saksı Çiçekleri",slug:"saksi-cicekleri",description:"Yaşam alanlarına huzur"},
 {name:"Düğün Sepetleri",slug:"dugun-sepetleri",description:"En özel günlere"},
 {name:"Çelenkler",slug:"celenkler",description:"Kutlamalara görkem katın"},
 {name:"VIP",slug:"vip",description:"Ayrıcalıklı ve özel tasarımlar"},
];

export default function Categories(){
 const {theme}=useTheme();const colors=themes[theme].colors;const products=useProducts();
 return <section className="relative isolate overflow-hidden px-4 py-16 transition-colors duration-500 sm:px-6 sm:py-20" style={{background:`linear-gradient(135deg, ${colors.card} 0%, ${colors.background} 46%, ${colors.actionSecondary} 140%)`,color:colors.foreground}}>
  <div className="pointer-events-none absolute -left-32 -top-40 -z-20 h-96 w-96 rounded-full opacity-15 blur-3xl" style={{background:colors.primary}} aria-hidden="true"/>
  <div className="pointer-events-none absolute -bottom-48 right-1/4 -z-20 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl" style={{background:colors.actionSecondary}} aria-hidden="true"/>
  <div className="pointer-events-none absolute right-0 top-0 -z-10 hidden h-[205px] w-[720px] overflow-hidden lg:block" aria-hidden="true"><img src="/images/ivy-daisy-category-header.png" alt="" className="absolute right-0 top-0 h-auto w-[720px] opacity-90 saturate-110 contrast-105" style={{filter:`drop-shadow(-6px 9px 10px ${colors.primary}30)`}}/></div>
  <div className="relative z-10 mx-auto max-w-7xl">
  <div className="flex flex-wrap items-end justify-between gap-7">
   <div><p className="inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[.24em]" style={{background:colors.actionSecondary,color:colors.actionSecondaryText}}>Her ana bir çiçek</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Aradığın duyguyu keşfet</h2><div className="mt-3 h-1 w-20 rounded-full" style={{background:`linear-gradient(90deg, ${colors.primary}, ${colors.accent})`}}/><p className="mt-4 max-w-xl text-sm font-semibold sm:text-base" style={{color:colors.muted}}>Kutlamadan özre, sevgiden teşekküre… Her duygunun çiçeğini senin için bir araya getirdik.</p></div>
   <CustomerStories />
  </div>
  <div className="mt-9 grid auto-rows-[190px] gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[205px]">
   {categories.map((category,index)=>{const items=index===0?[...products].sort((a,b)=>b.rating-a.rating):products.filter(product=>product.category===category.name);const image=items[0]?.image||products[index%Math.max(products.length,1)]?.image||"/images/renkli-bahce.jpg";const count=index===0?Math.min(products.length,8):items.length;return <Link key={category.slug} href={`/kategori/${category.slug}`} className={`group relative isolate overflow-hidden rounded-[28px] border-2 shadow-lg transition duration-300 hover:-translate-y-1 ${index===0?"sm:col-span-2 lg:col-span-2 lg:row-span-2":""}`} style={{borderColor:colors.cardBorder,boxShadow:`0 14px 35px ${colors.primary}2b`}}><img src={image} alt={category.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"/><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5 transition group-hover:from-black/80"/>{index===0&&<span className="absolute left-5 top-5 rounded-full px-3 py-1.5 text-xs font-black" style={{background:colors.actionPrimary,color:colors.actionPrimaryText}}>⭐ FlorioTR Seçkisi</span>}<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-wider text-white/65">{count} ürün</p><h3 className={`${index===0?"mt-2 text-2xl sm:text-3xl":"mt-1 text-xl"} font-black leading-tight text-white`}>{category.name}</h3><p className={`${index===0?"block":"hidden xl:block"} mt-2 text-sm font-semibold text-white/70`}>{category.description}</p></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl transition group-hover:translate-x-1" style={{borderColor:colors.cardBorder,background:colors.actionPrimary,color:colors.actionPrimaryText}}>→</span></div></div></Link>})}
  </div>
 </div></section>;
}
