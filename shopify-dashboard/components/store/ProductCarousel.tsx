"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoreProduct } from "@/lib/store/products";
import { ProductCard } from "@/components/store/ProductCard";

interface ProductCarouselProps {
  products: StoreProduct[];
  autoScrollSpeed?: number; // interval in ms
}

export function ProductCarousel({ products, autoScrollSpeed = 3500 }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isWrappingRef = useRef(false);

  // Triple the list for a 100% seamless circular infinite loop
  const displayProducts = products && products.length > 0
    ? [...products, ...products, ...products]
    : [];

  // Initialize position in the middle set
  useEffect(() => {
    if (!products || products.length === 0) return;
    const container = scrollRef.current;
    if (!container) return;

    // Small delay to ensure children layout & width are computed
    const timer = setTimeout(() => {
      if (container) {
        const singleSetWidth = container.scrollWidth / 3;
        container.scrollLeft = singleSetWidth;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [products]);

  // Handle seamless circular boundary wrapping
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isWrappingRef.current) return;

    const singleSetWidth = container.scrollWidth / 3;
    if (singleSetWidth <= 0) return;

    // When scrolled past the second set, wrap back to the first/middle set instantly
    if (container.scrollLeft >= singleSetWidth * 2) {
      isWrappingRef.current = true;
      container.style.scrollBehavior = "auto";
      container.scrollLeft -= singleSetWidth;
      container.style.scrollBehavior = "smooth";
      setTimeout(() => {
        isWrappingRef.current = false;
      }, 50);
    } 
    // When scrolled before the middle set, wrap forward to the second set instantly
    else if (container.scrollLeft <= 5) {
      isWrappingRef.current = true;
      container.style.scrollBehavior = "auto";
      container.scrollLeft += singleSetWidth;
      container.style.scrollBehavior = "smooth";
      setTimeout(() => {
        isWrappingRef.current = false;
      }, 50);
    }
  }, []);

  // Auto-scroll forward loop
  useEffect(() => {
    if (isPaused) return;

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
  }, [isPaused, autoScrollSpeed]);

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
      className="relative group/carousel py-2"
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
        className="flex items-stretch gap-6 overflow-x-auto scroll-smooth no-scrollbar px-1 py-4"
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
