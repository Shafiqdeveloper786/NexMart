"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   Premium carousel banner slides
   High-quality product images with clean backgrounds
───────────────────────────────────────────────────────────── */
const BANNER_SLIDES = [
  {
    id:       "headphones",
    category: "ELECTRONICS",
    title:    "Immersive Sound.",
    subtitle: "Pure Comfort.",
    cta:      "Shop Now",
    href:     "/category/electronics",
    image:    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=90&auto=format&fit=max",
    imageAlt: "Premium Wireless Headphones",
  },
  {
    id:       "backpack",
    category: "FASHION",
    title:    "Carry in Style",
    subtitle: "",
    cta:      "Shop Now",
    href:     "/category/fashion",
    image:    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=90&auto=format&fit=max",
    imageAlt: "Minimalist Premium Backpack",
  },
];

/* ─────────────────────────────────────────────────────────────
   Framer Motion variants
───────────────────────────────────────────────────────────── */
const textVariants = {
  enter: {
    opacity: 0,
    x: -30,
  },
  center: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -30,
  },
};

const imageVariants = {
  enter: {
    opacity: 0,
    scale: 0.95,
  },
  center: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
  },
};

const textTransition = {
  duration: 0.5,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

const imageTransition = {
  duration: 0.6,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export function CarouselBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  /* Navigate to target slide */
  const goTo = useCallback((target: number) => {
    setCurrent(target);
  }, []);

  /* Auto-advance every 4.5 seconds */
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused]);

  const slide = BANNER_SLIDES[current];

  return (
    <section
      className="relative rounded-[2.5rem] bg-[#F3F3F3] dark:bg-white/[0.05] 
                 overflow-hidden transition-all duration-300"
      aria-label="Premium product showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Main banner container with premium spacing */}
      <div className="relative h-[280px] sm:h-[320px] lg:h-[380px] w-full">
        <AnimatePresence mode="wait">
          {/* Left side: Text & CTA */}
          <motion.div
            key={`text-${current}`}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={textTransition}
            className="absolute inset-0 flex flex-col justify-center 
                       px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 
                       w-full sm:w-1/2 z-20 pointer-events-none"
          >
            {/* Category label */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.35em] 
                          uppercase text-gray-500 dark:text-gray-400 mb-2">
              {slide.category}
            </p>

            {/* Title */}
            <div className="space-y-0">
              <h2 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] 
                            font-black text-gray-900 dark:text-white 
                            leading-tight tracking-tight">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <h2 className="text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem] 
                              font-black text-gray-900 dark:text-white 
                              leading-tight tracking-tight">
                  {slide.subtitle}
                </h2>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href={slide.href}
              className="mt-6 sm:mt-7 lg:mt-8 inline-flex items-center justify-center 
                        rounded-full bg-gray-900 dark:bg-white px-6 sm:px-7 py-2.5 sm:py-3
                        text-xs sm:text-sm font-semibold text-white dark:text-gray-900
                        hover:opacity-80 transition-opacity duration-200 pointer-events-auto 
                        w-fit h-fit"
            >
              {slide.cta}
            </Link>
          </motion.div>

          {/* Right side: Product image - floats naturally on grey background */}
          <motion.div
            key={`image-${current}`}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={imageTransition}
            className="absolute inset-0 hidden sm:flex items-center justify-end 
                       pr-6 sm:pr-8 lg:pr-12 py-8 sm:py-10 lg:py-12 
                       pointer-events-none overflow-visible"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="h-full w-auto object-contain object-center 
                        drop-shadow-none select-none"
              draggable={false}
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Pagination dots ── */}
      <div className="flex justify-center items-center gap-2 pb-5 sm:pb-6 lg:pb-7">
        {BANNER_SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            animate={{
              width: i === current ? 20 : 6,
              backgroundColor:
                i === current
                  ? "rgba(31, 41, 55, 0.6)"
                  : "rgba(31, 41, 55, 0.2)",
            }}
            whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.4)" }}
            transition={{ duration: 0.3 }}
            className="h-[6px] rounded-full outline-none cursor-pointer 
                       transition-all hover:opacity-80"
          />
        ))}
      </div>
    </section>
  );
}
