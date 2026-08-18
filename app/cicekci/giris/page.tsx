"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CicekciGirisPage(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [showReset,setShowReset]=useState(false);
  const [resetStep,setResetStep]=useState<"email"|"code">("email");
  const [resetForm,setResetForm]=useState({email:"",code:"",newPassword:"",confirmPassword:""});
  const [resetMessage,setResetMessage]=useState("");
  const [resetLoading,setResetLoading]=useState(false);

  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setLoading(true);setMessage("⏳ Giriş yapılıyor...");
    try{
      const response=await fetch("/api/cicekci/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const data=await response.json();
      if(data.success){localStorage.setItem("floriotr_shop",JSON.stringify(data.shop));setMessage("🌸 Giriş başarılı. Panel açılıyor...");router.push("/cicekci/panel");}
      else setMessage("❌ "+data.message);
    }catch{setMessage("❌ Sunucu hatası.");}finally{setLoading(false);}
  }

  async function handleReset(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setResetMessage("");
    if(resetStep==="code"&&resetForm.newPassword!==resetForm.confirmPassword){setResetMessage("Yeni şifreler aynı değil.");return;}
    setResetLoading(true);
    try{
      const response=await fetch("/api/cicekci/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:resetStep==="email"?"request":"confirm",email:resetForm.email,code:resetForm.code,newPassword:resetForm.newPassword})});
      const data=await response.json();setResetMessage(data.message||"İşlem tamamlanamadı.");
      if(data.success&&resetStep==="email")setResetStep("code");
      if(data.success&&resetStep==="code")setTimeout(()=>{setShowReset(false);setResetStep("email");setEmail(resetForm.email);},1200);
    }catch{setResetMessage("İşlem tamamlanamadı.");}finally{setResetLoading(false);}
  }

  return <main className="flex min-h-screen items-center justify-center bg-pink-50 p-5 text-slate-950">
    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl">
      <h1 className="text-center text-3xl font-black text-pink-600">🌸 FlorioTR Çiçekçi Girişi</h1>
      <p className="mt-2 text-center font-bold text-slate-600">Partner paneline giriş yapın</p>
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <input required type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="📧 E-posta" className="w-full rounded-xl border p-3.5 text-slate-950"/>
        <input required type="password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="🔒 Şifre" className="w-full rounded-xl border p-3.5 text-slate-950"/>
        <button disabled={loading} className="w-full rounded-xl bg-pink-600 p-4 font-black text-white disabled:opacity-50">{loading?"⏳ Bekleyin...":"🌸 Giriş Yap"}</button>
      </form>
      <button type="button" onClick={()=>{setShowReset(true);setResetStep("email");setResetForm({email,code:"",newPassword:"",confirmPassword:""});setResetMessage("")}} className="mt-4 w-full rounded-xl border-2 border-pink-300 bg-pink-50 p-3 font-black text-pink-800">🔐 Şifremi Unuttum / Yenile</button>
      {message&&<p className="mt-5 rounded-xl bg-slate-100 p-3 text-center font-black">{message}</p>}
    </div>

    {showReset&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><form onSubmit={handleReset} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-pink-600">FlorioTR Çiçekçi</p><h2 className="mt-1 text-2xl font-black">Şifreni Yenile</h2></div><button type="button" onClick={()=>setShowReset(false)} className="h-10 w-10 rounded-full bg-slate-100 font-black">✕</button></div>{resetStep==="email"?<label className="mt-6 block text-sm font-black">Kayıtlı e-posta<input required type="email" value={resetForm.email} onChange={event=>setResetForm({...resetForm,email:event.target.value})} className="mt-2 w-full rounded-xl border p-3"/></label>:<><p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900">E-postana gelen kodu ve yeni şifreni yaz.</p><label className="mt-4 block text-sm font-black">6 haneli kod<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={resetForm.code} onChange={event=>setResetForm({...resetForm,code:event.target.value.replace(/\D/g,"")})} className="mt-2 w-full rounded-xl border p-3 text-center text-2xl font-black tracking-[.3em]"/></label><label className="mt-4 block text-sm font-black">Yeni şifre<input required minLength={8} type="password" value={resetForm.newPassword} onChange={event=>setResetForm({...resetForm,newPassword:event.target.value})} className="mt-2 w-full rounded-xl border p-3"/></label><label className="mt-4 block text-sm font-black">Yeni şifreyi tekrar yaz<input required minLength={8} type="password" value={resetForm.confirmPassword} onChange={event=>setResetForm({...resetForm,confirmPassword:event.target.value})} className="mt-2 w-full rounded-xl border p-3"/></label></>}{resetMessage&&<p className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-sm font-black text-amber-900">{resetMessage}</p>}<button disabled={resetLoading} className="mt-5 w-full rounded-xl bg-pink-600 p-4 font-black text-white disabled:opacity-50">{resetLoading?"Lütfen bekleyin...":resetStep==="email"?"Kodu E-postama Gönder":"Yeni Şifremi Kaydet"}</button></form></div>}
  </main>;
}
