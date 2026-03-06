import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// GET /orders/:id
export async function getOrder(req: Request, res: Response) {
  const id = String(req.params.id);
  const user = (req as any).user;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.userId === order.userId;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ error: "Forbidden" });
  }

  return res.json(order);
}

// GET /me/orders
export async function getMyOrders(req: Request, res: Response) {
  const user = (req as any).user;

  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  return res.json(orders);
}

// GET /admin/orders
export async function adminListOrders(req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  return res.json(orders);
}

// PATCH /admin/orders/:id/status
export async function adminUpdateOrderStatus(req: Request, res: Response) {
  const id = String(req.params.id);
  const { status } = req.body;

  const allowed = ["PENDING", "PAID", "CANCELLED"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid order status" });
  }

  const existing = await prisma.order.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({ error: "Order not found" });
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return res.json(updated);
}