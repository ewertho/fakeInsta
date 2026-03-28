import { prisma } from "../../lib/prisma.js";

const authorSelect = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  isVerified: true,
} as const;

function buildReelInclude(viewerId?: string) {
  return {
    user: { select: authorSelect },
    _count: { select: { likes: true } },
    ...(viewerId
      ? {
          likes: {
            where: { userId: viewerId },
            select: { userId: true },
            take: 1,
          },
        }
      : {}),
  };
}

export function mapReel(
  reel: {
    id: string;
    videoUrl: string;
    caption: string;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      fullName: string;
      avatarUrl: string | null;
      isVerified: boolean;
    };
    _count: { likes: number };
    likes?: { userId: string }[];
  },
) {
  return {
    id: reel.id,
    videoUrl: reel.videoUrl,
    caption: reel.caption,
    createdAt: reel.createdAt.toISOString(),
    author: {
      id: reel.user.id,
      username: reel.user.username,
      fullName: reel.user.fullName,
      avatarUrl: reel.user.avatarUrl,
      isVerified: reel.user.isVerified,
    },
    likeCount: reel._count.likes,
    likedByMe: Boolean(reel.likes?.length),
  };
}

export async function listReels(viewerId?: string) {
  const reels = await prisma.reel.findMany({
    orderBy: { createdAt: "desc" },
    include: buildReelInclude(viewerId),
  });

  return reels.map((reel) => mapReel(reel));
}

export async function toggleLikeReel(reelId: string, userId: string) {
  const reel = await prisma.reel.findUnique({
    where: { id: reelId },
  });

  if (!reel) {
    throw new Error("Reel not found.");
  }

  const existing = await prisma.reelLike.findUnique({
    where: {
      userId_reelId: {
        userId,
        reelId,
      },
    },
  });

  if (existing) {
    await prisma.reelLike.delete({
      where: {
        userId_reelId: {
          userId,
          reelId,
        },
      },
    });
  } else {
    await prisma.reelLike.create({
      data: {
        userId,
        reelId,
      },
    });
  }

  const updated = await prisma.reel.findUniqueOrThrow({
    where: { id: reelId },
    include: buildReelInclude(userId),
  });

  return mapReel(updated);
}
