import { useCustomerTransactionsStore } from "@/features/customer/transactions/store";
import { ArrowDownLeft, ArrowUpRight, Coins, CreditCard, History, LayoutGrid, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const pageWrapClass = "min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-background/50";
const containerClass = "mx-auto max-w-4xl";
const headerClass = "mb-10 text-center";
const titleClass = "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl";
const subtitleClass = "mt-4 text-lg text-muted-foreground";

const listWrapClass = "relative space-y-4";
const cardClass = "group relative flex items-center justify-between overflow-hidden rounded-2xl border border-black bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5";
const iconWrapClass = "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors";
const debitIconClass = "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white";
const creditIconClass = "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white";

const infoWrapClass = "flex-1 px-6";
const descClass = "text-sm font-bold text-foreground sm:text-base";
const dateClass = "mt-1 text-xs text-muted-foreground sm:text-sm";
const methodWrapClass = "flex items-center gap-1.5 mt-2";
const methodBadgeClass = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border transition-colors";

const amountWrapClass = "text-right";
const amountClass = "text-lg font-black tracking-tight sm:text-xl";
const debitAmountClass = "text-red-500";
const creditAmountClass = "text-green-500";
const orderLinkClass = "mt-2 block text-[10px] font-bold uppercase tracking-widest text-primary hover:underline";

const emptyStateClass = "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border py-20 text-center";
const emptyIconClass = "h-16 w-16 text-muted-foreground/30";
const emptyTitleClass = "mt-6 text-xl font-bold text-foreground";
const emptyDescClass = "mt-2 text-muted-foreground";

export default function TransactionsPage() {
    const { loading, items, loadTransactions } = useCustomerTransactionsStore();

    useEffect(() => {
        void loadTransactions();
    }, [loadTransactions]);

    if (loading && items.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={pageWrapClass}>
            <div className={containerClass}>
                <header className={headerClass}>
                    <h1 className={titleClass}>Transaction History</h1>
                    <p className={subtitleClass}>
                        Track your points earned and payments made through our platform.
                    </p>
                </header>

                {items.length === 0 ? (
                    <div className={emptyStateClass}>
                        <div className="relative">
                            <History className={emptyIconClass} />
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-dashed border-border flex items-center justify-center">
                                <LayoutGrid className="h-3 w-3 text-muted-foreground/50" />
                            </div>
                        </div>
                        <h2 className={emptyTitleClass}>No transactions found</h2>
                        <p className={emptyDescClass}>
                            Complete your first purchase to start earning rewards!
                        </p>
                    </div>
                ) : (
                    <div className={listWrapClass}>
                        {items.map((transaction) => {
                            const isDebit = transaction.type === "debit";
                            const isPoints = transaction.paymentMethod === "points";

                            return (
                                <div key={transaction._id} className={cardClass}>
                                    <div className={`${iconWrapClass} ${isDebit ? debitIconClass : creditIconClass}`}>
                                        {isDebit ? (
                                            <ArrowUpRight className="h-6 w-6" />
                                        ) : (
                                            <ArrowDownLeft className="h-6 w-6" />
                                        )}
                                    </div>

                                    <div className={infoWrapClass}>
                                        <h3 className={descClass}>{transaction.description}</h3>
                                        <p className={dateClass}>
                                            {new Date(transaction.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <div className={methodWrapClass}>
                                            <span className={`${methodBadgeClass} ${isPoints ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-blue-500/5 border-blue-500/20 text-blue-500'}`}>
                                                {isPoints ? <Coins className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                                                {transaction.paymentMethod}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={amountWrapClass}>
                                        <div className={`${amountClass} ${isDebit ? debitAmountClass : creditAmountClass}`}>
                                            {isDebit ? "-" : "+"}
                                            {isPoints ? "" : "$"}
                                            {transaction.amount.toLocaleString()}
                                            {isPoints ? " pts" : ""}
                                        </div>
                                        {transaction.order && (
                                            <Link 
                                                to="#" 
                                                className={orderLinkClass}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // This could open the order details dialog
                                                }}
                                            >
                                                Order #{transaction.order.code}
                                            </Link>
                                        )}
                                    </div>

                                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent transition-colors group-hover:from-primary/40 group-hover:to-transparent" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
