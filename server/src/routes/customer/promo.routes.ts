import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { applyPromo } from "../../controllers/customer/promo.controllers.js";

export const customerPromoRouter = Router();

customerPromoRouter.use(requireAuth);

customerPromoRouter.post("/promos/apply", applyPromo);