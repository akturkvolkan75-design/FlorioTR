import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";
import { getCustomerSession } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";



export async function GET(request: Request) {

  try {

    const { searchParams } =
      new URL(request.url);


    const productSlug =
      searchParams.get("productSlug")?.trim();


    const featured =
      searchParams.get("featured") === "true";



    const reviews =
      await prisma.review.findMany({

        where: {

          isApproved: true,

          ...(productSlug
            ? {
                productSlug,
              }
            : {}),

        },


        include: {

          replies: {

            include: {

              customer: {

                select: {

                  name: true,

                },

              },

            },


            orderBy: {

              createdAt: "asc",

            },

          },


          likes: true,

        },


        orderBy: {

          createdAt: "desc",

        },


        take: featured ? 20 : 100,

      });



    const result =
      reviews.map((review)=>{


        const product =
          products.find(
            (p)=>
              p.slug === review.productSlug
          );


        return {

          id: review.id,

          productSlug:
            review.productSlug,


          productName:
            product?.name ??
            "Çiçek Ürünü",


          productImage:
            product?.image ??
            "/images/logo.png",


          rating:
            review.rating,


          comment:
            review.comment,


          customerName:
            review.customerName,


          createdAt:
            review.createdAt,


          likeCount:
            review.likes.length,


          replies:
            review.replies.map(reply=>({

              id:
                reply.id,


              message:
                reply.message,


              customerName:
                reply.customer?.name ??
                "Müşteri",


              createdAt:
                reply.createdAt,

            })),


        };


      });



    return NextResponse.json({

      success:true,

      reviews:result,

    });


  } catch(error) {

    console.log(error);


    return NextResponse.json({

      success:false,

      message:"Yorumlar alınamadı.",

    },
    {
      status:500,
    });

  }

}
export async function POST(request: Request) {

  try {

    const body =
      await request.json();


    const customer =
      await getCustomerSession();



    if (!customer) {

      return NextResponse.json({

        success:false,

        message:
          "Bu işlem için giriş yapmalısınız.",

      },
      {
        status:401,
      });

    }




    // ==========================
    // YORUMA CEVAP EKLEME
    // ==========================

    if (body.reply) {


      const reviewId =
        Number(body.reviewId);



      const message =
        String(body.reply)
          .trim()
          .slice(0,500);



      if (
        !reviewId ||
        !message
      ) {

        return NextResponse.json({

          success:false,

          message:
            "Eksik bilgi.",

        },
        {
          status:400,
        });

      }




      await prisma.reviewReply.create({

        data: {

          reviewId,

          customerId:
            customer.id,

          message,

        },

      });




      return NextResponse.json({

        success:true,

        message:
          "Cevabınız yayınlandı.",

      });


    }





    // ==========================
    // YENİ YORUM EKLEME
    // ==========================


    const orderId =
      Number(body.orderId);



    const productSlug =
      String(body.productSlug ?? "")
        .trim();



    const rating =
      Number(body.rating);



    const comment =
      String(body.comment ?? "")
        .trim()
        .slice(0,500);





    if (
      !orderId ||
      !productSlug ||
      rating < 1 ||
      rating > 5
    ) {

      return NextResponse.json({

        success:false,

        message:
          "Eksik bilgiler.",

      },
      {
        status:400,
      });

    }





    const order =
      await prisma.order.findFirst({

        where: {

          id: orderId,

          customerId:
            customer.id,

        },

      });





    if (!order) {

      return NextResponse.json({

        success:false,

        message:
          "Sipariş bulunamadı.",

      },
      {
        status:404,
      });

    }





    if (
      order.status !==
      "Teslim Edildi"
    ) {

      return NextResponse.json({

        success:false,

        message:
          "Sadece teslim edilen ürünlere yorum yapılabilir.",

      },
      {
        status:403,
      });

    }





    const product =
      products.find(
        (p)=>
          p.slug === productSlug
      );





    if (!product) {

      return NextResponse.json({

        success:false,

        message:
          "Ürün bulunamadı.",

      },
      {
        status:404,
      });

    }





    const exists =
      await prisma.review.findUnique({

        where: {

          orderId,

        },

      });





    if (exists) {

      return NextResponse.json({

        success:false,

        message:
          "Bu sipariş zaten değerlendirilmiş.",

      },
      {
        status:409,
      });

    }





    await prisma.review.create({

      data: {

        orderId,

        productSlug,

        rating,

        comment,

        customerName:
          customer.name,

        isApproved:false,

      },

    });





    return NextResponse.json({

      success:true,

      message:
        "Yorumunuz onaya gönderildi.",

    });


  }

  catch(error) {


    console.log(error);



    return NextResponse.json({

      success:false,

      message:
        "İşlem başarısız.",

    },
    {
      status:500,
    });


  }

}