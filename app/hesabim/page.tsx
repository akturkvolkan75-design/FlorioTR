"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import FlorioLogo from "@/components/FlorioLogo";

type Customer = {
  name: string;
  email: string;
  phone: string;
};

type Order = {
  id: number;
  productName: string;
  status: string;
  price: number;
  quantity: number;
  createdAt: string;
};

export default function HesabimPage() {
  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch(
        "/api/musteri/auth",
        {
          cache: "no-store",
        }
      ),

      fetch(
        "/api/musteri/orders",
        {
          cache: "no-store",
        }
      ),
    ])
      .then(
        async ([
          authResponse,
          ordersResponse,
        ]) => {
          const auth =
            await authResponse.json();

          if (
            !auth.authenticated
          ) {
            router.replace(
              "/musteri/giris?next=/hesabim"
            );

            return;
          }

          setCustomer(
            auth.customer
          );

          const orderData =
            await ordersResponse.json();

          setOrders(
            orderData.orders || []
          );

          setLoading(false);
        }
      )
      .catch(() =>
        setLoading(false)
      );
  }, [router]);

  async function save(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!customer) {
      return;
    }

    setSaving(true);
    setMessage("");

    const response =
      await fetch(
        "/api/musteri/auth",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            customer
          ),
        }
      );

    const data =
      await response.json();

    setSaving(false);

    setMessage(
      data.message || ""
    );

    if (data.success) {
      setCustomer(
        data.customer
      );

      window.dispatchEvent(
        new Event(
          "floriotr-auth-changed"
        )
      );
    }
  }

  if (loading) {
    return (
      <main
        className="
          grid
          min-h-screen
          place-items-center
          bg-[#f5f2eb]
          font-black
          text-[#123f34]
        "
      >
        Hesabın yükleniyor...
      </main>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#f5f2eb]
        px-4
        py-10
        text-[#123f34]
        sm:px-6
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
        "
      >
        {/* HESAP ÜST ALANI */}

        <div
          className="
            overflow-hidden
            rounded-[32px]
            bg-[#123f34]
            p-7
            text-white
            shadow-xl
            sm:p-10
          "
        >
          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[.22em]
              text-[#efc979]
            "
          >
            FlorioTR Hesabım
          </p>

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-end
              justify-between
              gap-5
            "
          >
            <div>
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <h1
                  className="
                    text-3xl
                    font-black
                    sm:text-4xl
                  "
                >
                  Merhaba,{" "}
                  {
                    customer.name.split(
                      " "
                    )[0]
                  }
                </h1>

                <div
                  className="
                    flex
                    items-center
                    text-white
                  "
                >
                  <FlorioLogo
                    primary="#ffffff"
                    accent="#efc979"
                    compact
                    iconOnly
                    light
                  />
                </div>
              </div>

              <p
                className="
                  mt-2
                  text-white/65
                "
              >
                Bilgilerini ve
                siparişlerini buradan
                yönetebilirsin.
              </p>
            </div>

            <Link
              href="/siparislerim"
              className="
                rounded-full
                border
                border-[#efc979]
                bg-white/10
                px-6
                py-3
                font-black
                text-white
              "
            >
              Tüm Siparişlerim →
            </Link>
          </div>
        </div>

        <div
          className="
            mt-6
            grid
            gap-6
            lg:grid-cols-[1fr_1.2fr]
          "
        >
          {/* KİŞİSEL BİLGİLER */}

          <section
            className="
              rounded-[28px]
              bg-white
              p-6
              shadow-lg
            "
          >
            <h2
              className="
                text-xl
                font-black
              "
            >
              Kişisel Bilgilerim
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Siparişlerde
              kullanılacak iletişim
              bilgilerin.
            </p>

            <form
              onSubmit={save}
              className="
                mt-6
                space-y-4
              "
            >
              <label className="block">
                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-black
                  "
                >
                  Ad soyad
                </span>

                <input
                  required
                  value={
                    customer.name
                  }
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      name:
                        e.target
                          .value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    p-3.5
                  "
                />
              </label>

              <label className="block">
                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-black
                  "
                >
                  Telefon
                </span>

                <input
                  required
                  type="tel"
                  value={
                    customer.phone
                  }
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      phone:
                        e.target
                          .value,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    p-3.5
                  "
                />
              </label>

              <label className="block">
                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-black
                  "
                >
                  Doğrulanmış
                  e-posta
                </span>

                <input
                  readOnly
                  value={
                    customer.email
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-emerald-200
                    bg-emerald-50
                    p-3.5
                    text-emerald-900
                  "
                />

                <span
                  className="
                    mt-1
                    block
                    text-xs
                    font-bold
                    text-emerald-700
                  "
                >
                  ✓ E-posta
                  doğrulandı
                </span>
              </label>

              {message && (
                <p
                  className="
                    rounded-xl
                    bg-amber-50
                    p-3
                    text-sm
                    font-bold
                    text-amber-800
                  "
                >
                  {message}
                </p>
              )}

              <button
                disabled={saving}
                className="
                  w-full
                  rounded-full
                  bg-[#123f34]
                  py-3.5
                  font-black
                  text-white
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Kaydediliyor..."
                  : "Bilgilerimi Kaydet"}
              </button>
            </form>

            <Link
              href="/musteri/giris"
              className="
                mt-4
                block
                text-center
                text-sm
                font-black
                text-[#9a6a25]
              "
            >
              Şifremi değiştirmek
              istiyorum
            </Link>
          </section>

          {/* SON SİPARİŞLER */}

          <section
            className="
              rounded-[28px]
              bg-white
              p-6
              shadow-lg
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-black
                  "
                >
                  Son Siparişlerim
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  En yeni üç
                  siparişin.
                </p>
              </div>

              <span
                className="
                  grid
                  h-12
                  w-12
                  place-items-center
                  rounded-full
                  bg-[#f5ead2]
                  text-2xl
                "
              >
                📦
              </span>
            </div>

            {orders.length === 0 ? (
              <div
                className="
                  mt-8
                  rounded-2xl
                  bg-[#faf8f3]
                  p-8
                  text-center
                "
              >
                {/* FLORIOTR MARKA İKONU */}

                <div
                  className="
                    flex
                    h-16
                    items-center
                    justify-center
                  "
                >
                  <div className="scale-[1.8]">
                    <FlorioLogo
                      primary="#123f34"
                      accent="#efc979"
                      iconOnly
                    />
                  </div>
                </div>

                <p
                  className="
                    mt-3
                    font-black
                  "
                >
                  Henüz siparişin
                  yok
                </p>

                <Link
                  href="/"
                  className="
                    mt-4
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#123f34]
                    px-5
                    py-2.5
                    font-black
                    text-white
                    transition
                    hover:scale-105
                  "
                >
                  <FlorioLogo
                    primary="#ffffff"
                    accent="#efc979"
                    compact
                    iconOnly
                    light
                  />

                  <span>
                    Çiçeklere Bak
                  </span>
                </Link>
              </div>
            ) : (
              <div
                className="
                  mt-5
                  space-y-3
                "
              >
                {orders
                  .slice(0, 3)
                  .map((order) => (
                    <article
                      key={
                        order.id
                      }
                      className="
                        rounded-2xl
                        border
                        border-slate-100
                        bg-[#fafaf8]
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <p
                            className="
                              text-xs
                              font-black
                              text-[#a8752d]
                            "
                          >
                            SİPARİŞ #
                            {order.id}
                          </p>

                          <h3
                            className="
                              mt-1
                              font-black
                            "
                          >
                            {
                              order.productName
                            }
                          </h3>

                          <p
                            className="
                              mt-1
                              text-xs
                              text-slate-500
                            "
                          >
                            {new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "tr-TR"
                            )}
                          </p>
                        </div>

                        <span
                          className="
                            rounded-full
                            bg-[#e5f0e9]
                            px-3
                            py-1
                            text-xs
                            font-black
                          "
                        >
                          {
                            order.status
                          }
                        </span>
                      </div>

                      <p
                        className="
                          mt-3
                          text-right
                          font-black
                        "
                      >
                        {(
                          order.price *
                          order.quantity
                        ).toLocaleString(
                          "tr-TR"
                        )}{" "}
                        TL
                      </p>
                    </article>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}