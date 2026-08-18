import { PrismaClient } from "@/generated/prisma-sqlite/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient as PostgresPrismaClient } from "@/generated/prisma-postgres/client";


const configuredUrl = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL;
const isPostgres = configuredUrl?.startsWith("postgres://") || configuredUrl?.startsWith("postgresql://");

function createPrismaClient(): PrismaClient {
  if (isPostgres && configuredUrl) {
    const adapter = new PrismaPg({ connectionString: configuredUrl });
    return new PostgresPrismaClient({ adapter }) as unknown as PrismaClient;
  }

  const adapter = new PrismaBetterSqlite3({
    url: configuredUrl || "file:./prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};



export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();



if(process.env.NODE_ENV !== "production"){

  globalForPrisma.prisma = prisma;

}
