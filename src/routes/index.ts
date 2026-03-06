import { Router } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./products.routes";
import variantsRoutes from "./variants.routes";
import checkoutRoutes from "./checkout.routes";
import ordersRoutes from "./order.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/variants", variantsRoutes);
router.use("/", checkoutRoutes);
router.use(ordersRoutes);

export default router;