"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Customer = { name: string };

export default function CustomerAccount({ mobile = false }: { mobile?: boolean }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const pathname = usePathname();
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  useEffect(() => {
    function refreshCustomer() {
      fetch("/api/musteri/auth", { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => setCustomer(data.authenticated ? data.customer : null))
        .catch(() => setCustomer(null));
    }
    refreshCustomer();
    window.addEventListener("floriotr-auth-changed", refreshCustomer);
    return () => window.removeEventListener("floriotr-auth-changed", refreshCustomer);
  }, [pathname]);

  async function logout() {
    await fetch("/api/musteri/auth", { method: "DELETE" });
    setCustomer(null);
    window.location.href = "/";
  }

  if (!customer) return <Link href="/musteri/giris" className={`${mobile ? "w-full justify-center" : ""} flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`} style={{background:colors.actionPrimary,color:colors.actionPrimaryText,borderColor:"#d5a94f"}}><span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">👤</span><span>Giriş Yap / Kayıt Ol</span></Link>;

  return <div className={`${mobile ? "w-full" : ""} flex items-center gap-2 rounded-full border-2 p-1.5 pl-2 shadow-sm`} style={{background:colors.actionPrimary,borderColor:"#d5a94f",color:colors.actionPrimaryText}}>
    <Link href="/hesabim" className={`${mobile ? "flex-1" : ""} flex items-center gap-2 rounded-full px-2 py-1`}>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#efc979] text-[#123f34]">👤</span>
      <span className="leading-tight"><span className="block text-[10px] font-bold uppercase tracking-wider opacity-70">Hesabım</span><strong className="block max-w-28 truncate text-sm">{customer.name}</strong></span>
    </Link>
    <button onClick={logout} className="rounded-full bg-white/15 px-3 py-2 text-xs font-black transition hover:bg-white/25" title="Hesaptan çıkış yap">Çıkış</button>
  </div>;
}
