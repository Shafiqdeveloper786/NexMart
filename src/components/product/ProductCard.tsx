"use client";

import Link from "next/link";
import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useUIStore, useCartStore, useWishlistStore } from "@/lib/store";
import { toast } from "sonner";
import { ProductSummary } from "@/lib/actions/product.actions";

export function ProductCard({ product }: { product: ProductSummary }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const setQuickViewProductId = useUIStore((s) => s.setQuickViewProductId);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, hasItem } = useWishlistStore();

  // Hydration check to prevent SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isWishlisted = isHydrated ? hasItem(product.id) : false;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] ?? "",
      category: product.category,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(isWishlisted ? "Removed from memory bank" : "Saved to memory bank");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProductId(product.id);
  };

  const [imgSrc, setImgSrc] = useState(product.images[0] ?? "");

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 border border-border bg-card shadow-sm hover:shadow-md flex flex-col h-full rounded-2xl"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-square bg-muted/40 overflow-hidden w-full">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80&auto=format")}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground font-mono text-xs">
            NO IMAGE
          </div>
        )}

        {/* Glossmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="font-mono text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded shadow-sm">
              -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="font-mono text-[9px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Hover Quick Action Buttons */}
        <div className={`absolute inset-x-3 bottom-3 flex gap-1.5 transition-all duration-300 z-20 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}>
          <button
            onClick={handleQuickView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold uppercase bg-background border border-border text-foreground hover:bg-muted transition-all shadow-sm"
          >
            <Eye size={12} />
            <span>Quick View</span>
          </button>
          
          {isHydrated && (
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-xl border transition-all shadow-sm ${
                isWishlisted
                  ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-800/30 dark:text-rose-400"
                  : "bg-background border-border text-muted-foreground hover:text-rose-500 hover:border-rose-300"
              }`}
            >
              <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          )}
        </div>
      </div>

      {/* Card Info Content */}
      <Link href={`/product/${product.id}`} className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1 font-semibold">
            {product.category}
          </p>
          
          {/* Name */}
          <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={`${
                    star <= Math.round(product.rating ?? 0) 
                      ? "text-amber-400 fill-amber-400" 
                      : "text-muted-foreground/20 fill-transparent"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold">({product.reviewCount ?? 0})</span>
          </div>
        </div>

        {/* Pricing / CTA row */}
        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-border">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-muted-foreground line-through font-mono leading-none mb-0.5">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-bold text-foreground font-mono leading-none">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-xl bg-foreground text-background hover:opacity-85 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <ShoppingCart size={13} />
            </button>
          ) : (
            <span className="text-[9px] font-mono text-muted-foreground uppercase px-2 py-1 rounded bg-muted border border-border">
              OUT
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
