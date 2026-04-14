import { clerkClient, getAuth } from "@clerk/express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { User } from "../../models/User.js";
import { ok } from "../../utils/envelope.js";
import environment from "../../config/environment.js";

export const syncUser = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
        throw new AppError(401, "Unauthorized");
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const extractEmailFromUserInfo = clerkUser.emailAddresses.find((item) => item.id === clerkUser.primaryEmailAddressId) || clerkUser.emailAddresses[0];

    const email = extractEmailFromUserInfo.emailAddress;

    const fullName = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

    const name = fullName || clerkUser.username;

    const raw = environment.adminEmails || "";
    const adminEmails = new Set(
        raw
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean),
    );

    const existingUser = await User.findOne({ clerkUserId: userId });
    const shouldBeAdmin = email ? adminEmails.has(email.toLowerCase()) : false;

    const nextRole = existingUser?.role === "admin" ? "admin" : shouldBeAdmin ? "admin" : existingUser?.role || "user";

    const newlyCreatedDbUser = await User.findOneAndUpdate(
        {
            clerkUserId: userId,
        },
        {
            clerkUserId: userId,
            email,
            name,
            role: nextRole,
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        },
    );

    res.status(200).json(
        ok({
            user: {
                id: newlyCreatedDbUser._id,
                clerkUserId: newlyCreatedDbUser.clerkUserId,
                email: newlyCreatedDbUser.email,
                name: newlyCreatedDbUser.name,
                role: newlyCreatedDbUser.role,
            },
        }),
    );
});

export const getMe = asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);

    if (!userId) {
        throw new AppError(401, "User is not logged in.");
    }

    const dbUser = await User.findOne({ clerkUserId: userId });

    if (!dbUser) {
        throw new AppError(404, "User is not found.");
    }

    res.status(200).json(
        ok({
            user: {
                id: dbUser._id,
                clerkUserId: dbUser.clerkUserId,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role,
            },
        }),
    );
});