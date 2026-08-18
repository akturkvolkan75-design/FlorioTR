"use client";

import { useState } from "react";

export default function FlowerShopRegisterPage() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setMessage("Başvurunuz gönderiliyor...");
    setMessageType("loading");

    const form = new FormData(e.currentTarget);

    const data = {
      shopName: form.get("shopName"),
      owner: form.get("owner"),
      phone: form.get("phone"),
      email: form.get("email"),
      password: form.get("password"),
      city: form.get("city"),
      district: form.get("district"),
      address: form.get("address"),
    };

    try {
      const res = await fetch("/api/cicekci/kayit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(
          "Başvurunuz başarıyla alındı. Yönetici onayı bekleniyor."
        );
        setMessageType("success");
      } else {
        setMessage(
          result.message || "Bir hata oluştu."
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Sunucuya bağlanılamadı. Lütfen tekrar deneyin."
      );
      setMessageType("error");
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-center text-3xl font-black text-pink-700">
          🌸 FlorioTR Partner Başvurusu
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            name="shopName"
            placeholder="🏪 Çiçekçi Adı"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <input
            name="owner"
            placeholder="👤 Yetkili Kişi"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <input
            name="phone"
            placeholder="📞 Telefon"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="📧 E-posta"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="🔒 Şifre"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <input
            name="city"
            placeholder="🌆 Şehir"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <input
            name="district"
            placeholder="📍 İlçe"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <textarea
            name="address"
            placeholder="📍 Açık Adres"
            className="w-full rounded-xl border border-slate-300 p-3 text-slate-900"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-pink-700 p-4 font-black text-white transition hover:bg-pink-800"
          >
            🌸 Başvuruyu Gönder
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 rounded-2xl border-2 p-5 text-center shadow-sm ${
              messageType === "success"
                ? "border-emerald-600 bg-emerald-50 text-emerald-950"
                : messageType === "error"
                ? "border-red-600 bg-red-50 text-red-950"
                : "border-amber-500 bg-amber-50 text-amber-950"
            }`}
          >
            <div className="text-2xl font-black">
              {messageType === "success"
                ? "✅ Başvurunuz Alındı"
                : messageType === "error"
                ? "❌ İşlem Başarısız"
                : "⏳ Lütfen Bekleyin"}
            </div>

            <p className="mt-2 text-base font-bold leading-6">
              {message}
            </p>

            {messageType === "success" && (
              <p className="mt-3 text-sm font-semibold">
                Başvurunuz onaylandığında çiçekçi hesabınızla giriş yapabilirsiniz.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}