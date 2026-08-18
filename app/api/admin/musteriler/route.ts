import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(){
  if(!(await getAdminSession()))return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  const customers=await prisma.customer.findMany({orderBy:{createdAt:"desc"},include:{orders:{orderBy:{createdAt:"desc"},select:{id:true,productName:true,quantity:true,price:true,status:true,paymentStatus:true,createdAt:true}},_count:{select:{addresses:true}}}});
  return NextResponse.json({success:true,customers:customers.map(customer=>({id:customer.id,name:customer.name,email:customer.email,phone:customer.phone,status:customer.status,emailVerified:Boolean(customer.emailVerifiedAt),createdAt:customer.createdAt,addressCount:customer._count.addresses,orderCount:customer.orders.length,totalSpent:customer.orders.filter(order=>order.paymentStatus==="Ödendi").reduce((total,order)=>total+order.price*order.quantity,0),orders:customer.orders}))});
}

export async function PATCH(request:Request){
  if(!(await getAdminSession()))return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  const {id,status}=await request.json();
  if(!["Aktif","Pasif"].includes(status))return NextResponse.json({success:false,message:"Geçersiz durum."},{status:400});
  await prisma.$transaction([prisma.customer.update({where:{id:Number(id)},data:{status}}),...(status==="Pasif"?[prisma.customerSession.deleteMany({where:{customerId:Number(id)}})]:[])]);
  return NextResponse.json({success:true});
}
