"use client";

import { usePathname } from "next/navigation";
import FlorioLogo from "@/components/FlorioLogo";

export default function PanelBrand(){
  const pathname=usePathname();
  if(!pathname.startsWith("/admin"))return null;
  return <div className="border-b border-slate-700 bg-slate-950 px-4 py-2 text-white"><div className="mx-auto flex max-w-[1800px] items-center justify-between"><FlorioLogo primary="#ffffff" accent="#efc979" compact light/><span className="text-xs font-black uppercase tracking-[.18em] text-slate-400">Yönetim Merkezi</span></div></div>;
}
