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