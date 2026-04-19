import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "../customer/common/desktop-navbar";
import { CustomerFooter } from "../customer/common/footer";

export function CustomerLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <CustomerNavbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
                <Outlet />
            </main>
            <CustomerFooter />
        </div>
    )
}