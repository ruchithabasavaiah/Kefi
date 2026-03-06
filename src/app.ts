import express from "express";
import { stripeWebhookHandler } from "./controllers/stripe.controller";
import cors from "cors";

import routes from "./routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.post("/webhooks/stripe", express.raw({ type: "application/json" }), stripeWebhookHandler);
app.use(express.json());

app.get("/", (req, res) => res.send("Kefi API running"));

app.use(routes);

app.use(notFound);
app.use(errorHandler);

export default app;