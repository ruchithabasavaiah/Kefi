import { Request, Response } from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prisma";

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
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send("Webhook Error");
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      await prisma.order.updateMany({
        where: { id: orderId, status: "PENDING" },
        data: { status: "PAID" },
      });

      console.log(
        `Payment received | order=${orderId} | paymentIntent=${paymentIntent.id} | amount=${paymentIntent.amount}`
      );
    } else {
      await prisma.order.updateMany({
        where: { paymentIntentId: paymentIntent.id, status: "PENDING" },
        data: { status: "PAID" },
      });

      console.log(
        `Payment received | paymentIntent=${paymentIntent.id} | amount=${paymentIntent.amount}`
      );
    }
  }

  return res.json({ received: true });
}