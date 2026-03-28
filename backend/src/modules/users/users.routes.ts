import type { FastifyInstance } from "fastify";

import { followUser, getProfile, listSuggestions } from "./users.service.js";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users/suggestions", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Não autenticado." });
    }

    return listSuggestions(request.userId);
  });

  app.post("/users/:id/follow", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Não autenticado." });
    }

    const params = request.params as { id: string };
    await followUser(request.userId, params.id);

    return reply.send({ ok: true });
  });

  app.get("/users/profile/:username", async (request, reply) => {
    const params = request.params as { username: string };
    const profile = await getProfile(params.username);

    if (!profile) {
      return reply.status(404).send({ message: "Perfil não encontrado." });
    }

    return profile;
  });
}
