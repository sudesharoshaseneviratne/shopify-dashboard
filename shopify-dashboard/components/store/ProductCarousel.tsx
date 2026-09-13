"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoreProduct } from "@/lib/store/products";
import { ProductCard } from "@/components/store/ProductCard";

interface ProductCarouselProps {
  products: StoreProduct[];
  autoScrollSpeed?: number; // interval in ms
}

export function ProductCarousel({ products, autoScrollSpeed = 3500 }: ProductCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const isWrappingRef = useRef(false);
  const singleSetWidthRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  // Take top 8 products max to keep DOM lightweight (24 items when tripled)
  const slicedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 8);
  }, [products]);

  // Triple the list for a seamless circular infinite loop
  const displayProducts = useMemo(() => {
    if (slicedProducts.length === 0) return [];
    return [...slicedProducts, ...slicedProducts, ...slicedProducts];
  }, [slicedProducts]);

  // Viewport visibility detection using IntersectionObserver
  // Only auto-scroll when carousel is actually on-screen
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

  // Compute and cache single set width
  const updateMetrics = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    singleSetWidthRef.current = container.scrollWidth / 3;
  }, []);

  // Initialize position in the middle set
  useEffect(() => {
    if (displayProducts.length === 0) return;
    const container = scrollRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      if (container) {
        updateMetrics();
        if (singleSetWidthRef.current > 0) {
          container.scrollLeft = singleSetWidthRef.current;
        }
      }
    }, 150);

    window.addEventListener("resize", updateMetrics, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [displayProducts, updateMetrics]);

  // Throttled seamless circular boundary wrapping without synchronous forced reflows
  const handleScroll = useCallback(() => {
    if (isWrappingRef.current) return;
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const container = scrollRef.current;
      if (!container || isWrappingRef.current) return;

      const singleSetWidth = singleSetWidthRef.current;
      if (singleSetWidth <= 0) return;

      const scrollLeft = container.scrollLeft;

      // When scrolled past the second set, wrap back to the first/middle set
      if (scrollLeft >= singleSetWidth * 2) {
        isWrappingRef.current = true;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = scrollLeft - singleSetWidth;
        container.style.scrollBehavior = "smooth";
        setTimeout(() => {
          isWrappingRef.current = false;
        }, 60);
      } 
      // When scrolled before the middle set, wrap forward to the second set
      else if (scrollLeft <= 5) {
        isWrappingRef.current = true;
        container.style.scrollBehavior = "auto";
        container.scrollLeft = scrollLeft + singleSetWidth;
        container.style.scrollBehavior = "smooth";
        setTimeout(() => {
          isWrappingRef.current = false;
        }, 60);
      }
    });
  }, []);

  // Auto-scroll forward loop: ONLY when visible in viewport and not paused/hovered
  useEffect(() => {
    if (!isInViewport || isPaused || displayProducts.length === 0) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container || isWrappingRef.current) return;

      const cardWidth = 320 + 24; // card width + gap
      container.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }, autoScrollSpeed);

    return () => clearInterval(interval);
  }, [isInViewport, isPaused, autoScrollSpeed, displayProducts.length]);

  const scrollPrev = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 320 + 24;
    container.scrollBy({
      left: -cardWidth,
      behavior: "smooth",
    });
  };

  const scrollNext = () => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = 320 + 24;
    container.scrollBy({
      left: cardWidth,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div 
      ref={rootRef}
      className="relative group/carousel py-2 [contain:layout_style] [transform:translateZ(0)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left Navigation Arrow */}
      <button
        onClick={scrollPrev}
        className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-slate-100 border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center text-black transition cursor-pointer"
        title="Previous Product"
      >
        <ChevronLeft className="w-5 h-5 stroke-[3]" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={scrollNext}
        className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white hover:bg-slate-100 border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center text-black transition cursor-pointer"
        title="Next Product"
      >
        <ChevronRight className="w-5 h-5 stroke-[3]" />
      </button>

      {/* Seamless Infinite Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-stretch gap-6 overflow-x-auto scroll-smooth no-scrollbar px-1 py-4 [overscroll-behavior-x:contain] [transform:translateZ(0)]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {displayProducts.map((product, index) => (
          <div
            key={`${product.id}-set-${index}`}
            className="w-[280px] sm:w-[320px] shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
