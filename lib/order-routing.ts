import { prisma } from "./prisma";

const ACTIVE_ORDER_STATUSES = [
  "Yeni",
  "Kabul Edildi",
  "Hazırlanıyor",
  "Hazır",
  "Kuryede",
];

function normalizeLocation(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("i̇", "i");
}

export async function assignOrderToFlowerShop(orderId: number) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error("Sipariş bulunamadı.");
  }

  // Sipariş daha önce bir çiçekçiye atanmışsa tekrar atama yapma.
  if (order.flowerShopId) {
    if (!order.assignedAt) {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          assignedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      message: "Sipariş daha önce yönlendirilmiş.",
    };
  }

  // Sadece aktif/onaylı çiçekçileri getir.
  // Her çiçekçinin o anda kaç aktif siparişi olduğunu da hesapla.
  const approvedShops = await prisma.flowerShop.findMany({
    where: {
      status: {
        in: ["Onaylandı", "Aktif"],
      },
    },

    include: {
      orders: {
        where: {
          paymentStatus: "Ödendi",
          status: {
            in: ACTIVE_ORDER_STATUSES,
          },
        },

        select: {
          id: true,
        },
      },
    },
  });

  if (!approvedShops.length) {
    return {
      success: false,
      message:
        "Sistemde aktif ve onaylı çiçekçi bulunamadı. Sipariş yönetici kontrolüne bırakıldı.",
    };
  }

  const orderCity = normalizeLocation(order.city);
  const orderDistrict = normalizeLocation(order.district);

  // ========================================
  // 1. ÖNCELİK: AYNI İLÇE
  // ========================================

  const districtShops = approvedShops
    .filter(
      (shop) =>
        normalizeLocation(shop.city) === orderCity &&
        normalizeLocation(shop.district) === orderDistrict,
    )
    .sort(
      (a, b) =>
        a.orders.length - b.orders.length ||
        a.id - b.id,
    );

  let flowerShop = districtShops[0];

  let routingType = "İlçe";

  // ========================================
  // 2. ÖNCELİK: AYNI ŞEHİR
  // ========================================

  if (!flowerShop) {
    const cityShops = approvedShops
      .filter(
        (shop) =>
          normalizeLocation(shop.city) === orderCity,
      )
      .sort(
        (a, b) =>
          a.orders.length - b.orders.length ||
          a.id - b.id,
      );

    flowerShop = cityShops[0];
    routingType = "Şehir";
  }

  // ========================================
  // UYGUN ÇİÇEKÇİ YOK
  // ========================================

  if (!flowerShop) {
    return {
      success: false,
      message:
        "Siparişin bulunduğu şehirde aktif çiçekçi bulunamadı. Sipariş yönetici kontrolüne bırakıldı.",
    };
  }

  // ========================================
  // SİPARİŞİ ÇİÇEKÇİYE ATA
  // ========================================

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      flowerShopId: flowerShop.id,
      assignedAt: new Date(),
    },
  });

  console.log(
    `Sipariş #${orderId} otomatik olarak ${flowerShop.shopName} çiçekçisine atandı. Yöntem: ${routingType}`,
  );

  return {
    success: true,

    message:
      routingType === "İlçe"
        ? `${flowerShop.shopName} çiçekçisine otomatik yönlendirildi.`
        : `${order.district} ilçesinde uygun çiçekçi bulunamadığı için ${flowerShop.shopName} çiçekçisine şehir bazında otomatik yönlendirildi.`,

    routingType,

    flowerShop,

    order: updatedOrder,
  };
}