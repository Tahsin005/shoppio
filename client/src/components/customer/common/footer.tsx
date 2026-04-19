import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Store } from "lucide-react";
import { Link } from "react-router-dom";

const footerClass = "border-t border-border/60 bg-secondary/30 pt-16 pb-8";
const containerClass = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const gridClass = "grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4";
const brandColClass = "space-y-6";
const linkColClass = "space-y-6";
const newsletterColClass = "space-y-6 lg:col-span-1";
const brandTitleClass = "flex items-center gap-3 text-2xl font-bold tracking-tight text-foreground";
const brandDescClass = "max-w-xs text-sm leading-relaxed text-muted-foreground";
const columnTitleClass = "text-sm font-semibold uppercase tracking-wider text-foreground";
const linkListClass = "space-y-3";
const linkItemClass = "text-sm text-muted-foreground transition hover:text-primary";
const socialWrapClass = "flex items-center gap-4";
const contactItemClass = "flex items-start gap-3 text-sm text-muted-foreground";
const newsletterDescClass = "text-sm text-muted-foreground";
const formClass = "flex gap-2";
const bottomClass = "mt-16 border-t border-border/40 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row";
const copyrightClass = "text-xs text-muted-foreground";

export function CustomerFooter() {
    return (
        <footer className={footerClass}>
            <div className={containerClass}>
                <div className={gridClass}>
                    {/* Brand Section */}
                    <div className={brandColClass}>
                        <Link to="/" className={brandTitleClass}>
                            <Store className="h-8 w-8 text-primary" />
                            <span>Shoppio</span>
                        </Link>
                        <p className={brandDescClass}>
                            Your ultimate destination for premium lifestyle products. Quality, style, and care in every single package.
                        </p>
                        <div className={socialWrapClass}>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={linkColClass}>
                        <h3 className={columnTitleClass}>Shop</h3>
                        <ul className={linkListClass}>
                            <li><Link to="/collections" className={linkItemClass}>All Collections</Link></li>
                            <li><Link to="#" className={linkItemClass}>New Arrivals</Link></li>
                            <li><Link to="#" className={linkItemClass}>Best Sellers</Link></li>
                            <li><Link to="#" className={linkItemClass}>Sale Items</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className={linkColClass}>
                        <h3 className={columnTitleClass}>Support</h3>
                        <div className="space-y-4">
                            <div className={contactItemClass}>
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>123 Commerce Way, Tech City, TC 54321</span>
                            </div>
                            <div className={contactItemClass}>
                                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>+1 (555) 000-1234</span>
                            </div>
                            <div className={contactItemClass}>
                                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>support@shoppio.dev</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className={newsletterColClass}>
                        <h3 className={columnTitleClass}>Stay Updated</h3>
                        <p className={newsletterDescClass}>
                            Subscribe to our newsletter to get updates on new products and special offers.
                        </p>
                        <form className={formClass} onSubmit={(e) => e.preventDefault()}>
                            <Input 
                                type="email" 
                                placeholder="Email address" 
                                className="h-10 rounded-xl bg-background border-border focus-visible:ring-primary/20"
                            />
                            <Button type="submit" className="h-10 rounded-xl px-5">Join</Button>
                        </form>
                    </div>
                </div>

                <div className={bottomClass}>
                    <p className={copyrightClass}>
                        © {new Date().getFullYear()} Shoppio Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link to="#" className={copyrightClass}>Privacy Policy</Link>
                        <Link to="#" className={copyrightClass}>Terms of Service</Link>
                        <Link to="#" className={copyrightClass}>Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
