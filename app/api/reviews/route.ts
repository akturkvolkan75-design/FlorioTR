import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";
import { getCustomerSession } from "@/lib/customer-auth";

type ReviewRow = {
  id: number;
  orderId: number;
  productSlug: string;
  rating: number;
  comment: string | null;
  customerName: string;
  createdAt: string;
  isApproved: boolean;
};

type OrderReviewRow = {
  id: number;
  status: string;
  productName: string;
  productSlug: string | null;
  reviewId: number | null;
  rating: number | null;
  comment: string | null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get("productSlug")?.trim();
    const orderId = Number(searchParams.get("orderId"));
    const phone = searchParams.get("phone")?.trim();
    const featured = searchParams.get("featured") === "true";

    if (featured) {
      const reviews = await prisma.$queryRawUnsafe<Array<ReviewRow & { productName: string }>>(
        `SELECT r.id, r.orderId, r.productSlug, r.rating, r.comment, r.customerName, r.createdAt, r.isApproved, o.productName
         FROM Review r JOIN "Order" o ON o.id = r.orderId
         WHERE r.isApproved = 1 AND r.comment IS NOT NULL AND length(trim(r.comment)) > 0
         ORDER BY r.rating DESC, r.createdAt DESC LIMIT 20`
      );
      return NextResponse.json({ success: true, reviews });
    }

    if (productSlug) {
      const reviews = await prisma.$queryRawUnsafe<ReviewRow[]>(
        `SELECT id, orderId, productSlug, rating, comment, customerName, createdAt
         FROM Review WHERE productSlug = ? AND isApproved = 1 ORDER BY createdAt DESC`,
        productSlug
      );
      const average = reviews.length
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : null;

      return NextResponse.json({
        success: true,
        average,
        count: reviews.length,
        reviews,
      });
    }

    if (orderId && phone) {
      const rows = await prisma.$queryRawUnsafe<OrderReviewRow[]>(
        `SELECT o.id, o.status, o.productName, o.productSlug,
                r.id AS reviewId, r.rating, r.comment
         FROM "Order" o LEFT JOIN Review r ON r.orderId = o.id
         WHERE o.id = ? AND o.customerPhone = ? LIMIT 1`,
        orderId,
        phone
      );

      if (!rows[0]) {
        return NextResponse.json(
          { success: false, message: "Sipariş doğrulanamadı." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, order: rows[0] });
    }

    return NextResponse.json(
      { success: false, message: "Eksik sorgu bilgisi." },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Değerlendirmeler alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = Number(body.orderId);
    const productSlug = String(body.productSlug ?? "").trim();
    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim().slice(0, 500) || null;

    if (!orderId || !productSlug || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Değerlendirme bilgileri eksik." },
        { status: 400 }
      );
    }

    const customer = await getCustomerSession();
    if (!customer) return NextResponse.json({ success: false, message: "Yorum yapmak için giriş yapmalısınız." }, { status: 401 });

    const orders = await prisma.$queryRawUnsafe<
      Array<{ id: number; status: string; productName: string; productSlug: string | null; customerName: string }>
    >(
      `SELECT id, status, productName, productSlug, customerName
       FROM "Order" WHERE id = ? AND customerId = ? LIMIT 1`,
      orderId,
      customer.id
    );
    const order = orders[0];

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Sipariş doğrulanamadı." },
        { status: 404 }
      );
    }

    if (order.status !== "Teslim Edildi") {
      return NextResponse.json(
        { success: false, message: "Yalnızca teslim edilen ürünler puanlanabilir." },
        { status: 403 }
      );
    }

    const matchingProduct = products.find(
      (product) => product.slug === productSlug && product.name === order.productName
    );
    if (!matchingProduct || (order.productSlug && order.productSlug !== productSlug)) {
      return NextResponse.json(
        { success: false, message: "Ürün siparişle eşleşmiyor." },
        { status: 400 }
      );
    }

    const existing = await prisma.$queryRawUnsafe<Array<{ id: number }>>(
      "SELECT id FROM Review WHERE orderId = ? LIMIT 1",
      orderId
    );
    if (existing[0]) {
      return NextResponse.json(
        { success: false, message: "Bu sipariş daha önce değerlendirilmiş." },
        { status: 409 }
      );
    }

    await prisma.$executeRawUnsafe(
      `INSERT INTO Review (orderId, productSlug, rating, comment, customerName, isApproved)
       VALUES (?, ?, ?, ?, ?, 0)`,
      orderId,
      productSlug,
      rating,
      comment,
      order.customerName
    );

    return NextResponse.json({ success: true, message: "Değerlendirmeniz yönetici onayına gönderildi." });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Değerlendirme kaydedilemedi." },
      { status: 500 }
    );
  }
}
