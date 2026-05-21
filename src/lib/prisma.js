import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prismaClient =
 globalForPrisma.prisma ||
 new PrismaClient({ log: ["query"], });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
}

// export const prisma = prismaClient;
export const prisma = new PrismaClient();