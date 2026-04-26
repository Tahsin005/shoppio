import { create } from "zustand";
import type { CustomerOrder } from "./types";
import { getCustomerOrders, returnCustomerOrder } from "./api";
import { toast } from "sonner";

type CustomerOrdersStore = {
    loading: boolean;
    items: CustomerOrder[];
    loadOrders: () => Promise<void>;
    returnOrder: (orderId: string) => Promise<void>;
    clear: () => void;
};

export const useCustomerOrdersStore = create<CustomerOrdersStore>(
    (set) => ({
        loading: false,
        items: [],
        loadOrders: async () => {
            try {
                set({ loading: true });
                const response = await getCustomerOrders();
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
        returnOrder: async (orderId) => {
            try {
                const response = await returnCustomerOrder(orderId);

                set((state) => ({
                    items: state.items.map((item) =>
                        item._id === orderId
                        ? {
                            ...item,
                            orderStatus: response?.orderStatus ?? item?.orderStatus,
                            returnedAt: response?.returnedAt ?? item.returnedAt ?? null,
                            }
                        : item,
                    ),
                }));
            } catch {
                toast.error("Failed to return order");
            }
        },
    }),
);
