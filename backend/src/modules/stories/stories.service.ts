import { prisma } from "../../lib/prisma.js";

export async function listStories() {
  const now = new Date();

  return prisma.story.findMany({
    where: {
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
}
