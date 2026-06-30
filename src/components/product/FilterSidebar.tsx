"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Star, SlidersHorizontal, RotateCcw, Check } from "lucide-react";

interface FilterSidebarProps {
  currentCategory: string;
}

export function FilterSidebar({ currentCategory }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for price inputs to prevent lagging
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const activeSort = searchParams.get("sort") ?? "newest";
  const activeRating = searchParams.get("rating") ?? "";
  const activeInStock = searchParams.get("inStock") === "true";

  // Helper to update search parameters
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
    });
  };

  const handleRatingSelect = (rating: string) => {
    updateQuery({
      rating: activeRating === rating ? null : rating, // toggle
    });
  };

  const handleInStockToggle = () => {
    updateQuery({
      inStock: activeInStock ? null : "true",
    });
  };

  const handleSortChange = (sort: string) => {
    updateQuery({ sort });
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-cyan-400" />
          <h2 className="font-bold text-sm tracking-widest font-mono text-white uppercase">System Filters</h2>
        </div>
        {(searchParams.toString() || minPrice || maxPrice) && (
          <button
            onClick={handleReset}
            disabled={isPending}
            className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Sorting */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase">Sort Order</h3>
        <div className="flex flex-col gap-1.5">
          {[
            { value: "newest", label: "Newest Upgrades" },
            { value: "bestseller", label: "Best Sellers" },
            { value: "price_asc", label: "Price: Low to High" },
            { value: "price_desc", label: "Price: High to Low" },
            { value: "rating", label: "Top Rated" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium font-mono text-left transition-all ${
                activeSort === option.value
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
                  : "bg-slate-900/40 border border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <span>{option.label}</span>
              {activeSort === option.value && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase">Credit Range</h3>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono focus:border-cyan-400 outline-none text-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono focus:border-cyan-400 outline-none text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 bg-slate-900 border border-white/10 hover:border-cyan-400/40 hover:bg-slate-850 text-white hover:text-cyan-400 font-mono text-xs font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {isPending ? "COMPUTING..." : "APPLY FILTER"}
          </button>
        </form>
      </div>

      {/* Star Rating */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase">Module Quality</h3>
        <div className="flex flex-col gap-1.5">
          {["4", "3", "2"].map((ratingVal) => {
            const isSelected = activeRating === ratingVal;
            return (
              <button
                key={ratingVal}
                onClick={() => handleRatingSelect(ratingVal)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-left transition-all ${
                  isSelected
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-400/20"
                    : "bg-slate-900/40 border border-transparent text-slate-400 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={11}
                        className={`${
                          s <= Number(ratingVal) ? "text-amber-400 fill-amber-400" : "text-slate-800"
                        }`}
                      />
                    ))}
                  </div>
                  <span>& Up</span>
                </div>
                {isSelected && <Check className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock availability */}
      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer group text-xs font-mono text-slate-400 hover:text-white">
          <input
            type="checkbox"
            checked={activeInStock}
            onChange={handleInStockToggle}
            className="sr-only"
          />
          <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
            activeInStock 
              ? "bg-cyan-400 border-cyan-400 text-slate-950" 
              : "border-white/10 group-hover:border-white/20 bg-slate-950"
          }`}>
            {activeInStock && <Check size={12} className="stroke-[3]" />}
          </div>
          <span>IN STOCK MODULES ONLY</span>
        </label>
      </div>
    </aside>
  );
}
