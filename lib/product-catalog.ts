import { products as baseProducts } from "@/data/products";
import { prisma } from "@/lib/prisma";

export async function getProductCatalog() {
  const overrides = await prisma.productOverride.findMany();

  const map = new Map(
    overrides.map((item) => [item.slug, item])
  );

  const standard = baseProducts.map((product) => {
    const override = map.get(product.slug);

    return {
      ...product,

      // Fiyat şimdilik products.ts dosyasından gelir.
      price: product.price,

      // Admin tarafından değiştirilmiş görsel varsa onu koru.
      image: override?.image ?? product.image,

      // Admin ürün aktif/pasif yaptıysa onu koru.
      isActive: override?.isActive ?? true,
    };
  });

  const custom = overrides
    .filter(
      (item) =>
        item.isCustom &&
        item.catalogId &&
        item.name &&
        item.category &&
        item.description
    )
    .map((item) => ({
      id: item.catalogId!,
      slug: item.slug,
      name: item.name!,
      category: item.category!,
      price: item.price,
      rating: item.rating,
      image: item.image,
      description: item.description!,
      favorite: false,
      vip: item.vip,
      isActive: item.isActive,
    }));

  return [...standard, ...custom];
}