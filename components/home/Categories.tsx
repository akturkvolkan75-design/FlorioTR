"use client";

import Image from "next/image";
import Link from "next/link";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

const categories = [
  {
    badge: "ROMANTİK",
    name: "Gül Buketleri",
    slug: "gul-buketleri",
    image: "/images/categories/gul-buketleri.jpg",
    description: "Sevginin en zarif hali",
    position: "center 48%",
  },
  {
    badge: "MEVSİMİN TAZELERİ",
    name: "Karışık Mevsim Buketleri",
    slug: "karisik-mevsim-buketleri",
    image: "/images/categories/mevsim-buketleri.jpg",
    description: "Renkli ve canlı seçimler",
    position: "center",
  },
  {
    badge: "DOĞAL",
    name: "Papatya & Gül Buketleri",
    slug: "papatya-gul-buketleri",
    image: "/images/categories/papatya-buketleri.jpg",
    description: "İçten, sıcak ve neşeli",
    position: "center",
  },
  {
    badge: "ZARİF",
    name: "Orkideler",
    slug: "orkideler",
    image: "/images/categories/orkide.jpg",
    description: "Kalıcı zarafetin simgesi",
    position: "center 42%",
  },
  {
    badge: "YAŞAYAN HEDİYE",
    name: "Saksı Çiçekleri",
    slug: "saksi-cicekleri",
    image: "/images/categories/saksi.jpg",
    description: "Evinize doğal bir dokunuş",
    position: "center 45%",
  },
  {
    badge: "KUTLAMA",
    name: "Düğün Sepetleri",
    slug: "dugun-sepetleri",
    image: "/images/categories/ozel-buketler.jpg",
    description: "Mutlu günlere özel tasarımlar",
    position: "center",
  },
  {
    badge: "TÖREN",
    name: "Çelenkler",
    slug: "celenkler",
    image: "/images/categories/celenkler.jpg",
    description: "Açılış, düğün ve kutlamalara",
    position: "center",
  },
  {
    badge: "PREMİUM",
    name: "VIP Koleksiyon",
    slug: "vip",
    image: "/images/categories/kutu-guller.jpg",
    description: "Gösterişli ve unutulmaz",
    position: "center",
  },
];

export default function Categories() {
  const { theme } = useTheme();
  const colors = themes[theme].colors;
  const isNight = theme === "night";

  return (
    <section aria-labelledby="category-title" className="h-full w-full">
      <div className="mb-3 flex min-h-12 items-end justify-between gap-4 px-0.5">
        <div>
          <p
            className="text-[9px] font-black uppercase tracking-[0.24em] sm:text-[10px]"
            style={{ color: colors.accent }}
          >
            FlorioTR seçkisi
          </p>
          <h2
            id="category-title"
            className="mt-0.5 text-xl font-black tracking-[-0.02em] sm:text-2xl"
            style={{ color: colors.foreground }}
          >
            Çiçek kategorileri
          </h2>
        </div>

        <p
          className="hidden max-w-[260px] text-right text-[11px] font-semibold leading-4 lg:block"
          style={{ color: colors.muted }}
        >
          Her ana uygun çiçeği kolayca keşfedin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={"/kategori/" + category.slug}
            aria-label={category.name + " kategorisini aç"}
            className="group relative h-44 overflow-hidden rounded-[20px] transition duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              border: "1px solid " + colors.cardBorder,
              boxShadow: "0 14px 34px " + colors.cardBorder + "24",
            }}
          >
            <Image
              fill
              src={category.image}
              alt=""
              sizes="(max-width: 1023px) 50vw, 20vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
              style={{ objectPosition: category.position }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />

            <div className="absolute left-2.5 top-2.5">
              <span
                className="inline-flex rounded-full border px-2.5 py-1 text-[8px] font-black tracking-[0.12em] backdrop-blur-md sm:text-[9px]"
                style={{
                  background: isNight
                    ? "rgba(13, 37, 33, 0.72)"
                    : "rgba(255, 251, 234, 0.88)",
                  borderColor: isNight
                    ? "rgba(227, 184, 102, 0.52)"
                    : "rgba(241, 211, 107, 0.72)",
                  color: isNight ? "#F5D998" : "#604916",
                }}
              >
                {category.badge}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
              <div className="min-w-0">
                <h3 className="text-sm font-black leading-[1.15] text-[#FFF1C9] sm:text-[15px]">
                  {category.name}
                </h3>
                <p className="mt-1 text-[9px] font-semibold leading-3 text-white/90 sm:text-[10px]">
                  {category.description}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-black backdrop-blur-md transition duration-300 group-hover:translate-x-0.5"
                style={{
                  background: "rgba(255, 255, 255, 0.14)",
                  borderColor: "rgba(255, 241, 201, 0.58)",
                  color: "#FFF1C9",
                }}
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
