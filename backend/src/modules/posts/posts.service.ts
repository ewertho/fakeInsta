import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { MultipartFile } from "@fastify/multipart";

import { prisma } from "../../lib/prisma.js";

const uploadsDir = path.resolve(process.cwd(), "uploads");

async function persistUpload(file: MultipartFile) {
  await mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.filename) || ".jpg";
  const filename = `${randomUUID()}${extension}`;
  const targetPath = path.join(uploadsDir, filename);
  const buffer = await file.toBuffer();

  await writeFile(targetPath, buffer);

  return `/uploads/${filename}`;
}

const authorSelect = {
  id: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  isVerified: true,
} as const;

type CreatePostInput = {
  userId: string;
  caption: string;
  image: MultipartFile;
};

function buildPostInclude(viewerId?: string) {
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

export function mapPost(
  post: {
    id: string;
    imageUrl: string;
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
    id: post.id,
    imageUrl: post.imageUrl,
    caption: post.caption,
    createdAt: post.createdAt.toISOString(),
    author: {
      id: post.user.id,
      username: post.user.username,
      fullName: post.user.fullName,
      avatarUrl: post.user.avatarUrl,
      isVerified: post.user.isVerified,
    },
    likeCount: post._count.likes,
    likedByMe: Boolean(post.likes?.length),
  };
}

export async function listPosts(viewerId?: string) {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: buildPostInclude(viewerId),
  });

  return posts.map((post) => mapPost(post));
}

export async function createPost(input: CreatePostInput) {
  const imageUrl = await persistUpload(input.image);

  const post = await prisma.post.create({
    data: {
      userId: input.userId,
      imageUrl,
      caption: input.caption,
    },
    include: buildPostInclude(input.userId),
  });

  return mapPost(post);
}

export async function toggleLikePost(postId: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new Error("Post not found.");
  }

  const existing = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (existing) {
    await prisma.postLike.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
  } else {
    await prisma.postLike.create({
      data: {
        userId,
        postId,
      },
    });
  }

  const updated = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    include: buildPostInclude(userId),
  });

  return mapPost(updated);
}
