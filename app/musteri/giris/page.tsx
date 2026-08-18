"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register" | "verify" | "reset-request" | "reset-confirm";
const emptySecrets = { password: "", passwordConfirm: "", code: "" };

export default function MusteriGirisPage() {
  const [mode, setMode] = useState<Mode>("register");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", ...emptySecrets });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const needsPassword = ["register", "login", "reset-confirm"].includes(mode);
  const needsCode = ["verify", "reset-confirm"].includes(mode);
  const action = mode === "reset-request" ? "password-reset-request" : mode === "reset-confirm" ? "password-reset-confirm" : mode;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "reset") setMode("reset-request");
    else if (params.has("next")) setMode("login");
  }, []);

  function changeMode(nextMode: Mode) {
    setMode(nextMode); setMessage(""); setShowPassword(false);
    setForm((current) => ({ ...current, ...emptySecrets }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage("");
    if (mode === "reset-confirm" && form.password !== form.passwordConfirm) { setMessage("Yazdığınız iki şifre aynı değil."); return; }
    setLoading(true);
    const response = await fetch("/api/musteri/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, ...form, code: mode === "reset-request" ? "" : form.code }) });
    const data = await response.json(); setLoading(false);
    if (!data.success) { setMessage(data.message || "İşlem tamamlanamadı."); return; }
    if (data.verificationRequired) { setForm((current) => ({ ...current, ...emptySecrets })); setMode("verify"); setMessage(data.developmentCode ? `Test doğrulama kodunuz: ${data.developmentCode}` : data.message); return; }
    if (data.passwordResetRequired) { setForm((current) => ({ ...current, ...emptySecrets })); setMode("reset-confirm"); setMessage(data.message); return; }
    window.dispatchEvent(new Event("floriotr-auth-changed"));
    router.replace(new URLSearchParams(window.location.search).get("next") || "/"); router.refresh();
  }

  const title = mode === "register" ? "Aramıza Katıl" : mode === "login" ? "Tekrar Hoş Geldin" : mode === "verify" ? "E-postanı Doğrula" : mode === "reset-request" ? "Şifreni Yenile" : "Yeni Şifre Belirle";
  const buttonText = loading ? "Lütfen bekleyin..." : mode === "register" ? "Kayıt Ol ve Kod Gönder" : mode === "verify" ? "E-postamı Doğrula" : mode === "reset-request" ? "Şifre Kodunu Gönder" : mode === "reset-confirm" ? "Yeni Şifremi Kaydet" : "Giriş Yap";

  return <main className="min-h-screen bg-[#f5f2eb] px-4 py-8 text-[#123f34] sm:py-12"><div className="mx-auto max-w-md overflow-hidden rounded-[32px] bg-white shadow-xl">
    <div className="bg-[#123f34] p-6 text-center" style={{color:"white"}}><p className="text-xs font-black uppercase tracking-[.2em]" style={{color:"#efc979"}}>FlorioTR</p><h1 className="mt-2 text-3xl font-black">{title}</h1><p className="mt-2 text-sm opacity-70">{needsCode ? `${form.email} adresine gönderilen güvenlik kodunu kullan.` : mode === "reset-request" ? "Hesabındaki e-posta adresine güvenli bir kod göndereceğiz." : "Siparişlerini tek hesapta güvenle takip et."}</p></div>
    <form onSubmit={submit} className="p-6">
      {mode === "register" && <><input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Ad soyad" className="mb-3 w-full rounded-xl border p-3.5"/><input required type="tel" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="Telefon" className="mb-3 w-full rounded-xl border p-3.5"/></>}
      {!needsCode && <input required type="email" autoComplete="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="E-posta adresi" className="mb-3 w-full rounded-xl border p-3.5"/>}
      {needsCode && <label className="mb-4 block"><span className="mb-2 block text-sm font-black">1. E-postana gelen 6 haneli kod</span><input key={`${mode}-fresh-code`} required name="floriotr-fresh-code" autoComplete="off" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={form.code} onChange={(e)=>setForm({...form,code:e.target.value.replace(/\D/g,"")})} placeholder="000000" className="w-full rounded-xl border p-4 text-center text-3xl font-black tracking-[.35em]"/></label>}
      {needsPassword && <label className="block"><span className="mb-2 block text-sm font-black">{mode === "reset-confirm" ? "2. Yeni şifren" : "Şifren"}</span><div className="relative"><input required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} type={showPassword?"text":"password"} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="En az 8 karakter" className="w-full rounded-xl border p-3.5 pr-14"/><button type="button" onClick={()=>setShowPassword((current)=>!current)} className="absolute inset-y-0 right-2 px-3 text-xl" aria-label={showPassword?"Şifreyi gizle":"Şifreyi göster"}>{showPassword?"🙈":"👁️"}</button></div></label>}
      {mode === "reset-confirm" && <label className="mt-4 block"><span className="mb-2 block text-sm font-black">3. Yeni şifreni tekrar yaz</span><input required minLength={8} autoComplete="new-password" type={showPassword?"text":"password"} value={form.passwordConfirm} onChange={(e)=>setForm({...form,passwordConfirm:e.target.value})} placeholder="Yeni şifreyi tekrar yaz" className="w-full rounded-xl border p-3.5"/><p className="mt-2 text-xs font-bold opacity-65">Şifren en az 8 karakter olmalı ve iki alan aynı olmalı.</p></label>}
      {mode === "login" && <button type="button" onClick={()=>changeMode("reset-request")} className="mt-3 text-sm font-black text-[#8b6429]">Şifremi unuttum / değiştirmek istiyorum</button>}
      {message && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-sm font-bold text-amber-800">{message}</p>}
      <button type="submit" disabled={loading} style={{backgroundColor:"#123f34",color:"#fff",borderColor:"#efc979"}} className="mt-4 w-full rounded-full border-2 py-4 text-lg font-black shadow-lg disabled:opacity-50"><span style={{color:"#fff"}}>{buttonText}</span></button>
    </form>
    <div className="border-t bg-[#faf9f6] p-4 text-center text-sm font-bold">{!needsCode && <button type="button" onClick={()=>changeMode(mode === "register" ? "login" : "register")} className="text-[#8b6429]">{mode === "register" ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Kayıt ol"}</button>}<div><Link href="/" className="mt-2 inline-block text-slate-500">← Alışverişe dön</Link></div></div>
  </div></main>;
}
