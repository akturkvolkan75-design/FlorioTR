"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assignFlorist } from "@/lib/orderAssign";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";
import SavedAddressPicker from "@/components/order/SavedAddressPicker";

export default function SiparisPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  const [authChecking, setAuthChecking] = useState(true);

  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    senderName: "",
    senderPhone: "",
    email: "",
    identityNumber: "",
    city: "İstanbul",
    district: "",
    address: "",
    flowerNote: "",
    customerNote: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    fetch("/api/musteri/auth")
      .then((response) => response.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/musteri/giris?next=/siparis");
        } else {
          setForm((current) => ({
            ...current,
            senderName: current.senderName || data.customer.name,
            senderPhone: current.senderPhone || data.customer.phone,
            email: current.email || data.customer.email,
          }));

          setAuthChecking(false);
        }
      });
  }, [router]);

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f2eb] font-black text-[#123f34]">
        Müşteri hesabı kontrol ediliyor...
      </main>
    );
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function submitOrder() {
    const florist = assignFlorist(form.district);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (
      !form.receiverName.trim() ||
      !form.receiverPhone.trim() ||
      !form.senderName.trim() ||
      !form.senderPhone.trim() ||
      !form.email.trim() ||
      !form.identityNumber.trim() ||
      !form.date ||
      !form.time ||
      form.time === "Saat Seçiniz" ||
      !form.district ||
      form.district === "İlçe Seçiniz" ||
      !form.address.trim()
    ) {
      alert(
        "Lütfen alıcı, gönderici ve teslimat bilgilerini eksiksiz doldurun."
      );
      return;
    }

    if (!cart.length) {
      alert("Sipariş oluşturmak için sepete ürün ekleyin.");
      return;
    }

    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            receiverName: form.receiverName,
            receiverPhone: form.receiverPhone,
            senderName: form.senderName,
            senderPhone: form.senderPhone,
            email: form.email,
            identityNumber: form.identityNumber,
            city: form.city,
            district: form.district,
            address: form.address,
            customerNote: form.customerNote,
            recipientNote: form.flowerNote,
            deliveryDate: form.date,
            deliveryTimeSlot: form.time,
          },
          cart,
        }),
      });

      const data = await response.json();

      if (!data.success || !data.paymentPageUrl) {
        alert(data.message || "Sipariş oluşturulamadı.");
        return;
      }

      const order = {
        id: data.orderId || Date.now(),
        customer: form,
        products: cart,
        orderIds: [data.orderId],

        total: cart.reduce(
          (
            sum: number,
            item: {
              price: number;
              quantity: number;
            }
          ) => sum + item.price * item.quantity,
          0
        ),

        assignedFlorist: florist,
        status: "Yeni",
        createdAt: new Date().toLocaleDateString("tr-TR"),
      };

      localStorage.setItem("order", JSON.stringify(order));

      window.location.href = data.paymentPageUrl;
    } catch (error) {
      console.log(error);

      alert("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
    }
  }

  const inputStyle = {
    background: colors.background,
    color: colors.foreground,
    border: `1px solid ${colors.primary}`,
  };

  return (
    <main
      className="min-h-screen px-6 py-16"
      style={{
        background: colors.background,
      }}
    >
      <div
        className="mx-auto max-w-3xl rounded-[40px] p-8 shadow-2xl backdrop-blur-xl"
        style={{
          background: colors.secondary,
          border: `2px solid ${colors.primary}`,
        }}
      >
        <h1
          className="mb-10 text-center text-4xl font-extrabold"
          style={{
            color: colors.primary,
          }}
        >
          🌸 FlorioTR Sipariş
        </h1>

        <SavedAddressPicker
          onSelect={(address) =>
            setForm((current) => ({
              ...current,
              receiverName: address.receiverName,
              receiverPhone: address.receiverPhone,
              city: address.city,
              district: address.district,
              address: address.address,
            }))
          }
        />

        <section className="mb-10">
          <h2
            className="mb-5 text-xl font-bold"
            style={{
              color: colors.foreground,
            }}
          >
            👤 Alıcı Bilgileri
          </h2>

          <input
            name="receiverName"
            placeholder="Ad Soyad"
            value={form.receiverName}
            onChange={handleChange}
            className="mb-4 w-full rounded-2xl p-4 outline-none"
            style={inputStyle}
          />

          <input
            type="tel"
            name="receiverPhone"
            placeholder="Alıcı telefonu"
            value={form.receiverPhone}
            onChange={handleChange}
            className="w-full rounded-2xl p-4 outline-none"
            style={inputStyle}
          />
        </section>

        <section className="mb-10">
          <h2
            className="mb-5 text-xl font-bold"
            style={{
              color: colors.foreground,
            }}
          >
            🎁 Gönderici Bilgileri
          </h2>

          <input
            name="senderName"
            placeholder="Gönderici ad soyad"
            value={form.senderName}
            onChange={handleChange}
            className="mb-4 w-full rounded-2xl p-4 outline-none"
            style={inputStyle}
          />

          <input
            type="tel"
            name="senderPhone"
            placeholder="Gönderici telefonu"
            value={form.senderPhone}
            onChange={handleChange}
            className="w-full rounded-2xl p-4 outline-none"
            style={inputStyle}
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              type="email"
              name="email"
              placeholder="E-posta adresi"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl p-4 outline-none"
              style={inputStyle}
            />

            <input
              inputMode="numeric"
              maxLength={11}
              name="identityNumber"
              placeholder="T.C. kimlik numarası (iyzico için zorunlu)"
              value={form.identityNumber}
              onChange={handleChange}
              className="w-full rounded-2xl p-4 outline-none"
              style={inputStyle}
            />
          </div>

          <p className="mt-3 text-xs font-semibold opacity-70">
            Kimlik numarası yalnızca iyzico güvenli ödeme doğrulaması için
            kullanılır.
          </p>
        </section>

        <section className="mb-10">
          <h2
            className="mb-5 text-xl font-bold"
            style={{
              color: colors.foreground,
            }}
          >
            🚚 Teslimat Bilgileri
          </h2>

          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            className="mb-4 w-full rounded-2xl p-4"
            style={inputStyle}
          >
            <option>İlçe Seçiniz</option>
            <option>Kadıköy</option>
            <option>Beşiktaş</option>
            <option>Bakırköy</option>
            <option>Üsküdar</option>
            <option>Şişli</option>
            <option>Maltepe</option>
          </select>

          <textarea
            name="address"
            placeholder="Açık teslimat adresi"
            value={form.address}
            onChange={handleChange}
            className="h-32 w-full rounded-2xl p-4 outline-none"
            style={inputStyle}
          />
        </section>

        <section className="mb-10">
          <div className="mb-8">
            <h2
              className="text-xl font-bold"
              style={{
                color: colors.foreground,
              }}
            >
              💌 Alıcıya Kart Mesajı
            </h2>

            <p
              className="mt-2 text-sm font-semibold opacity-75"
              style={{
                color: colors.foreground,
              }}
            >
              Çiçeğin yanında alıcıya iletilmesini istediğiniz mesajı
              yazabilirsiniz.
            </p>

            <textarea
              name="flowerNote"
              placeholder="Örn: Seni çok seviyorum. İyi ki varsın ❤️"
              value={form.flowerNote}
              onChange={handleChange}
              className="mt-4 h-24 w-full rounded-2xl p-4 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <h2
              className="text-xl font-bold"
              style={{
                color: colors.foreground,
              }}
            >
              🌸 Çiçekçiye Özel Not
            </h2>

            <p
              className="mt-2 text-sm font-semibold opacity-75"
              style={{
                color: colors.foreground,
              }}
            >
              Çiçekçimizin bilmesini istediğiniz özel bir detayı buraya
              yazabilirsiniz.
            </p>

            <textarea
              name="customerNote"
              placeholder="Örn: Mümkünse açık pembe tonları ağırlıklı olsun."
              value={form.customerNote}
              onChange={handleChange}
              className="mt-4 h-24 w-full rounded-2xl p-4 outline-none"
              style={inputStyle}
            />
          </div>
        </section>

        <section className="mb-10">
          <h2
            className="mb-5 text-xl font-bold"
            style={{
              color: colors.foreground,
            }}
          >
            ⏰ Teslimat Zamanı
          </h2>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mb-4 w-full rounded-2xl p-4"
            style={inputStyle}
          />

          <select
            name="time"
            value={form.time}
            onChange={handleChange}
            className="w-full rounded-2xl p-4"
            style={inputStyle}
          >
            <option>Saat Seçiniz</option>
            <option>09:00 - 12:00</option>
            <option>12:00 - 15:00</option>
            <option>15:00 - 18:00</option>
            <option>18:00 - 21:00</option>
          </select>
        </section>

        <section>
          <h2
            className="mb-5 text-xl font-bold"
            style={{
              color: colors.foreground,
            }}
          >
            💳 Güvenli Kart Ödemesi
          </h2>

          <button
            onClick={submitOrder}
            className="w-full rounded-2xl py-5 text-lg font-extrabold transition hover:scale-105"
            style={{
              background: colors.primary,
              color: colors.background,
            }}
          >
            🔒 Kartla Güvenli Ödemeye Geç
          </button>
        </section>
      </div>
    </main>
  );
}