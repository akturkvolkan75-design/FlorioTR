"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";
import FeaturedFlowers from "./FeaturedFlowers";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


export default function ProductSection() {

  const products = useProducts();
  const [activeFilter, setActiveFilter] = useState<"all" | "popular" | "new" | "special">("all");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sort, setSort] = useState("recommended");

  const { theme } = useTheme();
  const colors = themes[theme].colors;
  const isNightTheme = theme === "geceBahcesi";
  const tabProducts = activeFilter === "popular"
    ? products.filter((product) => product.rating >= 4.8)
    : activeFilter === "new"
      ? products.slice(-4).reverse()
      : activeFilter === "special"
        ? products.filter((product) => product.vip || product.category === "Düğün Sepetleri" || product.category === "Çelenkler")
        : products;
  const categories = Array.from(new Set(products.map((product) => product.category))).sort((a, b) => a.localeCompare(b, "tr"));
  const filteredProducts = tabProducts
    .filter((product) => !search.trim() || `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("tr-TR").includes(search.trim().toLocaleLowerCase("tr-TR")))
    .filter((product) => category === "all" || product.category === category)
    .filter((product) => maxPrice === "all" || product.price <= Number(maxPrice))
    .sort((a, b) => sort === "priceAsc" ? a.price - b.price : sort === "priceDesc" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : 0);

  function clearFilters() {
    setActiveFilter("all");
    setSearch("");
    setCategory("all");
    setMaxPrice("all");
    setSort("recommended");
  }

  const filters = [
    { id: "all" as const, label: "Tüm Çiçekler", icon: "🌸" },
    { id: "popular" as const, label: "En Sevilenler", icon: "♥" },
    { id: "new" as const, label: "Yeni Gelenler", icon: "✨" },
    { id: "special" as const, label: "Özel Günler", icon: "🎁" },
  ];


  return (


    <section

      id="koleksiyon"

      className="
      mx-auto
      max-w-7xl
      px-6
      py-20
      "

    >




      <div

        className="
        text-center
        "

      >



        <h2

          className="
          text-4xl
          font-extrabold
          md:text-5xl
          "

          style={{

            color: isNightTheme ? "#C8A45D" : colors.primary,

            textShadow:
            isNightTheme ? "0 3px 15px rgba(0,0,0,.7)" : "none"

          }}

        >

          🌸 FlorioTR Çiçek Koleksiyonu


        </h2>







        <p

          className="
          mx-auto
          mt-5
          max-w-2xl
          text-base
          font-medium
          leading-relaxed
          "

          style={{


            color: colors.muted,

            textShadow:
            isNightTheme ? "0 2px 10px rgba(0,0,0,.8)" : "none"


          }}

        >

          Sevdiklerinize özel anlar için
          özenle hazırlanan zarif çiçek tasarımları.


        </p>




      </div>

      <div className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-3" role="group" aria-label="Ürünleri filtrele">
        {filters.map((filter) => {
          const active = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={active}
              className="rounded-full border-2 px-5 py-2.5 text-sm font-black shadow-sm transition hover:-translate-y-0.5"
              style={{
                background: active ? colors.actionPrimary : colors.card,
                borderColor: active ? colors.actionPrimary : colors.cardBorder,
                color: active ? colors.actionPrimaryText : colors.foreground,
                boxShadow: active ? `0 8px 22px ${colors.actionPrimary}35` : "none",
              }}
            >
              <span aria-hidden="true">{filter.icon}</span> {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-7 grid max-w-5xl gap-3 rounded-[28px] border-2 p-4 shadow-lg sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]" style={{background:colors.card,borderColor:colors.cardBorder,boxShadow:`0 14px 34px ${colors.primary}18`}}>
        <label className="relative block">
          <span className="sr-only">Ürün ara</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true">⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Çiçek veya ürün ara" className="h-12 w-full rounded-2xl border-2 bg-transparent pl-11 pr-4 text-sm font-bold outline-none transition focus:ring-2" style={{borderColor:colors.cardBorder,color:colors.foreground}} />
        </label>
        <label><span className="sr-only">Kategori seç</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 w-full rounded-2xl border-2 px-3 text-sm font-bold outline-none" style={{background:colors.secondary,borderColor:colors.cardBorder,color:colors.foreground}}><option value="all">Tüm kategoriler</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span className="sr-only">Fiyat sınırı seç</span><select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-12 w-full rounded-2xl border-2 px-3 text-sm font-bold outline-none" style={{background:colors.secondary,borderColor:colors.cardBorder,color:colors.foreground}}><option value="all">Tüm fiyatlar</option><option value="750">750 TL&apos;ye kadar</option><option value="1000">1.000 TL&apos;ye kadar</option><option value="1500">1.500 TL&apos;ye kadar</option><option value="2500">2.500 TL&apos;ye kadar</option></select></label>
        <label><span className="sr-only">Ürünleri sırala</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-12 w-full rounded-2xl border-2 px-3 text-sm font-bold outline-none" style={{background:colors.secondary,borderColor:colors.cardBorder,color:colors.foreground}}><option value="recommended">Önerilen sıralama</option><option value="rating">En yüksek puan</option><option value="priceAsc">Fiyat: düşükten yükseğe</option><option value="priceDesc">Fiyat: yüksekten düşüğe</option></select></label>
        <button type="button" onClick={clearFilters} className="h-12 rounded-2xl px-4 text-sm font-black transition hover:-translate-y-0.5" style={{background:colors.actionSecondary,color:colors.actionSecondaryText}}>Temizle</button>
      </div>

      <FeaturedFlowers />

      <div className="mt-6 text-center">
        <p className="text-xs font-black uppercase tracking-[.24em]" style={{color:colors.accent}}>Tüm koleksiyon</p>
        <h3 className="mt-2 text-3xl font-black" style={{color:colors.primary}}>Sana uygun çiçekleri keşfet</h3>
        <p className="mt-3 text-sm font-bold" style={{color:colors.muted}}>{filteredProducts.length} ürün gösteriliyor</p>
      </div>








      <div

        className="
        mt-14
        grid
        gap-8
        sm:grid-cols-2
        lg:grid-cols-4
        "

      >




        {

          filteredProducts.map((product)=>(



            <ProductCard

              key={product.id}

              product={product}

            />



          ))

        }





      </div>

      {filteredProducts.length === 0 && <div className="mx-auto mt-10 max-w-xl rounded-[28px] border-2 p-9 text-center shadow-lg" style={{background:colors.card,borderColor:colors.cardBorder}}><div className="text-4xl" aria-hidden="true">🌿</div><h3 className="mt-4 text-xl font-black">Aradığın özelliklerde ürün bulunamadı</h3><p className="mt-2 font-medium" style={{color:colors.muted}}>Arama kelimesini veya seçtiğin filtreleri değiştirebilirsin.</p><button type="button" onClick={clearFilters} className="mt-5 rounded-full px-6 py-3 font-black" style={{background:colors.actionPrimary,color:colors.actionPrimaryText}}>Filtreleri temizle</button></div>}





    </section>


  );

}
