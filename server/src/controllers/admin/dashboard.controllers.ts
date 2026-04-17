import { Category } from "../../models/Category.js";
import { Order } from "../../models/Order.js";
import { Product } from "../../models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ok } from "../../utils/envelope.js";
import { type Request, type Response } from "express";

type TotalSaleRow = {
    _id: null;
    totalSales: number;
};

export const getDashBoardData = asyncHandler(async (_req: Request, res: Response) => {
    const [
        totalProducts,
        totalCategories,
        totalOrders,
        totalReturnedOrders,
        salesRows,
    ] = await Promise.all([
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: "returned" }),
        Order.aggregate<TotalSaleRow>([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
        ]),
    ]);

    res.json(
        ok({
            totalProducts,
            totalCategories,
            totalSales: salesRows[0]?.totalSales || 0,
            totalOrders,
            totalReturnedOrders,
        }),
    );
});