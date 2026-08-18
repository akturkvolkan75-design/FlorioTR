import { NextResponse } from "next/server";

import { getFlowerShopOrders } from "@/lib/flower-shop-orders";

import { prisma } from "@/lib/prisma";




// ===============================
// SİPARİŞLERİ GETİR
// ===============================

export async function GET(
  request: Request
) {

  try {


    const { searchParams } =
      new URL(request.url);



    const flowerShopId =
      Number(
        searchParams.get("flowerShopId")
      );



    if (!flowerShopId) {

      return NextResponse.json(
        {
          success:false,
          message:"Çiçekçi bulunamadı."
        },
        {
          status:400
        }
      );

    }




    const orders =
      await getFlowerShopOrders(
        flowerShopId
      );




    return NextResponse.json({

      success:true,

      orders

    });



  } catch(error) {


    console.log(error);


    return NextResponse.json(
      {
        success:false,
        message:"Siparişler alınamadı."
      },
      {
        status:500
      }
    );


  }

}









// ===============================
// MÜŞTERİ SİPARİŞİ OLUŞTUR
// ===============================

export async function POST(request: Request) {
  try {
    const {
      customerName,
      customerPhone,
      senderPhone,
      city,
      district,
      address,
      customerNote,
      recipientNote,
      flowerShopId,
      products,
      paymentStatus,
    } = await request.json();

    if (!customerName || !customerPhone || !senderPhone || !city || !district || !address || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Sipariş bilgileri eksik." },
        { status: 400 }
      );
    }

    const shopId = Number(flowerShopId);
    const flowerShop = Number.isInteger(shopId)
      ? await prisma.flowerShop.findUnique({ where: { id: shopId } })
      : null;

    const orders = await prisma.$transaction(
      products.map((product: { name: string; slug?: string; quantity: number; price: number }) =>
        prisma.order.create({
          data: {
            customerName: String(customerName).trim(),
            customerPhone: String(customerPhone).trim(),
            senderPhone: String(senderPhone).trim(),
            city: String(city).trim(),
            district: String(district).trim(),
            address: String(address).trim(),
            customerNote: String(customerNote ?? "").trim() || null,
            recipientNote: String(recipientNote ?? "").trim() || null,
            productName: String(product.name).trim(),
            quantity: Math.max(1, Number(product.quantity) || 1),
            price: Math.max(0, Number(product.price) || 0),
            paymentStatus: String(paymentStatus || "Bekliyor"),
            status: "Yeni",
            flowerShopId: flowerShop?.id ?? null,
          },
        })
      )
    );

    await Promise.all(
      orders.map((order, index) =>
        prisma.$executeRawUnsafe(
          'UPDATE "Order" SET "productSlug" = ? WHERE "id" = ?',
          String(products[index]?.slug ?? "").trim() || null,
          order.id
        )
      )
    );

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Sipariş oluşturulamadı." },
      { status: 500 }
    );
  }
}

// ===============================
// SİPARİŞ DURUM GÜNCELLEME
// ===============================

export async function PATCH(
  request: Request
) {


  try {


    const body =
      await request.json();



    const {

      id,

      status,

      flowerShopId


    } = body;





    if (
      !id ||
      !status ||
      !flowerShopId
    ) {


      return NextResponse.json(
        {
          success:false,
          message:"Eksik bilgi."
        },
        {
          status:400
        }
      );


    }







    const order =
      await prisma.order.findUnique({

        where:{
          id:Number(id)
        }

      });







    if (!order) {


      return NextResponse.json(
        {
          success:false,
          message:"Sipariş bulunamadı."
        },
        {
          status:404
        }
      );


    }








    // Güvenlik kontrolü

    if (
      order.flowerShopId !== Number(flowerShopId)
    ) {


      return NextResponse.json(
        {
          success:false,
          message:"Bu sipariş size ait değil."
        },
        {
          status:403
        }
      );


    }









    // ==================================
    // DURUM GÜNCELLEME + GEÇMİŞ KAYDI
    // TEK TRANSACTION
    // ==================================


    const updatedOrder =

      await prisma.$transaction(async (tx)=>{


        const updated =

          await tx.order.update({

            where:{
              id:Number(id)
            },

            data:{

              status

            }

          });






        await tx.orderHistory.create({

          data:{

            orderId:Number(id),

            oldStatus:order.status,

            newStatus:status

          }

        });






        return updated;


      });









    return NextResponse.json({

      success:true,

      order:updatedOrder

    });







  } catch(error) {


    console.log(error);



    return NextResponse.json(
      {
        success:false,
        message:"Sipariş güncellenemedi."
      },
      {
        status:500
      }
    );


  }


}
