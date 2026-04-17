import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { addToWishList, getWishlistItems, getWishlistItemDetailsByProductId, syncCart, deleteCartItem, decreaseCartItem, increaseCartItem, addToCart, getCart } from "../../controllers/customer/cart-wishlist.controllers.js";

export const customerCartWishlistRouter = Router();

customerCartWishlistRouter.use(requireAuth);

customerCartWishlistRouter.get("/cart", getCart);
customerCartWishlistRouter.post("/cart/items", addToCart);
customerCartWishlistRouter.patch("/cart/items/:productId/increase", increaseCartItem);
customerCartWishlistRouter.patch("/cart/items/:productId/decrease", decreaseCartItem);
customerCartWishlistRouter.delete("/cart/items/:productId", deleteCartItem);
customerCartWishlistRouter.post("/cart/sync", syncCart);
customerCartWishlistRouter.get("/wishlist", getWishlistItems);
customerCartWishlistRouter.post("/wishlist/items", addToWishList);
customerCartWishlistRouter.delete("/wishlist/items/:productId", getWishlistItemDetailsByProductId);