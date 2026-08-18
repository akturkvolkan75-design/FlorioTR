import { createHash, randomBytes, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CUSTOMER_COOKIE, getCustomerSession, hashCustomerToken } from "@/lib/customer-auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function GET() {
  const customer = await getCustomerSession();
  return NextResponse.json({ success: true, authenticated: Boolean(customer), customer });
}

export async function PATCH(request: Request) {
  const customer = await getCustomerSession();
  if (!customer) return NextResponse.json({ success: false, message: "Giriş yapmalısınız." }, { status: 401 });
  try {
    const { name, phone } = await request.json();
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (cleanName.length < 2 || cleanPhone.length < 10) return NextResponse.json({ success: false, message: "Ad soyad ve telefon bilgilerini kontrol edin." }, { status: 400 });
    const updated = await prisma.customer.update({ where: { id: customer.id }, data: { name: cleanName, phone: cleanPhone }, select: { id: true, name: true, email: true, phone: true } });
    return NextResponse.json({ success: true, customer: updated, message: "Bilgileriniz güncellendi." });
  } catch (error) {
    console.error("Müşteri bilgileri güncellenemedi:", error);
    return NextResponse.json({ success: false, message: "Bilgiler güncellenemedi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, name, email, phone, password, code } = await request.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPassword = String(password || "");
    const passwordRequired = ["register", "login", "password-reset-confirm"].includes(action);
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail) || (passwordRequired && cleanPassword.length < 8)) {
      return NextResponse.json({ success: false, message: "Geçerli e-posta ve en az 8 karakterli şifre gerekli." }, { status: 400 });
    }

    if (action === "password-reset-request") {
      const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });
      if (!customer?.emailVerifiedAt) return NextResponse.json({ success: false, message: "Bu e-posta ile doğrulanmış bir hesap bulunamadı." }, { status: 404 });
      const verificationCode = randomInt(100000, 1000000).toString();
      await prisma.customerEmailVerification.deleteMany({ where: { customerId: customer.id } });
      await prisma.customerEmailVerification.create({ data: { customerId: customer.id, codeHash: createHash("sha256").update(verificationCode).digest("hex"), expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
      const sent = await sendVerificationEmail(cleanEmail, customer.name, verificationCode, "password-reset");
      if (!sent) return NextResponse.json({ success: false, message: "Şifre yenileme e-postası gönderilemedi." }, { status: 502 });
      return NextResponse.json({ success: true, passwordResetRequired: true, message: "Şifre yenileme kodunu e-posta adresinize gönderdik." });
    }

    if (action === "password-reset-confirm") {
      const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });
      if (!customer) return NextResponse.json({ success: false, message: "Hesap bulunamadı." }, { status: 404 });
      const verification = await prisma.customerEmailVerification.findFirst({ where: { customerId: customer.id }, orderBy: { createdAt: "desc" } });
      if (!verification || verification.expiresAt < new Date()) return NextResponse.json({ success: false, message: "Kodun süresi doldu. Yeniden kod isteyin." }, { status: 400 });
      if (verification.attempts >= 5) return NextResponse.json({ success: false, message: "Çok fazla hatalı deneme yapıldı." }, { status: 429 });
      const codeHash = createHash("sha256").update(String(code || "")).digest("hex");
      if (codeHash !== verification.codeHash) {
        await prisma.customerEmailVerification.update({ where: { id: verification.id }, data: { attempts: { increment: 1 } } });
        return NextResponse.json({ success: false, message: "Şifre yenileme kodu hatalı." }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.customer.update({ where: { id: customer.id }, data: { passwordHash: hashPassword(cleanPassword) } }),
        prisma.customerSession.deleteMany({ where: { customerId: customer.id } }),
        prisma.customerEmailVerification.deleteMany({ where: { customerId: customer.id } }),
      ]);
      return createCustomerSession(customer.id);
    }

    if (action === "verify") {
      const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });
      if (!customer) return NextResponse.json({ success: false, message: "Kayıt bulunamadı." }, { status: 404 });
      const verification = await prisma.customerEmailVerification.findFirst({ where: { customerId: customer.id }, orderBy: { createdAt: "desc" } });
      if (!verification || verification.expiresAt < new Date()) return NextResponse.json({ success: false, message: "Kodun süresi doldu. Yeniden kayıt olmayı deneyin." }, { status: 400 });
      if (verification.attempts >= 5) return NextResponse.json({ success: false, message: "Çok fazla hatalı deneme yapıldı." }, { status: 429 });
      const codeHash = createHash("sha256").update(String(code || "")).digest("hex");
      if (codeHash !== verification.codeHash) {
        await prisma.customerEmailVerification.update({ where: { id: verification.id }, data: { attempts: { increment: 1 } } });
        return NextResponse.json({ success: false, message: "Doğrulama kodu hatalı." }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.customer.update({ where: { id: customer.id }, data: { emailVerifiedAt: new Date() } }),
        prisma.customerEmailVerification.deleteMany({ where: { customerId: customer.id } }),
      ]);
      return createCustomerSession(customer.id);
    }

    let customer;
    if (action === "register") {
      const cleanName = String(name || "").trim();
      const cleanPhone = String(phone || "").replace(/\D/g, "");
      if (cleanName.length < 2 || cleanPhone.length < 10) {
        return NextResponse.json({ success: false, message: "Ad soyad ve telefon bilgilerini kontrol edin." }, { status: 400 });
      }
      const existing = await prisma.customer.findUnique({ where: { email: cleanEmail } });
      if (existing?.emailVerifiedAt) {
        return NextResponse.json({ success: false, message: "Bu e-posta ile kayıtlı bir hesap var." }, { status: 409 });
      }
      customer = existing
        ? await prisma.customer.update({ where: { id: existing.id }, data: { name: cleanName, phone: cleanPhone, passwordHash: hashPassword(cleanPassword) } })
        : await prisma.customer.create({ data: { name: cleanName, email: cleanEmail, phone: cleanPhone, passwordHash: hashPassword(cleanPassword) } });
      const verificationCode = randomInt(100000, 1000000).toString();
      await prisma.customerEmailVerification.deleteMany({ where: { customerId: customer.id } });
      await prisma.customerEmailVerification.create({ data: { customerId: customer.id, codeHash: createHash("sha256").update(verificationCode).digest("hex"), expiresAt: new Date(Date.now() + 10 * 60 * 1000) } });
      const sent = await sendVerificationEmail(cleanEmail, cleanName, verificationCode);
      if (!sent && process.env.RESEND_API_KEY) return NextResponse.json({ success: false, message: "Doğrulama e-postası gönderilemedi. E-posta adresini kontrol edip tekrar deneyin." }, { status: 502 });
      return NextResponse.json({ success: true, verificationRequired: true, message: "Doğrulama kodunu e-posta adresinize gönderdik.", ...(!process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production" ? { developmentCode: verificationCode } : {}) });
    } else {
      customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });
      if (!customer || !verifyPassword(cleanPassword, customer.passwordHash)) {
        return NextResponse.json({ success: false, message: "E-posta veya şifre hatalı." }, { status: 401 });
      }
      if (customer.status !== "Aktif") return NextResponse.json({ success: false, message: "Hesabınız geçici olarak kullanıma kapalı. Destek ile iletişime geçin." }, { status: 403 });
      if (!customer.emailVerifiedAt) return NextResponse.json({ success: false, message: "Önce e-posta adresinizi doğrulamalısınız." }, { status: 403 });
    }
    return createCustomerSession(customer.id);
  } catch (error) {
    console.error("Müşteri girişi hatası:", error);
    return NextResponse.json({ success: false, message: "İşlem tamamlanamadı." }, { status: 500 });
  }
}

async function createCustomerSession(customerId: number) {
  const customer = await prisma.customer.findUniqueOrThrow({ where: { id: customerId } });
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.customerSession.create({ data: { customerId, tokenHash: hashCustomerToken(token), expiresAt } });
  const response = NextResponse.json({ success: true, customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } });
  response.cookies.set(CUSTOMER_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt });
  return response;
}

async function sendVerificationEmail(email: string, name: string, code: string, purpose: "verify" | "password-reset" = "verify") {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const passwordReset = purpose === "password-reset";
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.VERIFICATION_EMAIL_FROM || "FlorioTR <onboarding@resend.dev>", to: [email], subject: passwordReset ? "FlorioTR şifre yenileme kodunuz" : "FlorioTR e-posta doğrulama kodunuz", html: `<div style="font-family:Arial;padding:24px"><h2>Merhaba ${name.replace(/[<>]/g, "")},</h2><p>${passwordReset ? "Şifrenizi yenilemek" : "E-posta adresinizi doğrulamak"} için kodunuz:</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p><p>Bu kod 10 dakika geçerlidir. Bu işlemi siz istemediyseniz mesajı dikkate almayın.</p></div>` }) });
  if (!response.ok) console.error("Resend gönderim hatası:", response.status, await response.text());
  return response.ok;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(CUSTOMER_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  return response;
}
