"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/themes/themes";

type Reply = {
  id: number;
  message: string;
  customerName: string;
  createdAt: string;
};

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  customerName: string;
  createdAt: string;
  replies?: Reply[];
};

type Customer = {
  id: number;
  name: string;
  email: string;
};

export default function ProductReviews({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { theme } = useTheme();
  const colors = themes[theme].colors;

  const loadReviews = useCallback(async () => {
    try {
      const response = await fetch(`/api/reviews?productSlug=${encodeURIComponent(productSlug)}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (data.success) setReviews(data.reviews ?? []);
    } catch {
      setMessage("Yorumlar şu anda yüklenemedi.");
    }
  }, [productSlug]);

  useEffect(() => {
    const reviewTimer = window.setTimeout(() => {
      void loadReviews();
    }, 0);

    fetch("/api/musteri/auth", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setCustomer(data.authenticated ? data.customer : null))
      .catch(() => setCustomer(null));

    return () => window.clearTimeout(reviewTimer);
  }, [loadReviews]);

  const average = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : null;

  async function sendReview() {
    if (!customer || !comment.trim()) {
      setMessage(customer ? "Lütfen yorumunuzu yazın." : "Yorum yazmak için giriş yapmalısınız.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productSlug, rating, comment }),
      });
      const data = await response.json();
      setMessage(data.message || (data.success ? "Yorumunuz alındı." : "Yorum gönderilemedi."));
      if (data.success) {
        setComment("");
        setRating(5);
        await loadReviews();
      }
    } catch {
      setMessage("Yorum gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mt-4 rounded-2xl p-4" style={{ background: colors.background }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-black" style={{ color: colors.primary }}>
          ⭐ Müşteri Yorumları
        </h2>
        <span className="text-sm font-black" style={{ color: colors.foreground }}>
          {reviews.length ? `⭐ ${average?.toFixed(1)} (${reviews.length})` : "Henüz yorum yok"}
        </span>
      </div>

      {customer ? (
        <div
          className="mt-3 grid items-center gap-3 rounded-xl border p-3 lg:grid-cols-[auto_minmax(180px,1fr)_auto]"
          style={{ background: colors.card, borderColor: colors.cardBorder }}
        >
          <div>
            <p className="text-xs font-black" style={{ color: colors.foreground }}>
              {customer.name} olarak yorum yaz
            </p>
            <div className="mt-1 flex gap-1" aria-label="Yıldız puanı">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-lg transition hover:scale-110"
                  aria-label={`${star} yıldız ver`}
                >
                  {star <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={500}
            placeholder="Deneyiminizi paylaşın..."
            className="h-14 w-full resize-none rounded-lg border px-3 py-2 text-sm"
          />

          <button
            type="button"
            disabled={sending}
            onClick={() => void sendReview()}
            className="rounded-lg px-4 py-2.5 text-sm font-black disabled:opacity-50"
            style={{ background: colors.actionPrimary, color: colors.actionPrimaryText }}
          >
            {sending ? "Gönderiliyor..." : "Yorumu Gönder"}
          </button>
        </div>
      ) : (
        <div className="mt-3 rounded-xl border p-3 text-sm font-bold" style={{ background: colors.card, borderColor: colors.cardBorder }}>
          Yorumları herkes okuyabilir. Yorum yazmak için{" "}
          <Link
            href={`/musteri/giris?next=${encodeURIComponent(`/urunler/${productSlug}`)}`}
            className="underline"
            style={{ color: colors.primary }}
          >
            e-posta hesabınızla giriş yapın
          </Link>
          .
        </div>
      )}

      {message && (
        <p className="mt-2 rounded-lg p-2 text-sm font-bold" style={{ background: colors.card, color: colors.foreground }}>
          {message}
        </p>
      )}

      {reviews.length > 0 && (
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl border p-3" style={{ background: colors.card, borderColor: colors.cardBorder }}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <strong style={{ color: colors.foreground }}>{review.customerName}</strong>
                <span>{"⭐".repeat(review.rating)}</span>
              </div>
              {review.comment && <p className="mt-2 text-sm font-medium" style={{ color: colors.muted }}>{review.comment}</p>}
              {review.replies?.map((reply) => (
                <p key={reply.id} className="mt-2 rounded-lg bg-slate-100 p-2 text-xs">
                  <strong>{reply.customerName}:</strong> {reply.message}
                </p>
              ))}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
