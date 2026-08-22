import sharp from "sharp";
import { NextResponse } from "next/server";

import { savePublicImage } from "@/lib/image-storage";
import { prisma } from "@/lib/prisma";

const allowed = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const orderId = Number(
      form.get("orderId")
    );

    const flowerShopId = Number(
      form.get("flowerShopId")
    );

    const file = form.get("image");

    if (
      !orderId ||
      !flowerShopId ||
      !(file instanceof File) ||
      !file.size
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Sipariş ve fotoğraf bilgisi eksik.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size > 10 * 1024 * 1024 ||
      !allowed.includes(file.type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Fotoğraf JPG, PNG, WebP veya AVIF ve en fazla 10 MB olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await prisma.order.findFirst({
        where: {
          id: orderId,
          flowerShopId,
        },

        include: {
          customer: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Bu sipariş size ait değil.",
        },
        {
          status: 403,
        }
      );
    }

    const optimized = await sharp(
      Buffer.from(
        await file.arrayBuffer()
      )
    )
      .rotate()
      .resize({
        width: 1400,
        height: 1400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 84,
      })
      .toBuffer();

    const preparationImage =
      await savePublicImage({
        bucket:
          "order-preparations",

        prefix:
          `order-${orderId}`,

        contents:
          optimized,
      });

    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        preparationImage,
      },
    });

    let notificationSent =
      false;

    const apiKey =
      process.env.RESEND_API_KEY;

    if (
      apiKey &&
      order.customer?.email
    ) {
      try {
        const customerName =
          escapeHtml(
            order.customer.name
          );

        const productName =
          escapeHtml(
            order.productName
          );

        const response =
          await fetch(
            "https://api.resend.com/emails",
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${apiKey}`,

                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                from:
                  process.env
                    .VERIFICATION_EMAIL_FROM ||
                  "FlorioTR <onboarding@resend.dev>",

                to: [
                  order.customer.email,
                ],

                subject:
                  "Siparişiniz hazırlandı",

                html: `
                  <div
                    style="
                      max-width:620px;
                      margin:auto;
                      padding:28px;
                      font-family:Arial,sans-serif;
                      color:#17382f;
                    "
                  >
                    <p
                      style="
                        margin:0 0 12px;
                        font-size:12px;
                        font-weight:700;
                        letter-spacing:2px;
                        color:#a8782d;
                      "
                    >
                      FLORIOTR
                    </p>

                    <h2
                      style="
                        margin:0 0 20px;
                        color:#123f34;
                      "
                    >
                      Siparişiniz hazırlandı
                    </h2>

                    <p>
                      Merhaba ${customerName},
                    </p>

                    <p>
                      <strong>${productName}</strong>
                      siparişiniz FlorioTR tarafından hazırlandı.
                    </p>

                    <p>
                      Hazırlanan ürününüzün gerçek fotoğrafını
                      FlorioTR hesabınızdaki
                      <strong>Siparişlerim</strong>
                      bölümünden görüntüleyebilirsiniz.
                    </p>

                    <p
                      style="
                        margin-top:28px;
                        font-weight:700;
                        color:#123f34;
                      "
                    >
                      FlorioTR Ekibi
                    </p>
                  </div>
                `,
              }),
            }
          );

        notificationSent =
          response.ok;

        if (!response.ok) {
          console.error(
            "Hazırlık bildirimi gönderilemedi:",
            response.status
          );
        }
      } catch (error) {
        console.error(
          "Hazırlık bildirimi gönderilemedi:",
          error
        );
      }
    }

    return NextResponse.json({
      success: true,
      preparationImage,
      notificationSent,
      message:
        "Hazırlık fotoğrafı müşteriye gönderildi.",
    });
  } catch (error) {
    console.error(
      "Hazırlık fotoğrafı yüklenemedi:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Fotoğraf yüklenemedi.",
      },
      {
        status: 500,
      }
    );
  }
}