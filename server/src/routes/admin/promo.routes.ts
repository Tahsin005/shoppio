import { Router } from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { addPromo, deletePromo, getPromos, updatePromo } from "../../controllers/admin/promo.contorllers.js";

export const adminPromoRouter = Router();

adminPromoRouter.use(requireAdmin);

adminPromoRouter.get("/promos", getPromos);
adminPromoRouter.post("/promos", addPromo);
adminPromoRouter.patch("/promos/:promoId", updatePromo);
adminPromoRouter.delete("/promos/:promoId", deletePromo);