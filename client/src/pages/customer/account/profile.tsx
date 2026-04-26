import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useUser } from "@clerk/react";
import { Coins, Mail, Pencil, Plus, Trash2, User } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const pageClass = "space-y-6 sm:space-y-8";
const pageTitleClass = "text-2xl sm:text-3xl font-bold tracking-tight text-foreground";
const pageSubtitleClass = "mt-1.5 text-sm text-muted-foreground";

const accountCardClass = "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-border/60 bg-card/80 p-5 sm:p-6 shadow-sm";
const avatarClass = "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner";
const accountInfoClass = "flex-1 min-w-0 space-y-1";
const accountNameClass = "text-xl font-bold text-foreground truncate";
const accountEmailClass = "flex items-center gap-2 text-sm text-muted-foreground/80";
const pointsBadgeClass = "flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-[15px] font-bold text-primary shadow-sm whitespace-nowrap self-stretch sm:self-auto justify-center";

const sectionClass = "space-y-5";
const sectionHeaderClass = "flex flex-wrap items-center justify-between gap-4";
const sectionTitleClass = "text-lg font-bold text-foreground";
const listClass = "grid gap-4";
const itemClass = "group relative rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm transition-all hover:border-primary/30";
const itemTopClass = "flex flex-col sm:flex-row sm:items-start justify-between gap-4";
const itemNameClass = "text-base font-bold text-foreground";
const defaultClass = "ml-2 inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary";
const addressClass = "mt-1.5 text-sm leading-relaxed text-muted-foreground/90";
const actionRowClass = "flex items-center gap-2 mt-5";
const buttonClass = "rounded-xl font-semibold";
const emptyClass = "rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground bg-secondary/5";

const formWrapClass = "rounded-2xl border border-border/60 bg-card/90 p-5 sm:p-8 shadow-xl space-y-6";
const formTitleClass = "text-xl font-bold text-foreground";
const twoColumnClass = "grid gap-5 sm:grid-cols-2";
const fieldClass = "space-y-2.5";
const inputClass = "h-11 rounded-xl bg-background border-border/60 focus:ring-primary/20";
const checkboxRowClass = "flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-4 text-sm font-medium text-foreground cursor-pointer transition-colors hover:bg-secondary/50";
const checkboxClass = "h-5 w-5 rounded-md border-border accent-primary";
const formActionsClass = "flex flex-col sm:flex-row justify-end gap-3 pt-2";

export default function AccountProfilePage() {
    const {
        mode,
        startAdd,
        startEdit,
        updateForm,
        cancelForm,
        saveForm,
        removeAddress,
        items,
        form,
        loadAddresses,
    } = useCustomerProfileStore();

    const { points } = useCustomerCartAndCheckoutStore((state) => state);
    const { user } = useUser();

    useEffect(() => {
        void loadAddresses();
    }, [loadAddresses]);

    const showForm = mode !== "none";

    return (
        <div className={pageClass}>
            <header>
                <h1 className={pageTitleClass}>My Account</h1>
                <p className={pageSubtitleClass}>Manage your personal information and delivery preferences.</p>
            </header>

            {/* User card */}
            <section className={accountCardClass}>
                <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className={avatarClass}>
                        <User className="h-7 w-7" />
                    </div>
                    <div className={accountInfoClass}>
                        <p className={accountNameClass}>{user?.fullName}</p>
                        <p className={accountEmailClass}>
                            <Mail className="h-3.5 w-3.5 shrink-0 opacity-60" />
                            <span className="truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                        </p>
                    </div>
                </div>
                <div className={pointsBadgeClass}>
                    <Coins className="h-5 w-5" />
                    <span>{points.toLocaleString()} pts</span>
                </div>
            </section>

            {/* Addresses */}
            <section className={sectionClass}>
                <div className={sectionHeaderClass}>
                    <h2 className={sectionTitleClass}>Saved Addresses</h2>
                    <Button 
                        className={cn(buttonClass, "w-full sm:w-auto h-11")} 
                        onClick={startAdd}
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add New Address
                    </Button>
                </div>

                {!items.length && !showForm ? (
                    <div className={emptyClass}>
                        <p>No addresses saved yet. Add one to speed up checkout.</p>
                    </div>
                ) : null}

                {items.length ? (
                    <div className={listClass}>
                        {items.map((item) => (
                            <div key={item._id} className={itemClass}>
                                <div className={itemTopClass}>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <span className={itemNameClass}>{item.fullName}</span>
                                            {item?.isDefault ? (
                                                <span className={defaultClass}>Default</span>
                                            ) : null}
                                        </div>
                                        <p className={addressClass}>
                                            {item.address}, {item.state}, {item.postalCode}
                                        </p>
                                    </div>
                                    <div className={actionRowClass}>
                                        <Button
                                            type="button"
                                            className={cn(buttonClass, "flex-1 sm:flex-none h-10 px-4")}
                                            variant="secondary"
                                            onClick={() => startEdit(item)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className={cn(buttonClass, "flex-1 sm:flex-none h-10 px-4 text-destructive hover:bg-destructive/5 hover:text-destructive")}
                                            onClick={() => void removeAddress(item._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </section>

            {/* Address form */}
            {showForm ? (
                <section className={formWrapClass}>
                    <h2 className={formTitleClass}>
                        {mode === "edit" ? "Edit Delivery Address" : "Add New Address"}
                    </h2>
                    <div className={twoColumnClass}>
                        <div className={fieldClass}>
                            <Label className="text-sm font-semibold ml-1">Full Name</Label>
                            <Input
                                className={inputClass}
                                value={form.fullName}
                                onChange={(e) => updateForm("fullName", e.target.value)}
                                placeholder="Receiver's full name"
                            />
                        </div>
                        <div className={fieldClass}>
                            <Label className="text-sm font-semibold ml-1">Street Address</Label>
                            <Input
                                className={inputClass}
                                value={form.address}
                                onChange={(e) => updateForm("address", e.target.value)}
                                placeholder="House no, street, area"
                            />
                        </div>
                    </div>
                    <div className={twoColumnClass}>
                        <div className={fieldClass}>
                            <Label className="text-sm font-semibold ml-1">State / City</Label>
                            <Input
                                className={inputClass}
                                value={form.state}
                                onChange={(e) => updateForm("state", e.target.value)}
                                placeholder="State or city name"
                            />
                        </div>
                        <div className={fieldClass}>
                            <Label className="text-sm font-semibold ml-1">Postal Code</Label>
                            <Input
                                className={inputClass}
                                value={form.postalCode}
                                onChange={(e) => updateForm("postalCode", e.target.value)}
                                placeholder="XXXX"
                            />
                        </div>
                    </div>
                    <label className={checkboxRowClass}>
                        <input
                            type="checkbox"
                            checked={form.isDefault}
                            onChange={(e) => updateForm("isDefault", e.target.checked)}
                            className={checkboxClass}
                        />
                        <span className="flex-1">Set as my primary delivery address</span>
                    </label>
                    <div className={formActionsClass}>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className={cn(buttonClass, "h-11 px-8")} 
                            onClick={cancelForm}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            className={cn(buttonClass, "h-11 px-8")} 
                            onClick={() => void saveForm()}
                        >
                            {mode === "edit" ? "Save Changes" : "Save Address"}
                        </Button>
                    </div>
                </section>
            ) : null}
        </div>
    );
}
