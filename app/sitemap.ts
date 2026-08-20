import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.floriotr.com";

  const now = new Date();

  const categorySlugs = [
    "gul-buketleri",
    "ozel-buketler",
    "papatya-buketleri",
    "mevsim-buketleri",
    "orkideler",
    "saksi-cicekleri",
    "celenkler",
    "kutu-guller",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${baseUrl}/yorumlar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap =
    categorySlugs.map((slug) => ({
      url: `${baseUrl}/kategori/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const productPages: MetadataRoute.Sitemap =
    products.map((product) => ({
      url: `${baseUrl}/urunler/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
  ];
}