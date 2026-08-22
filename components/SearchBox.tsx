"use client";

import Link from "next/link";
import { useState } from "react";

import FlorioLogo from "@/components/FlorioLogo";
import { useTheme } from "@/context/ThemeContext";
import { flowers } from "@/data/flowers";
import { themes } from "@/themes/themes";

export default function SearchBox() {
  const [search, setSearch] = useState("");

  const { theme } = useTheme();

  const colors = themes[theme].colors;

  const results = Object.entries(flowers).filter(
    ([, flower]) =>
      flower.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      flower.location
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Çiçekçi veya konum ara"
        className="
          w-full
          rounded-2xl
          border
          border-gray-200
          bg-white
          px-6
          py-4
          text-lg
          text-gray-900
          shadow-lg
          outline-none
          focus:border-pink-500
        "
      />

      {search && (
        <div
          className="
            absolute
            z-50
            mt-3
            w-full
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-xl
          "
        >
          {results.length > 0 ? (
            results.map(([slug, flower]) => (
              <Link
                key={slug}
                href={`/cicekci/${slug}`}
                className="
                  block
                  cursor-pointer
                  border-b
                  border-gray-100
                  p-5
                  transition
                  hover:bg-pink-50
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <FlorioLogo
                      primary={colors.primary}
                      accent={colors.accent}
                      compact
                      iconOnly
                    />

                    <h3 className="font-bold text-gray-800">
                      {flower.name}
                    </h3>
                  </div>

                  <p className="mt-1 text-gray-600">
                    📍 {flower.location}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                p-5
                text-center
                text-gray-500
              "
            >
              <FlorioLogo
                primary={colors.primary}
                accent={colors.accent}
                compact
                iconOnly
              />

              <span>Çiçekçi bulunamadı</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}