"use client";

export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse border border-white/5 bg-[#0d1117] rounded-2xl">
      {/* Image box */}
      <div className="aspect-square bg-slate-900 relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
      </div>
      
      {/* Content box */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 bg-slate-800 rounded-full" />
        <div className="h-4 w-5/6 bg-slate-800 rounded" />
        <div className="h-3 w-2/3 bg-slate-800 rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-16 bg-slate-800 rounded" />
          <div className="h-8 w-20 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
