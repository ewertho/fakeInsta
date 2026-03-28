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

type CreatePostInput = {
  author: string;
  place?: string;
  description: string;
  hashtags?: string;
  image: MultipartFile;
};

export async function listPosts() {
  return prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createPost(input: CreatePostInput) {
  const imageUrl = await persistUpload(input.image);

  const post = await prisma.post.create({
    data: {
      author: input.author,
      place: input.place || null,
      description: input.description,
      hashtags: input.hashtags || null,
      imageUrl,
    },
  });

  return post;
}

export async function likePost(postId: string) {
  const currentPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!currentPost) {
    throw new Error("Post not found.");
  }

  return prisma.post.update({
    where: { id: postId },
    data: {
      likes: currentPost.likes + 1,
    },
  });
}
