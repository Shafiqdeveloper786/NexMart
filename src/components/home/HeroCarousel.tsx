"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cpu, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SLIDES = [
  {
    tag: "NEW ARRIVALS",
    title: "Next-Gen\nElectronics",
    subtitle: "High-fidelity audio, neural gear & smartwatches for the modern era.",
    cta: "Shop Electronics",
    href: "/category/electronics",
    gradient: "from-[#030712] via-[#0a0f1e] to-[#030712]",
    accent: "#00f5ff",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    icon: <Cpu className="h-3 w-3" />,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format",
  },
  {
    tag: "TRENDING",
    title: "Street\nStyle",
    subtitle: "Premium techwear, tactical bags and urban apparel.",
    cta: "Shop Fashion",
    href: "/category/fashion",
    gradient: "from-[#030712] via-[#1a0a18] to-[#030712]",
    accent: "#ff2d78",
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/30",
    icon: <Zap className="h-3 w-3" />,
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80&auto=format",
  },
  {
    tag: "FEATURED",
    title: "New\nDrops",
    subtitle: "Fresh products across all categories — curated weekly.",
    cta: "Browse All",
    href: "/",
    gradient: "from-[#030712] via-[#120a1e] to-[#030712]",
    accent: "#8b5cf6",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    icon: <Sparkles className="h-3 w-3" />,
    img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80&auto=format",
  },
];

export function HeroCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
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

  const slide = SLIDES[selectedIndex];

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border transition-colors duration-500"
      style={{ borderColor: `${slide.accent}20` }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at 70% 50%, ${slide.accent}60 0%, transparent 70%)` }}
      />

      <div ref={emblaRef} className="w-full overflow-hidden">
        <div className="flex touch-pan-y">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              className={cn(
                "relative flex-[0_0_100%] min-w-0 flex items-center overflow-hidden",
                "h-[200px] sm:h-[260px] md:h-[300px]",
                `bg-gradient-to-r ${s.gradient}`
              )}
            >
              {/* Text side */}
              <div className="relative z-10 flex flex-col justify-center h-full w-[58%] pl-6 sm:pl-10 md:pl-14 py-6 space-y-3">
                {/* Badge */}
                <span className={cn(
                  "inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border",
                  s.badgeBg
                )}>
                  {s.icon}
                  {s.tag}
                </span>

                {/* Heading */}
                <AnimatePresence mode="wait">
                  {selectedIndex === i && (
                    <motion.h2
                      key={`title-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-[1.1] tracking-tight whitespace-pre-line"
                    >
                      {s.title.split('\n')[0]}
                      <br />
                      <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(90deg, ${s.accent}, #a78bfa)` }}
                      >
                        {s.title.split('\n')[1]}
                      </span>
                    </motion.h2>
                  )}
                </AnimatePresence>

                {/* Subtitle — hidden on mobile */}
                <p className="hidden sm:block text-xs md:text-sm text-slate-400 leading-relaxed max-w-[320px] line-clamp-2">
                  {s.subtitle}
                </p>

                {/* CTA */}
                <Link
                  href={s.href}
                  className="self-start inline-flex items-center gap-2 rounded-xl text-xs sm:text-sm font-bold px-4 py-2 sm:px-5 sm:py-2.5 text-slate-950 transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: s.accent, boxShadow: `0 0 16px ${s.accent}40` }}
                >
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Image side */}
              <div className="absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden">
                {/* fade overlay */}
                <div className="absolute inset-y-0 left-0 w-16 sm:w-28 z-10 bg-gradient-to-r from-[#030712] to-transparent" />
                <motion.img
                  key={`img-${i}`}
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={selectedIndex === i ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover object-center brightness-90"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-6 sm:left-10 md:left-14 flex gap-2 z-20">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="h-1 rounded-full transition-all duration-300 opacity-70 hover:opacity-100"
            style={{
              width: selectedIndex === i ? 28 : 8,
              backgroundColor: selectedIndex === i ? SLIDES[selectedIndex].accent : "#ffffff40",
            }}
          />
        ))}
      </div>
    </section>
  );
}
