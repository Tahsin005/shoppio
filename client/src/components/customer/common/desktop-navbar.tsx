import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/features/auth/store";
import { useAuth } from "@clerk/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, LogIn, LogOut, ShoppingBag, ShoppingBasket, ShoppingCart, Store, User, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { CustomerMobileNavbar } from "./mobile-navbar";

const shell = "mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8";
const headerClass = "sticky top-0 z-50 border-b border-border/70 bg-secondary/60 backdrop-blur-xl";
const textLink = "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-[15px] font-medium text-foreground/90 transition hover:bg-white/5 hover:text-foreground";
const iconLink = "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/90 transition hover:bg-white/5 hover:text-foreground";
const brandWrap = "flex shrink-0 items-center gap-3";
const brandTitle = "text-[25px] font-semibold tracking-[-0.02em] text-foreground";
const desktopCollectionsWrap = "ml-6 hidden lg:block";
const desktopNav = "ml-auto hidden items-center gap-1 lg:flex";
const dropdownButton = "h-10 rounded-xl px-3 text-[15px] font-medium text-foreground/90 hover:bg-white/5 hover:text-foreground";
const dropdownContent = "mt-3 rounded-2xl border-border bg-popover/95 p-2 backdrop-blur";
const accountDropdownContent = `${dropdownContent} w-56`;
const dropdownItemLink = "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5";
const cartBadge = "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";
const wishlistBadge = "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";


type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

const collectionsPage: NavItem = {
    label: "Collections",
    href: "/collections",
    icon: ShoppingBag,
};

function NavTextLink({
    href,
    label,
    icon: Icon,
}: {
    href: string;
    label: string;
    icon: LucideIcon;
}) {
    return (
        <Link to={href} className={textLink}>
            <Icon className="h-[18px] w-[18px]" />
            <span>{label}</span>
        </Link>
    );
}

export function CustomerNavbar() {
    const { isSignedIn, signOut, isLoaded } = useAuth();
    const { isBootstrapped } = useAuthStore();

    const isLoading = !isLoaded || !isBootstrapped;
    const showSignInUi = isLoaded && isBootstrapped && isSignedIn;

    return (
        <header className={headerClass}>
            <div className={shell}>
                <Link to={"/"} className={brandWrap}>
                    <Store className="h-10 w-10" />
                    <span className={brandTitle}>Shoppio</span>
                </Link>

                <div className={desktopCollectionsWrap}>
                    <NavTextLink
                        href={collectionsPage.href}
                        label={collectionsPage.label}
                        icon={collectionsPage.icon}
                    />
                </div>

                <nav className={desktopNav}>
                    {isLoading ? (
                        <>
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-10 w-24 rounded-xl" />
                        </>
                    ) : (
                        <>
                            {showSignInUi ? (
                                <button
                                    type="button"
                                    className={iconLink}
                                >
                                    <Heart className="w-[20px] h-[20px]" />
                                    <span className={wishlistBadge}>{0}</span>
                                </button>
                            ) : null}

                            {isSignedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant={"ghost"} className={dropdownButton}>
                                            <User className="h-4.5 w-4.5" />
                                            Account
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className={accountDropdownContent}
                                    >
                                        <DropdownMenuItem
                                            className={dropdownItemLink}
                                        >
                                            <User className="h-4 w-4" />
                                            <span>My Account</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className={dropdownItemLink}
                                        >
                                            <ShoppingBasket className="h-4 w-4" />
                                            <span>My Orders</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => signOut()}
                                            className={dropdownItemLink}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <NavTextLink href="/sign-in" label="Login" icon={LogIn} />
                            )}
                        </>
                    )}

                    <div className={iconLink}>
                        <ShoppingCart className="h-4.5 w-4.5" />
                        <span className={cartBadge}>0</span>
                    </div>
                </nav>

                <CustomerMobileNavbar
                    isSignedIn={!!isSignedIn}
                    loading={isLoading}
                />
            </div>
        </header>
    )
}