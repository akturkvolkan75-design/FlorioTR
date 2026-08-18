import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json(
      {
        success: false,
        message: "Yetkisiz erişim.",
      },
      { status: 401 }
    );
  }

  const [orders, flowerShops] = await Promise.all([
    prisma.order.findMany({
      where: {
        paymentStatus: "Ödendi",
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        flowerShop: {
          select: {
            id: true,
            shopName: true,
          },
        },

        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    }),

    prisma.flowerShop.findMany({
      where: {
        status: "Onaylandı",
      },

      orderBy: {
        shopName: "asc",
      },

      select: {
        id: true,
        shopName: true,
        city: true,
        district: true,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    orders,
    flowerShops,
  });
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json(
      {
        success: false,
        message: "Yetkisiz erişim.",
      },
      { status: 401 }
    );
  }

  const { id, status, flowerShopId } = await request.json();

  if (flowerShopId !== undefined) {
    const shopId =
      flowerShopId === null
        ? null
        : Number(flowerShopId);

    if (shopId !== null) {
      const shop =
        await prisma.flowerShop.findFirst({
          where: {
            id: shopId,
            status: "Onaylandı",
          },
        });

      if (!shop) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Onaylı çiçekçi bulunamadı.",
          },
          { status: 404 }
        );
      }
    }

    const order = await prisma.order.update({
      where: {
        id: Number(id),
      },

      data: {
        flowerShopId: shopId,
        assignedAt: shopId
          ? new Date()
          : null,
      },

      include: {
        flowerShop: {
          select: {
            id: true,
            shopName: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: shopId
        ? "Sipariş çiçekçiye atandı."
        : "Çiçekçi ataması kaldırıldı.",
    });
  }

  const allowed = [
    "Yeni",
    "Hazırlanıyor",
    "Hazır",
    "Kuryede",
    "Teslim Edildi",
    "İptal",
  ];

  if (!allowed.includes(status)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Geçersiz sipariş durumu.",
      },
      { status: 400 }
    );
  }

  const current =
    await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!current) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Sipariş bulunamadı.",
      },
      { status: 404 }
    );
  }

  await prisma.$transaction([
    prisma.order.update({
      where: {
        id: Number(id),
      },

      data: {
        status,
      },
    }),

    prisma.orderHistory.create({
      data: {
        orderId: Number(id),
        oldStatus: current.status,
        newStatus: status,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
  });
}