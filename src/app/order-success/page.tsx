import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | NexMart",
  description: "Your NexMart order has been placed successfully.",
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const orderId = id ?? `NX-${Math.floor(10000 + Math.random() * 90000)}`;

  const details = [
    { label: "Order ID",             value: orderId },
    { label: "Status",               value: "Confirmed ✓" },
    { label: "Estimated Delivery",   value: "3 – 5 business days" },
    { label: "Payment",              value: "Received" },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">

        {/* ── Animated check icon ── */}
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-950/40 animate-ping opacity-25" />
            <span className="absolute inset-3 rounded-full bg-green-100 dark:bg-green-950/50" />
            <CheckCircle className="relative h-14 w-14 text-green-500" strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Thank you for shopping with NexMart. Your order is being
              processed and will be dispatched soon.
            </p>
          </div>
        </div>

        {/* ── Order detail card ── */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-muted/40 border-b border-border">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Order Details</span>
          </div>

          {/* Detail rows */}
          <ul className="divide-y divide-border">
            {details.map(({ label, value }) => (
              <li key={label} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className={
                  label === "Order ID"
                    ? "font-black text-foreground tracking-wide"
                    : "font-semibold text-foreground"
                }>
                  {value}
                </span>
              </li>
            ))}
          </ul>

          {/* Confirmation note */}
          <div className="px-5 py-4 bg-green-50 dark:bg-green-950/20 border-t border-green-100 dark:border-green-900/40">
            <p className="text-xs text-green-700 dark:text-green-400 text-center leading-relaxed">
              A confirmation has been noted for order <strong>{orderId}</strong>.
              Our team will contact you shortly.
            </p>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md">
            <Home className="h-4 w-4" />
            Continue Shopping
          </Link>
          <Link href="/recommendations"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Recommendations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Support */}
        <p className="text-center text-xs text-muted-foreground">
          Questions about your order?{" "}
          <a href="mailto:hello@nexmart.com"
            className="underline underline-offset-2 hover:text-foreground transition-colors">
            hello@nexmart.com
          </a>
        </p>

      </div>
    </div>
  );
}
