import { prisma } from "../lib/prisma";

export async function getVariant(variantId: string) {
  return prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
}

export async function purchaseVariant(variantId: string, quantity: number) {
  const updated = await prisma.productVariant.updateMany({
    where: { id: variantId, stock: { gte: quantity } },
    data: { stock: { decrement: quantity } },
  });

  return updated.count > 0;
}