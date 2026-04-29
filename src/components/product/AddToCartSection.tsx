"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";
import type { ProductSummary } from "@/lib/actions/product.actions";

export function AddToCartSection({ product }: { product: ProductSummary }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.images[0] ?? "",
    });
    setAdded(true);
    toast.success("Added to cart", {
      description: `${product.name} × ${qty}`,
      duration: 2500,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity picker */}
      {!outOfStock && (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-foreground mr-3">Qty</span>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="rounded-full border border-border p-1.5 text-foreground hover:bg-muted transition-colors disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-foreground tabular-nums">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={qty >= product.stock}
            className="rounded-full border border-border p-1.5 text-foreground hover:bg-muted transition-colors disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className={cn(
          "flex w-full items-center justify-center gap-2.5 rounded-2xl px-8 py-3.5",
          "text-sm font-semibold transition-all duration-300 active:scale-[0.98]",
          outOfStock
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : added
            ? "bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900"
            : "bg-foreground text-background hover:opacity-85 shadow-md"
        )}
      >
        {added ? (
          <><Check className="h-4 w-4" /> Added to Cart</>
        ) : outOfStock ? (
          "Out of Stock"
        ) : (
          <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
        )}
      </button>
    </div>
  );
}
