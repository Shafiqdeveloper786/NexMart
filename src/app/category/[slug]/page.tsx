import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/actions/product.actions";
import { AddToCartButton } from "@/components/home/AddToCartButton";
import { ProductImage } from "@/components/home/ProductImage";

const KNOWN_CATEGORIES: Record<string, string> = {
  electronics: "Electronics",
  fashion: "Fashion",
  accessories: "Accessories",
  grooming: "Grooming",
  office: "Office",
  kitchen: "Kitchen",
  fitness: "Fitness",
  "home-decor": "Home Decor",
  home: "Home Decor",   // legacy alias
  sports: "Fitness",    // legacy alias
  beauty: "Grooming",   // legacy alias
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
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="rounded-2xl bg-muted/60 p-6 mb-4">
        <svg className="h-10 w-10 text-muted-foreground mx-auto" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-foreground">No {category} products yet</p>
      <p className="text-sm text-muted-foreground mt-1">
        Run <code className="bg-muted px-1.5 py-0.5 rounded text-xs">npm run seed</code> to populate the database.
      </p>
      <Link href="/" className="mt-6 inline-flex items-center rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-opacity">
        Back to Home
      </Link>
    </div>
  );
}

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const label = KNOWN_CATEGORIES[slug.toLowerCase()];

  // For completely unknown slugs (not in our map), return 404
  if (!label) notFound();

  const products = await getAllProducts({ category: label });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{label}</span>
          </nav>
          <h1 className="text-3xl font-black text-foreground tracking-tight">{label}</h1>
        </div>
        {products.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
        {products.length === 0 ? (
          <EmptyCategory category={label} />
        ) : (
          products.map((product) => (
            <article
              key={product.id}
              className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
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
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
              </Link>
              <div className="px-4 pb-4 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">${product.price.toFixed(2)}</span>
                <AddToCartButton product={product} />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
