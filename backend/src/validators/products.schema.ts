import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  images: z.array(z.string().url()).optional().default([]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;