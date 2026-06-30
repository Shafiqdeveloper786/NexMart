"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Star, Shield, Info } from "lucide-react";
import Image from "next/image";
import { useUIStore, useCartStore, useWishlistStore } from "@/lib/store";
import { getProductById, ProductSummary } from "@/lib/actions/product.actions";
import { toast } from "sonner";

export function QuickViewModal() {
  const { quickViewProductId, setQuickViewProductId } = useUIStore();
  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, hasItem } = useWishlistStore();

  // Hydration check to prevent SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!quickViewProductId) {
      setProduct(null);
      return;
    }

    async function loadProduct() {
      setLoading(true);
      try {
        const data = await getProductById(quickViewProductId!);
        if (data) {
          setProduct(data);
          setSelectedImage(0);
          setQuantity(1);
        } else {
          toast.error("Product not found");
          setQuickViewProductId(null);
        }
      } catch (err) {
        toast.error("Error loading product");
        setQuickViewProductId(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [quickViewProductId, setQuickViewProductId]);

  const handleClose = () => setQuickViewProductId(null);

  if (!quickViewProductId) return null;

  const isWishlisted = isHydrated && product ? hasItem(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0] ?? "",
      category: product.category,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-border shadow-xl bg-card text-foreground z-10 rounded-3xl"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground z-20"
          >
            <X className="h-5 w-5" />
          </button>

          {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10 animate-pulse">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
                </div>
                <div className="flex gap-2.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 py-4">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-20 bg-muted rounded w-full" />
                <div className="h-10 bg-muted rounded w-1/2" />
              </div>
            </div>
          ) : product ? (
            /* Loaded State */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
              {/* Left Column: Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-muted/20">
                  <Image
                    src={product.images[selectedImage] ?? "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80&auto=format"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={(e) => {
                      // Fallback image in case of load failure
                      const img = e.currentTarget as HTMLImageElement;
                      img.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80&auto=format";
                    }}
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-4 left-4 bg-rose-500 text-white font-sans text-xs font-bold px-2.5 py-1 rounded-md tracking-wider">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% DISCOUNT
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImage === i ? "border-foreground scale-95" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-col justify-between py-2 space-y-6">
                <div>
                  {/* Category Tag */}
                  <span className="text-[10px] tracking-wider uppercase text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10 font-bold">
                    {product.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-4">
                    {product.name}
                  </h2>

                  {/* Rating / Review Count */}
                  <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(product.rating) 
                              ? "text-amber-400 fill-amber-400" 
                              : "text-muted-foreground/20 fill-transparent"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold">
                      {product.rating.toFixed(1)} ({product.reviewCount} rating{product.reviewCount !== 1 && "s"})
                    </span>
                  </div>

                  {/* Prices */}
                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mt-4 line-clamp-4">
                    {product.description ?? "No description available for this product."}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Stock indicator */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                    <span className={product.stock > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-450"}>
                      {product.stock > 0 ? `IN STOCK: ${product.stock} UNITS AVAILABLE` : "OUT OF STOCK"}
                    </span>
                  </div>

                  {/* Quantity & Actions */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-4">
                      {/* Quantity input */}
                      <div className="flex items-center border border-border bg-muted/40 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-3.5 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-mono font-bold"
                        >
                          -
                        </button>
                        <span className="px-4 font-mono font-bold text-sm w-10 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                          className="px-3.5 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-mono font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background hover:opacity-85 font-bold py-3 px-6 rounded-xl transition-all hover:scale-[1.01] active:scale-98 shadow-sm"
                      >
                        <ShoppingCart className="h-4.5 w-4.5" />
                        <span>Add To Cart</span>
                      </button>

                      {/* Wishlist toggle */}
                      <button
                        onClick={() => {
                          toggleWishlist(product.id);
                          toast(isWishlisted ? "Removed from memory bank" : "Added to memory bank");
                        }}
                        className={`p-3 rounded-xl border transition-all ${
                          isWishlisted
                            ? "bg-rose-50 border-rose-200 text-rose-500"
                            : "border-border hover:border-rose-400 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5"
                        }`}
                      >
                        <Heart className="h-5 w-5" fill={isWishlisted ? "currentColor" : "none"} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
