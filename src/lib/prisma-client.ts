import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prismaclient: PrismaClient };

export const prismaclient = globalForPrisma.prismaclient || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaclient = prismaclient;
