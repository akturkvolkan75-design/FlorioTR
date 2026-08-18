"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

export default function AdminLoginPage() {
  const [needsSetup, setNeedsSetup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState<"email" | "code">("email");
  const [resetForm, setResetForm] = useState({ email: "", code: "", newPassword: "", confirmPassword: "" });
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated) router.replace("/admin");
        else setNeedsSetup(Boolean(data.needsSetup));
      });
  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: needsSetup ? "setup" : "login", email, password }),
    });
    const data = await response.json();
    if (!data.success) {
      setMessage(data.message || "Giriş yapılamadı.");
      return;
    }
    router.replace("/admin");
  }

  async function submitReset(event: FormEvent) {
    event.preventDefault();
    setResetMessage("");
    if (resetStep === "code" && resetForm.newPassword !== resetForm.confirmPassword) {
      setResetMessage("Yeni şifreler aynı değil.");
      return;
    }
    setResetLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: resetStep === "email" ? "reset-request" : "reset-confirm", email: resetForm.email, code: resetForm.code, newPassword: resetForm.newPassword }),
      });
      const data = await response.json();
      setResetMessage(data.message || "İşlem tamamlanamadı.");
      if (data.success && resetStep === "email") setResetStep("code");
      if (data.success && resetStep === "code") setTimeout(() => { setShowReset(false); setResetStep("email"); setEmail(resetForm.email); }, 1200);
    } catch {
      setResetMessage("İşlem tamamlanamadı.");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-14" style={{ background: colors.background, color: colors.foreground }}>
      <form onSubmit={submit} className="mx-auto max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: colors.card, border: `2px solid ${colors.cardBorder}` }}>
        <div className="text-center text-5xl">🛡️</div>
        <h1 className="mt-4 text-center text-3xl font-black" style={{ color: colors.primary }}>
          FlorioTR Yönetim Merkezi
        </h1>
        <p className="mt-3 text-center font-medium" style={{ color: colors.muted }}>
          {needsSetup ? "İlk yönetici hesabınızı oluşturun." : "Yönetici hesabınızla giriş yapın."}
        </p>

        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Yönetici e-postası" className="mt-7 w-full rounded-xl border p-4" />
        <input type="password" required minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre (en az 10 karakter)" className="mt-4 w-full rounded-xl border p-4" />
        {message && <p className="mt-4 rounded-xl bg-red-100 p-3 text-center font-bold text-red-800">{message}</p>}
        <button className="mt-6 w-full rounded-xl py-4 font-black" style={{ background: colors.actionPrimary, color: colors.actionPrimaryText }}>
          {needsSetup ? "Yönetici Hesabını Oluştur" : "Giriş Yap"}
        </button>
        {!needsSetup && <button type="button" onClick={() => { setShowReset(true); setResetStep("email"); setResetForm({ email, code: "", newPassword: "", confirmPassword: "" }); setResetMessage(""); }} className="mt-4 w-full rounded-xl border-2 border-slate-300 bg-white p-3 font-black text-slate-800">🔐 Şifremi Unuttum / Yenile</button>}
      </form>

      {showReset && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><form onSubmit={submitReset} className="w-full max-w-md rounded-3xl bg-white p-7 text-slate-950 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">FlorioTR Yönetim</p><h2 className="mt-1 text-2xl font-black">Yönetici Şifreni Yenile</h2></div><button type="button" onClick={() => setShowReset(false)} className="h-10 w-10 rounded-full bg-slate-100 font-black">✕</button></div>{resetStep === "email" ? <label className="mt-6 block text-sm font-black">Yönetici e-postası<input required type="email" value={resetForm.email} onChange={(event) => setResetForm({ ...resetForm, email: event.target.value })} className="mt-2 w-full rounded-xl border p-3" /></label> : <><p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-900">E-postana gelen kodu ve yeni yönetici şifreni yaz.</p><label className="mt-4 block text-sm font-black">6 haneli kod<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={resetForm.code} onChange={(event) => setResetForm({ ...resetForm, code: event.target.value.replace(/\D/g, "") })} className="mt-2 w-full rounded-xl border p-3 text-center text-2xl font-black tracking-[.3em]" /></label><label className="mt-4 block text-sm font-black">Yeni şifre<input required minLength={10} type="password" value={resetForm.newPassword} onChange={(event) => setResetForm({ ...resetForm, newPassword: event.target.value })} className="mt-2 w-full rounded-xl border p-3" placeholder="En az 10 karakter" /></label><label className="mt-4 block text-sm font-black">Yeni şifreyi tekrar yaz<input required minLength={10} type="password" value={resetForm.confirmPassword} onChange={(event) => setResetForm({ ...resetForm, confirmPassword: event.target.value })} className="mt-2 w-full rounded-xl border p-3" /></label></>}{resetMessage && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-sm font-black text-amber-900">{resetMessage}</p>}<button disabled={resetLoading} className="mt-5 w-full rounded-xl bg-emerald-800 p-4 font-black text-white disabled:opacity-50">{resetLoading ? "Lütfen bekleyin..." : resetStep === "email" ? "Kodu E-postama Gönder" : "Yeni Şifremi Kaydet"}</button></form></div>}
    </main>
  );
}
