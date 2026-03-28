import "dotenv/config";

import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";

const sampleVideo =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const alice = await prisma.user.upsert({
    where: { email: "alice@demo.com" },
    update: {},
    create: {
      username: "alice",
      email: "alice@demo.com",
      passwordHash,
      fullName: "Alice Demo",
      isVerified: true,
      bio: "Conta demo · FakeInsta",
      avatarUrl: "https://i.pravatar.cc/150?u=alice",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@demo.com" },
    update: {},
    create: {
      username: "bob",
      email: "bob@demo.com",
      passwordHash,
      fullName: "Bob Demo",
      avatarUrl: "https://i.pravatar.cc/150?u=bob",
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@demo.com" },
    update: {},
    create: {
      username: "carol",
      email: "carol@demo.com",
      passwordHash,
      fullName: "Carol Demo",
      avatarUrl: "https://i.pravatar.cc/150?u=carol",
    },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: alice.id,
        followingId: bob.id,
      },
    },
    update: {},
    create: {
      followerId: alice.id,
      followingId: bob.id,
    },
  });

  await prisma.follow.upsert({
    where: {
      followerId_followingId: {
        followerId: alice.id,
        followingId: carol.id,
      },
    },
    update: {},
    create: {
      followerId: alice.id,
      followingId: carol.id,
    },
  });

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.story.deleteMany({});
  await prisma.story.createMany({
    data: [
      {
        userId: bob.id,
        imageUrl: "https://picsum.photos/seed/storybob/720/1280",
        expiresAt: expires,
      },
      {
        userId: carol.id,
        imageUrl: "https://picsum.photos/seed/storycarol/720/1280",
        expiresAt: expires,
      },
    ],
  });

  await prisma.post.deleteMany({});
  await prisma.post.createMany({
    data: [
      {
        userId: bob.id,
        imageUrl: "https://picsum.photos/seed/post1/720/900",
        caption: "Bem-vindo ao FakeInsta — feed escuro estilo Instagram.",
      },
      {
        userId: carol.id,
        imageUrl: "https://picsum.photos/seed/post2/720/900",
        caption: "Interface web + mobile com SQLite e API Fastify.",
      },
      {
        userId: alice.id,
        imageUrl: "https://picsum.photos/seed/post3/720/900",
        caption: "Curtidas por usuário autenticado, stories e reels.",
      },
    ],
  });

  await prisma.reel.deleteMany({});
  await prisma.reel.createMany({
    data: [
      {
        userId: bob.id,
        videoUrl: sampleVideo,
        caption: "Reel de exemplo — vídeo sample para testes.",
      },
      {
        userId: carol.id,
        videoUrl: sampleVideo,
        caption: "Role para o próximo no app mobile.",
      },
    ],
  });

  await prisma.message.deleteMany({});
  await prisma.message.createMany({
    data: [
      {
        senderId: bob.id,
        receiverId: alice.id,
        body: "Oi! Testando DM no FakeInsta.",
      },
      {
        senderId: carol.id,
        receiverId: alice.id,
        body: "Reagiu com ❤️ à sua mensagem",
        readAt: null,
      },
    ],
  });

  // eslint-disable-next-line no-console
  console.log("Seed OK — usuários: alice / bob / carol — senha: demo1234");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
