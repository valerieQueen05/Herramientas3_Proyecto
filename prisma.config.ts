import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // El CLI (migrate, studio) usa la conexión directa de Supabase (puerto 5432).
    // La app usa DATABASE_URL (pooler) desde src/commons/lib/prisma.ts.
    url: process.env.DIRECT_URL,
  },
});
