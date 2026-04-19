import { type Request, type Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Transaction } from "../../models/Transaction.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { ok } from "../../utils/envelope.js";

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const transactions = await Transaction.find({ user: dbUser._id })
        .sort({ createdAt: -1 })
        .populate("order", "totalAmount orderStatus paymentStatus")
        .lean();

    res.json(
        ok({
            items: transactions.map((t) => ({
                _id: String(t._id),
                type: t.type,
                paymentMethod: t.paymentMethod,
                amount: t.amount,
                description: t.description,
                order: t.order ? {
                    _id: String(t.order._id),
                    code: String(t.order._id).slice(-8).toUpperCase(),
                } : null,
                createdAt: t.createdAt,
            })),
        }),
    );
});
