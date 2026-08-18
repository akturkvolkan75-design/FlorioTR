"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  customerName: string;
  createdAt: string;
};

export default function ProductReviews({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  useEffect(() => {
    fetch(`/api/reviews?productSlug=${encodeURIComponent(productSlug)}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
          setAverage(data.average);
        }
      })
      .catch(() => undefined);
  }, [productSlug]);

  return (
    <section className="mt-12 rounded-3xl p-6" style={{ background: colors.background }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-black" style={{ color: colors.primary }}>
          Müşteri Değerlendirmeleri
        </h2>
        <span className="font-black" style={{ color: colors.foreground }}>
          {reviews.length ? `⭐ ${average?.toFixed(1)} • ${reviews.length} değerlendirme` : "Henüz değerlendirme yok"}
        </span>
      </div>

      {reviews.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border p-4" style={{ background: colors.card, borderColor: colors.cardBorder }}>
              <div className="flex items-center justify-between gap-3">
                <strong style={{ color: colors.foreground }}>{review.customerName}</strong>
                <span>{"⭐".repeat(review.rating)}</span>
              </div>
              <p className="mt-1 text-xs font-bold text-emerald-700">✓ Doğrulanmış Alışveriş</p>
              {review.comment && <p className="mt-3 font-medium" style={{ color: colors.muted }}>{review.comment}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
