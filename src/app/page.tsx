import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { getAllProducts, searchProducts } from "@/lib/actions/product.actions";
import { AddToCartButton } from "@/components/home/AddToCartButton";
import { ProductImage } from "@/components/home/ProductImage";
import { HeroCarousel } from "@/components/home/HeroCarousel";

/* ── Shared product card ── */
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
        </div>
        <div className="px-4 pt-3 pb-1 space-y-0.5">
          <p className="text-sm font-semibold text-foreground dark:text-white leading-snug line-clamp-1">{product.name}</p>
          <p className="text-xs text-muted-foreground dark:text-slate-400">{product.category}</p>
        </div>
      </Link>
      <div className="px-4 pb-4 pt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-foreground dark:text-white">${product.price.toFixed(2)}</span>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

/* ── Section heading with optional "View All" link ── */
function SectionHeader({
  title, subtitle, href, count, icon,
}: {
  title: string; subtitle: string; href?: string; count?: number; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-7">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground/8 dark:bg-white/10">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white tracking-tight text-balance">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground dark:text-slate-200 hover:bg-muted transition-colors shrink-0 ml-4"
        >
          {count !== undefined ? `View all ${count}` : "View all"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ── Empty state ── */
function EmptySection() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-muted/60 p-5 mb-3">
        <svg className="h-9 w-9 text-muted-foreground mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-foreground dark:text-white">No products yet</p>
      <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
        Run <code className="bg-muted px-1 py-0.5 rounded text-[11px]">npm run seed</code> to populate.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Page
══════════════════════════════════════════ */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const query = search?.trim() ?? "";

  /* ── Search results ── */
  if (query) {
    const results = await searchProducts(query);
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Search className="h-3.5 w-3.5" />
              <span>Search results for</span>
            </div>
            <h1 className="text-2xl font-black text-foreground dark:text-white tracking-tight">
              &ldquo;{query}&rdquo;
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {results.length > 0 && (
              <span className="text-sm text-muted-foreground dark:text-slate-400">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </span>
            )}
            <Link href="/"
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground dark:text-slate-200 hover:bg-muted transition-colors">
              Clear
            </Link>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl bg-muted/60 p-6 mb-4">
              <Search className="h-10 w-10 text-muted-foreground mx-auto" />
            </div>
            <p className="text-base font-semibold text-foreground dark:text-white">No products found</p>
            <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">Try a different search term.</p>
            <Link href="/"
              className="mt-5 inline-flex items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    );
  }

  /* ── Home: fetch all sections in parallel ── */
  const [electronics, fashion, allForFeatured] = await Promise.all([
    getAllProducts({ category: "Electronics", limit: 8 }),
    getAllProducts({ category: "Fashion", limit: 8 }),
    getAllProducts({ limit: 30 }),
  ]);

  /* Shuffle all products and pick up to 8 as featured */
  const featured = [...allForFeatured]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">

      {/* ── Hero Carousel ── */}
      <HeroCarousel />

      {/* ── Premium Electronics ── */}
      <section>
        <SectionHeader
          title="Premium Electronics"
          subtitle="High-end tech for the modern lifestyle"
          href="/category/electronics"
          count={electronics.length > 0 ? undefined : 0}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {electronics.length === 0
            ? <EmptySection />
            : electronics.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* ── Trending Fashion ── */}
      <section>
        <SectionHeader
          title="Trending Fashion"
          subtitle="Minimalist styles for every wardrobe"
          href="/category/fashion"
          count={fashion.length > 0 ? undefined : 0}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {fashion.length === 0
            ? <EmptySection />
            : fashion.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* ── Featured Products (replaces New Arrivals) ── */}
      <section>
        <SectionHeader
          title="Featured Products"
          subtitle="Hand-picked favourites across all categories"
          icon={<Sparkles className="h-4.5 w-4.5 text-foreground dark:text-white" />}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.length === 0
            ? <EmptySection />
            : featured.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

    </div>
  );
}
