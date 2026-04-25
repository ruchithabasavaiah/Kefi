import { Request, Response } from "express";
import * as variantsService from "../services/variants.service";
import { purchaseSchema } from "../validators/purchase.schema";
import { prisma } from "../lib/prisma";
import { sendRestockAlert } from "../lib/email";

export async function getVariant(req: Request, res: Response) {
  const variantId = String(req.params.id);

  const variant = await variantsService.getVariant(variantId);
  if (!variant) return res.status(404).json({ error: "Variant not found" });

  return res.json(variant);
}

export async function updateVariantStock(req: Request, res: Response) {
  const variantId = String(req.params.id);
  const { stock } = req.body;

  if (typeof stock !== "number" || stock < 0) {
    res.status(400).json({ error: "stock must be a non-negative number" });
    return;
  }

  const existing = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!existing) {
    res.status(404).json({ error: "Variant not found" });
    return;
  }

  const wasOutOfStock = existing.stock === 0;
  const updated = await prisma.productVariant.update({
    where: { id: variantId },
    data: { stock },
  });

  if (wasOutOfStock && stock > 0) {
    const alerts = await prisma.restockAlert.findMany({
      where: { variantId },
      include: { user: true },
    });

    if (alerts.length > 0) {
      await Promise.allSettled(
        alerts.map((alert) =>
          sendRestockAlert({
            to: alert.user.email,
            productName: existing.product.name,
            size: existing.size,
            color: existing.color,
            productSlug: existing.product.slug ?? existing.product.id,
          })
        )
      );
      await prisma.restockAlert.deleteMany({ where: { variantId } });
    }
  }

  res.json(updated);
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