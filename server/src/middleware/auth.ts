import { getAuth } from "@clerk/express";
import { AppError } from "../utils/AppError.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
    const { userId } = getAuth(req);

    if (!userId) {
        return next(
            new AppError(401, "User is not logged in."),
        );
    }

    next();
}


export async function getDbUserFromReq(req: Request) {
    const { userId } = getAuth(req);

    if (!userId) {
        throw new AppError(401, "User is not logged in.");
    }

    const dbUser = await User.findOne({ clerkUserId: userId });
    if (!dbUser) {
        throw new AppError(404, "User is not found.");
    }

    return dbUser;
}

export const requireAdmin = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        const extractCurrentDbUser = await getDbUserFromReq(req);

        if (extractCurrentDbUser.role !== "admin") {
            throw new AppError(403, "Admin access only.");
        }

        next();
    },
);
