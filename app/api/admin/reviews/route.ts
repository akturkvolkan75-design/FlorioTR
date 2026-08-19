import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";


export async function GET() {

  if (!(await getAdminSession())) {
    return NextResponse.json(
      {
        success: false,
        message: "Yetkisiz erişim.",
      },
      {
        status: 401,
      }
    );
  }


  try {

    const reviews = await prisma.review.findMany({

      orderBy: {
        createdAt: "desc",
      },

      include: {

        replies: {

          orderBy: {
            createdAt: "asc",
          },

          include: {

            customer: {
              select: {
                name: true,
              },
            },

          },

        },

        likes: true,

        order: {
          select: {
            productName: true,
          },
        },

      },

    });


    const result = reviews.map((review) => {

      const product = products.find(
        (item) => item.slug === review.productSlug
      );


      return {

        id: review.id,

        orderId: review.orderId,

        productSlug: review.productSlug,

        productName:
          product?.name ??
          review.order?.productName ??
          "Ürün",

        productImage:
          product?.image ??
          "/images/logo.png",

        rating: review.rating,

        comment: review.comment,

        customerName: review.customerName,

        isApproved: review.isApproved,

        createdAt: review.createdAt,

        likeCount: review.likes.length,


        replies: review.replies.map((reply) => ({

          id: reply.id,

          message: reply.message,

          customerName:
            reply.customer?.name ||
            "Müşteri",

          createdAt:
            reply.createdAt,

        })),

      };

    });


    return NextResponse.json({
      success: true,
      reviews: result,
    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        success: false,
        message: "Yorumlar alınamadı.",
      },
      {
        status: 500,
      }
    );

  }

}



export async function PATCH(
  request: Request
) {

  if (!(await getAdminSession())) {

    return NextResponse.json(
      {
        success: false,
        message: "Yetkisiz erişim.",
      },
      {
        status: 401,
      }
    );

  }


  try {

    const body = await request.json();

    const id = Number(body.id);

    const isApproved =
      body.isApproved;


    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof isApproved !== "boolean"
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz bilgi.",
        },
        {
          status: 400,
        }
      );

    }


    await prisma.review.update({

      where: {
        id,
      },

      data: {
        isApproved,
      },

    });


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        success: false,
        message: "Yorum güncellenemedi.",
      },
      {
        status: 500,
      }
    );

  }

}



export async function DELETE(
  request: Request
) {

  if (!(await getAdminSession())) {

    return NextResponse.json(
      {
        success: false,
        message: "Yetkisiz erişim.",
      },
      {
        status: 401,
      }
    );

  }


  try {

    const body = await request.json();

    const id = Number(body.id);


    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz bilgi.",
        },
        {
          status: 400,
        }
      );

    }


    await prisma.review.delete({

      where: {
        id,
      },

    });


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    console.error(error);


    return NextResponse.json(
      {
        success: false,
        message: "Yorum silinemedi.",
      },
      {
        status: 500,
      }
    );

  }

}