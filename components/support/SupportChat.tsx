"use client";

import Link from "next/link";
import { useState } from "react";

import FlorioLogo from "@/components/FlorioLogo";

export default function SupportChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* DESTEK BUTONU */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={
          open
            ? "FlorioTR desteği kapat"
            : "FlorioTR desteği aç"
        }
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-pink-600
          text-white
          shadow-xl
          transition
          hover:scale-110
        "
      >
        <div className="scale-[1.35]">
          <FlorioLogo
            primary="#ffffff"
            accent="#ffffff"
            compact
            iconOnly
            light
          />
        </div>
      </button>

      {/* CHAT PENCERESİ */}

      {open && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-50
            w-80
            rounded-3xl
            bg-white
            p-6
            shadow-2xl
          "
        >
          {/* BAŞLIK */}

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <FlorioLogo
                primary="#db2777"
                accent="#f59e0b"
                compact
                iconOnly
              />

              <h2 className="text-xl font-bold text-pink-600">
                FlorioTR Destek
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Destek penceresini kapat"
              className="text-gray-400 transition hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* KARŞILAMA */}

          <p className="text-gray-600">
            Merhaba 👋
            <br />
            Size nasıl yardımcı olabilirim?
          </p>

          {/* SEÇENEKLER */}

          <div className="mt-5 space-y-3">
            <Link
              href="/kategori/en-cok-tercih-edilenler"
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-pink-50
                p-3
                font-semibold
                text-pink-600
                transition
                hover:bg-pink-100
              "
            >
              <FlorioLogo
                primary="#db2777"
                accent="#f59e0b"
                compact
                iconOnly
              />

              <span>
                Çiçek seçmek istiyorum
              </span>
            </Link>

            <Link
              href="/siparislerim"
              className="
                block
                rounded-xl
                bg-pink-50
                p-3
                font-semibold
                text-pink-600
                transition
                hover:bg-pink-100
              "
            >
              📦 Siparişimi takip etmek istiyorum
            </Link>

            <div
              className="
                rounded-xl
                bg-pink-50
                p-3
                font-semibold
                text-pink-600
              "
            >
              💳 Ödeme hakkında bilgi
            </div>

            <div
              className="
                rounded-xl
                bg-pink-50
                p-3
                font-semibold
                text-pink-600
              "
            >
              🚚 Teslimat bilgileri
            </div>
          </div>

          {/* BİLGİ */}

          <div
            className="
              mt-6
              flex
              items-center
              gap-2
              rounded-xl
              bg-gray-50
              p-3
              text-sm
              text-gray-500
            "
          >
            <FlorioLogo
              primary="#9ca3af"
              accent="#d1d5db"
              compact
              iconOnly
            />

            <span>
              Canlı destek yakında aktif olacak
            </span>
          </div>
        </div>
      )}
    </>
  );
}