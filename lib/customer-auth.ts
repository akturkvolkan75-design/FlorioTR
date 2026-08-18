import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_COOKIE = "floriotr_customer_session";

export function hashCustomerToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getCustomerSession() {
  const token = (await cookies()).get(CUSTOMER_COOKIE)?.value;
  if (!token) return null;
  return prisma.customer.findFirst({
    where: {
      sessions: {
        some: { tokenHash: hashCustomerToken(token), expiresAt: { gt: new Date() } },
      },
    },
    select: { id: true, name: true, email: true, phone: true },
  });
}
