import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import type { CustomerOrder, CustomerOrderStatus, CustomerPaymentStatus } from "@/features/customer/orders/types";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronUp, RefreshCw, ShoppingBasket, Calendar, Package, CreditCard } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const pageClass = "space-y-6 sm:space-y-8";
const pageTitleClass = "text-2xl sm:text-3xl font-bold tracking-tight text-foreground";
const pageSubtitleClass = "mt-1.5 text-sm text-muted-foreground";
const topRowClass = "flex flex-col sm:flex-row sm:items-center justify-between gap-4";
const emptyClass = "rounded-3xl border border-dashed border-border/60 px-6 py-20 text-center text-muted-foreground bg-secondary/5";

const successBadge = "rounded-full border-emerald-500/20 bg-emerald-500/10 text-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-500/15";
const dangerBadge = "rounded-full border-destructive/20 bg-destructive/10 text-destructive px-3 py-1 text-[11px] font-bold uppercase tracking-wider hover:bg-destructive/15";
const neutralBadge = "rounded-full border-border bg-secondary/80 text-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-wider hover:bg-secondary/100";

function PaymentBadge({ status }: { status: CustomerPaymentStatus }) {
    const cls = status === "paid" ? successBadge : status === "failed" ? dangerBadge : neutralBadge;
    return <Badge className={cls} variant="outline">{status}</Badge>;
}

function OrderStatusBadge({ status }: { status: CustomerOrderStatus }) {
    const cls = status === "delivered" ? successBadge : status === "returned" ? dangerBadge : neutralBadge;
    return <Badge className={cls} variant="outline">{status}</Badge>;
}

function fmtDate(v?: string | null) {
    if (!v) return "-";
    return new Date(v).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function canReturn(order: CustomerOrder) {
    if (order.orderStatus !== "delivered" || !order.deliveredAt) return false;
    return Date.now() - new Date(order.deliveredAt).getTime() <= 7 * 24 * 60 * 60 * 1000;
}

function MobileCard({ order, onReturn }: { order: CustomerOrder; onReturn: (id: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm transition-all hover:border-primary/30">
            <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Order ID</p>
                        <p className="text-sm font-bold text-foreground">#{order._id.slice(-8)}</p>
                    </div>
                    <OrderStatusBadge status={order.orderStatus} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            <CreditCard className="h-3 w-3" />
                            <span>Amount</span>
                        </div>
                        <p className="text-base font-black text-foreground">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            <Calendar className="h-3 w-3" />
                            <span>Date</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{fmtDate(order.createdAt)}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Payment</p>
                        <PaymentBadge status={order.paymentStatus} />
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Items</p>
                        <p className="text-sm font-bold">{order.totalItems} Units</p>
                    </div>
                </div>
            </div>

            <div className="bg-secondary/10 px-5 py-3 flex flex-col gap-3">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-full justify-between rounded-xl px-4 text-xs font-bold transition-colors hover:bg-secondary/40" 
                    onClick={() => setExpanded(!expanded)}
                >
                    <span className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-primary" />
                        {expanded ? "Hide Order Items" : "Show Order Items"}
                    </span>
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                
                {expanded && (
                    <div className="space-y-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {order.items.map((item) => (
                            <div key={item.product._id} className="flex items-center gap-4 rounded-xl bg-background/50 p-2.5 border border-border/40">
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted shadow-sm">
                                    <img src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-xs font-bold leading-none mb-1">{item.product.title}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground">
                                        {item.quantity} x {formatPrice(item.product.price)}
                                    </p>
                                </div>
                                <span className="text-xs font-black text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {canReturn(order) && (
                    <Button 
                        size="sm" 
                        variant="destructive" 
                        className="h-11 w-full rounded-xl font-bold shadow-lg shadow-destructive/10" 
                        onClick={() => onReturn(order._id)}
                    >
                        Return This Order
                    </Button>
                )}
                
                {order.orderStatus === "returned" && (
                    <div className="flex h-11 w-full items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-xs font-bold uppercase tracking-widest text-destructive">
                        Order Returned
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AccountOrdersPage() {
    const { loading, items, returnOrder, loadOrders } = useCustomerOrdersStore();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => { void loadOrders(); }, [loadOrders]);

    const toggle = (id: string) => setExpandedOrder(expandedOrder === id ? null : id);

    return (
        <div className={pageClass}>
            <header className={topRowClass}>
                <div>
                    <h1 className={pageTitleClass}>
                        <ShoppingBasket className="mr-3 inline-block h-8 w-8 align-text-bottom text-primary" />
                        My Orders
                    </h1>
                    <p className={pageSubtitleClass}>View history and track your recent purchases.</p>
                </div>
                <Button 
                    variant="outline" 
                    className="h-11 px-6 rounded-xl font-bold border-border/60 shadow-sm hover:bg-secondary/50" 
                    onClick={() => void loadOrders()}
                >
                    <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                    Refresh
                </Button>
            </header>

            {loading && items.length === 0 && (
                <div className="flex items-center justify-center py-24">
                    <RefreshCw className="h-10 w-10 animate-spin text-primary/40" />
                </div>
            )}

            {!loading && !items.length && (
                <div className={emptyClass}>
                    <ShoppingBasket className="mx-auto mb-5 h-16 w-16 text-muted-foreground/20" />
                    <p className="text-lg font-bold text-foreground">No orders found</p>
                    <p className="mt-1 text-sm">Once you place an order, it will appear here.</p>
                    <Button asChild className="mt-8 rounded-xl h-11 px-8" variant="secondary">
                        <a href="/collections">Start Shopping</a>
                    </Button>
                </div>
            )}

            {!loading && items.length > 0 && (
                <div className="space-y-6">
                    {/* Desktop View */}
                    <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-secondary/5 border-b border-border/60">
                                    <TableHead className="py-4 font-bold text-muted-foreground">Order ID</TableHead>
                                    <TableHead className="py-4 font-bold text-muted-foreground">Items</TableHead>
                                    <TableHead className="py-4 font-bold text-muted-foreground">Total</TableHead>
                                    <TableHead className="py-4 font-bold text-muted-foreground">Payment</TableHead>
                                    <TableHead className="py-4 font-bold text-muted-foreground">Status</TableHead>
                                    <TableHead className="py-4 font-bold text-muted-foreground">Date</TableHead>
                                    <TableHead className="py-4 font-bold text-right text-muted-foreground">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((order) => (
                                    <Fragment key={order._id}>
                                        <TableRow className="cursor-pointer transition-colors hover:bg-secondary/30 group" onClick={() => toggle(order._id)}>
                                            <TableCell className="py-5 font-bold">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary/50 transition-colors group-hover:bg-primary/10">
                                                        {expandedOrder === order._id
                                                            ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
                                                            : <ChevronDown className="h-3.5 w-3.5 text-primary" />}
                                                    </div>
                                                    <span className="opacity-80 group-hover:opacity-100">#{order._id.slice(-8)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-5 font-medium">{order.totalItems} Units</TableCell>
                                            <TableCell className="py-5 font-black text-foreground">{formatPrice(order.totalAmount)}</TableCell>
                                            <TableCell className="py-5"><PaymentBadge status={order.paymentStatus} /></TableCell>
                                            <TableCell className="py-5"><OrderStatusBadge status={order.orderStatus} /></TableCell>
                                            <TableCell className="py-5 font-medium text-muted-foreground">{fmtDate(order.createdAt)}</TableCell>
                                            <TableCell className="py-5 text-right">
                                                {canReturn(order) ? (
                                                    <Button 
                                                        size="sm" 
                                                        className="rounded-lg font-bold" 
                                                        variant="outline"
                                                        onClick={(e) => { e.stopPropagation(); void returnOrder(order._id); }}
                                                    >
                                                        Return
                                                    </Button>
                                                ) : (
                                                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                                        {order.orderStatus === "returned" ? "Returned" : "None"}
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        {expandedOrder === order._id && (
                                            <TableRow className="bg-secondary/5 border-t border-border/40">
                                                <TableCell colSpan={7} className="p-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Detailed Order Summary</h4>
                                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                                            {order.items.map((item) => (
                                                                <div key={item.product._id} className="flex gap-4 rounded-2xl border border-border/60 bg-background p-4 shadow-sm transition-transform hover:-translate-y-1">
                                                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border/60 shadow-inner">
                                                                        <img src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                                                                    </div>
                                                                    <div className="flex flex-col justify-center min-w-0">
                                                                        <p className="truncate text-sm font-bold text-foreground">{item.product.title}</p>
                                                                        <p className="text-xs font-semibold text-muted-foreground">{item.quantity} x {formatPrice(item.product.price)}</p>
                                                                        <p className="mt-1 text-sm font-black text-primary">{formatPrice(item.product.price * item.quantity)}</p>
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

                    {/* Mobile View */}
                    <div className="grid gap-4 lg:hidden">
                        {items.map((order) => <MobileCard key={order._id} order={order} onReturn={(id) => void returnOrder(id)} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
