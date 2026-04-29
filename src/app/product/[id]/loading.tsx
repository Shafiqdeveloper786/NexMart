function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className ?? ""}`} />;
}

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Back button */}
      <Skeleton className="h-5 w-36 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="space-y-3">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-12 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
