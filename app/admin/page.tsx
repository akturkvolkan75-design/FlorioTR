"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Shop = { id:number; shopName:string; owner:string; phone:string; email:string; city:string; district:string; status:string; totalOrders:number; deliveredOrders:number; cancelledOrders:number; activeOrders:number; productCount:number; averageRating:number|null; reviewCount:number };
type ProductReport = { id:number; slug:string; name:string; category:string; price:number; orderCount:number; averageRating:number|null; reviewCount:number };
type Review = { id:number; rating:number; comment:string|null; customerName:string; createdAt:string; productName:string; shopName:string|null };
type Dashboard = { totals:{ shops:number; pendingShops:number; orders:number; delivered:number; cancelled:number; revenue:number; successRate:number; lowRatingCount:number }; timeline:Array<{period:string;orders:number;delivered:number;cancelled:number;revenue:number}>; shops:Shop[]; products:ProductReport[]; reviews:Review[] };
type Period = "today"|"week"|"month"|"year"|"all"|"custom";
type RatingFilter = "all"|"low"|"medium"|"positive";

function dateValue(date:Date){ return date.toISOString().slice(0,10); }
function periodRange(period:Period){
  const now=new Date(); const end=dateValue(now); const start=new Date(now);
  if(period==="all") return {start:"",end:""};
  if(period==="week") start.setDate(now.getDate()-6);
  if(period==="month") start.setDate(1);
  if(period==="year") start.setMonth(0,1);
  return {start:dateValue(start),end};
}

export default function AdminDashboardPage(){
  const firstRange=periodRange("month");
  const [data,setData]=useState<Dashboard|null>(null);
  const [tab,setTab]=useState<"shops"|"products"|"reviews"|"lowRatings">("shops");
  const [ratingFilter,setRatingFilter]=useState<RatingFilter>("all");
  const [selectedShopId,setSelectedShopId]=useState<number|null>(null);
  const [selectedShopName,setSelectedShopName]=useState("");
  const [period,setPeriod]=useState<Period>("month");
  const [startDate,setStartDate]=useState(firstRange.start);
  const [endDate,setEndDate]=useState(firstRange.end);
  const router=useRouter();

  async function loadDashboard(start=startDate,end=endDate,shopId=selectedShopId){
    const params=new URLSearchParams();
    if(start&&end){params.set("start",start);params.set("end",end);}
    if(shopId)params.set("shopId",String(shopId));
    const query=params.size?`?${params.toString()}`:"";
    const response=await fetch(`/api/admin/dashboard${query}`,{cache:"no-store"});
    if(response.status===401){router.replace("/admin/giris");return;}
    const result=await response.json(); if(result.success)setData(result);
  }
  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDashboard(firstRange.start,firstRange.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  function choosePeriod(next:Period){
    setPeriod(next); if(next==="custom")return;
    const range=periodRange(next); setStartDate(range.start);setEndDate(range.end);void loadDashboard(range.start,range.end);
  }
  function openShop(shop:Shop){setSelectedShopId(shop.id);setSelectedShopName(shop.shopName);setTab("products");void loadDashboard(startDate,endDate,shop.id);}
  function closeShop(){setSelectedShopId(null);setSelectedShopName("");setTab("shops");void loadDashboard(startDate,endDate,null);}
  async function updateShopStatus(id:number,status:string){
    const response=await fetch("/api/admin/cicekci",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});
    if(response.ok)await loadDashboard();
  }
  async function logout(){await fetch("/api/admin/auth",{method:"DELETE"});router.replace("/admin/giris");}

  if(!data)return <main className="min-h-screen bg-[#f5f2eb] p-10 text-center font-black text-[#123f34]">Yönetim paneli hazırlanıyor...</main>;
  const cards=[
    ["Çiçekçiler",data.totals.shops,"bg-blue-100 text-blue-950"],
    ["Onay Bekleyen",data.totals.pendingShops,"bg-amber-100 text-amber-950"],
    ["Sipariş",data.totals.orders,"bg-violet-100 text-violet-950"],
    ["Teslim",data.totals.delivered,"bg-emerald-100 text-emerald-950"],
    ["İptal",data.totals.cancelled,"bg-red-100 text-red-950"],
    ["Satış",`${data.totals.revenue.toLocaleString("tr-TR")} TL`,"bg-cyan-100 text-cyan-950"],
    ["Başarı",`%${data.totals.successRate}`,"bg-lime-100 text-lime-950"],
    ...(selectedShopId?[["Düşük Puan",data.totals.lowRatingCount,"bg-orange-100 text-orange-950"]]:[]),
  ];
  const filteredReviews=data.reviews.filter(review=>ratingFilter==="all"||(ratingFilter==="low"&&review.rating<=2)||(ratingFilter==="medium"&&review.rating===3)||(ratingFilter==="positive"&&review.rating>=4));
  return <main className="min-h-screen bg-[#f5f2eb] p-4 text-slate-950 sm:p-6"><div className="mx-auto max-w-[1700px]">
    <div className="rounded-3xl bg-[#123f34] p-5 text-white shadow-lg sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div>{selectedShopId&&<button onClick={closeShop} className="mb-1 text-sm font-black text-[#efc979]">← Tüm Çiçekçiler</button>}<p className="text-xs font-black uppercase tracking-[.22em] text-[#efc979]">FlorioTR Operasyon Merkezi</p><h1 className="mt-1 text-2xl font-black sm:text-3xl">{selectedShopId?selectedShopName:"Yönetici Paneli"}</h1>{selectedShopId?<p className="mt-1 text-sm font-bold text-white/65">Çiçekçiye özel performans raporu</p>:<p className="mt-1 text-sm font-bold text-white/65">Başvurular, siparişler ve satış performansı tek ekranda</p>}</div><button onClick={logout} className="rounded-full border border-white/25 bg-white/10 px-5 py-3 font-black text-white hover:bg-white/15">Çıkış Yap</button></div></div>

    <section className="mt-4 rounded-2xl border bg-white p-4 shadow-sm"><div className="flex flex-wrap gap-2">
      {([['today','Bugün'],['week','7 Gün'],['month','Bu Ay'],['year','Bu Yıl'],['all','Tüm Zamanlar'],['custom','Özel Tarih']] as const).map(([id,label])=><button key={id} onClick={()=>choosePeriod(id)} className={`rounded-xl px-4 py-2 font-black ${period===id?'bg-[#123f34] text-white':'bg-slate-100 text-slate-700'}`}>{label}</button>)}
    </div>{period==="custom"&&<div className="mt-4 flex flex-wrap items-end gap-3"><label className="text-sm font-bold">Başlangıç<input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="mt-1 block rounded-lg border p-2"/></label><label className="text-sm font-bold">Bitiş<input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="mt-1 block rounded-lg border p-2"/></label><button onClick={()=>void loadDashboard()} disabled={!startDate||!endDate} className="rounded-xl bg-blue-950 px-5 py-2.5 font-black text-white disabled:opacity-40">Raporu Getir</button></div>}</section>

    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-7">{cards.map(([label,value,style])=><div key={String(label)} className={`rounded-2xl p-5 shadow-sm ${style}`}><p className="text-sm font-black">{label}</p><p className="mt-2 text-3xl font-black">{value}</p></div>)}</section>

    {data.timeline.length>0&&<section className="mt-5 rounded-2xl bg-white p-5 shadow-sm"><h2 className="font-black">Dönem Hareketleri</h2><div className="mt-4 flex items-end gap-2 overflow-x-auto pb-2">{data.timeline.map(day=>{const max=Math.max(...data.timeline.map(item=>item.orders),1);return <div key={day.period} className="min-w-16 text-center"><div className="mx-auto w-9 rounded-t-lg bg-blue-600" style={{height:`${Math.max(12,(day.orders/max)*100)}px`}} title={`${day.orders} sipariş`}/><p className="mt-2 text-xs font-bold">{day.period.slice(5)}</p><p className="text-xs text-slate-500">{day.orders}</p></div>})}</div></section>}

    <nav className="mt-6 flex flex-wrap gap-2">{(selectedShopId?([['products','Aldığı Ürünler'],['reviews','Puanlar & Yorumlar'],['lowRatings','Düşük Puanlar']] as const):([['shops','Çiçekçiler'],['products','Ürünler'],['reviews','Puanlar & Yorumlar']] as const)).map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={`rounded-xl px-5 py-3 font-black ${tab===id?'bg-[#123f34] text-white':'bg-white text-slate-800'}`}>{label}</button>)}</nav>

    {tab==="shops"&&<section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{data.shops.map(shop=>{const completion=shop.totalOrders?Math.round(shop.deliveredOrders/shop.totalOrders*100):0;return <article key={shop.id} onClick={()=>openShop(shop)} className="cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"><div className="flex justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-lg font-black">{shop.shopName}</h2><p className="truncate text-sm font-bold text-slate-600">{shop.owner} • {shop.city}/{shop.district}</p><p className="truncate text-xs text-slate-500">{shop.email}</p></div><span className="h-fit shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black">{shop.status}</span></div><div className="mt-3 grid grid-cols-4 gap-2">{[['Sipariş',shop.totalOrders],['Teslim',shop.deliveredOrders],['Başarı',`%${completion}`],['Puan',shop.averageRating?`⭐${shop.averageRating.toFixed(1)}`:'—']].map(([label,value])=><div key={String(label)} className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] font-black text-slate-500">{label}</p><p className="text-sm font-black">{value}</p></div>)}</div><div className="mt-3 flex items-center justify-between"><span className="text-xs font-black text-blue-800">Detayı aç →</span><div className="flex gap-1.5" onClick={event=>event.stopPropagation()}>{shop.status==='Onay Bekliyor'&&<><button onClick={()=>updateShopStatus(shop.id,'Onaylandı')} className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-black text-white">Onayla</button><button onClick={()=>updateShopStatus(shop.id,'Reddedildi')} className="rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-black text-white">Reddet</button></>}{shop.status==='Onaylandı'&&<button onClick={()=>updateShopStatus(shop.id,'Durduruldu')} className="rounded-md bg-slate-700 px-2.5 py-1.5 text-xs font-black text-white">Durdur</button>}{(shop.status==='Durduruldu'||shop.status==='Reddedildi')&&<button onClick={()=>updateShopStatus(shop.id,'Onaylandı')} className="rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-black text-white">Tekrar Aç</button>}</div></div></article>})}</section>}

    {tab==="products"&&<section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.products.filter(product=>!selectedShopId||product.orderCount>0||product.reviewCount>0).map(product=><article key={product.id} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-black text-blue-700">{product.category}</p><h2 className="mt-1 text-lg font-black">{product.name}</h2><div className="mt-4 flex justify-between font-bold"><span>{product.orderCount} sipariş</span><span>{product.averageRating?`⭐ ${product.averageRating.toFixed(1)} (${product.reviewCount})`:'Henüz puan yok'}</span></div></article>)}</section>}
    {tab==="reviews"&&<section className="mt-4"><div className="mb-3 flex flex-wrap gap-2">{([['all','Tümü'],['low','1–2 Yıldız'],['medium','3 Yıldız'],['positive','4–5 Yıldız']] as const).map(([id,label])=><button key={id} onClick={()=>setRatingFilter(id)} className={`rounded-xl px-4 py-2 text-sm font-black ${ratingFilter===id?'bg-blue-950 text-white':'border bg-white text-slate-700'}`}>{label}</button>)}</div><div className="space-y-3">{filteredReviews.length?filteredReviews.map(review=><article key={review.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex justify-between gap-3"><div><h2 className="font-black">{review.productName}</h2><p className="text-sm font-bold text-slate-500">{review.shopName||'Çiçekçi atanmamış'} • {review.customerName}</p></div><span>{'⭐'.repeat(review.rating)}</span></div><p className="mt-3">{review.comment||'Yorum yazılmadı.'}</p><p className="mt-2 text-xs font-bold text-emerald-700">✓ Doğrulanmış Alışveriş</p></article>):<div className="rounded-2xl bg-white p-10 text-center font-bold">Bu puan aralığında değerlendirme yok.</div>}</div></section>}
    {tab==="lowRatings"&&<section className="mt-4 space-y-3">{data.reviews.filter(review=>review.rating<=2).length?data.reviews.filter(review=>review.rating<=2).map(review=><article key={review.id} className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5"><div className="flex justify-between gap-3"><div><h2 className="font-black text-orange-950">{review.productName}</h2><p className="text-sm font-bold text-orange-800">{review.customerName}</p></div><span>{'⭐'.repeat(review.rating)}</span></div><p className="mt-3 font-medium">{review.comment||'Düşük puan verildi; açıklama yazılmadı.'}</p><p className="mt-2 text-xs font-black text-orange-800">1–2 yıldız uyarısı • Doğrulanmış alışveriş</p></article>):<div className="rounded-2xl bg-white p-10 text-center font-bold text-emerald-800">Bu dönemde düşük puan yok ✓</div>}</section>}
  </div></main>;
}
