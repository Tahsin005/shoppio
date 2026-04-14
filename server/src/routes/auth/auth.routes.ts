import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { getMe, syncUser } from "../../controllers/auth/auth.contorllers.js";

export const authRouter = Router();

authRouter.post("/sync", requireAuth, syncUser);
authRouter.get("/me", requireAuth, getMe);
