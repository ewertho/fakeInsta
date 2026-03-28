import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(2)
      .max(30)
      .regex(/^[a-zA-Z0-9._]+$/, "Use apenas letras, números, ponto e underline."),
    fullName: z.string().min(2).max(60),
    email: z.string().email(),
    password: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
});
