import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./db.js";
import { ok } from "./utils/envelope.js";
import environment from "./config/environment.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { clerkMiddleware } from '@clerk/express';
import { authRouter } from "./routes/auth/auth.routes.js";
import { adminProductRouter } from "./routes/admin/product.routes.js";
import { adminOrderRouter } from "./routes/admin/order.routes.js";
import { adminPromoRouter } from "./routes/admin/promo.routes.js";
import { adminSettingsRouter } from "./routes/admin/settings.routes.js";
import { adminDashboardRouter } from "./routes/admin/dashboard.routes.js";
import { customerHomeRouter } from "./routes/customer/home.routes.js";
import { customerProductRouter } from "./routes/customer/product.routes.js";
import { customerCartWishlistRouter } from "./routes/customer/cart-wishlist.routes.js";
import { customerAddressRouter } from "./routes/customer/address.routes.js";
import { customerPromoRouter } from "./routes/customer/promo.routes.js";
import { customerCheckoutRouter } from "./routes/customer/checkout.routes.js";
import { customerCheckoutWithPointsRouter } from "./routes/customer/checkout-with-points.routes.js";
import { customerOrderRouter } from "./routes/customer/orders.routes.js";

const app = express();

const corsOrigins = (environment.corsOrigins || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin: corsOrigins,
        credentials: true,
    }),
);

app.use(express.json());
app.use(morgan("dev"));
app.use(clerkMiddleware());

import mongoose from "mongoose";
import { lastDbError } from "./db.js";

app.use(async (_req, _res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        next(err);
    }
});

app.get("/health", (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting",
        99: "uninitialized",
    }[dbState] || "unknown";

    const mongoUri = environment.mongoUri || "";
    const obfuscatedUri = mongoUri.length > 20 
        ? `${mongoUri.substring(0, 15)}...${mongoUri.substring(mongoUri.length - 10)}`
        : "not_set";

    res.status(200).json(ok({ 
        message: "Server is healthy and running",
        database: {
            state: dbState,
            status: dbStatus,
            error: lastDbError,
            uri: obfuscatedUri
        }
    }));
});

// auth routes
app.use("/auth", authRouter);

// customer routes
app.use("/customer", customerHomeRouter);
app.use("/customer", customerProductRouter);
app.use("/customer", customerCartWishlistRouter);
app.use("/customer", customerAddressRouter);
app.use("/customer", customerPromoRouter);
app.use("/customer", customerCheckoutRouter);
app.use("/customer", customerCheckoutWithPointsRouter);
app.use("/customer", customerOrderRouter);

// admin routes
app.use("/admin", adminProductRouter);
app.use("/admin", adminOrderRouter);
app.use("/admin", adminPromoRouter);
app.use("/admin", adminSettingsRouter);
app.use("/admin", adminDashboardRouter);


app.use(notFound);
app.use(errorHandler);

if (!process.env.VERCEL) {
    const port = Number(environment.port || 5000);
    app.listen(port, () => {
        console.log(`Server is now listening to port ${port}`);
    });
}

export { app };
export default app;