import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    if (!(await getAdminSession())) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    const flowerShops = await prisma.flowerShop.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, flowerShops });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Çiçekçiler alınamadı." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await getAdminSession())) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
    const { id, status, contactStatus, adminNote } = await request.json();
    if (!id) return NextResponse.json({ success: false, message: "Eksik bilgi." }, { status: 400 });
    if (status !== undefined && !["Onay Bekliyor", "Onaylandı", "Reddedildi"].includes(status)) return NextResponse.json({ success: false, message: "Geçersiz başvuru durumu." }, { status: 400 });
    if (contactStatus !== undefined && !["Aranacak", "Görüşüldü", "Uygun", "Uygun Değil"].includes(contactStatus)) return NextResponse.json({ success: false, message: "Geçersiz görüşme durumu." }, { status: 400 });

    const previous = await prisma.flowerShop.findUnique({ where: { id: Number(id) }, select: { status: true } });
    const flowerShop = await prisma.flowerShop.update({ where: { id: Number(id) }, data: {
      ...(status !== undefined ? { status } : {}),
      ...(contactStatus !== undefined ? { contactStatus } : {}),
      ...(adminNote !== undefined ? { adminNote: String(adminNote).trim() || null } : {}),
    } });
    let notificationSent = false;
    if (status === "Onaylandı" && previous?.status !== "Onaylandı") {
      notificationSent = await sendApprovalEmail(flowerShop.email, flowerShop.owner, flowerShop.shopName, new URL("/cicekci/giris", request.url).toString());
    }
    return NextResponse.json({ success: true, flowerShop, notificationSent });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Durum güncellenemedi." }, { status: 500 });
  }
}

async function sendApprovalEmail(email: string, owner: string, shopName: string, loginUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.VERIFICATION_EMAIL_FROM || "FlorioTR <onboarding@resend.dev>",
        to: [email],
        subject: "FlorioTR çiçekçi başvurunuz onaylandı 🌸",
        html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:28px;color:#17382f"><p style="font-size:12px;font-weight:700;letter-spacing:2px;color:#a8782d">FLORIOTR</p><h2>Başvurunuz onaylandı 🌸</h2><p>Merhaba ${escapeHtml(owner)},</p><p><strong>${escapeHtml(shopName)}</strong> adına yaptığınız çiçekçi başvurusu onaylandı. FlorioTR çiçekçi paneline kayıt sırasında belirlediğiniz e-posta ve şifreyle giriş yapabilirsiniz.</p><p style="margin:28px 0"><a href="${loginUrl}" style="display:inline-block;background:#123f34;color:white;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">Çiçekçi Paneline Giriş Yap</a></p><p><strong>Not:</strong> Sizi en kısa sürede görüşme ve tanışma için arayacağız.</p><p style="margin-top:28px">FlorioTR Ekibi 🌿</p></div>`,
      }),
    });
    if (!response.ok) console.error("Çiçekçi onay e-postası gönderilemedi:", response.status, await response.text());
    return response.ok;
  } catch (error) {
    console.error("Çiçekçi onay e-postası gönderilemedi:", error);
    return false;
  }
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return String(value || "").replace(/[&<>"']/g, (character) => entities[character]);
}
