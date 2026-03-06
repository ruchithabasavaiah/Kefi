import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler"; 
import * as checkoutController from "../controllers/checkout.controller";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.post("/checkout", requireAuth, asyncHandler(checkoutController.checkout));

export default router;