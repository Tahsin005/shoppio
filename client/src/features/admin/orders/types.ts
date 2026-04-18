export type AdminOrderStatus = "placed" | "shipped" | "delivered" | "returned";
export type AdminPaymentStatus = "pending" | "paid" | "failed";

export type AdminOrder = {
    _id: string;
    code: string;
    customerName: string;
    customerEmail: string;
    totalItems: number;
    totalAmount: number;
    paymentStatus: AdminPaymentStatus;
    orderStatus: AdminOrderStatus;
    items: {
        product: {
            _id: string;
            title: string;
            image: string;
            price: number;
        };
        quantity: number;
    }[];
    paidAt?: string | null;
    deliveredAt?: string | null;
    returnedAt?: string | null;
    createdAt: string;
};

export type AdminOrdersResponse = {
    items: AdminOrder[];
};

export type AdminUpdateOrderStatusResponse = {
    _id: string;
    orderStatus: AdminOrderStatus;
    deliveredAt?: string | null;
    returnedAt?: string | null;
};
