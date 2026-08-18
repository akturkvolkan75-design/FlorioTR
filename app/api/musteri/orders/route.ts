import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customer = await getCustomerSession();

  if (!customer) {
    return NextResponse.json(
      {
        success: false,
        message: "Giriş yapmalısınız.",
      },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      customerId: customer.id,
      paymentStatus: "Ödendi",
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      productName: true,
      productSlug: true,
      quantity: true,
      price: true,
      status: true,
      paymentStatus: true,
      district: true,
      createdAt: true,
      preparationImage: true,

      review: {
        select: {
          id: true,
          rating: true,
          comment: true,
        },
      },
    },
  });

  return NextResponse.json({
    success: true,
    orders,
  });
}