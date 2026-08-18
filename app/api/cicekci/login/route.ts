import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";



// ===============================
// ÇİÇEKÇİ LOGIN
// ===============================


export async function POST(
request:Request
){


try{


const body = await request.json();



const {

email,

password

}=body;





if(!email || !password){


return NextResponse.json({

success:false,

message:"Email ve şifre zorunlu."

},
{
status:400
});


}







const flowerShop =

await prisma.flowerShop.findUnique({

where:{

email

}

});






if(!flowerShop){


return NextResponse.json({

success:false,

message:"Çiçekçi bulunamadı."

},
{
status:404
});


}









if(!verifyPassword(String(password), flowerShop.password)){


return NextResponse.json({

success:false,

message:"Şifre hatalı."

},
{
status:401
});


}









if(
flowerShop.status !== "Onaylandı"
){


return NextResponse.json({

success:false,

message:"Hesabınız henüz onaylanmamış."

},
{
status:403
});


}









return NextResponse.json({

success:true,

message:"Giriş başarılı.",

shop:{

id:flowerShop.id,

shopName:flowerShop.shopName,

email:flowerShop.email,

owner:flowerShop.owner,

city:flowerShop.city,

district:flowerShop.district


}

});





}

catch(error){


console.log(error);



return NextResponse.json({

success:false,

message:"Giriş yapılamadı."

},
{
status:500
});


}



}
