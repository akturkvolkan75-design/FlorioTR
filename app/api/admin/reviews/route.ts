import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { products } from "@/data/products";


export async function GET() {


  if (!(await getAdminSession())) {

    return NextResponse.json(
      {
        success:false,
        message:"Yetkisiz erişim.",
      },
      {
        status:401,
      }
    );

  }



  try {


    const reviews =
      await prisma.review.findMany({

        orderBy:{
          createdAt:"desc",
        },


        include:{


          replies:{


            orderBy:{
              createdAt:"asc",
            },


            include:{


              customer:{
                select:{
                  name:true,
                },
              },


            },


          },


          likes:true,


          order:{
            select:{
              productName:true,
            },
          },


        },


      });





    const result =
      reviews.map((review)=>{


        const product =
          products.find(
            p=>p.slug===review.productSlug
          );



        return {


          id:review.id,


          orderId:
            review.orderId,


          productName:
            product?.name ??
            review.order?.productName ??
            "Ürün",


          productImage:
            product?.image ??
            "/images/logo.png",


          rating:
            review.rating,


          comment:
            review.comment,


          customerName:
            review.customerName,


          isApproved:
            review.isApproved,


          isHidden:
            review.isHidden,


          isDeleted:
            review.isDeleted,



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


              isApproved:
                reply.isApproved,


              isHidden:
                reply.isHidden,


              isDeleted:
                reply.isDeleted,


              createdAt:
                reply.createdAt,


            })),


        };


      });





    return NextResponse.json({

      success:true,

      reviews:result,

    });



  }

  catch(error){

    console.error(error);


    return NextResponse.json({

      success:false,

      message:"Yorumlar alınamadı.",

    },
    {
      status:500,
    });


  }


}
export async function PATCH(
  request: Request
) {


  if (!(await getAdminSession())) {

    return NextResponse.json(
      {
        success:false,
        message:"Yetkisiz erişim.",
      },
      {
        status:401,
      }
    );

  }



  try {


    const body =
      await request.json();


    const id =
      Number(body.id);


    const type =
      body.type;


    const action =
      body.action;



    if(
      !id ||
      !type ||
      !action
    ){

      return NextResponse.json(
        {
          success:false,
          message:"Eksik bilgi.",
        },
        {
          status:400,
        }
      );

    }




    const data:any = {};



    if(action==="approve"){

      data.isApproved = true;

    }



    if(action==="hide"){

      data.isHidden = true;

    }



    if(action==="show"){

      data.isHidden = false;

    }




    if(action==="delete"){

      data.isDeleted = true;

    }




    if(action==="restore"){

      data.isDeleted = false;

    }





    if(type==="review"){


      await prisma.review.update({

        where:{
          id,
        },


        data,

      });


    }




    if(type==="reply"){


      await prisma.reviewReply.update({

        where:{
          id,
        },


        data,

      });


    }




    return NextResponse.json({

      success:true,

    });



  }

  catch(error){

    console.error(error);


    return NextResponse.json({

      success:false,

      message:"Güncelleme başarısız.",


    },
    {
      status:500,
    });


  }


}








export async function DELETE(
request:Request
){


  if (!(await getAdminSession())) {


    return NextResponse.json(
      {
        success:false,
        message:"Yetkisiz erişim.",
      },
      {
        status:401,
      }
    );

  }



  try {


    const body =
      await request.json();


    const id =
      Number(body.id);


    const type =
      body.type;



    if(type==="review"){


      await prisma.review.update({

        where:{
          id,
        },


        data:{

          isDeleted:true,

        },


      });


    }



    if(type==="reply"){


      await prisma.reviewReply.update({

        where:{
          id,
        },


        data:{

          isDeleted:true,

        },


      });


    }




    return NextResponse.json({

      success:true,

    });



  }

  catch(error){


    console.error(error);


    return NextResponse.json({

      success:false,

      message:"Silme başarısız.",

    },
    {
      status:500,
    });


  }


}