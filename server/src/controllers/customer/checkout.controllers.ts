import { Types } from "mongoose";
import { Product, ProductSize } from "../../models/Product.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getDbUserFromReq } from "../../middleware/auth.js";
import { requireFound, requireText } from "../../utils/helpers.js";
import { type Request, type Response } from "express";
import { User } from "../../models/User.js";
import { Cart } from "../../models/Cart.js";
import { AppError } from "../../utils/AppError.js";
import { Promo } from "../../models/Promo.js";
import { Order } from "../../models/Order.js";
import { Transaction } from "../../models/Transaction.js";
import { ok } from "../../utils/envelope.js";
import { moneybag, PAYMENT_STATUS, CURRENCY_CODES } from "../../utils/moneybag.js";
import environment from "../../config/environment.js";
import { ValidationException, ApiException } from "@moneybag/sdk";

type UserAddressRow = {
    _id: Types.ObjectId;
    fullName: string;
    address: string;
    state: string;
    postalCode: string;
    phone?: string;
    city?: string;
};

type CheckoutUserRow = {
    _id: Types.ObjectId;
    name?: string;
    email?: string;
    addresses: UserAddressRow[];
};

type CartRow = {
    items: Array<{
        product: Types.ObjectId;
        quantity: number;
        color?: string;
        size?: ProductSize;
    }>;
};

type ProductRow = {
    _id: Types.ObjectId;
    price: number;
    salePercentage: number;
    stock: number;
    status: "active" | "inactive";
};

type PromoRow = {
    code: string;
    percentage: number;
    count: number;
    minimumOrderValue: number;
    startsAt: Date;
    endsAt: Date;
};

export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const addressId = String(req.body.addressId || "").trim();
    const promoCode = String(req.body.promoCode || "")
        .trim()
        .toUpperCase();

    requireText(addressId, "Address is required");

    const [user, cart] = await Promise.all([
        User.findById(dbUser._id)
            .select("name email addresses")
            .lean<CheckoutUserRow | null>(),
        Cart.findOne({ user: dbUser._id }).select("items").lean<CartRow | null>(),
    ]);

    const foundUser = requireFound(user, "user not found", 404);
    const foundCart = requireFound(cart, "Cart not found", 404);

    if (!foundCart.items.length) {
        throw new AppError(400, "Cart is empty");
    }

    const selectedAddress = foundUser.addresses.find(
        (item) => String(item._id) === addressId,
    );

    if (!selectedAddress) {
        throw new AppError(404, "Address not found!!");
    }

    const products = await Product.find({
        _id: { $in: foundCart.items.map((item) => item.product) },
    })
        .select("price salePercentage stock status")
        .lean<ProductRow[]>();

    const productMap = new Map(
        products.map((item) => [String(item._id), item]),
    );

    let totalItems = 0;
    let subTotal = 0;

    const items = foundCart.items.map((cartItem) => {
        const product = productMap.get(String(cartItem.product));

        if (!product || product.status !== "active") {
            throw new AppError(400, "One or more cart items are not available");
        }

        if (product.stock < cartItem.quantity) {
            throw new AppError(400, "Cart items are out of stock");
        }

        const finalPrice = product.salePercentage
            ? Math.round(
                product.price - (product.price * product.salePercentage) / 100,
            )
            : product.price;

        totalItems += cartItem.quantity;
        subTotal += finalPrice * cartItem.quantity;

        return {
            product: cartItem.product,
            quantity: cartItem.quantity,
        };
    });

    let appliedPromoCode = "";
    let discountAmount = 0;

    if (promoCode) {
        const promo = await Promo.findOne({ code: promoCode })
            .select("code percentage count minimumOrderValue startsAt endsAt")
            .lean<PromoRow | null>();

        const foundPromo = requireFound(promo, "Promo not found", 404);
        const now = new Date();

        if (
            now < foundPromo.startsAt ||
            now > foundPromo.endsAt ||
            foundPromo.count < 1
        ) {
            throw new AppError(400, "Promo code is not active");
        }

        if (subTotal < foundPromo.minimumOrderValue) {
            throw new AppError(400, "Minimum order value for this promo is not met");
        }

        appliedPromoCode = foundPromo.code;
        discountAmount = Math.round((subTotal * foundPromo.percentage) / 100);
    }

    const totalAmount = Math.max(subTotal - discountAmount, 0);

    if (totalAmount < 10) {
        throw new AppError(400, "Order amount must be at least 10 BDT");
    }

    const moneybagOrderId = `ORD${Date.now()}`;

    const clientBase = environment.clientBaseUrl || "http://localhost:5173";

    const deliveryAddress = [
        selectedAddress.address,
        selectedAddress.state,
        selectedAddress.postalCode,
    ]
        .filter(Boolean)
        .join(", ");

    const order = await Order.create({
        user: dbUser._id,
        customerName: foundUser.name || selectedAddress.fullName,
        customerEmail: foundUser.email || "",
        items,
        totalItems,
        deliveryName: selectedAddress.fullName,
        deliveryAddress,
        promoCode: appliedPromoCode,
        discountAmount,
        totalAmount,
        paymentStatus: "pending",
        orderStatus: "placed",
        paymentSessionId: "",
    });

    try {
        const moneybagSession = await moneybag.checkout({
            order_id: moneybagOrderId,
            currency: CURRENCY_CODES.BDT,
            order_amount: totalAmount.toFixed(2),
            order_description: `Order #${String(order._id).slice(-8).toUpperCase()}`,
            success_url: `${clientBase}/payment/success?order_id=${order._id}`,
            cancel_url: `${clientBase}/payment/cancel?order_id=${order._id}`,
            fail_url: `${clientBase}/payment/fail?order_id=${order._id}`,
            customer: {
                name: foundUser.name || selectedAddress.fullName,
                email: foundUser.email || "customer@example.com",
                address: selectedAddress.address || "N/A",
                city: selectedAddress.city || "Dhaka",
                postcode: selectedAddress.postalCode || "1000",
                country: "Bangladesh",
                phone: selectedAddress.phone || "01700000000",
            },
            shipping: {
                name: selectedAddress.fullName,
                address: selectedAddress.address || "N/A",
                city: selectedAddress.city || "Dhaka",
                postcode: selectedAddress.postalCode || "1000",
                country: "Bangladesh",
            },
            order_items: items.map((item) => ({
                sku: String(item.product),
                net_amount: totalAmount.toFixed(2),
            })),
            payment_info: {
                is_recurring: false,
                installments: 0,
                currency_conversion: false,
                allowed_payment_methods: ["card", "mobile_banking"],
                requires_emi: false,
            },
        });

        const sessionRef = `${moneybagSession.data.session_id}|${String(order._id)}|${moneybagOrderId}`;
        order.paymentSessionId = sessionRef;
        await order.save();

        res.json(
            ok({
                checkoutUrl: moneybagSession.data.checkout_url,
                order: {
                    _id: String(order._id),
                    totalItems,
                    discountAmount,
                    totalAmount,
                },
            }),
        );
    } catch (error) {
        await Order.findByIdAndDelete(order._id);

        if (error instanceof ValidationException) {
            throw new AppError(400, `Moneybag validation failed: ${error.message}`);
        } else if (error instanceof ApiException) {
            throw new AppError(500, `Moneybag API error: ${error.message}`);
        }
        throw error;
    }
});

export const verifyCheckout = asyncHandler(async (req: Request, res: Response) => {
    const dbUser = await getDbUserFromReq(req);
    const transactionId = String(req.query.transaction_id || "").trim();
    const orderId = String(req.query.order_id || "").trim();

    requireText(transactionId, "transaction_id is required");

    let order;
    if (orderId) {
        order = await Order.findOne({ _id: orderId, user: dbUser._id });
    }

    try {
        const verifyResult = await moneybag.verify(transactionId);

        if (!order) {
            order = await Order.findOne({
                user: dbUser._id,
                paymentSessionId: { $regex: verifyResult.data.order_id },
            });
        }

        const foundOrder = requireFound(order, "Order not found", 404);

        if (foundOrder.paymentStatus === "paid") {
            res.json(ok({ _id: String(foundOrder._id), status: PAYMENT_STATUS.SUCCESS }));
            return;
        }

        if (!verifyResult.data.verified || verifyResult.data.status !== PAYMENT_STATUS.SUCCESS) {
            if (
                ["FAILED", "CANCELLED", "EXPIRED"].includes(verifyResult.data.status)
            ) {
                foundOrder.paymentStatus = "failed";
                await foundOrder.save();
            }

            res.json(
                ok({
                    _id: String(foundOrder._id),
                    status: verifyResult.data.status,
                    verified: false,
                }),
            );
            return;
        }

        for (const item of foundOrder.items) {
            const updated = await Product.updateOne(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: { stock: -item.quantity },
                },
            );

            if (!updated.matchedCount) {
                throw new AppError(400, "One or more cart items are out of stock");
            }
        }

        if (foundOrder.promoCode) {
            await Promo.updateOne(
                { code: foundOrder.promoCode, count: { $gt: 0 } },
                { $inc: { count: -1 } },
            );
        }

        await Cart.updateOne({ user: dbUser._id }, { $set: { items: [] } });

        foundOrder.paymentStatus = "paid";
        foundOrder.paymentId = transactionId;
        foundOrder.paidAt = new Date();
        await foundOrder.save();

        // Points Earning: 30% of totalAmount
        const pointsEarned = Math.round(foundOrder.totalAmount * 0.3);

        // Update User Points
        await User.updateOne(
            { _id: dbUser._id },
            { $inc: { points: pointsEarned } },
        );

        // Log Transaction: Moneybag Payment (Debit)
        await Transaction.create({
            user: dbUser._id,
            type: "debit",
            paymentMethod: "moneybag",
            amount: foundOrder.totalAmount,
            description: `Order Payment for #${String(foundOrder._id).slice(-8).toUpperCase()}`,
            order: foundOrder._id,
        });

        // Log Transaction: Points Earned (Credit)
        await Transaction.create({
            user: dbUser._id,
            type: "credit",
            paymentMethod: "points",
            amount: pointsEarned,
            description: `30% Shopping Rewards for #${String(foundOrder._id).slice(-8).toUpperCase()}`,
            order: foundOrder._id,
        });

        res.json(ok({ _id: String(foundOrder._id), status: PAYMENT_STATUS.SUCCESS, verified: true }));
    } catch (error) {
        if (error instanceof ApiException) {
            throw new AppError(500, `Moneybag Verification Failed: ${error.message}`);
        }
        throw error;
    }
});