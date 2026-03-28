import { z } from "zod";

export const postPayloadSchema = z.object({
  author: z.string().min(2).max(60),
  place: z.string().max(80).optional().or(z.literal("")),
  description: z.string().min(2).max(2200),
  hashtags: z.string().max(180).optional().or(z.literal("")),
});
