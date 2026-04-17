import { Router } from "express";
import { requireAdmin } from "../../middleware/auth.js";
import { getDashBoardData } from "../../controllers/admin/dashboard.controllers.js";

export const adminDashboardRouter = Router();

adminDashboardRouter.use(requireAdmin);

adminDashboardRouter.get("/dashboard/lite", getDashBoardData);