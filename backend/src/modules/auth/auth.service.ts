import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { prisma } from "../../lib/prisma.js";

type SignUpInput = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

const userPublicSelect = {
  id: true,
  username: true,
  fullName: true,
  email: true,
  avatarUrl: true,
  isVerified: true,
  createdAt: true,
} as const;

export async function signUp(input: SignUpInput) {
  const email = input.email.toLowerCase();
  const username = input.username.toLowerCase();

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new Error("A user with this email already exists.");
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new Error("Este nome de usuário já está em uso.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      fullName: input.fullName,
      email,
      passwordHash,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`,
    },
    select: userPublicSelect,
  });

  return user;
}

export async function signIn(input: SignInInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
    },
  };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userPublicSelect,
  });
}
