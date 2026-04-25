import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getRestockAlerts, subscribeRestockAlert, unsubscribeRestockAlert } from "../controllers/restock.controller";

const router = Router();

router.get("/me/restock-alerts", requireAuth, asyncHandler(getRestockAlerts));
router.post("/me/restock-alerts/:variantId", requireAuth, asyncHandler(subscribeRestockAlert));
router.delete("/me/restock-alerts/:variantId", requireAuth, asyncHandler(unsubscribeRestockAlert));

export default router;
