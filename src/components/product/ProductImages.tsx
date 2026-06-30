"use client";

import { Package } from "lucide-react";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export function ProductImages({ images, name }: ProductImagesProps) {
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
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80&auto=format";
          }}
        />
      </div>
      {/* Thumbnails */}
      {rest.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {rest.map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img} 
                alt={`${name} view ${i + 2}`}
                className="w-full h-full object-cover" 
                loading="lazy" 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80&auto=format";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}