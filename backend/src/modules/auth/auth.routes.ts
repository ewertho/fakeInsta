import type { FastifyInstance } from "fastify";

import { signInSchema, signUpSchema } from "./auth.schema.js";
import { getUserById, signIn, signUp } from "./auth.service.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/signup", async (request, reply) => {
    const payload = signUpSchema.parse(request.body);
    const user = await signUp({
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    });

    return reply.status(201).send({ user });
  });

  app.post("/auth/signin", async (request, reply) => {
    const payload = signInSchema.parse(request.body);
    const session = await signIn(payload);

    return reply.send(session);
  });

  app.get("/auth/me", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Não autenticado." });
    }

    const user = await getUserById(request.userId);

    if (!user) {
      return reply.status(404).send({ message: "Usuário não encontrado." });
    }

    return reply.send({ user });
  });
}
