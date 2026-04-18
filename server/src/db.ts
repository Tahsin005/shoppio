import mongoose from "mongoose";
import environment from "./config/environment.js";

export let lastDbError: any = null;

let isConnected = false;

export async function connectDB() {
    if (isConnected) return;

    if (!environment.mongoUri) {
        lastDbError = { message: "MONGO_URI is not defined" };
        console.error("MONGO_URI is not defined");
        return;
    }

    try {
        await mongoose.connect(environment.mongoUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });

        isConnected = true;
        lastDbError = null;
        console.log("DB connected");
    } catch (error: any) {
        lastDbError = {
            name: error?.name,
            message: error?.message,
            code: error?.code,
        };

        console.error("DB connection failed:", error?.message);
        throw error;
    }
}