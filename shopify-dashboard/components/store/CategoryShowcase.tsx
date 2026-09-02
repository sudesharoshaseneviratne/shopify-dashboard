import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StoreCollection } from "@/lib/store/products";

interface CategoryShowcaseProps {
  collections?: StoreCollection[];
  onSelectCategory?: (category: string) => void;
}

const DEFAULT_COLORS = ["#FFB800", "#EAB308", "#D97706", "#CA8A04", "#F59E0B", "#10B981", "#3B82F6"];

export function CategoryShowcase({ collections, onSelectCategory }: CategoryShowcaseProps) {
  const displayCategories = (collections && collections.length > 0)
    ? collections.map((col, idx) => ({
        name: col.title,
        color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
        href: `/store/products?category=${encodeURIComponent(col.title)}`,
        count: col.productCount ?? 0,
      }))
    : [
        { name: "Cold Storage", color: "#FFB800", href: "/store/products?category=Cold%20Storage", count: 2 },
        { name: "Mining & ASICs", color: "#EAB308", href: "/store/products?category=Mining%20%26%20ASICs", count: 1 },
        { name: "Sovereign Nodes", color: "#D97706", href: "/store/products?category=Sovereign%20Nodes", count: 2 },
        { name: "Security & Backup", color: "#CA8A04", href: "/store/products?category=Security%20%26%20Backup", count: 2 },
        { name: "Cryptographic Relics", color: "#F59E0B", href: "/store/products?category=Cryptographic%20Relics", count: 1 },
      ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-black/10 pb-4">
        <div>
          <div className="text-xs font-mono text-amber-800 font-bold tracking-wider uppercase">
            EXPLORE HARDWARE SUITES
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
            Shop By <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Category</span>
          </h2>
        </div>
        <Link 
          href="/store/products"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-slate-950 border-2 border-black font-heading font-bold text-xs shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#FFB800] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
        >
          <span>View All Hardware</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {displayCategories.map((cat, idx) => {
          const count = cat.count;

          return (
            <Link
              key={idx}
              href={cat.href}
              className="group cursor-pointer p-5 sm:p-6 rounded-2xl bg-white border-2 border-black transition-all duration-200 shadow-none hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-black relative overflow-hidden flex flex-col justify-between aspect-square"
            >
              {/* Ambient Background Glow */}
              <div 
                className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-15 group-hover:opacity-30 blur-xl transition duration-300"
                style={{ backgroundColor: cat.color }}
              />

              {/* Top Row: Product Count Pill (No Inside Shadow Effect) */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-slate-800 bg-slate-100 border border-slate-200 font-bold shadow-none">
                  {count} {count === 1 ? "Product" : "Products"}
                </span>
              </div>

              {/* Bottom Action Row: Category Name with Arrow */}
              <div className="relative z-10 mt-6 pt-3 border-t border-slate-100 flex items-center justify-between font-heading font-bold text-base text-slate-950 group-hover:text-amber-600 transition">
                <span>{cat.name}</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
