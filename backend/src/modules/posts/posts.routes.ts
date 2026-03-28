import type { FastifyInstance } from "fastify";
import type { Multipart, MultipartValue } from "@fastify/multipart";

import { postPayloadSchema } from "./posts.schema.js";
import { createPost, likePost, listPosts } from "./posts.service.js";

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
  app.get("/posts", async () => {
    return listPosts();
  });

  app.post("/posts", async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.status(400).send({ message: "Image upload is required." });
    }

    const payload = postPayloadSchema.parse({
      author: getFieldValue(file.fields.author),
      place: getFieldValue(file.fields.place),
      description: getFieldValue(file.fields.description),
      hashtags: getFieldValue(file.fields.hashtags),
    });

    const post = await createPost({
      ...payload,
      image: file,
    });

    app.io.emit("post:created", post);

    return reply.status(201).send(post);
  });

  app.post("/posts/:id/like", async (request, reply) => {
    const params = request.params as { id: string };
    const post = await likePost(params.id);

    app.io.emit("post:liked", post);

    return reply.send(post);
  });
}
