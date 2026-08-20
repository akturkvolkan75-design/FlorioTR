"use client";

import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

const categories = [
  {
    name: "Gül Buketleri",
    slug: "gul-buketleri",
    image: "/images/categories/gul-buketleri.jpg",
    description: "Sevginin en zarif hali",
    position: "center 48%",
  },
  {
    name: "Özel Buketler",
    slug: "ozel-buketler",
    image: "/images/categories/ozel-buketler.jpg",
    description: "Özel tasarımlar",
    position: "center",
  },
  {
    name: "Papatya Buketleri",
    slug: "papatya-buketleri",
    image: "/images/categories/papatya.jpg",
    description: "Doğallığın simgesi",
    position: "center",
  },
  {
    name: "Mevsim Buketleri",
    slug: "mevsim-buketleri",
    image: "/images/categories/mevsim.jpg",
    description: "Mevsimin renkleri",
    position: "center",
  },
  {
    name: "Orkideler",
    slug: "orkideler",
    image: "/images/categories/orkide.jpg",
    description: "Zarafet ve şıklık",
    position: "center 42%",
  },
  {
    name: "Saksı Çiçekleri",
    slug: "saksi-cicekleri",
    image: "/images/categories/saksi.jpg",
    description: "Doğal güzellik",
    position: "center 45%",
  },
  {
    name: "Çelenkler",
    slug: "celenkler",
    image: "/images/categories/celenk.jpg",
    description: "Özel gün tasarımları",
    position: "center",
  },
  {
    name: "Kutu Güller",
    slug: "kutu-guller",
    image: "/images/categories/kutu-gul.jpg",
    description: "Şık sürprizler",
    position: "center",
  },
];

export default function Categories() {
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  const isNight = theme === "night";

  const titleColor = isNight
    ? "#F4D58A"
    : "#FFE89A";

  const descriptionColor = isNight
    ? "#FFF5DF"
    : "#FFFBEF";

  return (
    <section className="h-full w-full">
      <div
        className="
          grid
          h-full
          grid-cols-2
          gap-[2px]
          overflow-hidden
          rounded-[22px]
          lg:grid-cols-4
        "
        style={{
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/kategori/${category.slug}`}
            className="
              group
              relative
              h-52
              overflow-hidden
            "
          >
            <img
              src={category.image}
              alt={category.name}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition
                duration-500
                group-hover:scale-105
              "
              style={{
                objectPosition: category.position,
              }}
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/80
                via-black/5
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-3
                left-3
                right-3
              "
            >
              <h3
                className="
                  text-[13px]
                  font-bold
                  leading-4
                  tracking-[0.01em]
                  md:text-sm
                "
                style={{
                  color: titleColor,
                }}
              >
                {category.name}
              </h3>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  font-medium
                  leading-3
                  md:text-[10px]
                "
                style={{
                  color: descriptionColor,
                }}
              >
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}