"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="rounded-2xl bg-muted/60 p-8 mb-6">
          <ShoppingBag className="h-14 w-14 text-muted-foreground mx-auto" />
        </div>
        <h1 className="text-2xl font-black text-foreground tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-xs">
          Looks like you haven&apos;t added anything yet. Explore our products and find something you love.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Your Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-sm"
            >
              {/* Image */}
              <Link href={`/product/${item.productId}`} className="shrink-0">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/60">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.productId}`}>
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:underline underline-offset-2">
                    {item.name}
                  </p>
                </Link>
                <p className="text-sm font-bold text-foreground mt-1">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity + remove */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Quantity controls */}
                <div className="flex items-center gap-1 rounded-full border border-border bg-muted/40">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Decrease quantity"
                    className="rounded-full p-1.5 text-foreground hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold tabular-nums text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                    className="rounded-full p-1.5 text-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Line total */}
                <span className="text-sm font-bold text-foreground w-16 text-right tabular-nums">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.name}`}
                  className="rounded-full p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Continue shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-base font-bold text-foreground">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-base">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-2xl bg-foreground py-3.5 text-center text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md active:scale-[0.98]"
            >
              Proceed to Checkout
            </Link>

            <p className="text-center text-xs text-muted-foreground">
              Secure checkout · Free returns · SSL encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
