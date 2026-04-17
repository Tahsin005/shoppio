import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { checkoutConfirm, createCheckoutSession } from "../../controllers/customer/checkout.controllers.js";

export const customerCheckoutRouter = Router();

customerCheckoutRouter.use(requireAuth);

customerCheckoutRouter.post("/checkout/create-session", createCheckoutSession);
customerCheckoutRouter.post("/checkout/confirm", checkoutConfirm);