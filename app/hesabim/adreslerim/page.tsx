"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";


type Address = {
  id: number;
  title: string;
  receiverName: string;
  receiverPhone: string;
  city: string;
  district: string;
  address: string;
};


const empty = {
  title: "",
  receiverName: "",
  receiverPhone: "",
  district: "",
  address: "",
};


export default function AdreslerimPage() {
  const [addresses, setAddresses] =
    useState<Address[]>([]);

  const [form, setForm] =
    useState(empty);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();

  const { theme } = useTheme();

  const colors =
    themes[theme].colors;


  useEffect(() => {
    fetch(
      "/api/musteri/addresses",
      {
        cache: "no-store",
      }
    )
      .then(async (r) => ({
        r,
        data: await r.json(),
      }))
      .then(({ r, data }) => {
        if (r.status === 401) {
          router.replace(
            "/musteri/giris?next=/hesabim/adreslerim"
          );

          return;
        }

        setAddresses(
          data.addresses || []
        );

        setLoading(false);
      });
  }, [router]);


  async function save(
    e: FormEvent
  ) {
    e.preventDefault();

    setMessage("");


    const r = await fetch(
      "/api/musteri/addresses",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(form),
      }
    );


    const data =
      await r.json();


    setMessage(
      data.message || ""
    );


    if (data.success) {
      setAddresses(
        (current) => [
          data.address,
          ...current,
        ]
      );

      setForm(empty);
    }
  }


  async function remove(
    id: number
  ) {
    if (
      !confirm(
        "Bu adres silinsin mi?"
      )
    ) {
      return;
    }


    const r = await fetch(
      `/api/musteri/addresses?id=${id}`,
      {
        method: "DELETE",
      }
    );


    if (r.ok) {
      setAddresses(
        (current) =>
          current.filter(
            (address) =>
              address.id !== id
          )
      );
    }
  }


  const inputStyle = {
    background: colors.card,
    color: colors.foreground,
    borderColor: colors.cardBorder,
  };


  return (
    <main
      className="
        min-h-screen
        px-4
        py-10
        transition-colors
        duration-300
      "
      style={{
        background:
          colors.background,

        color:
          colors.foreground,
      }}
    >
      <div
        className="
          mx-auto
          max-w-5xl
        "
      >

        {/* ÜST BAŞLIK */}

        <div
          className="
            flex
            flex-wrap
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[.2em]
              "
              style={{
                color:
                  colors.accent,
              }}
            >
              Hesabım
            </p>


            <h1
              className="
                mt-2
                text-4xl
                font-black
              "
            >
              Kayıtlı Adreslerim
            </h1>


            <p
              className="
                mt-2
                text-sm
              "
              style={{
                color:
                  colors.muted,
              }}
            >
              Sipariş verirken tek
              dokunuşla
              kullanabileceğin
              adresler.
            </p>
          </div>


          <Link
            href="/hesabim"
            className="
              rounded-full
              border
              px-5
              py-2.5
              text-sm
              font-black
              transition
              duration-200
              hover:-translate-y-0.5
            "
            style={{
              background:
                colors.actionSecondary,

              color:
                colors.actionSecondaryText,

              borderColor:
                colors.cardBorder,
            }}
          >
            ← Hesabıma dön
          </Link>
        </div>



        <div
          className="
            mt-8
            grid
            gap-6
            lg:grid-cols-[1fr_1.2fr]
          "
        >

          {/* YENİ ADRES FORMU */}

          <form
            onSubmit={save}
            className="
              rounded-[28px]
              p-6
              shadow-lg
              transition-colors
              duration-300
            "
            style={{
              background:
                colors.card,

              border:
                `1px solid ${colors.cardBorder}`,
            }}
          >
            <h2
              className="
                text-xl
                font-black
              "
            >
              Yeni Adres Ekle
            </h2>


            <input
              required
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
              placeholder="Adres başlığı (Ev, İş...)"
              className="
                mt-5
                w-full
                rounded-xl
                border
                p-3.5
                outline-none
                transition
                focus:ring-2
              "
              style={inputStyle}
            />


            <input
              required
              value={
                form.receiverName
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  receiverName:
                    e.target.value,
                })
              }
              placeholder="Alıcı ad soyad"
              className="
                mt-3
                w-full
                rounded-xl
                border
                p-3.5
                outline-none
                transition
                focus:ring-2
              "
              style={inputStyle}
            />


            <input
              required
              type="tel"
              value={
                form.receiverPhone
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  receiverPhone:
                    e.target.value,
                })
              }
              placeholder="Alıcı telefonu"
              className="
                mt-3
                w-full
                rounded-xl
                border
                p-3.5
                outline-none
                transition
                focus:ring-2
              "
              style={inputStyle}
            />


            <select
              required
              value={
                form.district
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  district:
                    e.target.value,
                })
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                p-3.5
                outline-none
              "
              style={inputStyle}
            >
              <option value="">
                İlçe seçiniz
              </option>

              {[
                "Kadıköy",
                "Beşiktaş",
                "Bakırköy",
                "Üsküdar",
                "Şişli",
                "Maltepe",
              ].map((item) => (
                <option
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>


            <textarea
              required
              value={
                form.address
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  address:
                    e.target.value,
                })
              }
              placeholder="Açık teslimat adresi"
              className="
                mt-3
                h-28
                w-full
                resize-none
                rounded-xl
                border
                p-3.5
                outline-none
              "
              style={inputStyle}
            />


            {message && (
              <p
                className="
                  mt-3
                  rounded-xl
                  p-3
                  text-sm
                  font-bold
                "
                style={{
                  background:
                    colors.accentSoft,

                  color:
                    colors.foreground,
                }}
              >
                {message}
              </p>
            )}


            {/* TEMAYA BAĞLI KAYDET BUTONU */}

            <button
              type="submit"
              className="
                mt-4
                w-full
                rounded-full
                py-3.5
                font-black
                shadow-md
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-lg
                active:translate-y-0
              "
              style={{
                background:
                  colors.actionPrimary,

                color:
                  colors.actionPrimaryText,
              }}
            >
              Adresi Kaydet
            </button>

          </form>



          {/* KAYITLI ADRESLER */}

          <section
            className="
              rounded-[28px]
              p-6
              shadow-lg
              transition-colors
              duration-300
            "
            style={{
              background:
                colors.card,

              border:
                `1px solid ${colors.cardBorder}`,
            }}
          >
            <h2
              className="
                text-xl
                font-black
              "
            >
              Adreslerim
            </h2>


            {loading ? (
              <p
                className="mt-6"
                style={{
                  color:
                    colors.muted,
                }}
              >
                Yükleniyor...
              </p>
            ) : addresses.length ===
              0 ? (
              <p
                className="
                  mt-6
                  rounded-2xl
                  p-8
                  text-center
                  font-bold
                "
                style={{
                  background:
                    colors.surfaceSoft,

                  color:
                    colors.muted,
                }}
              >
                Henüz kayıtlı
                adresin yok.
              </p>
            ) : (
              <div
                className="
                  mt-5
                  space-y-3
                "
              >
                {addresses.map(
                  (item) => (
                    <article
                      key={
                        item.id
                      }
                      className="
                        rounded-2xl
                        border
                        p-4
                        transition
                      "
                      style={{
                        background:
                          colors.surfaceSoft,

                        borderColor:
                          colors.cardBorder,
                      }}
                    >
                      <div
                        className="
                          flex
                          justify-between
                          gap-3
                        "
                      >
                        <div>
                          <h3
                            className="
                              font-black
                            "
                          >
                            📍{" "}
                            {
                              item.title
                            }
                          </h3>


                          <p
                            className="
                              mt-2
                              text-sm
                              font-bold
                            "
                          >
                            {
                              item.receiverName
                            }{" "}
                            ·{" "}
                            {
                              item.receiverPhone
                            }
                          </p>


                          <p
                            className="
                              mt-1
                              text-sm
                            "
                            style={{
                              color:
                                colors.muted,
                            }}
                          >
                            {
                              item.district
                            }
                            ,{" "}
                            {
                              item.address
                            }
                          </p>
                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            void remove(
                              item.id
                            )
                          }
                          className="
                            h-fit
                            rounded-full
                            px-3
                            py-2
                            text-xs
                            font-black
                            transition
                            hover:scale-105
                          "
                          style={{
                            background:
                              `${colors.danger}18`,

                            color:
                              colors.danger,
                          }}
                        >
                          Sil
                        </button>

                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}