import path from "node:path";

import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { ZodError } from "zod";

import { setUserIdFromAuthHeader } from "./lib/request-user.js";
import { registerSocket } from "./lib/socket.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { messagesRoutes } from "./modules/messages/messages.routes.js";
import { postsRoutes } from "./modules/posts/posts.routes.js";
import { reelsRoutes } from "./modules/reels/reels.routes.js";
import { storiesRoutes } from "./modules/stories/stories.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.addHook("preHandler", async (request) => {
    setUserIdFromAuthHeader(request);
  });

  app.register(cors, {
    origin: true,
    credentials: true,
  });

  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.register(fastifyStatic, {
    root: path.resolve(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        issues: error.flatten(),
      });
    }

    const message = error instanceof Error ? error.message : "Internal server error";

    if (message === "Post not found." || message === "Reel not found.") {
      return reply.status(404).send({ message });
    }

    if (message === "Invalid email or password.") {
      return reply.status(400).send({ message });
    }

    if (message === "Usuário não encontrado." || message === "Perfil não encontrado.") {
      return reply.status(404).send({ message });
    }

    if (message === "Não é possível seguir a si mesmo.") {
      return reply.status(400).send({ message });
    }

    if (message === "A user with this email already exists." || message === "Este nome de usuário já está em uso.") {
      return reply.status(409).send({ message });
    }

    app.log.error(error);
    return reply.status(500).send({
      message: process.env.NODE_ENV === "development" ? message : "Internal server error",
    });
  });

  registerSocket(app);

  app.register(healthRoutes);
  app.register(authRoutes, { prefix: "/api" });
  app.register(postsRoutes, { prefix: "/api" });
  app.register(usersRoutes, { prefix: "/api" });
  app.register(storiesRoutes, { prefix: "/api" });
  app.register(reelsRoutes, { prefix: "/api" });
  app.register(messagesRoutes, { prefix: "/api" });

  return app;
}
