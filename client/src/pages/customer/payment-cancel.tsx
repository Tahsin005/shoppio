import { Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

const pageClass = "flex min-h-screen items-center justify-center bg-background px-4";
const cardClass = "w-full max-w-xl space-y-6 border border-border bg-card p-8 text-center";
const iconClass = "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground";
const titleClass = "text-2xl font-semibold text-foreground";
const textClass = "text-sm text-muted-foreground";
const buttonRowClass = "flex flex-col gap-3 sm:flex-row sm:justify-center";
const buttonClass = "rounded-none";

export default function PaymentCancelPage() {
    return (
        <div className={pageClass}>
            <div className={cardClass}>
                <div className={iconClass}>
                    <Ban className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h1 className={titleClass}>Payment cancelled</h1>
                    <p className={textClass}>
                        You cancelled the payment. Your cart is still saved — you can
                        try again whenever you're ready.
                    </p>
                </div>
                <div className={buttonRowClass}>
                    <Button asChild className={buttonClass}>
                        <Link to="/">Go to home</Link>
                    </Button>
                    <Button asChild variant="outline" className={buttonClass}>
                        <Link to="/collections">Continue shopping</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
