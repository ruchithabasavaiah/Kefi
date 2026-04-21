import express from "express";
import { stripeWebhookHandler } from "./controllers/stripe.controller";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import routes from "./routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/requestLogger";
import { swaggerSpec } from "./swagger";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

const app = express();

app.use(requestLogger);
app.use(cors());
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);
app.use(express.json());

app.get("/", (req, res) => res.send("Kefi API running"));

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected", uptime: process.uptime() });
  } catch (err) {
    logger.error({ err }, "Health check failed — DB unreachable");
    res.status(503).json({ status: "error", db: "unreachable" });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;