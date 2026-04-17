import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { createCheckoutWithPoints, getCheckoutWithPoints } from "../../controllers/customer/checkout-with-points.controllers.js";

export const customerCheckoutWithPointsRouter = Router();

customerCheckoutWithPointsRouter.use(requireAuth);

customerCheckoutWithPointsRouter.get("/checkout/points", getCheckoutWithPoints);
customerCheckoutWithPointsRouter.post("/checkout/pay-with-points", createCheckoutWithPoints);