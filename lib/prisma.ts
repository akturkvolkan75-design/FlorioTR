import { PrismaClient as PostgresPrismaClient } from "@/generated/prisma-postgres/client";
import { PrismaClient as SqlitePrismaClient } from "@/lib/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";


const databaseUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;


const isPostgres =
  databaseUrl?.startsWith("postgres://") ||
  databaseUrl?.startsWith("postgresql://");


function createPrismaClient() {

  if (isPostgres && databaseUrl) {

    const adapter =
      new PrismaPg({
        connectionString: databaseUrl,
      });


    return new PostgresPrismaClient({
      adapter,
    });

  }


  const adapter =
    new PrismaBetterSqlite3({
      url:
        databaseUrl ||
        "file:./prisma/dev.db",
    });


  return new SqlitePrismaClient({
    adapter,
  });

}



const globalForPrisma =
  globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
  };


export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();



if (
  process.env.NODE_ENV !== "production"
) {
  globalForPrisma.prisma = prisma;
}