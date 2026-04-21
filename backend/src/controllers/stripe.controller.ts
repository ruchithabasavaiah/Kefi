import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

export async function stripeWebhookHandler(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing Stripe signature");
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).send("STRIPE_WEBHOOK_SECRET not set");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch (err) {
    logger.warn({ err }, "Stripe webhook signature verification failed");
    return res.status(400).send("Webhook Error");
  }

  logger.info({ eventType: event.type, eventId: event.id }, "Stripe webhook received");

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      await prisma.order.updateMany({
        where: { id: orderId, status: "PENDING" },
        data: { status: "PAID" },
      });
      logger.info(
        { orderId, paymentIntentId: paymentIntent.id, amount: paymentIntent.amount },
        "Order marked PAID"
      );
    } else {
      await prisma.order.updateMany({
        where: { paymentIntentId: paymentIntent.id, status: "PENDING" },
        data: { status: "PAID" },
      });
      logger.info(
        { paymentIntentId: paymentIntent.id, amount: paymentIntent.amount },
        "Order marked PAID via paymentIntentId"
      );
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;
    const reason = paymentIntent.last_payment_error?.message ?? "unknown";

    if (orderId) {
      await prisma.order.updateMany({
        where: { id: orderId, status: "PENDING" },
        data: { status: "CANCELLED" },
      });
      logger.warn(
        { orderId, paymentIntentId: paymentIntent.id, reason },
        "Order marked CANCELLED — payment failed"
      );
    } else {
      await prisma.order.updateMany({
        where: { paymentIntentId: paymentIntent.id, status: "PENDING" },
        data: { status: "CANCELLED" },
      });
      logger.warn(
        { paymentIntentId: paymentIntent.id, reason },
        "Order marked CANCELLED via paymentIntentId — payment failed"
      );
    }
  }

  return res.json({ received: true });
}