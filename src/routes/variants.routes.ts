import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import * as variantsController from "../controllers/variants.controller";

const router = Router();

router.get("/:id", asyncHandler(variantsController.getVariant));
router.post("/:id/purchase", asyncHandler(variantsController.purchaseVariant));

export default router;