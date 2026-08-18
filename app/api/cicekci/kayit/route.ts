import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";


export async function POST(
  request: Request
) {

  try {


    const body = await request.json();


    console.log("FORM GELDİ:", body);



    const flowerShop = await prisma.flowerShop.create({

      data: {

        shopName: body.shopName,

        owner: body.owner,

        phone: body.phone,

        email: body.email,

        password: hashPassword(String(body.password)),

        city: body.city,

        district: body.district,

        address: body.address,

        status: "Onay Bekliyor",

      },

    });



    console.log(
      "KAYIT BAŞARILI:",
      flowerShop
    );



    return NextResponse.json(

      {
        message:"Başvurunuz alındı.",
        flowerShop
      },

      {
        status:201
      }

    );



  } catch(error:unknown) {


    console.error(
      "KAYIT HATASI:",
      error
    );


    return NextResponse.json(

      {
        message:error instanceof Error ? error.message : "Kayıt oluşturulamadı."
      },

      {
        status:500
      }

    );


  }

}
