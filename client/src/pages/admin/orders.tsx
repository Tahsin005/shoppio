import { Commonloader } from "@/components/common/loader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    SelectTrigger,
    SelectValue,
    Select,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAdminOrdersStore } from "@/features/admin/orders/store";
import type {
    AdminOrder,
    AdminOrderStatus,
    AdminPaymentStatus,
} from "@/features/admin/orders/types";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

const pageWrapClass = "min-h-screen bg-background";
const contentWrapClass = "mx-auto max-w-7xl px-4 py-8";
const cardClass = "border-border bg-card";
const wrapClass = "space-y-4";
const titleClass = "flex items-center gap-2 text-2xl font-semibold";
const emptyClass = "rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground";
const tableWrapClass = "overflow-x-auto";
const subTextClass = "text-xs text-muted-foreground";
const selectTriggerClass = "h-9 w-[160px] rounded-none";
const successBadgeClass = "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10";
const dangerBadgeClass = "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10";
const neutralBadgeClass = "border-border bg-secondary/60 text-foreground hover:bg-secondary/60";

const orderStatusOptions: AdminOrderStatus[] = [
    "placed",
    "shipped",
    "delivered",
    "returned",
];

function formatDate(value?: string | null) {
    return value ? new Date(value).toLocaleDateString() : "-";
}

function AdminPaymentStatusBadge(props: { status: AdminPaymentStatus }) {
    const { status } = props;
    const className = status === "paid" ? successBadgeClass : status === "failed" ? dangerBadgeClass : neutralBadgeClass;

    return <Badge className={className}>{status}</Badge>;
}

function canUpdateStatus(order: AdminOrder) {
    if (order.paymentStatus !== "paid") return false;
    if (order.orderStatus === "returned") return false;

    return true;
}

function getNextStatusValue(order: AdminOrder) {
    if (order.orderStatus === "delivered" || order.orderStatus === "returned")
        return "";

    return order.orderStatus;
}

function AdminOrders() {
    const { loading, orders, updatingOrderId, fetchOrders, changeStatus } =
        useAdminOrdersStore((state) => state);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    useEffect(() => {
        void fetchOrders();
    }, [fetchOrders]);

    if (loading) return <Commonloader />;

    return (
        <div className={pageWrapClass}>
            <div className={contentWrapClass}>
                <Card className={cardClass}>
                    <CardHeader className={wrapClass}>
                        <CardTitle className={titleClass}>Orders</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {!orders.length ? (
                            <div className={emptyClass}>No Orders found</div>
                        ) : (
                            <div className={tableWrapClass}>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Paid at</TableHead>
                                            <TableHead className="text-right">Update</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {orders.map((order) => {
                                            const canUpdate = canUpdateStatus(order);
                                            const isExpanded = expandedOrder === order._id;
                                            return (
                                                <Fragment key={order._id}>
                                                    <TableRow 
                                                        className="cursor-pointer transition-colors hover:bg-muted/50"
                                                        onClick={() => toggleExpand(order._id)}
                                                    >
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                {isExpanded ? (
                                                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                                )}
                                                                {order._id}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{order.customerName}</TableCell>
                                                        <TableCell>{order.totalItems}</TableCell>
                                                        <TableCell>
                                                            {formatPrice(order.totalAmount)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <AdminPaymentStatusBadge
                                                                status={order.paymentStatus}
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            {formatDate(order.paidAt || order.createdAt)}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {canUpdate ? (
                                                                <Select
                                                                    value={getNextStatusValue(order)}
                                                                    onValueChange={(value) =>
                                                                    void changeStatus(
                                                                        order._id,
                                                                        value as AdminOrderStatus,
                                                                    )
                                                                    }
                                                                    disabled={updatingOrderId === order._id}
                                                                >
                                                                    <SelectTrigger 
                                                                        className={selectTriggerClass}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <SelectValue placeholder="Update Status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent onClick={(e) => e.stopPropagation()}>
                                                                        {orderStatusOptions.map((status) => (
                                                                            <SelectItem
                                                                                key={status}
                                                                                value={status}
                                                                                disabled={
                                                                                    status === "placed" ||
                                                                                    status === order.orderStatus ||
                                                                                    (order.orderStatus === "delivered" &&
                                                                                        status === "shipped")
                                                                                }
                                                                            >
                                                                                {status}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            ) : (
                                                                <span className={subTextClass}>
                                                                    {order.paymentStatus !== "paid"
                                                                        ? "Payment not paid"
                                                                        : order.orderStatus === "returned"
                                                                            ? "Returned"
                                                                            : "Completed"}
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                    {isExpanded && (
                                                        <TableRow className="bg-muted/30">
                                                            <TableCell colSpan={7} className="p-4">
                                                                <div className="ml-6 space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Items</h4>
                                                                        <p className="text-xs text-muted-foreground">Customer Email: <span className="font-medium text-foreground">{order.customerEmail}</span></p>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                                        {order.items.map((item) => (
                                                                            <div key={item.product._id} className="flex gap-4 rounded-lg border border-border/50 bg-background p-3 shadow-sm">
                                                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                                                                    <img 
                                                                                        src={item.product.image} 
                                                                                        alt={item.product.title} 
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex flex-col justify-center">
                                                                                    <p className="line-clamp-1 text-sm font-semibold">{item.product.title}</p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {item.quantity} × {formatPrice(item.product.price)}
                                                                                    </p>
                                                                                    <p className="mt-1 text-xs font-bold text-primary">
                                                                                        Subtotal: {formatPrice(item.product.price * item.quantity)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminOrders;
