"use client";

import { useEffect, useRef, useState } from "react";
import FlorioLogo from "@/components/FlorioLogo";

type OrderStatus =
  | "Yeni"
  | "Hazırlanıyor"
  | "Hazır"
  | "Kuryede"
  | "Teslim Edildi"
  | "İptal";

type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  city: string;
  district: string;
  address: string;
  customerNote?: string | null;
  recipientNote?: string | null;
  productName: string;
  quantity: number;
  price: number;
  paymentStatus: string;
  status: OrderStatus;
  preparationImage?: string | null;
  assignedAt?: string | null;
  deliveryDate?: string | null;
  deliveryTimeSlot?: string | null;
};

const statuses: OrderStatus[] = [
  "Yeni",
  "Hazırlanıyor",
  "Hazır",
  "Kuryede",
  "Teslim Edildi",
  "İptal",
];

function localDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function todayValue() {
  return localDateValue(new Date());
}

function tomorrowValue() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return localDateValue(date);
}

function formatDate(value: string) {
  if (!value) return "Tüm Tarihler";

  return new Date(`${value}T12:00:00`).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function statusStyle(status: OrderStatus, active: OrderStatus) {
  const isActive = status === active;

  if (!isActive) {
    return {
      backgroundColor: "#ffffff",
      color: "#111827",
      borderColor: "#475569",
      fontWeight: 900,
      opacity: 1,
    };
  }

  const styles: Record<
    OrderStatus,
    {
      backgroundColor: string;
      color: string;
      borderColor: string;
    }
  > = {
    Yeni: {
      backgroundColor: "#facc15",
      color: "#422006",
      borderColor: "#ca8a04",
    },
    Hazırlanıyor: {
      backgroundColor: "#c084fc",
      color: "#3b0764",
      borderColor: "#9333ea",
    },
    Hazır: {
      backgroundColor: "#2dd4bf",
      color: "#042f2e",
      borderColor: "#0f766e",
    },
    Kuryede: {
      backgroundColor: "#fb923c",
      color: "#431407",
      borderColor: "#ea580c",
    },
    "Teslim Edildi": {
      backgroundColor: "#4ade80",
      color: "#052e16",
      borderColor: "#16a34a",
    },
    İptal: {
      backgroundColor: "#f87171",
      color: "#450a0a",
      borderColor: "#dc2626",
    },
  };

  return {
    ...styles[status],
    fontWeight: 900,
    opacity: 1,
  };
}

export default function CicekciPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [selectedOrderIds, setSelectedOrderIds] =
    useState<number[]>([]);

  const [newOrderCount, setNewOrderCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const [statusFilter, setStatusFilter] =
    useState<OrderStatus | "Tümü">("Yeni");

  const [orderSearch, setOrderSearch] = useState("");

  const [selectedDate, setSelectedDate] =
    useState(todayValue());

  const [uploadingPhoto, setUploadingPhoto] =
    useState<number | null>(null);

  const [photoDraft, setPhotoDraft] = useState<{
    orderId: number;
    file: File;
    preview: string;
  } | null>(null);

  const [showPasswordChange, setShowPasswordChange] =
    useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const knownOrderIds = useRef<Set<number> | null>(null);
  const soundEnabledRef = useRef(false);

  const cleanOrderSearch = orderSearch
    .trim()
    .replace(/^#/, "")
    .toLocaleLowerCase("tr");

  const dateOrders = selectedDate
    ? orders.filter((order) => order.deliveryDate === selectedDate)
    : orders;

  const statusOrders =
    statusFilter === "Tümü"
      ? dateOrders
      : dateOrders.filter(
          (order) => order.status === statusFilter
        );

  const visibleOrders = cleanOrderSearch
    ? dateOrders.filter((order) =>
        /^\d+$/.test(cleanOrderSearch)
          ? String(order.id) === cleanOrderSearch
          : `${order.id} ${order.productName} ${order.customerName} ${order.customerPhone}`
              .toLocaleLowerCase("tr")
              .includes(cleanOrderSearch)
      )
    : statusOrders;

  function playNotificationSound() {
    try {
      const audioContext = new AudioContext();
      const now = audioContext.currentTime;

      const carrier = audioContext.createOscillator();
      const warmth = audioContext.createOscillator();
      const vibration = audioContext.createOscillator();

      const vibrationDepth = audioContext.createGain();
      const warmthGain = audioContext.createGain();
      const volume = audioContext.createGain();

      carrier.type = "triangle";
      carrier.frequency.setValueAtTime(340, now);

      warmth.type = "sine";
      warmth.frequency.setValueAtTime(680, now);

      vibration.type = "sine";
      vibration.frequency.setValueAtTime(18, now);

      vibrationDepth.gain.setValueAtTime(0.07, now);
      warmthGain.gain.setValueAtTime(0.08, now);

      volume.gain.setValueAtTime(0.24, now);
      volume.gain.setValueAtTime(0.24, now + 0.65);

      volume.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.82
      );

      vibration.connect(vibrationDepth);
      vibrationDepth.connect(volume.gain);

      warmth.connect(warmthGain);
      warmthGain.connect(volume);

      carrier.connect(volume);
      volume.connect(audioContext.destination);

      carrier.start(now);
      warmth.start(now);
      vibration.start(now);

      carrier.stop(now + 0.82);
      warmth.stop(now + 0.82);
      vibration.stop(now + 0.82);

      window.setTimeout(
        () => void audioContext.close(),
        1100
      );
    } catch (error) {
      console.log("Bildirim sesi oynatılamadı.", error);
    }
  }

  async function loadOrders(checkForNewOrders = false) {
    try {
      const shop = JSON.parse(
        localStorage.getItem("floriotr_shop") || "{}"
      );

      if (!shop.id) {
        window.location.replace("/cicekci/giris");
        return;
      }

      const response = await fetch(
        `/api/cicekci/orders?flowerShopId=${shop.id}`
      );

      const data = await response.json();

      if (data.success) {
        const incomingOrders = data.orders as Order[];

        if (
          checkForNewOrders &&
          knownOrderIds.current
        ) {
          const newOrders = incomingOrders.filter(
            (order) =>
              !knownOrderIds.current?.has(order.id)
          );

          if (newOrders.length) {
            setNewOrderCount(
              (current) => current + newOrders.length
            );

            document.title = `(${newOrders.length}) Yeni Sipariş • FlorioTR`;

            if (soundEnabledRef.current) {
              playNotificationSound();
            }
          }
        }

        knownOrderIds.current = new Set(
          incomingOrders.map((order) => order.id)
        );

        setOrders(incomingOrders);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedSoundPreference =
      localStorage.getItem("floriotr_order_sound") === "on";

    soundEnabledRef.current = savedSoundPreference;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSoundEnabled(savedSoundPreference);

    void loadOrders();

    const refreshTimer = window.setInterval(() => {
      void loadOrders(true);
    }, 15000);

    return () => window.clearInterval(refreshTimer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeStatus(
    id: number,
    status: OrderStatus
  ) {
    try {
      const shop = JSON.parse(
        localStorage.getItem("floriotr_shop") || "{}"
      );

      if (!shop.id) {
        alert("Çiçekçi bilgisi bulunamadı.");
        return;
      }

      const response = await fetch("/api/cicekci/orders", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id,
          status,
          flowerShopId: shop.id,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Durum güncellenemedi.");
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      );

      setSelectedOrder((current) =>
        current?.id === id
          ? { ...current, status }
          : current
      );
    } catch (error) {
      console.log(error);
      alert("Durum güncellenemedi.");
    }
  }

  async function changeAllStatuses(status: OrderStatus) {
    if (!selectedOrderIds.length) {
      alert("Önce işlem yapılacak siparişleri seçin.");
      return;
    }

    const approved = window.confirm(
      `${selectedOrderIds.length} siparişin durumu “${status}” olarak değiştirilsin mi?`
    );

    if (!approved) return;

    await Promise.all(
      orders
        .filter(
          (order) =>
            selectedOrderIds.includes(order.id) &&
            order.status !== status
        )
        .map((order) =>
          changeStatus(order.id, status)
        )
    );

    setSelectedOrderIds([]);
  }

  async function uploadPreparationPhoto(
    orderId: number,
    file: File
  ) {
    const shop = JSON.parse(
      localStorage.getItem("floriotr_shop") || "{}"
    );

    if (!shop.id) {
      alert(
        "Çiçekçi oturumunuz bulunamadı. Lütfen yeniden giriş yapın."
      );

      window.location.replace("/cicekci/giris");
      return;
    }

    const form = new FormData();

    form.set("orderId", String(orderId));
    form.set("flowerShopId", String(shop.id));
    form.set("image", file);

    setUploadingPhoto(orderId);

    try {
      const response = await fetch(
        "/api/cicekci/orders/photo",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Fotoğraf yüklenemedi.");
        return;
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                preparationImage: data.preparationImage,
              }
            : order
        )
      );

      setSelectedOrder((current) =>
        current?.id === orderId
          ? {
              ...current,
              preparationImage: data.preparationImage,
            }
          : current
      );

      if (photoDraft) {
        URL.revokeObjectURL(photoDraft.preview);
      }

      setPhotoDraft(null);

      alert(
        data.notificationSent
          ? "Fotoğraf yüklendi ve müşteriye e-posta bildirimi gönderildi."
          : "Fotoğraf yüklendi; müşteri sipariş ekranında görebilir."
      );
    } finally {
      setUploadingPhoto(null);
    }
  }

  function toggleOrderSelection(id: number) {
    setSelectedOrderIds((current) =>
      current.includes(id)
        ? current.filter(
            (orderId) => orderId !== id
          )
        : [...current, id]
    );
  }

  function acknowledgeNewOrders() {
    setNewOrderCount(0);
    document.title = "FlorioTR";
  }

  function toggleNotificationSound() {
    const nextValue = !soundEnabledRef.current;

    soundEnabledRef.current = nextValue;

    setSoundEnabled(nextValue);

    localStorage.setItem(
      "floriotr_order_sound",
      nextValue ? "on" : "off"
    );

    if (nextValue) {
      playNotificationSound();
    }
  }

  async function changePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordMessage("");

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage("Yeni şifreler aynı değil.");
      return;
    }

    const shop = JSON.parse(
      localStorage.getItem("floriotr_shop") || "{}"
    );

    if (!shop.id || !shop.email) {
      setPasswordMessage(
        "Güvenlik için panelden çıkıp tekrar giriş yapın."
      );
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        "/api/cicekci/password",
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            flowerShopId: shop.id,
            email: shop.email,
            currentPassword:
              passwordForm.currentPassword,
            newPassword:
              passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      setPasswordMessage(
        data.message ||
          (data.success
            ? "Şifreniz değiştirildi."
            : "Şifre değiştirilemedi.")
      );

      if (data.success) {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch {
      setPasswordMessage("Şifre değiştirilemedi.");
    } finally {
      setChangingPassword(false);
    }
  }

  function closeStatusMenu(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.currentTarget
      .closest("details")
      ?.removeAttribute("open");
  }

  function escapeHtml(value: unknown) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function printOrders(list: Order[]) {
    if (!list.length) {
      alert("Yazdırılacak sipariş bulunmuyor.");
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Yazdırma penceresi açılamadı.");
      return;
    }

    const ticketHtml = (order: Order) => `
      <div class="ticket">
        <div class="columns">

          <div class="box">
            <h3>ÜRÜN</h3>

            <strong>
              ${escapeHtml(order.productName)}
            </strong>

            <p>
              ${escapeHtml(order.quantity)} adet
            </p>

            <h3 class="section-title">
              TESLİMAT ZAMANI
            </h3>

            <p>
              ${
                order.deliveryDate
                  ? escapeHtml(
                      new Date(
                        `${order.deliveryDate}T12:00:00`
                      ).toLocaleDateString("tr-TR")
                    )
                  : "Tarih belirtilmedi"
              }
            </p>

            <p>
              ${escapeHtml(
                order.deliveryTimeSlot ||
                  "Saat belirtilmedi"
              )}
            </p>
          </div>

          <div class="box">
            <h3>MÜŞTERİ ÖZEL NOTU</h3>

            <p>
              ${escapeHtml(
                order.customerNote?.trim() || "—"
              )}
            </p>
          </div>

          <div class="box">
            <h3>ALICI / TESLİMAT</h3>

            <strong>
              ${escapeHtml(order.customerName)}
            </strong>

            <p>
              ☎ ${escapeHtml(order.customerPhone)}
            </p>

            <p>
              ${escapeHtml(order.city)}
              /
              ${escapeHtml(order.district)}
            </p>

            <p>
              ${escapeHtml(order.address)}
            </p>
          </div>

          <div class="box last message-box">
            <div class="message-decor">
              <div class="flower-line">
                ✿ · ❀ · ✿
              </div>

              <p class="message-text">
                ${escapeHtml(
                  order.recipientNote?.trim() ||
                    "Mesaj bulunmuyor."
                )}
              </p>

              <div class="flower-line flower-line-bottom">
                ✿ · ❀ · ✿
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>

      <html lang="tr">
        <head>
          <meta charset="UTF-8" />

          <title>
            FlorioTR Sipariş Çıktısı
          </title>

          <style>
            @page {
              size: A4 landscape;
              margin: 6mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, sans-serif;
              color: #111827;
              background: #ffffff;
            }

            .ticket {
              border: 1px dashed #64748b;
              margin-bottom: 4mm;
              break-inside: avoid;
              background: #ffffff;
            }

            .columns {
              display: grid;
              grid-template-columns:
                22% 22% 32% 24%;
            }

            .box {
              padding: 4mm;
              border-right:
                1px dashed #94a3b8;
              min-height: 50mm;
            }

            .box.last {
              border-right: 0;
            }

            h3 {
              color: #1e3a8a;
              font-size: 10px;
              margin: 0 0 2mm;
              letter-spacing: 0.4px;
            }

            .section-title {
              margin-top: 5mm;
            }

            p {
              margin: 1.5mm 0;
              font-size: 10px;
              font-weight: 700;
              line-height: 1.4;
            }

            strong {
              font-size: 11px;
            }

            .message-box {
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fff7fb;
              padding: 3mm;
            }

            .message-decor {
              width: 100%;
              min-height: 42mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              border: 1px solid #e8a9c4;
              border-radius: 12px;
              padding: 4mm;
              background: #fffafd;
            }

            .flower-line {
              color: #be185d;
              font-size: 12px;
              font-weight: 900;
              letter-spacing: 2px;
              margin-bottom: 3mm;
            }

            .flower-line-bottom {
              margin-top: 3mm;
              margin-bottom: 0;
            }

            .message-text {
              margin: 0;
              color: #831843;
              font-size: 12px;
              font-weight: 700;
              line-height: 1.55;
              white-space: pre-wrap;
              overflow-wrap: anywhere;
            }
          </style>
        </head>

        <body>
          ${list.map(ticketHtml).join("")}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xl font-black text-slate-950">
          Yükleniyor 🌸
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-3 sm:p-5">
      <div className="max-w-[1600px] mx-auto">
        <header className="bg-white rounded-2xl border border-slate-300 shadow-sm p-5 mb-5">
          <div className="flex justify-between items-center gap-5 flex-wrap">
            <div>
              <FlorioLogo
                primary="#172554"
                accent="#d59a2f"
                compact
              />

              <p className="text-slate-700 font-bold mt-1">
                Çiçekçi Operasyon Paneli · Sipariş takip merkezi
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  setShowPasswordChange(true);
                  setPasswordMessage("");
                }}
                className="rounded-xl border border-slate-300 bg-slate-900 px-4 py-2 font-black text-white hover:bg-slate-800"
              >
                🔐 Şifre Değiştir
              </button>

              <div className="bg-yellow-300 px-4 py-2 rounded-xl font-black text-slate-950">
                Yeni:{" "}
                {
                  dateOrders.filter(
                    (order) =>
                      order.status === "Yeni"
                  ).length
                }
              </div>

              <div className="bg-purple-300 px-4 py-2 rounded-xl font-black text-slate-950">
                Hazırlanıyor:{" "}
                {
                  dateOrders.filter(
                    (order) =>
                      order.status ===
                      "Hazırlanıyor"
                  ).length
                }
              </div>

              <button
                onClick={() =>
                  setSelectedOrderIds(
                    visibleOrders.map(
                      (order) => order.id
                    )
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-black text-slate-800 hover:bg-slate-50"
              >
                ☑ Görünenleri Seç
              </button>

              <button
                onClick={() =>
                  setSelectedOrderIds([])
                }
                disabled={!selectedOrderIds.length}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-black text-slate-800 hover:bg-slate-50 disabled:opacity-40"
              >
                Seçimi Kaldır
              </button>

              <button
                onClick={toggleNotificationSound}
                className={`rounded-xl border px-4 py-2 font-black ${
                  soundEnabled
                    ? "border-emerald-300 bg-emerald-100 text-emerald-950"
                    : "border-slate-300 bg-white text-slate-700"
                }`}
              >
                {soundEnabled
                  ? "🔊 Ses Açık"
                  : "🔇 Ses Kapalı"}
              </button>

              <details className="relative">
                <summary className="list-none cursor-pointer bg-indigo-50 border border-indigo-200 text-indigo-950 px-5 py-2 rounded-xl font-black hover:bg-indigo-100">
                  Seçilenlere Durum ({selectedOrderIds.length}) ▾
                </summary>

                <div className="absolute right-0 top-full z-30 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={(event) => {
                        closeStatusMenu(event);

                        void changeAllStatuses(
                          status
                        );
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-800 hover:bg-slate-100"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </details>

              <button
                onClick={() =>
                  printOrders(visibleOrders)
                }
                className="bg-white border border-slate-300 text-slate-800 px-5 py-2 rounded-xl font-black shadow-sm hover:bg-slate-50 hover:border-slate-400"
              >
                🖨 Görünenleri Yazdır
              </button>
            </div>
          </div>
        </header>

        {newOrderCount > 0 && (
          <button
            onClick={acknowledgeNewOrders}
            className="mb-4 flex w-full items-center justify-between rounded-2xl border-2 border-amber-400 bg-amber-100 px-5 py-4 text-left font-black text-amber-950 shadow-lg animate-pulse"
          >
            <span>
              🔔 {newOrderCount} yeni sipariş geldi!
            </span>

            <span className="text-sm">
              Gördüm ✓
            </span>
          </button>
        )}

        <section className="mb-4 rounded-2xl border-2 border-emerald-800 bg-white p-4 shadow-md">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                📅 Teslimat Tarihi
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950">
                {selectedDate
                  ? formatDate(selectedDate)
                  : "Tüm Tarihler"}
              </h2>

              <p className="mt-1 text-xs font-bold text-slate-500">
                Bu tarih için {dateOrders.length} sipariş bulunuyor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedDate(todayValue())
                }
                className={`rounded-xl border px-4 py-2 font-black ${
                  selectedDate === todayValue()
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                Bugün
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedDate(tomorrowValue())
                }
                className={`rounded-xl border px-4 py-2 font-black ${
                  selectedDate === tomorrowValue()
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                Yarın
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate("")}
                className={`rounded-xl border px-4 py-2 font-black ${
                  selectedDate === ""
                    ? "border-emerald-800 bg-emerald-800 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                Tümü
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
                className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 font-black text-slate-950 outline-none focus:border-emerald-700"
              />
            </div>
          </div>
        </section>

        <div className="mb-4 rounded-2xl border-2 border-blue-900 bg-white p-3 shadow-md">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label
                htmlFor="order-search"
                className="mb-1 block text-xs font-black uppercase tracking-wider text-blue-900"
              >
                🔎 Sipariş No Ara
              </label>

              <input
                id="order-search"
                value={orderSearch}
                onChange={(event) =>
                  setOrderSearch(event.target.value)
                }
                placeholder="Örn: 125 veya #125"
                className="w-full rounded-xl border border-slate-400 px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {orderSearch && (
              <button
                type="button"
                onClick={() =>
                  setOrderSearch("")
                }
                className="rounded-xl border border-slate-300 bg-slate-100 px-5 py-3 font-black text-slate-800 sm:mt-5"
              >
                Temizle
              </button>
            )}
          </div>

          <p className="mt-2 text-xs font-bold text-slate-600">
            Sipariş numarası, alıcı adı, alıcı telefonu veya ürün adıyla arayabilirsiniz.
          </p>
        </div>

        <div
          className={`mb-4 gap-2 overflow-x-auto rounded-2xl border border-slate-300 bg-white p-2 shadow-sm ${
            orderSearch ? "hidden" : "flex"
          }`}
        >
          {[
            "Yeni",
            "Hazırlanıyor",
            "Hazır",
            "Kuryede",
            "Teslim Edildi",
            "İptal",
            "Tümü",
          ].map((item) => {
            const filterItem =
              item as OrderStatus | "Tümü";

            const count =
              filterItem === "Tümü"
                ? dateOrders.length
                : dateOrders.filter(
                    (order) =>
                      order.status === filterItem
                  ).length;

            return (
              <button
                key={filterItem}
                onClick={() =>
                  setStatusFilter(filterItem)
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black ${
                  statusFilter === filterItem
                    ? "bg-blue-950 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {filterItem} ({count})
              </button>
            );
          })}
        </div>

        {visibleOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-300 p-12 text-center">
            <p className="font-black text-slate-700">
              {orderSearch
                ? `“${orderSearch}” aramasına uygun sipariş bulunamadı.`
                : selectedDate
                  ? `${formatDate(
                      selectedDate
                    )} tarihinde ${statusFilter} durumunda sipariş bulunmuyor.`
                  : `${statusFilter} durumunda sipariş bulunmuyor.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleOrders.map((order) => (
              <article
                key={order.id}
                className={`relative bg-white rounded-2xl border shadow-sm overflow-visible transition md:grid md:grid-cols-[0.85fr_2.3fr_auto] md:items-center ${
                  selectedOrderIds.includes(order.id)
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-slate-300"
                }`}
              >
                <div className="bg-slate-50 border-b border-slate-300 px-3 py-2 flex flex-wrap justify-between items-center gap-2 rounded-t-2xl md:h-full md:border-b-0 md:border-r md:rounded-l-2xl md:rounded-tr-none">
                  <div className="flex min-w-0 items-center gap-3">
                    <label
                      className="flex cursor-pointer items-center"
                      title="Bu siparişi toplu işlem için seç"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrderIds.includes(
                          order.id
                        )}
                        onChange={() =>
                          toggleOrderSelection(order.id)
                        }
                        className="h-5 w-5 cursor-pointer rounded border-2 border-slate-400 accent-indigo-700"
                        aria-label={`#${order.id} numaralı siparişi seç`}
                      />
                    </label>

                    <span className="shrink-0 bg-blue-950 text-white px-3 py-1.5 rounded-lg font-black">
                      #{order.id}
                    </span>

                    <span
                      className="max-w-[220px] truncate text-sm font-black text-slate-950"
                      title={order.productName}
                    >
                      {order.productName}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(event) =>
                      void changeStatus(
                        order.id,
                        event.target.value as OrderStatus
                      )
                    }
                    style={statusStyle(
                      order.status,
                      order.status
                    )}
                    className="rounded-lg border-2 px-2 py-1 text-xs font-black"
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2 p-2 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-amber-100 p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                        Teslimat Zamanı
                      </p>

                      <p className="mt-1 font-black text-amber-950">
                        {order.deliveryDate
                          ? new Date(
                              `${order.deliveryDate}T12:00:00`
                            ).toLocaleDateString(
                              "tr-TR"
                            )
                          : "Tarih yok"}
                        {" · "}
                        {order.deliveryTimeSlot ||
                          "Saat yok"}
                      </p>

                      <p className="mt-1 text-[10px] font-bold text-amber-800">
                        Geliş:{" "}
                        {order.assignedAt
                          ? new Date(
                              order.assignedAt
                            ).toLocaleString(
                              "tr-TR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Atama saati yok"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        Teslimat
                      </p>

                      <p className="mt-1 font-black text-slate-950">
                        {order.district} / {order.city}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-600">
                        {order.quantity} adet
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
                    <button
                      onClick={() =>
                        setSelectedOrder(order)
                      }
                      className="rounded-lg bg-blue-950 px-4 py-2 text-xs font-black text-white"
                    >
                      Tüm Detaylar
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-300 bg-slate-50 px-2 py-1.5 rounded-b-2xl md:h-full md:border-l md:border-t-0 md:rounded-r-2xl md:rounded-bl-none md:flex md:items-center">
                  <div className="flex justify-end items-center gap-2 flex-wrap">
                    <label className="cursor-pointer rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 font-black text-emerald-950">
                      📷{" "}
                      {order.preparationImage
                        ? "Yeni Fotoğraf Çek"
                        : "Kamerayı Aç"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        capture="environment"
                        className="hidden"
                        disabled={
                          uploadingPhoto === order.id
                        }
                        onChange={(event) => {
                          const file =
                            event.target.files?.[0];

                          if (file) {
                            if (photoDraft) {
                              URL.revokeObjectURL(
                                photoDraft.preview
                              );
                            }

                            setPhotoDraft({
                              orderId: order.id,
                              file,
                              preview:
                                URL.createObjectURL(
                                  file
                                ),
                            });
                          }

                          event.currentTarget.value = "";
                        }}
                      />
                    </label>

                    <button
                      onClick={() =>
                        printOrders([order])
                      }
                      className="bg-white border border-slate-300 text-slate-800 px-3 py-2 rounded-lg text-sm font-black shadow-sm hover:bg-slate-100"
                    >
                      🖨 Yazdır
                    </button>
                  </div>

                  {photoDraft?.orderId === order.id && (
                    <div className="mt-2 flex w-full flex-wrap items-center justify-end gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3">
                      <img
                        src={photoDraft.preview}
                        alt="Gönderilecek hazırlık fotoğrafı önizlemesi"
                        className="h-20 w-20 rounded-lg object-cover"
                      />

                      <div className="text-left">
                        <p className="font-black text-emerald-950">
                          Fotoğraf hazır
                        </p>

                        <p className="text-xs font-bold text-emerald-800">
                          Göndermeden önce kontrol edin.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void uploadPreparationPhoto(
                            order.id,
                            photoDraft.file
                          )
                        }
                        disabled={
                          uploadingPhoto === order.id
                        }
                        className="rounded-lg bg-emerald-700 px-4 py-2 font-black text-white disabled:opacity-60"
                      >
                        {uploadingPhoto === order.id
                          ? "Yükleniyor..."
                          : "Müşteriye Gönder"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(
                            photoDraft.preview
                          );

                          setPhotoDraft(null);
                        }}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-black text-slate-800"
                      >
                        Vazgeç
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="bg-blue-950 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div>
                <p className="font-bold text-blue-200">
                  FlorioTR Sipariş
                </p>

                <h2 className="text-2xl font-black">
                  #{selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="bg-white/20 rounded-full w-10 h-10 text-xl font-black"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <section className="bg-slate-100 rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-black text-blue-900 mb-3">
                    👤 Alıcı
                  </h3>

                  <p className="font-black text-slate-950">
                    {selectedOrder.customerName}
                  </p>

                  <p className="font-bold text-slate-800 mt-2">
                    📞 {selectedOrder.customerPhone}
                  </p>
                </section>

                <section className="bg-slate-100 rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-black text-blue-900 mb-3">
                    📍 Teslimat
                  </h3>

                  <p className="font-black text-slate-950">
                    {selectedOrder.city} /{" "}
                    {selectedOrder.district}
                  </p>

                  <p className="font-semibold text-slate-800 mt-2">
                    {selectedOrder.address}
                  </p>

                  <p className="mt-3 rounded-xl bg-amber-100 p-3 font-black text-amber-950">
                    ⏰{" "}
                    {selectedOrder.deliveryDate
                      ? new Date(
                          `${selectedOrder.deliveryDate}T12:00:00`
                        ).toLocaleDateString(
                          "tr-TR"
                        )
                      : "Tarih belirtilmedi"}
                    {" · "}
                    {selectedOrder.deliveryTimeSlot ||
                      "Saat belirtilmedi"}
                  </p>

                  <p className="mt-2 text-xs font-bold text-slate-600">
                    Panele geliş:{" "}
                    {selectedOrder.assignedAt
                      ? new Date(
                          selectedOrder.assignedAt
                        ).toLocaleString(
                          "tr-TR"
                        )
                      : "Kayıt yok"}
                  </p>
                </section>

                <section className="bg-slate-100 rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-black text-blue-900 mb-3">
                    🌹 Sipariş
                  </h3>

                  <p className="font-black text-slate-950">
                    {selectedOrder.productName}
                  </p>

                  <p className="font-bold text-slate-800 mt-2">
                    Adet: {selectedOrder.quantity}
                  </p>
                </section>

                <section className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <h3 className="font-black text-blue-900 mb-2">
                      📝 Müşteri Özel Notu
                    </h3>

                    <p className="font-bold text-slate-950 whitespace-pre-wrap">
                      {selectedOrder.customerNote?.trim() ||
                        "Not bulunmuyor."}
                    </p>
                  </div>

                  <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4">
                    <h3 className="font-black text-pink-900 mb-2">
                      💌 Alıcı Kart Mesajı
                    </h3>

                    <p className="font-bold text-pink-950 whitespace-pre-wrap">
                      {selectedOrder.recipientNote?.trim() ||
                        "Kart mesajı bulunmuyor."}
                    </p>
                  </div>
                </section>
              </div>

              <section className="mt-6">
                <h3 className="text-lg font-black text-slate-950 mb-3">
                  📦 Sipariş Durumu
                </h3>

                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        changeStatus(
                          selectedOrder.id,
                          status
                        )
                      }
                      style={statusStyle(
                        status,
                        selectedOrder.status
                      )}
                      className={`px-4 py-2 rounded-xl border-2 text-sm ${
                        selectedOrder.status === status
                          ? "ring-2 ring-blue-400 ring-offset-1"
                          : ""
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </section>

              <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                <button
                  onClick={() =>
                    printOrders([selectedOrder])
                  }
                  className="flex-1 bg-slate-950 text-white py-3 rounded-xl font-black hover:bg-slate-800"
                >
                  🖨 Siparişi Yazdır
                </button>

                <button
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                  className="flex-1 bg-slate-200 text-slate-950 py-3 rounded-xl font-black hover:bg-slate-300"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPasswordChange && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          onClick={() =>
            setShowPasswordChange(false)
          }
        >
          <form
            onSubmit={changePassword}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-700">
                  Hesap Güvenliği
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  Şifre Değiştir
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPasswordChange(false)
                }
                className="h-10 w-10 rounded-full bg-slate-100 font-black text-slate-900"
              >
                ✕
              </button>
            </div>

            <label className="mt-6 block text-sm font-black text-slate-800">
              Mevcut şifre

              <input
                required
                type="password"
                value={
                  passwordForm.currentPassword
                }
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword:
                      event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-slate-950"
              />
            </label>

            <label className="mt-4 block text-sm font-black text-slate-800">
              Yeni şifre

              <input
                required
                minLength={8}
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword:
                      event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-slate-950"
                placeholder="En az 8 karakter"
              />
            </label>

            <label className="mt-4 block text-sm font-black text-slate-800">
              Yeni şifreyi tekrar yaz

              <input
                required
                minLength={8}
                type="password"
                value={
                  passwordForm.confirmPassword
                }
                onChange={(event) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword:
                      event.target.value,
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-slate-950"
              />
            </label>

            {passwordMessage && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-sm font-black text-amber-900">
                {passwordMessage}
              </p>
            )}

            <button
              disabled={changingPassword}
              className="mt-5 w-full rounded-xl bg-blue-950 py-3.5 font-black text-white disabled:opacity-50"
            >
              {changingPassword
                ? "Değiştiriliyor..."
                : "Yeni Şifreyi Kaydet"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}