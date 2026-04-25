import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getWishlist(req: Request, res: Response) {
  const { userId } = (req as any).user;

  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: { variants: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(items);
}

export async function addToWishlist(req: Request, res: Response) {
  const { userId } = (req as any).user;
  const { productId } = req.body;

  if (!productId) {
    res.status(400).json({ error: "productId is required" });
    return;
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId },
    update: {},
  });

  res.status(201).json(item);
}

export async function removeFromWishlist(req: Request, res: Response) {
  const { userId } = (req as any).user;
  const { productId } = req.params;

  await prisma.wishlistItem.deleteMany({ where: { userId, productId } });

  res.status(204).send();
}
