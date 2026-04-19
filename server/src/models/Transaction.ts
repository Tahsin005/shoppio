import mongoose, { Schema, Document, Types } from "mongoose";

export type TransactionType = "credit" | "debit";
export type PaymentMethod = "points" | "moneybag";

export interface ITransaction extends Document {
    user: Types.ObjectId;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    amount: number;
    description: string;
    order?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["points", "moneybag"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: false,
        },
    },
    { timestamps: true },
);

// Index for fetching user transactions efficiently
TransactionSchema.index({ user: 1, createdAt: -1 });

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
