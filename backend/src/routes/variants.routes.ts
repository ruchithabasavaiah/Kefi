import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as variantsController from "../controllers/variants.controller";

const router = Router();

router.get("/:id", asyncHandler(variantsController.getVariant));
router.post("/:id/purchase", asyncHandler(variantsController.purchaseVariant));
router.patch("/admin/:id", requireAuth, requireAdmin, asyncHandler(variantsController.updateVariantStock));

export default router;