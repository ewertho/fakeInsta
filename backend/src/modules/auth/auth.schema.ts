import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2).max(60),
    email: z.string().email(),
    password: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
});
