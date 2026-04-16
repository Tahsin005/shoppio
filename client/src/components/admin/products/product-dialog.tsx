import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category, Product } from "@/features/admin/products/types";
import { useProductForm } from "@/features/admin/products/use-product-form";

type ProductDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    product: Product | null;
    onSaved: () => Promise<void>;
};

const dialogContentClass = "max-h-[92vh] overflow-y-auto sm:max-w-4xl";
const contentWrapClass = "grid gap-6";
const twoColumnGridClass = "grid gap-4 md:grid-cols-2";
const threeColumnGridClass = "grid gap-4 md:grid-cols-3";
const fieldGroupClass = "space-y-2";
const sectionGridClass = "grid gap-6 md:grid-cols-2";
const statusGroupClass = "flex gap-6 rounded-xl border border-border bg-card px-4 py-3";
const statusItemClass = "flex items-center space-x-2";
const actionsRowClass = "flex justify-end gap-3";

export function ProductDialog({
    open,
    onOpenChange,
    categories,
    product,
    onSaved,
}: ProductDialogProps) {
    const {
        form,
        saving,
        isEditMode,
        updateField,
        toggleSize,
        addColor,
        removeColor,
        addFiles,
        submit,
        removeExistingImage,
        changeCoverImage,
    } = useProductForm({
        open,
        onClose: () => onOpenChange(false),
        onSaved,
        product,
    });
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={dialogContentClass}>
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Update Product" : "Create Product"}
                    </DialogTitle>
                </DialogHeader>

                <div className={contentWrapClass}>
                    <div className={twoColumnGridClass}>
                        <div className={fieldGroupClass}>
                            <Label>Title</Label>
                            <Input
                                value={form.title}
                                onChange={(event) => updateField("title", event.target.value)}
                                placeholder="Title"
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}