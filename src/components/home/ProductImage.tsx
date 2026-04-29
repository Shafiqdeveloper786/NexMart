"use client";

const FALLBACK =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src || FALLBACK}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== FALLBACK) img.src = FALLBACK;
      }}
    />
  );
}
