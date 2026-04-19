import { create } from "zustand";
import type { Transaction } from "./types";
import { getCustomerTransactions } from "./api";

type CustomerTransactionsStore = {
    loading: boolean;
    items: Transaction[];
    loadTransactions: () => Promise<void>;
    clear: () => void;
};

export const useCustomerTransactionsStore = create<CustomerTransactionsStore>(
    (set) => ({
        loading: false,
        items: [],
        loadTransactions: async () => {
            try {
                set({ loading: true });
                const response = await getCustomerTransactions();
                set({ items: response?.items ?? [] });
            } catch {
                set({ items: [] });
            } finally {
                set({ loading: false });
            }
        },
        clear: () => {
            set({
                loading: false,
                items: [],
            });
        },
    }),
);
