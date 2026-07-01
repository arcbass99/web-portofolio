import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const externalUrlSchema = z
  .string()
  .url({ message: "Harus berupa URL yang valid (https://...)" })
  .or(z.literal(""));