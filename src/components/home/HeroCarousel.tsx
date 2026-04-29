"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    tag: "New Season",
    title: "Next-Gen\nElectronics",
    subtitle: "The latest gadgets, smartwatches & audio gear — crafted for the future.",
    cta: "Shop Electronics",
    href: "/category/electronics",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=700&q=85",
    imageAlt: "Electronics — headphones and smartwatch",
    gradient: "from-blue-50 to-slate-100 dark:from-[#0f1623] dark:to-[#111827]",
    dot: "bg-blue-500",
  },
  {
    tag: "Trending Now",
    title: "Fashion\nForward",
    subtitle: "Premium bags, accessories and apparel for the style-conscious modern professional.",
    cta: "Shop Fashion",
    href: "/category/fashion",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    imageAlt: "Fashion — premium leather bag",
    gradient: "from-amber-50 to-orange-50 dark:from-[#1a1208] dark:to-[#1a1208]",
    dot: "bg-amber-500",
  },
  {
    tag: "Just Landed",
    title: "New\nArrivals",
    subtitle: "Fresh drops across every category. Discover what's new in the NexMart store today.",
    cta: "Explore All",
    href: "/",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    imageAlt: "New Arrivals — premium smartwatch",
    gradient: "from-gray-100 to-gray-50 dark:from-[#111111] dark:to-[#111111]",
    dot: "bg-foreground",
  },
];

export function HeroCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4500, stopOnInteraction: true })]
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative w-full overflow-hidden rounded-2xl" aria-label="Featured promotions">
      <div ref={emblaRef} className="w-full overflow-hidden rounded-2xl">
        <div className="flex touch-pan-y will-change-transform">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={cn(
                /* Fixed height per breakpoint — prevents any vertical stretch */
                "relative flex-[0_0_100%] min-w-0 overflow-hidden",
                "h-[200px] sm:h-[220px] md:h-[260px]",
                /* Row layout always — text 60%, image 40% */
                "flex flex-row items-stretch",
                "bg-gradient-to-br",
                slide.gradient
              )}
            >
              {/* ── LEFT: Text — 60% wide, tighter padding on mobile ── */}
              <div className="relative z-10 flex flex-col justify-center w-[60%] sm:w-[54%] pl-4 pr-2 sm:pl-10 md:pl-12 sm:pr-4 py-5 sm:py-7 space-y-1.5 sm:space-y-3">
                {/* Tag */}
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">
                  {slide.tag}
                </p>

                {/* Heading — text-xl on mobile so it fits the 200px height */}
                <h2 className="text-xl sm:text-3xl md:text-5xl font-black text-foreground dark:text-white leading-[1.05] tracking-tight whitespace-pre-line">
                  {slide.title}
                </h2>

                {/* Subtitle — hidden on mobile, visible sm+ */}
                <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground dark:text-slate-300 leading-relaxed max-w-[260px]">
                  {slide.subtitle}
                </p>

                {/* CTA button — compact on mobile */}
                <Link
                  href={slide.href}
                  className={cn(
                    "self-start mt-0.5 sm:mt-1",
                    "inline-flex items-center rounded-full bg-foreground",
                    "px-3 py-1.5 sm:px-6 sm:py-2.5",
                    "text-[10px] sm:text-sm font-semibold text-background",
                    "transition-all duration-200 hover:opacity-85 active:scale-95 shadow-md"
                  )}
                >
                  {slide.cta}
                </Link>
              </div>

              {/* ── RIGHT: Image — 40% wide, fills box completely ── */}
              <div className="relative w-[40%] sm:w-[46%] overflow-hidden">
                {/* Dark-mode left-edge fade so image blends into background */}
                <div className="absolute inset-y-0 left-0 w-6 sm:w-16 z-10 hidden dark:block bg-gradient-to-r from-[#111] to-transparent" />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  /* Mobile: object-cover fills the box edge-to-edge, zero white space.
                     sm+:    object-contain + object-bottom lets the product "stand" at the base. */
                  className={cn(
                    "absolute inset-0 h-full w-full",
                    "object-cover object-center",         /* mobile default — no gaps */
                    "sm:object-contain sm:object-bottom", /* desktop — product sits at base */
                    "drop-shadow-lg sm:drop-shadow-2xl",
                    "dark:brightness-[0.82] dark:opacity-90"
                  )}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-300",
              selectedIndex === i
                ? `h-1.5 w-5 sm:w-7 opacity-80 ${slide.dot}`
                : "h-1.5 w-1.5 bg-foreground/20 hover:bg-foreground/40"
            )}
          />
        ))}
      </div>
    </section>
  );
}
