import mongoose from "mongoose";
import environment from "./config/environment.js";

export let lastDbError: any = null;

export async function connectDB() {
    if (!environment.mongoUri) {
        lastDbError = { message: "MONGO_URI is not defined in environment variables" };
        console.error("MONGO_URI is not defined in environment variables");
        return;
    }
    try {
        await mongoose.connect(environment.mongoUri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            family: 4,
        });
        console.log("DB connected");
        lastDbError = null;
    } catch (error: any) {
        lastDbError = {
            name: error?.name,
            message: error?.message,
            code: error?.code
        };
        console.error("DB connection failed details:");
        console.error("Error Name:", error?.name);
        console.error("Error Message:", error?.message);
        console.error("Error Code:", error?.code);
        throw error;
    }
}
