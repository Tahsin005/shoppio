import { Button } from "@/components/ui/button";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const pageClass = "space-y-6 sm:space-y-8";
const pageTitleClass = "text-2xl sm:text-3xl font-bold tracking-tight text-foreground";
const pageSubtitleClass = "mt-1.5 text-sm text-muted-foreground";

const gridClass = "grid gap-5 sm:grid-cols-2 xl:grid-cols-3";
const cardClass = "group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1";
const imageWrapClass = "relative aspect-[5/4] overflow-hidden bg-secondary/20 shadow-inner";
const imageClass = "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110";
const noImageClass = "flex h-full w-full items-center justify-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 bg-secondary/10";
const bodyClass = "flex flex-1 flex-col gap-3 p-5";
const brandClass = "text-[10px] font-black uppercase tracking-[0.2em] text-primary/70";
const titleClass = "line-clamp-2 text-[15px] font-bold text-foreground leading-tight min-h-[2.5rem]";
const priceClass = "mt-auto text-lg font-black text-foreground flex items-baseline gap-1";
const actionsClass = "flex gap-2 pt-2";
const btnBase = "h-11 flex-1 rounded-xl text-xs font-bold transition-all";

const emptyClass = "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center bg-secondary/5";

export default function AccountWishlistPage() {
    const { items, removeItem, loadWishlist } = useCustomerWishlistStore();

    useEffect(() => { void loadWishlist(); }, [loadWishlist]);

    return (
        <div className={pageClass}>
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className={pageTitleClass}>
                        <Heart className="mr-3 inline-block h-8 w-8 align-text-bottom text-primary fill-primary/10" />
                        Wishlist
                    </h1>
                    <p className={pageSubtitleClass}>
                        {items.length
                            ? `You have ${items.length} item${items.length > 1 ? "s" : ""} saved in your wishlist.`
                            : "Save items you love to keep track of them."}
                    </p>
                </div>
                {items.length > 0 && (
                    <Button asChild variant="outline" className="h-11 rounded-xl px-6 font-bold border-border/60 shadow-sm hover:bg-secondary/50">
                        <Link to="/collections">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                )}
            </header>

            {!items.length ? (
                <div className={emptyClass}>
                    <div className="relative mb-6">
                        <Heart className="h-20 w-20 text-muted-foreground/10" />
                        <ShoppingBag className="absolute -bottom-2 -right-2 h-10 w-10 text-primary opacity-20" />
                    </div>
                    <p className="text-xl font-bold text-foreground">Your wishlist is empty</p>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                        Found something you like? Click the heart icon on any product to save it here.
                    </p>
                    <Button asChild className="mt-10 rounded-xl h-12 px-10 font-bold shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95" variant="default">
                        <Link to="/collections">Browse Collections</Link>
                    </Button>
                </div>
            ) : (
                <div className={gridClass}>
                    {items.map((item) => (
                        <div key={item.productId} className={cardClass}>
                            <div className={imageWrapClass}>
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className={imageClass} />
                                ) : (
                                    <div className={noImageClass}>Product Image Unavailable</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <div className={bodyClass}>
                                <div className="space-y-1">
                                    <p className={brandClass}>{item.brand}</p>
                                    <Link to={`/collection/${item.productId}`} className={titleClass}>
                                        {item.title}
                                    </Link>
                                </div>
                                <div className={priceClass}>
                                    <span className="text-sm font-bold text-muted-foreground/60">$</span>
                                    {item.finalPrice.toLocaleString()}
                                </div>
                                <div className={actionsClass}>
                                    <Button asChild variant="default" className={cn(btnBase, "shadow-md shadow-primary/10")}>
                                        <Link to={`/collection/${item.productId}`}>
                                            View Details
                                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={cn(btnBase, "flex-none w-12 p-0 border-border/60 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30")}
                                        onClick={() => void removeItem(item.productId)}
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
