"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils/cn";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
  className?: string;
}

export function AddToCartButton({ product, className }: Props) {
  const { status } = useSession();
  const router     = useRouter();
  const addItem    = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // ── Auth guard — guests must log in first ──────────────────────────
    if (status !== "authenticated") {
      toast.error("Please login to add items to your cart.", {
        description: "You need an account to shop on NexMart.",
        icon: <LogIn className="h-4 w-4" />,
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        },
        duration: 4000,
      });
      router.push("/login");
      return;
    }

    // ── Authenticated — add to cart ────────────────────────────────────
    addItem({
      productId: product.id,
      name:      product.name,
      price:     product.price,
      quantity:  1,
      image:     product.images[0] ?? "",
    });

    setAdded(true);
    toast.success("Added to cart", {
      description: product.name,
      duration: 2500,
    });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      aria-label={added ? "Added to cart" : `Add ${product.name} to cart`}
      className={cn(
        "rounded-full border p-1.5 transition-all duration-200",
        added
          ? "border-green-500 bg-green-500 text-white scale-110"
          : "border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground",
        className
      )}
    >
      {added
        ? <Check className="h-3.5 w-3.5" />
        : <ShoppingCart className="h-3.5 w-3.5" />
      }
    </button>
  );
}
