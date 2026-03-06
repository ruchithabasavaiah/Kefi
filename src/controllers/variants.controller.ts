import { Request, Response } from "express";
import * as variantsService from "../services/variants.service";
import { purchaseSchema } from "../validators/purchase.schema";

export async function getVariant(req: Request, res: Response) {
  const variantId = String(req.params.id);

  const variant = await variantsService.getVariant(variantId);
  if (!variant) return res.status(404).json({ error: "Variant not found" });

  return res.json(variant);
}

export async function purchaseVariant(req: Request, res: Response) {
  const variantId = String(req.params.id);

  const parsed = purchaseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  const { quantity } = parsed.data;

  const ok = await variantsService.purchaseVariant(variantId, quantity);
  if (!ok) return res.status(400).json({ error: "Not enough stock" });
  return res.json({ message: "Purchase successful" });
}