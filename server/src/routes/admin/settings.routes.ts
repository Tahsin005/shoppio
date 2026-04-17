import { Router } from "express";
import { addBanner, getBanners } from "../../controllers/admin/settings.controllers.js";
import { requireAdmin } from "../../middleware/auth.js";
import multer from "multer";

export const adminSettingsRouter = Router();

adminSettingsRouter.use(requireAdmin);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
        files: 10,
    },
});

adminSettingsRouter.get("/settings/banners", getBanners);
adminSettingsRouter.post("/settings/banners", upload.array("images", 10), addBanner);