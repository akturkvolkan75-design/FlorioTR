import { NextResponse } from "next/server";
import { getProductCatalog } from "@/lib/product-catalog";
import { prisma } from "@/lib/prisma";
import { initializeCheckoutForm } from "@/lib/iyzico";
import { getCustomerSession } from "@/lib/customer-auth";

type CartInput = {
  id?: unknown;
  quantity?: unknown;
};

function cleanPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  return digits.startsWith("90")
    ? `+${digits}`
    : `+90${digits.replace(/^0/, "")}`;
}

export async function POST(request: Request) {
  try {
    const signedInCustomer = await getCustomerSession();

    if (!signedInCustomer) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Ödeme için müşteri hesabınıza giriş yapmalısınız.",
          loginRequired: true,
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const products = (await getProductCatalog()).filter(
      (product) => product.isActive
    );

    const customer = body.customer ?? {};

    const cart = Array.isArray(body.cart)
      ? (body.cart as CartInput[])
      : [];

    if (
      !customer.receiverName ||
      !customer.receiverPhone ||
      !customer.senderName ||
      !customer.senderPhone ||
      !customer.email ||
      !customer.identityNumber ||
      !customer.district ||
      !customer.address ||
      !customer.deliveryDate ||
      !customer.deliveryTimeSlot ||
      !cart.length
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Lütfen zorunlu alanları doldurun ve sepetinizi kontrol edin.",
        },
        {
          status: 400,
        }
      );
    }

    const identityNumber = String(
      customer.identityNumber
    ).replace(/\D/g, "");

    if (!/^\d{11}$/.test(identityNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "T.C. kimlik numarası 11 rakam olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    const basket = cart.map((item) => {
      const product = products.find(
        (candidate) =>
          candidate.id === Number(item.id)
      );

      const quantity = Number(item.quantity);

      if (
        !product ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        throw new Error("INVALID_CART");
      }

      return {
        product,
        quantity,
        lineTotal: product.price * quantity,
      };
    });

    const total = basket.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const names = String(customer.senderName)
      .trim()
      .split(/\s+/);

    const buyerName =
      names.shift() || "FlorioTR";

    const buyerSurname =
      names.join(" ") || "Müşteri";

    const order = await prisma.order.create({
      data: {
        customerName:
          String(customer.receiverName).trim(),

        customerPhone:
          String(customer.receiverPhone).trim(),

        senderPhone:
          String(customer.senderPhone).trim(),

        city: "İstanbul",

        district:
          String(customer.district),

        address:
          String(customer.address).trim(),

        customerNote:
          String(customer.customerNote || "")
            .trim() || null,

        recipientNote:
          String(customer.recipientNote || "")
            .trim() || null,

        deliveryDate:
          String(customer.deliveryDate),

        deliveryTimeSlot:
          String(customer.deliveryTimeSlot),

        productName:
          basket
            .map(
              (item) =>
                `${item.product.name} x${item.quantity}`
            )
            .join(", "),

        productSlug:
          basket.length === 1
            ? basket[0].product.slug
            : null,

        quantity:
          basket.reduce(
            (sum, item) =>
              sum + item.quantity,
            0
          ),

        price: total,

        paymentStatus:
          "Ödeme Bekliyor",

        status:
          "Ödeme Bekliyor",

        customerId:
          signedInCustomer.id,
      },
    });

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(request.url).origin;

    const result =
      await initializeCheckoutForm({
        locale: "tr",

        conversationId:
          String(order.id),

        price:
          total.toFixed(2),

        paidPrice:
          total.toFixed(2),

        currency: "TRY",

        basketId:
          String(order.id),

        paymentGroup:
          "PRODUCT",

        callbackUrl:
          `${origin}/api/payment/callback`,

        enabledInstallments:
          [1, 2, 3, 6, 9],

        buyer: {
          id:
            `customer-${signedInCustomer.id}`,

          name:
            buyerName,

          surname:
            buyerSurname,

          gsmNumber:
            cleanPhone(
              String(customer.senderPhone)
            ),

          email:
            String(customer.email).trim(),

          identityNumber,

          registrationAddress:
            String(customer.address).trim(),

          ip:
            request.headers
              .get("x-forwarded-for")
              ?.split(",")[0]
              ?.trim() ||
            "127.0.0.1",

          city: "İstanbul",

          country: "Turkey",
        },

        shippingAddress: {
          contactName:
            String(
              customer.receiverName
            ).trim(),

          city: "İstanbul",

          country: "Turkey",

          address:
            String(customer.address).trim(),
        },

        billingAddress: {
          contactName:
            String(
              customer.senderName
            ).trim(),

          city: "İstanbul",

          country: "Turkey",

          address:
            String(customer.address).trim(),
        },

        basketItems:
          basket.map(
            ({ product, lineTotal }) => ({
              id:
                String(product.id),

              name:
                product.name,

              category1:
                product.category,

              itemType:
                "PHYSICAL",

              price:
                lineTotal.toFixed(2),
            })
          ),
      });

    const status =
      String(result.status || "");

    const paymentPageUrl =
      typeof result.paymentPageUrl ===
      "string"
        ? result.paymentPageUrl
        : "";

    if (
      status !== "success" ||
      !paymentPageUrl
    ) {
      await prisma.order.update({
        where: {
          id: order.id,
        },

        data: {
          paymentStatus:
            "Başlatılamadı",
        },
      });

      return NextResponse.json(
        {
          success: false,

          message:
            String(
              result.errorMessage ||
              "Ödeme başlatılamadı."
            ),
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,

      paymentPageUrl,

      orderId:
        order.id,
    });
  } catch (error) {
    const message =
      error instanceof Error &&
      error.message ===
        "IYZICO_CONFIG_MISSING"
        ? "iyzico test anahtarları henüz tanımlanmamış."
        : "Ödeme başlatılırken bir hata oluştu.";

    console.error(
      "Ödeme başlatma hatası:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      }
    );
  }
}