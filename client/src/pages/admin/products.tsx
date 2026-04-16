import { useAdminProducts } from "@/features/admin/products/use-admin-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductDialog } from "@/components/admin/products/product-dialog";
import { ProductToolbar } from "@/components/admin/products/product-toolbar";
import { CategoryDialog } from "@/components/admin/products/category-dialog";

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
                    <ProductToolbar
                        search={search}
                        onSearchChange={setSearch}
                        onManageCategories={() => setcategoryDialogOpen(true)}
                        onAddProduct={openCreateDialog}
                    />
                </CardHeader>
                <CardContent className={cardContentClass}>
                    <ProductsTable
                        loading={loading}
                        products={products}
                        onEdit={openEditDialog}
                    />
                </CardContent>
            </Card>

            <CategoryDialog
                open={categoryDialogOpen}
                onOpenChange={setcategoryDialogOpen}
                categories={categories}
                onSaved={refreshAll}
            />

            <ProductDialog
                open={productDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeProductDialog();
                        return;
                    }

                    setProductDialogOpen(true);
                }}
                categories={categories}
                product={editingProduct}
                onSaved={refreshAll}
            />
        </div>
    )
}

export default AdminProducts