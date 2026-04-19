import { apiGet } from "@/lib/api";
import type { TransactionsResponse } from "./types";

export const getCustomerTransactions = async () => {
    const response = await apiGet<TransactionsResponse>("/customer/transactions");
    return response;
};
