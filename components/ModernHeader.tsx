"use client";
import Link from "next/link";
import { useState } from "react";

const links = [["Çiçekler","/kategori/buketler"],["Yakınımdakiler","/yakinimdakiler"],["Siparişlerim","/siparislerim"]];

export default function ModernHeader() {
  const [open,setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-black/5 bg-[#fbfaf7]/95 text-[#183128] backdrop-blur">
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
      <Link href="/" className="flex items-center gap-2 text-2xl font-black"><span className="text-[#b08342]">✿</span> FlorioTR</Link>
      <nav className="hidden items-center gap-7 md:flex">{links.map(([label,href]) => <Link key={href} href={href} className="text-sm font-bold hover:text-[#9d7339]">{label}</Link>)}</nav>
      <div className="hidden items-center gap-2 md:flex"><Link href="/favoriler" className="rounded-full px-4 py-3 text-sm font-bold">Favoriler</Link><Link href="/sepet" className="rounded-full bg-[#173c31] px-5 py-3 text-sm font-bold text-white">Sepet</Link></div>
      <button type="button" aria-label="Menüyü aç veya kapat" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-11 w-11 place-items-center rounded-full border md:hidden">{open ? "×" : "☰"}</button>
    </div>
    {open && <nav className="border-t bg-[#fbfaf7] px-5 py-4 md:hidden">{links.map(([label,href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b py-3 font-bold">{label}</Link>)}<div className="mt-4 grid grid-cols-2 gap-3"><Link href="/favoriler" className="rounded-xl border p-3 text-center font-bold">Favoriler</Link><Link href="/sepet" className="rounded-xl bg-[#173c31] p-3 text-center font-bold text-white">Sepet</Link></div></nav>}
  </header>;
}
