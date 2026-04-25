import { Router } from "express";
import authRoutes from "./auth.routes";
import productsRoutes from "./products.routes";
import variantsRoutes from "./variants.routes";
import checkoutRoutes from "./checkout.routes";
import ordersRoutes from "./order.routes";
import wishlistRoutes from "./wishlist.routes";
import restockRoutes from "./restock.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/variants", variantsRoutes);
router.use("/", checkoutRoutes);
router.use(ordersRoutes);
router.use(wishlistRoutes);
router.use(restockRoutes);

export default router;