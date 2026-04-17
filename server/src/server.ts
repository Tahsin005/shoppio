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

async function mainEntryFunction() {
    await connectDB();

    const app = express();

    const corsOrigins = (environment.corsOrigins || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
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

    app.get("/health", (_req, res) => {
        res.status(200).json(ok({ 
            message: "Server is healthy and running" 
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

    const port = Number(environment.port || 5000);

    app.listen(port, () => {
        console.log(`Server is now listening to port ${port}`);
    });
};

mainEntryFunction().catch((err) => {
    console.error("failed to start", err);
    process.exit(1);
});