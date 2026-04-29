import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Package, Tag } from "lucide-react";
import { getProductById, getAllProducts } from "@/lib/actions/product.actions";
import { AddToCartSection } from "@/components/product/AddToCartSection";

/*
  generateMetadata runs on the server before the page renders.
  Google receives a unique <title> and <description> per product —
  this is the primary SEO benefit of Server Components for product pages.
*/
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found | NexMart" };

  return {
    title: `${product.name} | NexMart`,
    description: product.description ?? `Buy ${product.name} for $${product.price.toFixed(2)} on NexMart.`,
    openGraph: {
      title: product.name,
      description: product.description ?? "",
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

/*
  generateStaticParams pre-renders product pages at build time
  (static site generation for known products — great for Core Web Vitals).
  Unknown IDs fall back to on-demand rendering.
*/
export async function generateStaticParams() {
  const products = await getAllProducts({ limit: 100 });
  return products.map((p) => ({ id: p.id }));
}

/* ── Image gallery (server) ── */
function ProductImages({ images, name }: { images: string[]; name: string }) {
  const primary = images[0];
  const rest = images.slice(1, 5);

  if (!primary) {
    return (
      <div className="aspect-square rounded-3xl bg-muted flex items-center justify-center text-muted-foreground/30">
        <Package className="h-20 w-20" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-800/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={name}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      {/* Thumbnails */}
      {rest.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {rest.map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${name} view ${i + 2}`}
                className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Stock indicator ── */
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500"><span className="h-2 w-2 rounded-full bg-red-500" />Out of stock</span>;
  if (stock < 10)
    return <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500"><span className="h-2 w-2 rounded-full bg-amber-500" />Only {stock} left</span>;
  return <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600"><span className="h-2 w-2 rounded-full bg-green-500" />In stock</span>;
}

/* ── Page ── */
export default async function ProductPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.category.toLowerCase()}`}
          className="hover:text-foreground transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Back button */}
      <Link href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to products
      </Link>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* ── Left: Images ── */}
        <ProductImages images={product.images} name={product.name} />

        {/* ── Right: Details ── */}
        <div className="space-y-6">

          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            {product.category}
          </div>

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Stock */}
          <StockBadge stock={product.stock} />

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">About this product</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Add to cart — Client Component island */}
          <AddToCartSection product={product} />

          {/* Meta */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Category</span>
              <span className="font-medium text-foreground capitalize">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Stock</span>
              <span className="font-medium text-foreground">{product.stock} units</span>
            </div>
            <div className="flex justify-between">
              <span>Product ID</span>
              <span className="font-mono text-[10px]">{product.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
