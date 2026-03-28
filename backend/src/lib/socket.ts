import type { FastifyInstance } from "fastify";
import { Server as SocketIOServer } from "socket.io";

import { env } from "../config/env.js";

declare module "fastify" {
  interface FastifyInstance {
    io: SocketIOServer;
  }
}

export function registerSocket(app: FastifyInstance) {
  const io = new SocketIOServer(app.server, {
    cors: {
      origin: [env.CLIENT_URL, "http://localhost:8081", "http://localhost:19006"],
      credentials: true,
    },
  });

  app.decorate("io", io);

  io.on("connection", (socket) => {
    app.log.info(`socket connected: ${socket.id}`);
  });
}
