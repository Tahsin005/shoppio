import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import type {
  CustomerOrder,
  CustomerOrderStatus,
  CustomerPaymentStatus,
} from "@/features/customer/orders/types";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronUp, ShoppingBasket } from "lucide-react";
import { Fragment, useState } from "react";

const dialogClass = "max-h-[92vh] w-[95vw] overflow-y-auto border-border bg-background sm:max-w-3xl";
const wrapClass = "space-y-4";
const topRowClass = "flex flex-wrap items-center justify-between gap-3";
const metaClass = "text-sm text-muted-foreground";
const buttonClass = "rounded-none";
const emptyClass = "text-sm text-muted-foreground";
const successBadgeClass = "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10";
const dangerBadgeClass = "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10";
const neutralBadgeClass = "border-border bg-secondary/60 text-foreground hover:bg-secondary/60";

function CustomerPaymentStatusBadge(props: { status: CustomerPaymentStatus }) {
    const { status } = props;
    const className =
        status === "paid"
        ? successBadgeClass
        : status === "failed"
            ? dangerBadgeClass
            : neutralBadgeClass;

    return <Badge className={className}>{status}</Badge>;
}

function CustomerOrderStatusBadge(props: { status: CustomerOrderStatus }) {
    const { status } = props;
    const className =
        status === "delivered"
        ? successBadgeClass
        : status === "returned"
            ? dangerBadgeClass
            : neutralBadgeClass;

    return <Badge className={className}>{status}</Badge>;
}

function formatDate(value?: string | null) {
    return value ? new Date(value).toLocaleDateString() : "-";
}

function canReturnOrder(order: CustomerOrder) {
    if (order.orderStatus !== "delivered" || !order.deliveredAt) return false;

    const diff = Date.now() - new Date(order.deliveredAt).getTime();

    return diff <= 7 * 24 * 60 * 60 * 1000;
}

function MobileOrderCard({ 
    order, 
    onReturn 
}: { 
    order: CustomerOrder; 
    onReturn: (id: string) => void 
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order #{order._id.slice(-8)}
                </span>
                <CustomerOrderStatusBadge status={order.orderStatus} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-1">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="font-medium text-foreground">{order.totalItems} Items</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-1">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <CustomerPaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Ordered On</p>
                    <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
                </div>
            </div>

            <div className="space-y-2 border-t border-border/50 pt-3">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-full justify-between px-2 text-xs font-medium hover:bg-secondary/40"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "Hide Items" : "View Items"}
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
                
                {isExpanded && (
                    <div className="space-y-3 pt-2">
                        {order.items.map((item) => (
                            <div key={item.product._id} className="flex items-center gap-3">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                    <img 
                                        src={item.product.image} 
                                        alt={item.product.title} 
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-xs font-semibold">{item.product.title}</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Qty: {item.quantity} × {formatPrice(item.product.price)}
                                    </p>
                                </div>
                                <div className="text-xs font-medium">
                                    {formatPrice(item.product.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-2">
                <span className="text-xs text-muted-foreground">
                    {order.paidAt ? `Paid on ${formatDate(order.paidAt)}` : "Payment Pending"}
                </span>
                {canReturnOrder(order) ? (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg px-4"
                        onClick={() => onReturn(order._id)}
                    >
                        Return Order
                    </Button>
                ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                        {order.orderStatus === "returned" ? "Returned" : ""}
                    </span>
                )}
            </div>
        </div>
    );
}

function CustomerOrdersDialog() {
    const { isOpen, closeOrders, loading, items, returnOrder, loadOrders } = useCustomerOrdersStore((state) => state);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && closeOrders()}>
            <DialogContent className={dialogClass}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingBasket className="h-4 w-4" />
                        My Orders
                    </DialogTitle>
                </DialogHeader>
                <div className={wrapClass}>
                    <div className={topRowClass}>
                        <p className={metaClass}>Track your recent orders</p>
                        <Button
                            type="button"
                            className={buttonClass}
                            onClick={() => void loadOrders()}
                        >
                            Refresh
                        </Button>
                    </div>

                    {loading ? <p>Loading...</p> : null}
                    {!loading && !items.length ? (
                        <p className={emptyClass}>No orders found</p>
                    ) : null}

                    <div className="hidden md:block">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Paid at</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {items.map((order) => (
                                        <Fragment key={order._id}>
                                            <TableRow 
                                                className="cursor-pointer transition-colors hover:bg-muted/50"
                                                onClick={() => toggleExpand(order._id)}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {expandedOrder === order._id ? (
                                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        {order._id}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{order.totalItems}</TableCell>
                                                <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                                                <TableCell>
                                                    <CustomerPaymentStatusBadge
                                                        status={order.paymentStatus}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <CustomerOrderStatusBadge status={order.orderStatus} />
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(order.paidAt || order.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {canReturnOrder(order) ? (
                                                        <Button
                                                            size="sm"
                                                            className="rounded-none"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                void returnOrder(order._id);
                                                            }}
                                                        >
                                                            Return
                                                        </Button>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            {order.orderStatus === "returned" ? "Returned" : ""}
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            {expandedOrder === order._id && (
                                                <TableRow className="bg-muted/30">
                                                    <TableCell colSpan={7} className="p-4">
                                                        <div className="ml-6 space-y-4">
                                                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order Items</h4>
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="space-y-4 md:hidden">
                        {items.map((order) => (
                            <MobileOrderCard 
                                key={order._id} 
                                order={order} 
                                onReturn={(id) => returnOrder(id)}
                            />
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CustomerOrdersDialog;
