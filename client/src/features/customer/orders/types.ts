export type CustomerOrderStatus =
  | "placed"
  | "shipped"
  | "delivered"
  | "returned";
export type CustomerPaymentStatus = "pending" | "paid" | "failed";

export type CustomerOrder = {
    _id: string;
    code: string;
    totalItems: number;
    totalAmount: number;
    paymentStatus: CustomerPaymentStatus;
    orderStatus: CustomerOrderStatus;
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

export type CustomerOrdersResponse = {
    items: CustomerOrder[];
};

export type CustomerReturnOrderResponse = {
    _id: string;
    orderStatus: CustomerOrderStatus;
    returnedAt?: string | null;
};
