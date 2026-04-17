import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { verifyPayment } from "../../features/customer/cart-and-checkout/api";
import { useCustomerCartAndCheckoutStore } from "../../features/customer/cart-and-checkout/store";

const pageClass = "flex min-h-screen items-center justify-center bg-background px-4";
const cardClass = "w-full max-w-xl space-y-6 border border-border bg-card p-8 text-center";
const iconSuccessClass = "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary";
const iconFailClass = "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive";
const titleClass = "text-2xl font-semibold text-foreground";
const textClass = "text-sm text-muted-foreground";
const buttonRowClass = "flex flex-col gap-3 sm:flex-row sm:justify-center";
const buttonClass = "rounded-none";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const clear = useCustomerCartAndCheckoutStore((s) => s.clear);

    useEffect(() => {
        const transactionId = searchParams.get("transaction_id") ?? "";
        const orderId = searchParams.get("order_id") ?? "";

        if (!transactionId) {
            setStatus("failed");
            return;
        }

        verifyPayment({ transaction_id: transactionId, order_id: orderId })
            .then((result) => {
                if (result?.verified && result.status === "SUCCESS") {
                    clear();
                    setStatus("success");
                } else {
                    setStatus("failed");
                }
            })
            .catch(() => setStatus("failed"));
    }, [searchParams, clear]);

    if (status === "loading") {
        return (
            <div className={pageClass}>
                <div className={cardClass}>
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <h1 className={titleClass}>Verifying your payment…</h1>
                    <p className={textClass}>Please wait while we confirm your payment.</p>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className={pageClass}>
                <div className={cardClass}>
                    <div className={iconSuccessClass}>
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className={titleClass}>Payment successful!</h1>
                        <p className={textClass}>
                            Your order has been placed and is being processed.
                        </p>
                    </div>
                    <div className={buttonRowClass}>
                        <Button asChild className={buttonClass}>
                            <Link to="/collections">Continue shopping</Link>
                        </Button>
                        <Button asChild variant="outline" className={buttonClass}>
                            <Link to="/">Go to home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={pageClass}>
            <div className={cardClass}>
                <div className={iconFailClass}>
                    <XCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h1 className={titleClass}>Payment could not be verified</h1>
                    <p className={textClass}>
                        We couldn't confirm your payment. If money was deducted, please
                        contact support with your transaction details.
                    </p>
                </div>
                <div className={buttonRowClass}>
                    <Button asChild className={buttonClass}>
                        <Link to="/">Go to home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
