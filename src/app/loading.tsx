/* Root loading.tsx — shown by Next.js while page.tsx's async fetch runs */

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-muted ${className ?? ""}`} />
  );
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Image */}
      <Skeleton className="aspect-square rounded-none" />
      {/* Info */}
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Hero skeleton */}
      <Skeleton className="w-full min-h-[260px] sm:min-h-[300px] rounded-2xl" />

      {/* Products skeleton */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
