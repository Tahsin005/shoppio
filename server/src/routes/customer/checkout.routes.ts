import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { createCheckoutSession, verifyCheckout } from "../../controllers/customer/checkout.controllers.js";

export const customerCheckoutRouter = Router();

customerCheckoutRouter.use(requireAuth);

customerCheckoutRouter.post("/checkout/create-session", createCheckoutSession);
customerCheckoutRouter.get("/checkout/verify", verifyCheckout);