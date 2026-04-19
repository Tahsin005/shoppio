export type TransactionType = "credit" | "debit";
export type PaymentMethod = "points" | "moneybag";

export type Transaction = {
    _id: string;
    type: TransactionType;
    paymentMethod: PaymentMethod;
    amount: number;
    description: string;
    order?: {
        _id: string;
        code: string;
    };
    createdAt: string;
};

export type TransactionsResponse = {
    items: Transaction[];
};
