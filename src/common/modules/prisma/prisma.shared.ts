/* create global prisma client  */
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient = null;
/**
 * Create a new prisma global prisma client.
 * Warning: Please make sure to not use this client in different files that import this file. Otherwise, you will saturate the database connection pool.
 * TODO: Make sure to use the prismaService and not this one
 * @returns PrismaClient
 */
export async function getGlobalPrismaClient(): Promise<PrismaClient> {
  if (!prisma) {
    prisma = new PrismaClient();
    await prisma.$connect();
  }
  return prisma;
}
