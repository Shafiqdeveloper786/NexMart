import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | NexMart",
  description: "Your NexMart order has been placed successfully.",
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">

        {/* Animated check */}
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          {/* Ripple rings */}
          <span className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-950/40 animate-ping opacity-30" />
          <span className="absolute inset-2 rounded-full bg-green-100 dark:bg-green-950/40" />
          <CheckCircle className="relative h-14 w-14 text-green-500" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Thank you for your order. We&apos;ve received it and will start processing right away.
            You&apos;ll get a confirmation email shortly.
          </p>
        </div>

        {/* Order detail card */}
        <div className="rounded-2xl border border-border bg-card p-5 text-left space-y-3">
          {[
            ["Status",           "Processing"],
            ["Estimated Delivery","3 – 5 business days"],
            ["Payment",          "Confirmed"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
          <Link href="/recommendations"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Recommendations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Questions? Email us at{" "}
          <a href="mailto:hello@nexmart.com"
            className="underline underline-offset-2 hover:text-foreground transition-colors">
            hello@nexmart.com
          </a>
        </p>
      </div>
    </div>
  );
}
