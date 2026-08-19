import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({
  path: process.env.PRISMA_ENV_FILE || ".env",
});


const databaseUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  "file:./prisma/dev.db";


export default defineConfig({

  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: databaseUrl,
  },

});