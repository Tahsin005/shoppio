import { cn } from "@/lib/utils";
import { Heart, LayoutGrid, ShoppingBasket, History, User } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const pageClass = "min-h-[calc(100vh-72px)] bg-background";
const containerClass = "mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 lg:py-12";
const innerClass = "flex flex-col lg:flex-row gap-8 lg:gap-12";

// Sidebar (desktop)
const sidebarClass = "hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:gap-1.5";
const sidebarHeaderClass = "mb-6 px-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60";

// Mobile Nav
const mobileNavClass = "lg:hidden mb-8";
const selectTriggerClass = "h-14 w-full rounded-2xl border-border/50 bg-card px-4 text-base font-semibold shadow-sm focus:ring-0 focus:ring-offset-0";

const navItemBase = "flex items-center gap-3.5 rounded-xl px-4 py-3 text-[15px] font-medium text-foreground/60 transition-all duration-200 hover:bg-secondary/80 hover:text-foreground hover:translate-x-1";
const navItemActive = "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary hover:translate-x-0";

const contentClass = "min-w-0 flex-1";

type NavEntry = {
    to: string;
    label: string;
    icon: React.ElementType;
};

const navItems: NavEntry[] = [
    { to: "/account/profile",      label: "My Account",    icon: User },
    { to: "/account/orders",       label: "My Orders",     icon: ShoppingBasket },
    { to: "/account/transactions", label: "Transactions",  icon: History },
    { to: "/account/wishlist",     label: "Wishlist",      icon: Heart },
];

function SidebarLink({ to, label, icon: Icon }: NavEntry) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(navItemBase, isActive && navItemActive)
            }
        >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
        </NavLink>
    );
}

export default function AccountLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = navItems.find(item => location.pathname.startsWith(item.to))?.to || navItems[0].to;

    return (
        <div className={pageClass}>
            <div className={containerClass}>
                <div className={innerClass}>
                    {/* Mobile Navigation */}
                    <div className={mobileNavClass}>
                        <Select value={currentTab} onValueChange={(val) => navigate(val)}>
                            <SelectTrigger className={selectTriggerClass}>
                                <div className="flex items-center gap-3">
                                    <LayoutGrid className="h-5 w-5 text-primary" />
                                    <SelectValue placeholder="Navigate to..." />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border bg-popover/95 p-1 backdrop-blur-xl">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <SelectItem 
                                            key={item.to} 
                                            value={item.to}
                                            className="rounded-xl px-3 py-3 text-base font-medium focus:bg-primary/10 focus:text-primary"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-5 w-5" />
                                                <span>{item.label}</span>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className={sidebarClass}>
                        <div className={sidebarHeaderClass}>
                            <LayoutGrid className="h-4 w-4" />
                            <span>Dashboard</span>
                        </div>
                        <nav className="flex flex-col gap-1.5">
                            {navItems.map((item) => (
                                <SidebarLink key={item.to} {...item} />
                            ))}
                        </nav>
                    </aside>

                    {/* Page content */}
                    <main className={contentClass}>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
