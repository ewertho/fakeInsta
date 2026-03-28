import path from "node:path";

import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { ZodError } from "zod";

import { env } from "./config/env.js";
import { registerSocket } from "./lib/socket.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { postsRoutes } from "./modules/posts/posts.routes.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
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

    if (message === "Post not found." || message === "Invalid email or password.") {
      return reply.status(400).send({ message });
    }

    if (message === "A user with this email already exists.") {
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

  return app;
}
