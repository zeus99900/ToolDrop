export { PrismaClient } from '../prisma/generated/client';
export type * from '../prisma/generated/client';

import { PrismaClient } from '../prisma/generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
