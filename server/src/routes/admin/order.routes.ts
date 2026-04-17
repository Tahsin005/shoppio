import { Router } from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { getOrders, updateOrderStatus } from "../../controllers/admin/order.controllers.js";

export const adminOrderRouter = Router();

adminOrderRouter.use(requireAdmin);

adminOrderRouter.get("/orders", getOrders);
adminOrderRouter.patch("/orders/:orderId/status", updateOrderStatus);
