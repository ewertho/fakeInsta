import { prisma } from "./prisma.js";

export async function ensureDatabaseSchema() {
  await prisma.$connect();
}
