import type { FastifyInstance } from "fastify";

import { listReels, toggleLikeReel } from "./reels.service.js";

export async function reelsRoutes(app: FastifyInstance) {
  app.get("/reels", async (request) => {
    return listReels(request.userId);
  });

  app.post("/reels/:id/like", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Faça login para curtir." });
    }

    const params = request.params as { id: string };
    const reel = await toggleLikeReel(params.id, request.userId);

    return reply.send(reel);
  });
}
