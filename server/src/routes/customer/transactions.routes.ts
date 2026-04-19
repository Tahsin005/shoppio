import { Router } from "express";
import { getTransactions } from "../../controllers/customer/transaction.controllers.js";

const router = Router();

router.get("/", getTransactions);

export default router;
