import type { FastifyInstance } from "fastify";

import { listMessagePreviews } from "./messages.service.js";

export async function messagesRoutes(app: FastifyInstance) {
  app.get("/messages", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Não autenticado." });
    }

    return listMessagePreviews(request.userId);
  });
}
