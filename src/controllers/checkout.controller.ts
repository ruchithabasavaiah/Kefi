import { Request, Response } from "express";
import * as checkoutService from "../services/checkout.service";
import { checkoutSchema } from "../validators/checkout.schema";

export async function checkout(req: Request, res: Response) {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.issues,
    });
  }

  const user = (req as any).user;

  if (!user?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { items } = parsed.data;

  const result = await checkoutService.checkout({
    userId: user.userId,
    items,
  });

  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({
    order: result.order,
    clientSecret: result.clientSecret,
  });
}