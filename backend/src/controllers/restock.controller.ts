import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getRestockAlerts(req: Request, res: Response) {
  const { userId } = (req as any).user;

  const alerts = await prisma.restockAlert.findMany({
    where: { userId },
    include: {
      variant: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(alerts);
}

export async function subscribeRestockAlert(req: Request, res: Response) {
  const { userId } = (req as any).user;
  const { variantId } = req.params;

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId } });
  if (!variant) {
    res.status(404).json({ error: "Variant not found" });
    return;
  }

  if (variant.stock > 0) {
    res.status(400).json({ error: "Item is already in stock" });
    return;
  }

  const alert = await prisma.restockAlert.upsert({
    where: { userId_variantId: { userId, variantId } },
    create: { userId, variantId },
    update: {},
  });

  res.status(201).json(alert);
}

export async function unsubscribeRestockAlert(req: Request, res: Response) {
  const { userId } = (req as any).user;
  const { variantId } = req.params;

  await prisma.restockAlert.deleteMany({ where: { userId, variantId } });

  res.status(204).send();
}
