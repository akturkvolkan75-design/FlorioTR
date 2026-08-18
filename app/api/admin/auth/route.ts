import { createHash, randomBytes, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE,
  getAdminSession,
  hashSessionToken,
} from "@/lib/admin-auth";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function GET() {
  try {
    const adminCount = await prisma.adminUser.count();
    const session = await getAdminSession();

    return NextResponse.json({
      success: true,
      needsSetup: adminCount === 0,
      authenticated: Boolean(session),
      admin: session,
    });
  } catch (error) {
    console.error("Admin auth GET hatası:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Yönetici bilgileri alınamadı.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      action,
      email,
      password,
      code,
      newPassword,
    } = await request.json();

    const cleanEmail = String(email ?? "")
      .trim()
      .toLowerCase();

    const cleanPassword = String(password ?? "");

    // =====================================================
    // ŞİFRE SIFIRLAMA KODU İSTE
    // =====================================================

    if (action === "reset-request") {
      const resetAdmin = await prisma.adminUser.findUnique({
        where: {
          email: cleanEmail,
        },
      });

      if (!resetAdmin) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Bu e-posta ile kayıtlı yönetici bulunamadı.",
          },
          { status: 404 },
        );
      }

      const verificationCode = randomInt(
        100000,
        1000000,
      ).toString();

      await prisma.adminPasswordReset.deleteMany({
        where: {
          adminId: resetAdmin.id,
        },
      });

      await prisma.adminPasswordReset.create({
        data: {
          adminId: resetAdmin.id,
          codeHash: hashCode(verificationCode),
          expiresAt: new Date(
            Date.now() + 10 * 60 * 1000,
          ),
        },
      });

      const sent = await sendAdminResetEmail(
        resetAdmin.email,
        verificationCode,
      );

      if (!sent) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Şifre yenileme e-postası gönderilemedi.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json({
        success: true,
        message:
          "6 haneli kodu yönetici e-postasına gönderdik.",
      });
    }

    // =====================================================
    // ŞİFRE SIFIRLAMA KODUNU DOĞRULA
    // =====================================================

    if (action === "reset-confirm") {
      const resetAdmin = await prisma.adminUser.findUnique({
        where: {
          email: cleanEmail,
        },
      });

      if (
        !resetAdmin ||
        String(newPassword || "").length < 10
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Bilgileri kontrol edin. Yeni şifre en az 10 karakter olmalı.",
          },
          { status: 400 },
        );
      }

      const reset =
        await prisma.adminPasswordReset.findFirst({
          where: {
            adminId: resetAdmin.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      if (!reset || reset.expiresAt < new Date()) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Kodun süresi doldu. Yeniden kod isteyin.",
          },
          { status: 400 },
        );
      }

      if (reset.attempts >= 5) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Çok fazla hatalı deneme yapıldı.",
          },
          { status: 429 },
        );
      }

      if (
        hashCode(String(code || "")) !==
        reset.codeHash
      ) {
        await prisma.adminPasswordReset.update({
          where: {
            id: reset.id,
          },
          data: {
            attempts: {
              increment: 1,
            },
          },
        });

        return NextResponse.json(
          {
            success: false,
            message: "Doğrulama kodu hatalı.",
          },
          { status: 400 },
        );
      }

      await prisma.$transaction([
        prisma.adminUser.update({
          where: {
            id: resetAdmin.id,
          },
          data: {
            passwordHash: hashPassword(
              String(newPassword),
            ),
          },
        }),

        prisma.adminPasswordReset.deleteMany({
          where: {
            adminId: resetAdmin.id,
          },
        }),

        prisma.adminSession.deleteMany({
          where: {
            adminId: resetAdmin.id,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message:
          "Yönetici şifreniz yenilendi. Yeni şifrenizle giriş yapabilirsiniz.",
      });
    }

    // =====================================================
    // GİRİŞ / İLK YÖNETİCİ KURULUMU
    // =====================================================

    if (!cleanEmail || cleanPassword.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Geçerli e-posta ve en az 10 karakterli şifre gerekli.",
        },
        { status: 400 },
      );
    }

    let admin;

    if (action === "setup") {
      const adminCount = await prisma.adminUser.count();

      if (adminCount > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Yönetici kurulumu daha önce tamamlanmış.",
          },
          { status: 409 },
        );
      }

      admin = await prisma.adminUser.create({
        data: {
          email: cleanEmail,
          passwordHash: hashPassword(cleanPassword),
        },
      });
    } else {
      admin = await prisma.adminUser.findUnique({
        where: {
          email: cleanEmail,
        },
      });

      if (
        !admin ||
        !verifyPassword(
          cleanPassword,
          admin.passwordHash,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "E-posta veya şifre hatalı.",
          },
          { status: 401 },
        );
      }
    }

    // =====================================================
    // OTURUM OLUŞTUR
    // =====================================================

    const token = randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await prisma.adminSession.create({
      data: {
        adminId: admin.id,
        tokenHash: hashSessionToken(token),
        expiresAt,
      },
    });

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set(
      ADMIN_COOKIE,
      token,
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: expiresAt,
      },
    );

    return response;
  } catch (error) {
    console.error(
      "Admin auth POST hatası:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Yönetici girişi yapılamadı.",
      },
      { status: 500 },
    );
  }
}

// =====================================================
// DOĞRULAMA KODU HASH
// =====================================================

function hashCode(code: string) {
  return createHash("sha256")
    .update(code)
    .digest("hex");
}

// =====================================================
// YÖNETİCİ ŞİFRE YENİLEME E-POSTASI
// =====================================================

async function sendAdminResetEmail(
  email: string,
  code: string,
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return false;
  }

  const response = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        from:
          process.env.VERIFICATION_EMAIL_FROM ||
          "FlorioTR <onboarding@resend.dev>",

        to: [email],

        subject:
          "FlorioTR yönetici şifre yenileme kodunuz",

        html:
          `<div style="font-family:Arial;padding:24px;color:#17382f">` +
          `<h2>FlorioTR Yönetim Merkezi</h2>` +
          `<p>Yönetici şifrenizi yenilemek için kodunuz:</p>` +
          `<p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p>` +
          `<p>Bu kod 10 dakika geçerlidir. İşlemi siz istemediyseniz bu mesajı dikkate almayın.</p>` +
          `</div>`,
      }),
    },
  );

  return response.ok;
}

// =====================================================
// ÇIKIŞ
// =====================================================

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(
    ADMIN_COOKIE,
    "",
    {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    },
  );

  return response;
}