import { createBrowserRouter } from "react-router-dom";
import { CustomerLayout } from "./components/layout/customer-layout";
import { PublicOnlyLayout } from "./components/auth/public-only-layout";
import { SignInPage } from "./pages/auth/sign-in";
import { SignUpPage } from "./pages/auth/sign-up";
import { ProtectedLayout } from "./components/auth/protected-layout";
import { RoleGuardLayout } from "./components/auth/role-guard-layout";
import { AdminLayout } from "./components/layout/admin-layout";
import { CustomerHomePage } from "./pages/customer/home";
import AdminDashboard from "./pages/admin/dashboard";
import AdminProducts from "./pages/admin/products";
import AdminPromos from "./pages/admin/promos";
import AdminOrders from "./pages/admin/orders";
import AdminSettings from "./pages/admin/settings";
import Collections from "./pages/customer/collections";
import CollectionDetails from "./pages/customer/collection-details";
import CustomerOrderSuccessPage from "./pages/customer/order-success";

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
                    },
                    {
                        path: "collections",
                        element: <Collections />,
                    },
                    {
                        path: "collection/:id",
                        element: <CollectionDetails />,
                    },
                ]
            },
            {
                element: <ProtectedLayout />,
                children: [
                    {
                        path: "order-success",
                        element: <CustomerOrderSuccessPage />,
                    },
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
                                element: <AdminDashboard />
                            },
                            {
                                path: "products",
                                element: <AdminProducts />
                            },
                            {
                                path: "coupons",
                                element: <AdminPromos />,
                            },
                            {
                                path: "orders",
                                element: <AdminOrders />,
                            },
                            {
                                path: "settings",
                                element: <AdminSettings />,
                            },
                        ]
                    }
                ]
            }
        ]
    }
])