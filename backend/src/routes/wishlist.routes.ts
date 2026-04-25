import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlist.controller";

const router = Router();

router.get("/me/wishlist", requireAuth, asyncHandler(getWishlist));
router.post("/me/wishlist", requireAuth, asyncHandler(addToWishlist));
router.delete("/me/wishlist/:productId", requireAuth, asyncHandler(removeFromWishlist));

export default router;
