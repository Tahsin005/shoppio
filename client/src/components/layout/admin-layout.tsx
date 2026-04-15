import { Outlet } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { AdminSidebar, AdminMobileSidebar } from "../admin/common/sidebar";

export function AdminLayout() {
    return (
        <div className="min-h-screen bg-secondary/45">
            <div className="flex min-h-screen">
                <AdminSidebar />
                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border px-4 backdrop-blur lg:px-6">
                        <AdminMobileSidebar />
                        <div className="ml-auto flex items-center gap-2">
                            <UserButton />
                        </div>
                    </header>

                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}