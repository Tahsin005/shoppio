import mongoose from "mongoose";
import environment from "./config/environment.js";

export async function connectDB() {
    try {
        await mongoose.connect(environment.mongoUri!);
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection failed", error);
        process.exit(1);
    }
}
