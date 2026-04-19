import { Types } from "mongoose";
import { Order, OrderStatus, PaymentStatus } from "../../models/Order.js";
import { Transaction } from "../../models/Transaction.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { type Request, type Response } from "express";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { ok } from "../../utils/envelope.js";
import { User } from "../../models/User.js";
import { Product } from "../../models/Product.js";
import { AppError } from "../../utils/AppError.js";
import { requireFound, requireText } from "../../utils/helpers.js";

type CustomerOrderRow = {
    _id: Types.ObjectId;
    totalItems: number;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    paidAt?: Date | null;
    deliveredAt?: Date | null;
    returnedAt?: Date | null;
    createdAt: Date;
    items: {
        product: {
            _id: Types.ObjectId;
            title: string;
            images: { url: string; isCover: boolean }[];
            price: number;
        };
        quantity: number;
    }[];
};

export const getCustomerOrder = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);

    const orders = await Order.find({ user: dbUser._id })
        .populate("items.product", "title images price")
        .select(
            "items totalItems totalAmount paymentStatus orderStatus paidAt deliveredAt returnedAt createdAt",
        )
        .sort({ createdAt: -1 })
        .lean<CustomerOrderRow[]>();

    res.json(
      ok({
        items: orders.map((orderItem) => ({
            _id: String(orderItem._id),
            code: String(orderItem._id).slice(-8).toUpperCase(),
            totalItems: orderItem.totalItems,
            totalAmount: orderItem.totalAmount,
            paymentStatus: orderItem.paymentStatus,
            orderStatus: orderItem.orderStatus,
            paidAt: orderItem.paidAt,
            deliveredAt: orderItem.deliveredAt,
            returnedAt: orderItem.returnedAt,
            createdAt: orderItem.createdAt,
            items: orderItem.items.map((item) => ({
                product: {
                    _id: String(item.product._id),
                    title: item.product.title,
                    image: item.product.images.find((img) => img.isCover)?.url || (item.product.images[0]?.url || ""),
                    price: item.product.price,
                },
                quantity: item.quantity,
            })),
        })),
      }),
    );
});

export const returnOrder = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const orderId = String(req.params.orderId || "").trim();

    requireText(orderId, "Order Id is required");

    const order = await Order.findOne({ _id: orderId, user: dbUser._id });

    const foundOrder = requireFound(order, "Order not found", 404);

    if (foundOrder.orderStatus !== "delivered" || !foundOrder.deliveredAt) {
        throw new AppError(400, "Only delivered orders can be returned");
    }

    const sevenDaysReturnWindowTime = 7 * 24 * 60 * 60 * 1000;

    if (
        Date.now() - new Date(foundOrder.deliveredAt).getTime() >
        sevenDaysReturnWindowTime
    ) {
        throw new AppError(400, "Return window expired");
    }

    for (const item of foundOrder.items) {
        await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
        );
    }

    await User.updateOne(
        { _id: dbUser._id },
        {
            $inc: { points: foundOrder.totalAmount },
        },
    );

    await Transaction.create({
        user: dbUser._id,
        type: "credit",
        paymentMethod: "points",
        amount: foundOrder.totalAmount,
        description: `Order Refund for #${String(foundOrder._id).slice(-8).toUpperCase()}`,
        order: foundOrder._id,
    });

    foundOrder.orderStatus = "returned";
    foundOrder.returnedAt = new Date();
    await foundOrder.save();

    res.json(
        ok({
            _id: String(foundOrder._id),
            orderStatus: foundOrder.orderStatus,
            returnedAt: foundOrder.returnedAt,
        }),
    );
});