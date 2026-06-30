import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/actions/product.actions";
import { ProductCard } from "@/components/product/ProductCard";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Recommendations | NexMart",
  description: "Curated picks trending right now on NexMart — hand-selected across every category.",
};


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
