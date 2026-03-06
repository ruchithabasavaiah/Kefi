import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import * as productsController from "../controllers/products.controller";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

router.get("/", asyncHandler(productsController.listProducts));
router.post("/", requireAuth, requireAdmin, asyncHandler(productsController.createProduct));

router.get("/:id/variants", asyncHandler(productsController.listProductVariants));
router.post("/:id/variants", requireAuth, requireAdmin, asyncHandler(productsController.createProductVariant));

export default router;