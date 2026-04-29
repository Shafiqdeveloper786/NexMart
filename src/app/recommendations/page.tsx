import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/actions/product.actions";
import { AddToCartButton } from "@/components/home/AddToCartButton";
import { ProductImage } from "@/components/home/ProductImage";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Recommendations | NexMart",
  description: "Curated picks trending right now on NexMart — hand-selected across every category.",
};

function ProductCard({ product }: {
  product: {
    id: string; name: string; price: number;
    category: string; images: string[]; stock: number;
  }
}) {
  return (
    <article className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-50 dark:bg-gray-800/60 overflow-hidden">
          <ProductImage src={product.images[0] ?? ""} alt={product.name} />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="rounded-full bg-background border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                Out of Stock
              </span>
            </div>
          )}
          {/* Trending badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground/90 px-2 py-0.5 text-[10px] font-semibold text-background backdrop-blur-sm">
              <Sparkles className="h-2.5 w-2.5" />
              Trending
            </span>
          </div>
        </div>
        <div className="px-4 pt-3 pb-1 space-y-0.5">
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.category}</p>
        </div>
      </Link>
      <div className="px-4 pb-4 pt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">${product.price.toFixed(2)}</span>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

/* Deterministic pseudo-shuffle — keeps SSR output stable while
   spreading picks across the catalogue (every 3rd product by index). */
function pickRecommended(
  all: Awaited<ReturnType<typeof getAllProducts>>,
  count: number
) {
  if (all.length <= count) return all;
  const step = Math.floor(all.length / count);
  const picks = [];
  for (let i = 0; i < count; i++) picks.push(all[(i * step) % all.length]);
  return picks;
}

export default async function RecommendationsPage() {
  const all = await getAllProducts(); // all products, newest first
  const recommended = pickRecommended(all, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* ── Header ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Recommendations</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-foreground" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Curated for you
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Recommended for You
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Hand-picked trending products across every category — refreshed daily to match what&apos;s popular right now.
            </p>
          </div>
          <span className="text-sm text-muted-foreground shrink-0">
            {recommended.length} picks
          </span>
        </div>

      </div>

      {/* ── Product grid ── */}
      {recommended.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-2xl bg-muted/60 p-6 mb-4">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto" />
          </div>
          <p className="text-base font-semibold text-foreground">No recommendations yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npm run seed</code> to populate the store.
          </p>
          <Link href="/"
            className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {recommended.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* ── Browse more CTA ── */}
      {recommended.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Browse all products
          </Link>
        </div>
      )}
    </div>
  );
}
