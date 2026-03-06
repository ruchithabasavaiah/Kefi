import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { requireAuth } from "../middlewares/requireAuth";
import { requireAdmin } from "../middlewares/requireAdmin";
import * as ordersController from "../controllers/order.controller";

const router = Router();

router.get("/me/orders", requireAuth, asyncHandler(ordersController.getMyOrders));
router.get("/orders/:id", requireAuth, asyncHandler(ordersController.getOrder));

router.get(
  "/admin/orders",
  requireAuth,
  requireAdmin,
  asyncHandler(ordersController.adminListOrders)
);

router.patch(
  "/admin/orders/:id/status",
  requireAuth,
  requireAdmin,
  asyncHandler(ordersController.adminUpdateOrderStatus)
);

export default router;