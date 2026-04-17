import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { returnOrder, getCustomerOrder } from "../../controllers/customer/order.controllers.js";

export const customerOrderRouter = Router();

customerOrderRouter.use(requireAuth);

customerOrderRouter.get("/orders", getCustomerOrder);
customerOrderRouter.patch("/orders/:orderId/return", returnOrder);