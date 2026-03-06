import { prisma } from "../lib/prisma";

export async function listProducts() {
  return prisma.product.findMany();
}

export async function createProduct(data: {
  name: string;
  price: number;
  description: string;
  slug: string;
}) {
  try {
    const product = await prisma.product.create({ data });
    return { ok: true as const, product };
  } catch {
    return { ok: false as const, error: "Product slug already exists. Try a different name." };
  }
}

export async function createVariant(
  productId: string,
  data: { size: string; color: string; stock: number; price?: number }
) {
  try {
    const variant = await prisma.productVariant.create({
      data: { productId, ...data },
    });
    return { ok: true as const, variant };
  } catch {
    return { ok: false as const, error: "Variant already exists for this product (size+color)." };
  }
}

export async function listVariants(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: [{ color: "asc" }, { size: "asc" }],
  });
}