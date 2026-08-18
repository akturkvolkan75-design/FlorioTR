import { NextResponse } from "next/server";
import { updateFlowerShopStatus } from "@/lib/cicekciler";
import { getAdminSession } from "@/lib/admin-auth";


export async function POST(
  request: Request
) {

  try {

    if (!(await getAdminSession())) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();


    const updated =
      await updateFlowerShopStatus(
        Number(body.id),
        body.status
      );


    return NextResponse.json(

      {
        message: "Durum güncellendi",
        updated
      },

      {
        status: 200
      }

    );


  } catch(error:unknown) {


    console.error(
      "DURUM GÜNCELLEME HATASI:",
      error
    );


    return NextResponse.json(

      {
        message:
          error instanceof Error ? error.message : "Güncelleme başarısız"
      },

      {
        status:500
      }

    );

  }

}
