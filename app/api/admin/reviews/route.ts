import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  const reviews = await prisma.$queryRawUnsafe(`SELECT r.id, r.orderId, r.productSlug, r.rating, r.comment, r.customerName, r.isApproved, r.createdAt, o.productName FROM Review r JOIN "Order" o ON o.id = r.orderId ORDER BY r.createdAt DESC`);
  return NextResponse.json({success:true,reviews});
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  const { id, isApproved } = await request.json();
  if (!Number(id) || typeof isApproved !== "boolean") return NextResponse.json({success:false,message:"Geçersiz bilgi."},{status:400});
  await prisma.$executeRawUnsafe("UPDATE Review SET isApproved = ? WHERE id = ?", isApproved ? 1 : 0, Number(id));
  return NextResponse.json({success:true});
}

export async function DELETE(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({success:false,message:"Yetkisiz erişim."},{status:401});
  const { id } = await request.json();
  if (!Number(id)) return NextResponse.json({success:false,message:"Geçersiz bilgi."},{status:400});
  await prisma.review.delete({where:{id:Number(id)}});
  return NextResponse.json({success:true});
}
