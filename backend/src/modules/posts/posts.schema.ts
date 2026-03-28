import { z } from "zod";

export const postPayloadSchema = z.object({
  caption: z.string().min(1).max(2200),
});
