import { z } from "zod";

export const createVariantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  stock: z.number().int().min(0),
  price: z.number().positive().optional(),
});