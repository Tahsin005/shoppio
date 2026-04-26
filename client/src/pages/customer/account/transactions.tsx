import { useCustomerTransactionsStore } from "@/features/customer/transactions/store";
import { ArrowDownLeft, ArrowUpRight, Coins, CreditCard, History, Loader2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const pageClass = "space-y-6 sm:space-y-8";
const pageTitleClass = "text-2xl sm:text-3xl font-bold tracking-tight text-foreground";
const pageSubtitleClass = "mt-1.5 text-sm text-muted-foreground";

const listClass = "grid gap-4";
const cardClass = "group relative flex items-center justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5";
const iconWrapClass = "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-3";
const debitIconClass = "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-rose-500/20";
const creditIconClass = "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-emerald-500/20";
const infoClass = "flex-1 px-4 sm:px-8 min-w-0";
const descClass = "text-[15px] font-bold text-foreground truncate group-hover:text-primary transition-colors";
const dateClass = "mt-1 text-xs font-medium text-muted-foreground/60";
const methodWrapClass = "flex items-center gap-1.5 mt-2.5";
const methodBadgeClass = "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border transition-all";
const amountWrapClass = "text-right flex flex-col items-end gap-1";
const amountClass = "text-xl font-black tracking-tighter sm:text-2xl";
const debitAmountClass = "text-rose-500";
const creditAmountClass = "text-emerald-500";
const orderLinkClass = "inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary/70 hover:text-primary transition-colors hover:underline";

const emptyClass = "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center bg-secondary/5";

export default function AccountTransactionsPage() {
    const { loading, items, loadTransactions } = useCustomerTransactionsStore();

    useEffect(() => { void loadTransactions(); }, [loadTransactions]);

    if (loading && items.length === 0) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            </div>
        );
    }

    return (
        <div className={pageClass}>
            <header>
                <h1 className={pageTitleClass}>
                    <History className="mr-3 inline-block h-8 w-8 align-text-bottom text-primary" />
                    Transactions
                </h1>
                <p className={pageSubtitleClass}>Keep track of your spending, earnings, and rewards.</p>
            </header>

            {items.length === 0 ? (
                <div className={emptyClass}>
                    <div className="relative mb-6">
                        <History className="h-20 w-20 text-muted-foreground/10" />
                        <Coins className="absolute -bottom-2 -right-2 h-10 w-10 text-primary opacity-20" />
                    </div>
                    <p className="text-xl font-bold text-foreground">No transactions yet</p>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                        Once you start shopping and earning points, your financial activity will appear here.
                    </p>
                    <Button asChild className="mt-10 rounded-xl h-12 px-10 font-bold" variant="secondary">
                        <Link to="/collections">Explore Products</Link>
                    </Button>
                </div>
            ) : (
                <div className={listClass}>
                    {items.map((transaction) => {
                        const isDebit = transaction.type === "debit";
                        const isPoints = transaction.paymentMethod === "points";
                        return (
                            <div key={transaction._id} className={cardClass}>
                                <div className={cn(iconWrapClass, isDebit ? debitIconClass : creditIconClass)}>
                                    {isDebit ? <ArrowUpRight className="h-7 w-7" /> : <ArrowDownLeft className="h-7 w-7" />}
                                </div>
                                <div className={infoClass}>
                                    <p className={descClass}>{transaction.description}</p>
                                    <p className={dateClass}>
                                        {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric", month: "short", day: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                    <div className={methodWrapClass}>
                                        <span className={cn(
                                            methodBadgeClass, 
                                            isPoints 
                                                ? "bg-primary/5 border-primary/20 text-primary" 
                                                : "bg-blue-500/5 border-blue-500/20 text-blue-500"
                                        )}>
                                            {isPoints ? <Coins className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                                            {transaction.paymentMethod}
                                        </span>
                                    </div>
                                </div>
                                <div className={amountWrapClass}>
                                    <div className={cn(amountClass, isDebit ? debitAmountClass : creditAmountClass)}>
                                        {isDebit ? "-" : "+"}
                                        {isPoints ? "" : "$"}
                                        {transaction.amount.toLocaleString()}
                                        {isPoints ? " pts" : ""}
                                    </div>
                                    {transaction.order && (
                                        <Link to="/account/orders" className={orderLinkClass}>
                                            <span>Order #{transaction.order.code}</span>
                                            <ArrowRight className="h-2.5 w-2.5" />
                                        </Link>
                                    )}
                                </div>
                                <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
