import type { FastifyInstance } from "fastify";
import type { Multipart, MultipartValue } from "@fastify/multipart";

import { postPayloadSchema } from "./posts.schema.js";
import { createPost, listPosts, toggleLikePost } from "./posts.service.js";

function getFieldValue(field?: Multipart | Multipart[]): string | undefined {
  if (!field || Array.isArray(field)) {
    return undefined;
  }

  if ("value" in field) {
    return String((field as MultipartValue<string>).value);
  }

  return undefined;
}

export async function postsRoutes(app: FastifyInstance) {
  app.get("/posts", async (request) => {
    return listPosts(request.userId);
  });

  app.post("/posts", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Faça login para publicar." });
    }

    const file = await request.file();

    if (!file) {
      return reply.status(400).send({ message: "É necessário enviar uma imagem." });
    }

    const payload = postPayloadSchema.parse({
      caption: getFieldValue(file.fields.caption) ?? "",
    });

    const post = await createPost({
      userId: request.userId,
      caption: payload.caption,
      image: file,
    });

    app.io.emit("post:created", post);

    return reply.status(201).send(post);
  });

  app.post("/posts/:id/like", async (request, reply) => {
    if (!request.userId) {
      return reply.status(401).send({ message: "Faça login para curtir." });
    }

    const params = request.params as { id: string };
    const post = await toggleLikePost(params.id, request.userId);

    app.io.emit("post:liked", post);

    return reply.send(post);
  });
}
