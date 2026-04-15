import { useAdminProducts } from "@/features/admin/products/use-admin-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductsTable } from "@/components/admin/products/products-table";

const pageWrap = "space-y-6 p-6";
const cardClass = "border-border bg-card shadow-sm";
const cardHeaderClass = "space-y-4";
const cardTitleClass = "text-xl";
const cardContentClass = "space-y-4";

function AdminProducts() {
    const {
        search,
        setSearch,
        products,
        categories,
        loading,
        categoryDialogOpen,
        setcategoryDialogOpen,
        productDialogOpen,
        setProductDialogOpen,
        editingProduct,
        openCreateDialog,
        closeProductDialog,
        refreshAll,
        openEditDialog,
    } = useAdminProducts();
    return (
        <div className={pageWrap}>
            <Card className={cardClass}>
                <CardHeader className={cardHeaderClass}>
                    <CardTitle className={cardTitleClass}>Products</CardTitle>
                </CardHeader>
                <CardContent className={cardContentClass}>
                    <ProductsTable
                        loading={loading}
                        products={products}
                        onEdit={openEditDialog}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminProducts