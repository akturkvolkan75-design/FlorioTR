"use client";

import { useEffect, useState } from "react";

export default function ProductRating({
  productSlug,
  fallback,
}: {
  productSlug: string;
  fallback: number;
}) {
  const [summary, setSummary] = useState<{ average: number | null; count: number } | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/reviews?productSlug=${encodeURIComponent(productSlug)}`)
      .then((response) => response.json())
      .then((data) => {
        if (active && data.success) {
          setSummary({ average: data.average, count: data.count });
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [productSlug]);

  const displayedRating = summary?.average ?? fallback;
  return (
    <span>
      ⭐ {displayedRating.toFixed(1)}
      {summary?.count ? ` (${summary.count})` : ""}
    </span>
  );
}
