import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";

export async function checkout(input: {
  userId: string;
  items: { variantId: string; quantity: number }[];
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const variantIds = input.items.map((i) => i.variantId);

      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      if (variants.length !== variantIds.length) {
        return { ok: false as const, error: "One or more variants not found" };
      }

      const variantMap = new Map(variants.map((v) => [v.id, v]));
      let total = 0;

      for (const item of input.items) {
        const v = variantMap.get(item.variantId)!;
        if (v.stock < item.quantity) {
          return { ok: false as const, error: `Not enough stock for variant ${v.id}` };
        }
        const unitPrice = v.price ?? v.product.price;
        total += unitPrice * item.quantity;
      }

      for (const item of input.items) {
        const updated = await tx.productVariant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          return { ok: false as const, error: "Stock changed, please retry" };
        }
      }

      const order = await tx.order.create({
        data: {
          userId: input.userId,
          total,
          status: "PENDING",
          currency: "usd",
          items: {
            create: input.items.map((item) => {
              const v = variantMap.get(item.variantId)!;
              return {
                variantId: item.variantId,
                quantity: item.quantity,
                unitPrice: v.price ?? v.product.price,
              };
            }),
          },
        },
        include: { items: true },
      });

      return { ok: true as const, order };
    });

    if (!result.ok) return result;

    const order = result.order;

    // Stripe outside transaction
    const amountCents = Math.round(order.total * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: order.currency ?? "usd",
      metadata: { orderId: order.id },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe client_secret missing");
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id },
      include: { items: true },
    });

    return {
      ok: true as const,
      order: updatedOrder,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error(error);
    return { ok: false as const, error: "Checkout failed" };
  }
}