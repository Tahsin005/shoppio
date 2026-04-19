import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, LogIn, LogOut, Menu, ShoppingBag, ShoppingBasket, ShoppingCart, Store, User, History, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import { useAuth } from "@clerk/react";
import { useState } from "react";

type CustomerMobileNavbarProps = {
    isSignedIn: boolean;
    loading?: boolean;
};

export type NavItem = {
    label: string;
    href?: string;
    icon: LucideIcon;
    onClick?: () => void;
    badge?: number;
};

const collectionsPage: NavItem = {
    label: "Collections",
    href: "/collections",
    icon: ShoppingBag,
};

const iconLink = "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/90 transition hover:bg-white/5 hover:text-foreground";
const mobileWrap = "ml-auto flex items-center gap-1 lg:hidden";
const menuButton = "h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10";
const sheetContent = "w-[380px] max-w-[92vw] border-r border-border bg-background p-0 sm:w-[460px]";
const brandWrap = "flex items-center gap-3";
const brandTitle = "text-[25px] font-semibold tracking-[-0.02em] text-foreground";
const brandBlock = "px-5 py-6 sm:px-6";
const drawerSection = "space-y-3 px-5 py-5 sm:px-6";
const drawerTitle = "text-sm font-semibold tracking-wide text-muted-foreground";
const drawerItemsWrap = "space-y-1";
const drawerItemLink = "flex items-center gap-3 rounded-xl px-2 py-3 text-[18px] font-medium text-foreground transition hover:bg-white/5";
const cartBadge = "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";


function DrawerSection({ title, items }: { title: string; items: NavItem[] }) {
    return (
        <section className={drawerSection}>
            <p className={drawerTitle}>{title}</p>
            <div className={drawerItemsWrap}>
                {items.map((item) => {
                    const Icon = item.icon;

                    if (item.onClick) {
                        return (
                            <button
                                key={item.label}
                                type="button"
                                className={cn(drawerItemLink, "relative w-full text-left")}
                                onClick={item.onClick}
                            >
                                <Icon className="h-4.5 w-4.5" />
                                <span>{item.label}</span>
                                {item.badge && item.badge > 0 ? (
                                    <span className="ms-2 inline-flex min-w-4.5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold leading-4.5 text-black">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.href || "#"}
                            className={cn(drawerItemLink, "relative")}
                        >
                            <Icon className="h-4.5 w-4.5" />
                            <span>{item.label}</span>
                            {item.badge && item.badge > 0 ? (
                                <span className="ms-2 inline-flex min-w-4.5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold leading-4.5 text-black">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

import { cn } from "@/lib/utils";

export function CustomerMobileNavbar({
    isSignedIn,
    loading,
}: CustomerMobileNavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { signOut } = useAuth();
    
    const { items: wishlistItems, setOpen: setWishlistOpen } = useCustomerWishlistStore();
    const { openProfile } = useCustomerProfileStore();
    const { setOpen: setCartOpen, cart } = useCustomerCartAndCheckoutStore();
    const { openOrders } = useCustomerOrdersStore();

    const handleAction = (action: () => void) => {
        setIsOpen(false);
        action();
    };

    const wishlistCount = wishlistItems.length;
    const cartCount = cart?.items?.length || 0;

    const mobileAccountItems: NavItem[] = isSignedIn
        ? [
            { 
                label: "Account", 
                icon: User, 
                onClick: () => handleAction(() => openProfile()) 
            },
            { 
                label: "My Orders", 
                icon: ShoppingBasket, 
                onClick: () => handleAction(() => openOrders()) 
            },
            { 
                label: "Transactions", 
                icon: History, 
                onClick: () => handleAction(() => window.location.href = "/transactions"),
            },
            { 
                label: "Wishlist", 
                icon: Heart, 
                badge: wishlistCount,
                onClick: () => handleAction(() => setWishlistOpen(true)) 
            },
            { 
                label: "Sign Out", 
                icon: LogOut, 
                onClick: () => handleAction(() => signOut()) 
            },
        ]
        : [
            {
                label: "Login",
                href: "/sign-in",
                icon: LogIn,
            },
        ];

    return (
        <div className={mobileWrap}>
            <div 
                className={iconLink} 
                onClick={() => setCartOpen(true)}
                role="button"
                tabIndex={0}
            >
                <ShoppingCart className="h-4.5 w-4.5" />
                <span className={cartBadge}>{cartCount}</span>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} className={menuButton}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>

                <SheetContent side="left" className={sheetContent}>
                    <SheetHeader className="sr-only">
                        <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className={brandBlock}>
                        <Link 
                            to={"/"} 
                            className={brandWrap}
                            onClick={() => setIsOpen(false)}
                        >
                            <Store className="h-10 w-10" />
                            <span className={brandTitle}>Shoppio</span>
                        </Link>
                    </div>
                    <Separator />
                    <DrawerSection 
                        title="Collections" 
                        items={[{ 
                            ...collectionsPage, 
                            onClick: () => setIsOpen(false) 
                        }]} 
                    />

                    <Separator />
                    {loading ? (
                        <section className={drawerSection}>
                            <p className={drawerTitle}>Account</p>
                            <div className={drawerItemsWrap}>
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                        </section>
                    ) : (
                        <DrawerSection title="Account" items={mobileAccountItems} />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}