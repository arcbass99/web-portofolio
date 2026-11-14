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

export const metricsEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("pageview"),
    page: z.enum(["home", "galeri"]),
  }),
  z.object({
    type: z.literal("clap"),
    itemId: z.number().int().positive(),
    delta: z.number().int().min(1).max(10),
  }),
  z.object({
    type: z.literal("item_view"),
    itemId: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("service_click"),
    serviceId: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("sifan_tour"),
  }),
]);

export type MetricsEventPayload = z.infer<typeof metricsEventSchema>;