import { NextResponse } from "next/server";
import { assignOrderToFlowerShop } from "@/lib/order-routing";
import { retrieveCheckoutForm } from "@/lib/iyzico";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    new URL(request.url).origin;

  try {
    const form = await request.formData();

    const token = String(
      form.get("token") || "",
    );

    if (!token) {
      return NextResponse.redirect(
        `${origin}/siparis-onay?payment=failed`,
        303,
      );
    }

    const result =
      await retrieveCheckoutForm(token);

    const orderId = Number(
      result.basketId ||
        result.conversationId,
    );

    const status = String(
      result.status || "",
    );

    const paymentStatus = String(
      result.paymentStatus || "",
    );

    if (
      status !== "success" ||
      paymentStatus !== "SUCCESS" ||
      !Number.isInteger(orderId)
    ) {
      if (Number.isInteger(orderId)) {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            paymentStatus: "Başarısız",
          },
        });
      }

      return NextResponse.redirect(
        `${origin}/siparis-onay?payment=failed`,
        303,
      );
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: "Ödendi",
        status: "Yeni",
      },
    });

    await assignOrderToFlowerShop(
      orderId,
    );

    return NextResponse.redirect(
      `${origin}/siparis-onay?payment=success&orderId=${orderId}`,
      303,
    );
  } catch (error) {
    console.error(
      "Ödeme doğrulama hatası:",
      error,
    );

    return NextResponse.redirect(
      `${origin}/siparis-onay?payment=failed`,
      303,
    );
  }
}