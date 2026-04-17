import { Router } from "express";
import { getHomeData } from "../../controllers/customer/home.controllers.js";

export const customerHomeRouter = Router();

customerHomeRouter.get("/home", getHomeData);