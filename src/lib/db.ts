import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Initialize database on first load
if (typeof globalThis !== 'undefined' && !globalForPrisma.prisma) {
  import('./init-db').then(({ initializeDatabase }) => {
    initializeDatabase().catch(console.error);
  });
}
