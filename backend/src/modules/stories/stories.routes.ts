import type { FastifyInstance } from "fastify";

import { listStories } from "./stories.service.js";

export async function storiesRoutes(app: FastifyInstance) {
  app.get("/stories", async () => {
    const stories = await listStories();

    return stories.map((story) => ({
      id: story.id,
      imageUrl: story.imageUrl,
      expiresAt: story.expiresAt.toISOString(),
      user: {
        id: story.user.id,
        username: story.user.username,
        avatarUrl: story.user.avatarUrl,
      },
    }));
  });
}
