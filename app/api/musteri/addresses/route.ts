import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customer=await getCustomerSession();
  if(!customer)return NextResponse.json({success:false,message:"Giriş yapmalısınız."},{status:401});
  const addresses=await prisma.customerAddress.findMany({where:{customerId:customer.id},orderBy:{createdAt:"desc"}});
  return NextResponse.json({success:true,addresses});
}

export async function POST(request:Request){
  const customer=await getCustomerSession();
  if(!customer)return NextResponse.json({success:false,message:"Giriş yapmalısınız."},{status:401});
  const body=await request.json();
  const data={title:String(body.title||"").trim(),receiverName:String(body.receiverName||"").trim(),receiverPhone:String(body.receiverPhone||"").replace(/\D/g,""),city:"İstanbul",district:String(body.district||"").trim(),address:String(body.address||"").trim()};
  if(data.title.length<2||data.receiverName.length<2||data.receiverPhone.length<10||!data.district||data.address.length<8)return NextResponse.json({success:false,message:"Adres bilgilerini eksiksiz doldurun."},{status:400});
  const address=await prisma.customerAddress.create({data:{...data,customerId:customer.id}});
  return NextResponse.json({success:true,address,message:"Adresiniz kaydedildi."});
}

export async function DELETE(request:Request){
  const customer=await getCustomerSession();
  if(!customer)return NextResponse.json({success:false,message:"Giriş yapmalısınız."},{status:401});
  const id=Number(new URL(request.url).searchParams.get("id"));
  const result=await prisma.customerAddress.deleteMany({where:{id,customerId:customer.id}});
  if(!result.count)return NextResponse.json({success:false,message:"Adres bulunamadı."},{status:404});
  return NextResponse.json({success:true});
}
