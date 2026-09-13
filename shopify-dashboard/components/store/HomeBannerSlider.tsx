"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageBannerSlide {
  id: string;
  href: string;
  alt: string;
  bgGradient: string;
  badgeTag: string;
  symbol: string;
  accentTitle: string;
}

export function HomeBannerSlider() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);

  const slides: ImageBannerSlide[] = [
    {
      id: "banner-1",
      href: "/products",
      alt: "Curated Educational Textbooks and Workbooks",
      bgGradient: "from-amber-400 via-amber-300 to-yellow-200",
      badgeTag: "PRASANTHI CRAFT ESSENTIALS // GRADE 1-12 BOOKS",
      symbol: "📚",
      accentTitle: "EDUCATIONAL BOOKS",
    },
    {
      id: "banner-2",
      href: "/products",
      alt: "Next-Gen Smart Tech and Wireless Peripherals",
      bgGradient: "from-amber-300 via-yellow-200 to-amber-100",
      badgeTag: "SMART GADGETS // LATEST RELEASES",
      symbol: "⚡",
      accentTitle: "TECH & ACCESSORIES",
    },
    {
      id: "banner-3",
      href: "/products",
      alt: "Fine Writing Stationery and Office Sets",
      bgGradient: "from-yellow-300 via-amber-200 to-yellow-100",
      badgeTag: "OFFICE ESSENTIALS // FINE STATIONERY",
      symbol: "✏️",
      accentTitle: "DESK & STATIONERY",
    },
    {
      id: "banner-4",
      href: "/products",
      alt: "Special Promotional Discounts Storewide",
      bgGradient: "from-amber-400 via-yellow-300 to-amber-200",
      badgeTag: "SEASONAL SAVINGS // UP TO 25% OFF",
      symbol: "🏷️",
      accentTitle: "STOREWIDE OFFERS",
    },
  ];

  // Viewport visibility detection
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto slide advance timer (only runs when in viewport)
  useEffect(() => {
    if (isPaused || !isInViewport) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, isInViewport, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <section 
      ref={rootRef}
      className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-2 sm:pt-4 [transform:translateZ(0)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Clean Full-Bleed Image Banner Slider (Height multiplied by 1.5) */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden h-[270px] sm:h-[360px] md:h-[420px] bg-slate-100 transition-all duration-300">
        
        {/* Clickable Image Banner Slide */}
        <Link href={current.href} className="block w-full h-full relative cursor-pointer group">
          {/* Vibrant Banner Visual Background */}
          <div 
            className={`w-full h-full bg-gradient-to-r ${current.bgGradient} transition-all duration-700 ease-in-out flex items-center justify-between px-8 sm:px-16 overflow-hidden relative`}
          >
            {/* Visual Grid Backdrop */}
            <div className="absolute inset-0 bg-grid-dense opacity-20 pointer-events-none" />

            {/* Left Visual Badge */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-black/10 backdrop-blur-md border border-black/20 flex items-center justify-center text-2xl sm:text-4xl shadow-xs group-hover:scale-110 transition-transform duration-300">
                {current.symbol}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-slate-800 uppercase">
                  {current.badgeTag}
                </span>
                <span className="font-heading font-black text-xl sm:text-3xl text-slate-950 tracking-tight">
                  {current.accentTitle}
                </span>
              </div>
            </div>

            {/* Right Large Illustration / Watermark */}
            <div className="text-7xl sm:text-9xl md:text-[140px] select-none pointer-events-none opacity-30 transform group-hover:scale-105 transition-transform duration-500">
              {current.symbol}
            </div>
          </div>
        </Link>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white border border-slate-300 text-slate-900 shadow-sm transition hover:scale-105 cursor-pointer"
          title="Previous Banner"
        >
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white border border-slate-300 text-slate-900 shadow-sm transition hover:scale-105 cursor-pointer"
          title="Next Banner"
        >
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        {/* Bottom Pagination Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx 
                  ? "w-6 sm:w-7 bg-slate-950" 
                  : "w-2 bg-slate-950/25 hover:bg-slate-950/50"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
