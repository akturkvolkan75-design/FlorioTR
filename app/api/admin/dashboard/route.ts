import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";

export async function GET(request: Request) {
  try {
    // =====================================================
    // YÖNETİCİ KONTROLÜ
    // =====================================================

    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Yetkisiz erişim.",
        },
        { status: 401 },
      );
    }

    // =====================================================
    // FİLTRELER
    // =====================================================

    const { searchParams } = new URL(request.url);

    const start =
      searchParams.get("start")?.trim() || null;

    const end =
      searchParams.get("end")?.trim() || null;

    const shopIdParam =
      searchParams.get("shopId");

    const parsedShopId =
      shopIdParam ? Number(shopIdParam) : null;

    const shopId =
      parsedShopId &&
      Number.isInteger(parsedShopId) &&
      parsedShopId > 0
        ? parsedShopId
        : null;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (start) {
      const parsed = new Date(`${start}T00:00:00`);

      if (!Number.isNaN(parsed.getTime())) {
        startDate = parsed;
      }
    }

    if (end) {
      const parsed = new Date(`${end}T23:59:59.999`);

      if (!Number.isNaN(parsed.getTime())) {
        endDate = parsed;
      }
    }

    const createdAtFilter =
      startDate || endDate
        ? {
            ...(startDate
              ? { gte: startDate }
              : {}),
            ...(endDate
              ? { lte: endDate }
              : {}),
          }
        : undefined;

    // =====================================================
    // ÇİÇEKÇİLER
    // =====================================================

    const flowerShops =
      await prisma.flowerShop.findMany({
        where: shopId
          ? {
              id: shopId,
            }
          : undefined,

        orderBy: {
          createdAt: "desc",
        },
      });

    // =====================================================
    // SİPARİŞLER
    // =====================================================

    const orders =
      await prisma.order.findMany({
        where: {
          ...(shopId
            ? {
                flowerShopId: shopId,
              }
            : {}),

          ...(createdAtFilter
            ? {
                createdAt: createdAtFilter,
              }
            : {}),
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    // =====================================================
    // YORUMLAR
    // =====================================================

    const reviews =
      await prisma.review.findMany({
        where: {
          ...(createdAtFilter
            ? {
                createdAt: createdAtFilter,
              }
            : {}),

          ...(shopId
            ? {
                order: {
                  flowerShopId: shopId,
                },
              }
            : {}),
        },

        include: {
          order: {
            include: {
              flowerShop: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 100,
      });

    // =====================================================
    // ÇİÇEKÇİ RAPORLARI
    // =====================================================

    const shopReports =
      flowerShops.map((shop) => {
        const shopOrders =
          orders.filter(
            (order) =>
              order.flowerShopId === shop.id,
          );

        const shopReviews =
          reviews.filter(
            (review) =>
              review.order?.flowerShopId ===
              shop.id,
          );

        const deliveredOrders =
          shopOrders.filter(
            (order) =>
              order.status ===
              "Teslim Edildi",
          ).length;

        const cancelledOrders =
          shopOrders.filter(
            (order) =>
              order.status === "İptal",
          ).length;

        const activeOrders =
          shopOrders.filter(
            (order) =>
              order.status !==
                "Teslim Edildi" &&
              order.status !== "İptal",
          ).length;

        const productKeys =
          new Set(
            shopOrders.map(
              (order) =>
                order.productSlug ||
                order.productName,
            ),
          );

        const ratingValues =
          shopReviews.map(
            (review) =>
              Number(review.rating),
          );

        const averageRating =
          ratingValues.length > 0
            ? ratingValues.reduce(
                (sum, rating) =>
                  sum + rating,
                0,
              ) / ratingValues.length
            : null;

        return {
          id: shop.id,
          shopName: shop.shopName,
          owner: shop.owner,
          phone: shop.phone,
          email: shop.email,
          city: shop.city,
          district: shop.district,
          status: shop.status,

          createdAt:
            shop.createdAt.toISOString(),

          totalOrders:
            shopOrders.length,

          deliveredOrders,

          cancelledOrders,

          activeOrders,

          productCount:
            productKeys.size,

          averageRating,

          reviewCount:
            shopReviews.length,
        };
      });

    // =====================================================
    // ÜRÜN RAPORLARI
    // =====================================================

    const productReports =
      products.map((product) => {
        const productOrders =
          orders.filter(
            (order) =>
              order.productSlug ===
              product.slug,
          );

        const productReviews =
          reviews.filter(
            (review) =>
              review.productSlug ===
              product.slug,
          );

        const ratings =
          productReviews.map(
            (review) =>
              Number(review.rating),
          );

        const averageRating =
          ratings.length > 0
            ? ratings.reduce(
                (sum, rating) =>
                  sum + rating,
                0,
              ) / ratings.length
            : null;

        return {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,

          orderCount:
            productOrders.length,

          averageRating,

          reviewCount:
            productReviews.length,
        };
      });

    // =====================================================
    // FİNANSAL RAPOR
    // =====================================================

    const revenue =
      orders.reduce(
        (sum, order) => {
          return (
            sum +
            Number(order.price) *
              Number(order.quantity)
          );
        },
        0,
      );

    const averageOrder =
      orders.length > 0
        ? revenue / orders.length
        : 0;

    const allRatings =
      reviews.map(
        (review) =>
          Number(review.rating),
      );

    const reviewAverage =
      allRatings.length > 0
        ? allRatings.reduce(
            (sum, rating) =>
              sum + rating,
            0,
          ) / allRatings.length
        : null;

    // =====================================================
    // GÜNLÜK ZAMAN ÇİZELGESİ
    // =====================================================

    const timelineMap =
      new Map<
        string,
        {
          period: string;
          orders: number;
          delivered: number;
          cancelled: number;
          revenue: number;
        }
      >();

    for (const order of orders) {
      const period =
        order.createdAt
          .toISOString()
          .slice(0, 10);

      const current =
        timelineMap.get(period) || {
          period,
          orders: 0,
          delivered: 0,
          cancelled: 0,
          revenue: 0,
        };

      current.orders += 1;

      if (
        order.status ===
        "Teslim Edildi"
      ) {
        current.delivered += 1;
      }

      if (
        order.status === "İptal"
      ) {
        current.cancelled += 1;
      }

      current.revenue +=
        Number(order.price) *
        Number(order.quantity);

      timelineMap.set(
        period,
        current,
      );
    }

    const timeline =
      Array.from(
        timelineMap.values(),
      ).sort((a, b) =>
        a.period.localeCompare(
          b.period,
        ),
      );

    // =====================================================
    // GENEL TOPLAMLAR
    // =====================================================

    const delivered =
      orders.filter(
        (order) =>
          order.status ===
          "Teslim Edildi",
      ).length;

    const cancelled =
      orders.filter(
        (order) =>
          order.status === "İptal",
      ).length;

    const pendingShops =
      flowerShops.filter(
        (shop) =>
          shop.status ===
          "Onay Bekliyor",
      ).length;

    const successRate =
      orders.length > 0
        ? Math.round(
            (delivered /
              orders.length) *
              100,
          )
        : 0;

    const lowRatingCount =
      reviews.filter(
        (review) =>
          Number(review.rating) <= 2,
      ).length;

    // =====================================================
    // YORUMLARI FRONTEND FORMATINA ÇEVİR
    // =====================================================

    const reviewReports =
      reviews.map((review) => ({
        id: review.id,
        rating:
          Number(review.rating),

        comment:
          review.comment,

        customerName:
          review.customerName,

        createdAt:
          review.createdAt.toISOString(),

        productSlug:
          review.productSlug,

        productName:
          review.order?.productName ||
          "",

        shopName:
          review.order?.flowerShop
            ?.shopName || null,
      }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      range: {
        start,
        end,
      },

      selectedShopId:
        shopId,

      totals: {
        shops:
          flowerShops.length,

        pendingShops,

        orders:
          orders.length,

        delivered,

        cancelled,

        revenue,

        averageOrder,

        successRate,

        reviewAverage,

        reviewCount:
          reviews.length,

        lowRatingCount,
      },

      timeline,

      shops:
        shopReports,

      products:
        productReports,

      reviews:
        reviewReports,
    });
  } catch (error) {
    console.error(
      "Admin dashboard hatası:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Yönetim raporları alınamadı.",
      },
      { status: 500 },
    );
  }
}