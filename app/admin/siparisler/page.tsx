"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Shop = {
  id: number;
  shopName: string;
  city: string;
  district: string;
};

type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  city: string;
  district: string;
  address: string;
  customerNote: string | null;
  recipientNote: string | null;
  productName: string;
  quantity: number;
  price: number;
  paymentStatus: string;
  status: string;
  deliveryDate?: string | null;
  deliveryTimeSlot?: string | null;

  flowerShop: null | {
    id: number;
    shopName: string;
  };

  customer: null | {
    name: string;
    email: string;
  };
};

const statuses = [
  "Tümü",
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
  if (!value) {
    return "Tüm Tarihler";
  }

  return new Date(`${value}T12:00:00`).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AdminSiparislerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tümü");

  const [selectedDate, setSelectedDate] = useState(todayValue());

  const [selected, setSelected] = useState<number | null>(null);

  const [message, setMessage] = useState<Record<number, string>>({});

  const router = useRouter();

  async function load() {
    const response = await fetch("/api/admin/orders", {
      cache: "no-store",
    });

    if (response.status === 401) {
      router.replace("/admin/giris");
      return;
    }

    const data = await response.json();

    if (data.success) {
      setOrders(data.orders);
      setShops(data.flowerShops || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(
    id: number,
    nextStatus: string
  ) {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,
        status: nextStatus,
      }),
    });

    if (response.ok) {
      await load();
    }
  }

  async function assignShop(
    id: number,
    value: string
  ) {
    setMessage((current) => ({
      ...current,
      [id]: "Atanıyor...",
    }));

    const response = await fetch("/api/admin/orders", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,
        flowerShopId: value ? Number(value) : null,
      }),
    });

    const data = await response.json();

    setMessage((current) => ({
      ...current,
      [id]: data.message || "İşlem tamamlandı.",
    }));

    if (data.success) {
      await load();
    }
  }

  const dateOrders = useMemo(() => {
    if (!selectedDate) {
      return orders;
    }

    return orders.filter(
      (order) => order.deliveryDate === selectedDate
    );
  }, [orders, selectedDate]);

  const filtered = useMemo(() => {
    const query = search
      .trim()
      .toLocaleLowerCase("tr");

    return dateOrders.filter((order) => {
      const matchesStatus =
        status === "Tümü" ||
        order.status === status;

      const searchable = `
        ${order.id}
        ${order.customerName}
        ${order.customerPhone}
        ${order.productName}
        ${order.flowerShop?.shopName || ""}
      `.toLocaleLowerCase("tr");

      return (
        matchesStatus &&
        searchable.includes(query)
      );
    });
  }, [dateOrders, search, status]);

  const paid = dateOrders.filter(
    (order) =>
      order.paymentStatus === "Ödendi"
  );

  const revenue = paid.reduce(
    (total, order) =>
      total + order.price * order.quantity,
    0
  );

  const unassigned = dateOrders.filter(
    (order) => !order.flowerShop
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f2eb] p-10 text-center font-black text-[#123f34]">
        Siparişler yükleniyor...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f2eb] p-4 text-slate-950 sm:p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="rounded-3xl bg-[#123f34] p-6 text-white shadow-lg">
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#efc979]">
            FlorioTR Operasyon
          </p>

          <h1 className="mt-1 text-3xl font-black">
            Sipariş Yönetimi
          </h1>

          <p className="mt-1 text-white/70">
            Ödeme, çiçekçi atama ve teslimat durumları tek ekranda.
          </p>
        </div>

        {/* TARİH FİLTRESİ */}
        <section className="mt-5 rounded-2xl border-2 border-[#123f34] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#17725c]">
                📅 Teslimat Tarihi
              </p>

              <h2 className="mt-1 text-xl font-black text-[#123f34]">
                {selectedDate
                  ? formatDate(selectedDate)
                  : "Tüm Tarihler"}
              </h2>

              <p className="mt-1 text-xs font-bold text-slate-500">
                Bu seçimde {dateOrders.length} ödenmiş sipariş bulunuyor.
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
                    ? "border-[#123f34] bg-[#123f34] text-white"
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
                    ? "border-[#123f34] bg-[#123f34] text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                Yarın
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedDate("")
                }
                className={`rounded-xl border px-4 py-2 font-black ${
                  selectedDate === ""
                    ? "border-[#123f34] bg-[#123f34] text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                Tümü
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 font-black text-slate-950 outline-none focus:border-[#123f34]"
              />
            </div>
          </div>
        </section>

        {/* ÖZET */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Toplam Sipariş",
              dateOrders.length,
            ],

            [
              "Ödenmiş",
              paid.length,
            ],

            [
              "Atanmamış",
              unassigned,
            ],

            [
              "Ödenmiş Tutar",
              `${revenue.toLocaleString(
                "tr-TR"
              )} TL`,
            ],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-black text-slate-500">
                {label}
              </p>

              <p className="mt-2 text-2xl font-black text-[#123f34]">
                {value}
              </p>
            </div>
          ))}
        </section>

        {/* ARAMA + DURUM */}
        <section className="mt-5 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Sipariş no, müşteri, ürün veya çiçekçi ara..."
            className="rounded-xl border p-3"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-xl border p-3"
          >
            {statuses.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        {/* SİPARİŞLER */}
        <section className="mt-4 space-y-3">
          {filtered.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <button
                onClick={() =>
                  setSelected(
                    selected === order.id
                      ? null
                      : order.id
                  )
                }
                className="grid w-full gap-3 p-5 text-left md:grid-cols-[.5fr_1.3fr_1.4fr_1fr_1fr_auto]"
              >
                <strong>
                  #{order.id}
                </strong>

                <div>
                  <p className="font-black">
                    {order.customerName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {order.customerPhone}
                  </p>
                </div>

                <div>
                  <p className="font-black">
                    {order.productName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {order.quantity} adet ·{" "}
                    {order.price *
                      order.quantity}{" "}
                    TL
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500">
                    Çiçekçi
                  </p>

                  <p
                    className={`font-black ${
                      order.flowerShop
                        ? "text-[#123f34]"
                        : "text-red-700"
                    }`}
                  >
                    {order.flowerShop
                      ?.shopName ||
                      "Atanmadı"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500">
                    Teslimat
                  </p>

                  <p className="font-black text-[#123f34]">
                    {order.deliveryDate
                      ? new Date(
                          `${order.deliveryDate}T12:00:00`
                        ).toLocaleDateString(
                          "tr-TR"
                        )
                      : "Tarih yok"}
                  </p>

                  <p className="text-xs font-bold text-slate-500">
                    {order.deliveryTimeSlot ||
                      "Saat yok"}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  {order.paymentStatus}
                </span>

                <span className="h-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                  {order.status}
                </span>
              </button>

              {selected === order.id && (
                <div className="border-t bg-slate-50 p-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1.3fr]">
                    <div>
                      <h3 className="font-black">
                        Teslimat
                      </h3>

                      <p className="mt-2 text-sm">
                        {order.city} /{" "}
                        {order.district}
                        <br />
                        {order.address}
                      </p>

                      <p className="mt-3 rounded-xl bg-amber-100 p-3 text-sm font-black text-amber-950">
                        ⏰{" "}
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
                    </div>

                    <div>
                      <h3 className="font-black">
                        Müşteri Hesabı
                      </h3>

                      <p className="mt-2 whitespace-pre-line text-sm">
                        {order.customer
                          ? `${order.customer.name}\n${order.customer.email}`
                          : "Hesaba bağlı değil"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-black">
                        Notlar
                      </h3>

                      <p className="mt-2 text-sm">
                        Kart Mesajı:{" "}
                        {order.recipientNote ||
                          "—"}
                        <br />
                        Müşteri Özel Notu:{" "}
                        {order.customerNote ||
                          "—"}
                      </p>
                    </div>

                    <div className="rounded-2xl border-2 border-[#123f34] bg-white p-4">
                      <h3 className="font-black text-[#123f34]">
                        🌸 Çiçekçi Ata
                      </h3>

                      <select
                        value={
                          order.flowerShop
                            ?.id || ""
                        }
                        onChange={(event) =>
                          void assignShop(
                            order.id,
                            event.target
                              .value
                          )
                        }
                        className="mt-3 w-full rounded-xl border p-3 font-bold"
                      >
                        <option value="">
                          Atama yok
                        </option>

                        {shops.map(
                          (shop) => (
                            <option
                              key={shop.id}
                              value={shop.id}
                            >
                              {
                                shop.shopName
                              }{" "}
                              ·{" "}
                              {
                                shop.district
                              }
                              /
                              {shop.city}
                            </option>
                          )
                        )}
                      </select>

                      {message[
                        order.id
                      ] && (
                        <p className="mt-2 text-xs font-black text-emerald-800">
                          {
                            message[
                              order.id
                            ]
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {statuses
                      .slice(1)
                      .map((item) => (
                        <button
                          key={item}
                          onClick={() =>
                            void updateStatus(
                              order.id,
                              item
                            )
                          }
                          disabled={
                            order.status ===
                            item
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-black ${
                            order.status ===
                            item
                              ? "bg-[#123f34] text-white"
                              : "border bg-white text-slate-700"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </article>
          ))}

          {!filtered.length && (
            <div className="rounded-2xl bg-white p-10 text-center font-bold">
              {selectedDate
                ? `${formatDate(
                    selectedDate
                  )} tarihinde filtreye uygun sipariş bulunamadı.`
                : "Filtreye uygun sipariş bulunamadı."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}