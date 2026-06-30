import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/actions/product.actions";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { ArrowLeft, Layers } from "lucide-react";

const KNOWN_CATEGORIES: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  accessories: "Accessories",
  grooming: "Grooming",
  office: "Office",
  kitchen: "Kitchen",
  fitness: "Fitness",
  "home-decor": "Home Decor",
  home: "Home Decor",
  sports: "Fitness",
  beauty: "Grooming",
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const label = KNOWN_CATEGORIES[slug.toLowerCase()] ?? slug;
  return {
    title: `${label} | NexMart`,
    description: `Shop ${label} products on NexMart — quality items at great prices.`,
  };
}

function EmptyCategory({ category }: { category: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-border bg-muted/30 p-8">
      <div className="rounded-full bg-muted p-5 mb-4 text-muted-foreground">
        <Layers className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-foreground">No Products Available</h3>
      <p className="text-sm text-muted-foreground max-w-sm mt-2">
        There are currently no products in the {category} category.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}) {
  const { slug } = await params;
  const label = KNOWN_CATEGORIES[slug.toLowerCase()];

  if (!label) notFound();

  const resolvedSearchParams = await searchParams;

  const products = await getAllProducts({
    category: label,
    sort: resolvedSearchParams.sort,
  });

  const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "bestseller", label: "Best Sellers" },
  ];

  const activeSort = resolvedSearchParams.sort ?? "newest";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Breadcrumb + Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">{label}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {label}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Sort dropdown — right side */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground whitespace-nowrap font-medium">Sort by:</label>
            <SortSelect value={activeSort} options={SORT_OPTIONS} />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.length === 0 ? (
          <EmptyCategory category={label} />
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
