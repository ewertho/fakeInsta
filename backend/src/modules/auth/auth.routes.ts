import type { FastifyInstance } from "fastify";

import { signInSchema, signUpSchema } from "./auth.schema.js";
import { signIn, signUp } from "./auth.service.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/signup", async (request, reply) => {
    const payload = signUpSchema.parse(request.body);
    const user = await signUp(payload);

    return reply.status(201).send({ user });
  });

  app.post("/auth/signin", async (request, reply) => {
    const payload = signInSchema.parse(request.body);
    const session = await signIn(payload);

    return reply.send(session);
  });
}
