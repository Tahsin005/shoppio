import { create } from "zustand";
import type { CustomerWishlistItem } from "./types";
import { getCustomerWishlist, removeCustomerWishlistItem } from "./api";
import { toast } from "sonner";

type CustomerWishlistStore = {
    items: CustomerWishlistItem[];
    setItems: (items: CustomerWishlistItem[]) => void;
    loadWishlist: () => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clear: () => void;
};

export const useCustomerWishlistStore = create<CustomerWishlistStore>(
    (set) => ({
        items: [],
        setItems: (items) => set({ items }),
        clear: () => set({ items: [] }),
        loadWishlist: async () => {
            try {
                const response = await getCustomerWishlist();
                set({ items: response.items ?? [] });
            } catch {
                set({ items: [] });
            }
        },
        removeItem: async (productId) => {
            try {
                const response = await removeCustomerWishlistItem(productId);
                set({ items: response?.items ?? [] });
                toast.success("Removed from wishlist");
            } catch {
                toast.error("Failed to remove items from wishlist");
            }
        },
    }),
);
