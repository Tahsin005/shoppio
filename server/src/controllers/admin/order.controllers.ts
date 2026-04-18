import { Types } from "mongoose";
import { Order, OrderStatus, PaymentStatus } from "../../models/Order.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ok } from "../../utils/envelope.js";
import { Product } from "../../models/Product.js";
import { requireFound, requireText } from "../../utils/helpers.js";
import { AppError } from "../../utils/AppError.js";
import { type Request, type Response } from "express";
import { User } from "../../models/User.js";

const ALLOWED_ORDER_STATUSES = [
    "placed",
    "shipped",
    "delivered",
    "returned",
] as const;

type AdminOrderStatus = (typeof ALLOWED_ORDER_STATUSES)[number];

type AdminOrderRow = {
    _id: Types.ObjectId;
    customerName: string;
    customerEmail: string;
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

export const getOrders = asyncHandler(async (_req: Request, res: Response) => {
    const orders = await Order.find()
        .populate("items.product", "title images price")
        .select(
            "items customerName customerEmail totalItems totalAmount paymentStatus orderStatus  paidAt deliveredAt returnedAt createdAt",
        )
        .sort({ createdAt: -1 })
        .lean<AdminOrderRow[]>();

    res.json(
      ok({
            items: orders.map((orderItem) => ({
                _id: String(orderItem._id),
                code: String(orderItem._id).slice(-8).toUpperCase(),
                customerName: orderItem.customerName,
                customerEmail: orderItem.customerEmail,
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

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const orderId = String(req.params.orderId || "").trim();
    const orderStatus = String(
        req.body.orderStatus || "",
    ).trim() as AdminOrderStatus;

    requireText(orderId, "Order Id is required");
    requireText(orderStatus, "orderStatus is required");

    if (!ALLOWED_ORDER_STATUSES.includes(orderStatus)) {
        throw new AppError(400, "Invalid order status");
    }

    const order = await Order.findById(orderId);
    const foundOrder = requireFound(order, "Order not found", 404);

    // admin can return order -> increase the product quantity
    // update returnedAt property
    // add the points to that user points

    if (orderStatus === "returned" && foundOrder.orderStatus !== "returned") {
        // restock products
        for (const item of foundOrder.items) {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { stock: item.quantity } },
            );
        }

        // refund points to user
        await User.updateOne(
            { _id: foundOrder.user },
            { $inc: { points: foundOrder.totalAmount } },
        );

        // set returnedAt
        foundOrder.returnedAt = new Date();
    }

    if (orderStatus === "delivered" && !foundOrder.deliveredAt) {
        foundOrder.deliveredAt = new Date();
    }

    foundOrder.orderStatus = orderStatus;
    await foundOrder.save();

    res.json(
        ok({
            _id: String(foundOrder._id),
            orderStatus: foundOrder.orderStatus,
            deliveredAt: foundOrder.deliveredAt,
            returnedAt: foundOrder.returnedAt,
        }),
    );
});