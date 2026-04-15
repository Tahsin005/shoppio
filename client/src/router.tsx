import { createBrowserRouter } from "react-router-dom";
import { CustomerLayout } from "./components/layout/customer-layout";
import { PublicOnlyLayout } from "./components/auth/public-only-layout";
import { SignInPage } from "./pages/auth/sign-in";
import { SignUpPage } from "./pages/auth/sign-up";
import { ProtectedLayout } from "./components/auth/protected-layout";
import { RoleGuardLayout } from "./components/auth/role-guard-layout";
import { AdminLayout } from "./components/layout/admin-layout";
import { CustomerHomePage } from "./pages/customer/home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <CustomerLayout />,
        children: [
            {
                index: true,
                element: <CustomerHomePage />
            },
            {
                element: <PublicOnlyLayout />,
                children: [
                    {
                        path: "sign-in/*",
                        element: <SignInPage />
                    },
                    {
                        path: "sign-up/*",
                        element: <SignUpPage />
                    }
                ]
            },
            {
                element: <ProtectedLayout />,
                children: [
                    
                ]
            }
        ]
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                element: <RoleGuardLayout allow={["admin"]} />,
                children: [
                    {
                        path: "/admin",
                        element: <AdminLayout />,
                        children: [
                            {
                                index: true,
                                element: <div>Admin Dashboard</div>
                            },
                            {
                                path: "products",
                                element: <div>Admin Products</div>
                            }
                        ]
                    }
                ]
            }
        ]
    }
])