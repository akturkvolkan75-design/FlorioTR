import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createHash, randomInt } from "node:crypto";

export async function PATCH(request: Request) {
  try {
    const { flowerShopId, email, currentPassword, newPassword } = await request.json();
    if (!flowerShopId || !email || !currentPassword || String(newPassword || "").length < 8) {
      return NextResponse.json({ success: false, message: "Bilgileri kontrol edin. Yeni şifre en az 8 karakter olmalı." }, { status: 400 });
    }
    const shop = await prisma.flowerShop.findFirst({ where: { id: Number(flowerShopId), email: String(email).trim().toLowerCase() } });
    if (!shop || !verifyPassword(String(currentPassword), shop.password)) {
      return NextResponse.json({ success: false, message: "Mevcut şifreniz hatalı." }, { status: 401 });
    }
    await prisma.flowerShop.update({ where: { id: shop.id }, data: { password: hashPassword(String(newPassword)) } });
    return NextResponse.json({ success: true, message: "Şifreniz başarıyla değiştirildi." });
  } catch (error) {
    console.error("Çiçekçi şifresi değiştirilemedi:", error);
    return NextResponse.json({ success: false, message: "Şifre değiştirilemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, email, code, newPassword } = await request.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const shop = await prisma.flowerShop.findUnique({ where: { email: cleanEmail } });
    if (!shop) return NextResponse.json({ success: false, message: "Bu e-posta ile kayıtlı çiçekçi bulunamadı." }, { status: 404 });

    if (action === "request") {
      const verificationCode = randomInt(100000, 1000000).toString();
      await prisma.flowerShopPasswordReset.deleteMany({ where: { flowerShopId: shop.id } });
      await prisma.flowerShopPasswordReset.create({ data: { flowerShopId: shop.id, codeHash: hashCode(verificationCode), expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
      const sent = await sendResetEmail(shop.email, shop.owner, verificationCode);
      if (!sent) return NextResponse.json({ success: false, message: "Şifre yenileme e-postası gönderilemedi." }, { status: 502 });
      return NextResponse.json({ success: true, codeRequired: true, message: "6 haneli kodu e-posta adresinize gönderdik." });
    }

    if (action === "confirm") {
      if (String(newPassword || "").length < 8) return NextResponse.json({ success: false, message: "Yeni şifre en az 8 karakter olmalı." }, { status: 400 });
      const reset = await prisma.flowerShopPasswordReset.findFirst({ where: { flowerShopId: shop.id }, orderBy: { createdAt: "desc" } });
      if (!reset || reset.expiresAt < new Date()) return NextResponse.json({ success: false, message: "Kodun süresi doldu. Yeniden kod isteyin." }, { status: 400 });
      if (reset.attempts >= 5) return NextResponse.json({ success: false, message: "Çok fazla hatalı deneme yapıldı." }, { status: 429 });
      if (hashCode(String(code || "")) !== reset.codeHash) {
        await prisma.flowerShopPasswordReset.update({ where: { id: reset.id }, data: { attempts: { increment: 1 } } });
        return NextResponse.json({ success: false, message: "Doğrulama kodu hatalı." }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.flowerShop.update({ where: { id: shop.id }, data: { password: hashPassword(String(newPassword)) } }),
        prisma.flowerShopPasswordReset.deleteMany({ where: { flowerShopId: shop.id } }),
      ]);
      return NextResponse.json({ success: true, message: "Şifreniz yenilendi. Yeni şifrenizle giriş yapabilirsiniz." });
    }

    return NextResponse.json({ success: false, message: "Geçersiz işlem." }, { status: 400 });
  } catch (error) {
    console.error("Çiçekçi şifre yenileme hatası:", error);
    return NextResponse.json({ success: false, message: "Şifre yenileme işlemi tamamlanamadı." }, { status: 500 });
  }
}

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

async function sendResetEmail(email: string, owner: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.VERIFICATION_EMAIL_FROM || "FlorioTR <onboarding@resend.dev>",
      to: [email],
      subject: "FlorioTR çiçekçi şifre yenileme kodunuz",
      html: `<div style="font-family:Arial;padding:24px;color:#17382f"><h2>Merhaba ${String(owner).replace(/[<>]/g, "")},</h2><p>Çiçekçi paneli şifrenizi yenilemek için kodunuz:</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p><p>Bu kod 10 dakika geçerlidir.</p></div>`,
    }),
  });
  if (!response.ok) console.error("Çiçekçi şifre e-postası gönderilemedi:", response.status, await response.text());
  return response.ok;
}
