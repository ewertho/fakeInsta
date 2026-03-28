import { prisma } from "../../lib/prisma.js";

export async function listSuggestions(currentUserId: string, take = 6) {
  const myFollowing = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const myFollowingIds = myFollowing.map((row) => row.followingId);
  const excludeIds = [...myFollowingIds, currentUserId];

  const candidates = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
    },
    take,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      followers: {
        where: {
          followerId: { in: myFollowingIds },
        },
        take: 1,
        select: {
          follower: { select: { username: true } },
        },
      },
    },
  });

  return candidates.map((user) => ({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    followedByUsername: user.followers[0]?.follower.username ?? null,
  }));
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error("Não é possível seguir a si mesmo.");
  }

  const target = await prisma.user.findUnique({
    where: { id: followingId },
  });

  if (!target) {
    throw new Error("Usuário não encontrado.");
  }

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
    update: {},
    create: {
      followerId,
      followingId,
    },
  });

  return { ok: true };
}

export async function getProfile(username: string) {
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      bio: true,
      isVerified: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          imageUrl: true,
        },
      },
    },
  });

  return user;
}
