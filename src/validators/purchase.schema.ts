import { z } from "zod";

export const purchaseSchema = z.object({
  quantity: z.number().int().positive(),
});