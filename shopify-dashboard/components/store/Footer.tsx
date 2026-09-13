"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Truck, 
  Phone, 
  ArrowUpRight,
  ShoppingBag
} from "lucide-react";

// --- 1. Footer Link Interfaces & Curated Store Data ---
export interface FooterColumn {
  heading: string;
  headingHref?: string;
  links: { label: string; href: string; external?: boolean }[];
}

export const DEFAULT_STORE_COLUMNS: FooterColumn[] = [
  {
    heading: "Curated Categories",
    headingHref: "/products",
    links: [
      { label: "Books & Workbooks", href: "/products?category=Books%20%26%20Workbooks" },
      { label: "Tech & Electronics", href: "/products?category=Tech%20%26%20Electronics" },
      { label: "Stationery & Office", href: "/products?category=Stationery%20%26%20Office" },
      { label: "School Essentials", href: "/products?category=School%20Essentials" },
      { label: "Promotional Offers", href: "/products" },
    ],
  },
  {
    heading: "Customer Support",
    links: [
      { label: "Islandwide Delivery Info", href: "/#faq" },
      { label: "Returns & Exchanges", href: "/#faq" },
      { label: "FAQ & Help Center", href: "/#faq" },
      { label: "Contact Our Team", href: "/#faq" },
      { label: "Terms of Service", href: "/#faq" },
    ],
  },
  {
    heading: "About Prasanthi Craft",
    links: [
      { label: "About Our Shop", href: "/#about" },
      { label: "Authentic Quality Pledge", href: "/#about" },
      { label: "Customer Reviews", href: "/reviews" },
      { label: "Privacy Policy", href: "/#faq" },
      { label: "Islandwide Coverage", href: "/#about" },
    ],
  },
  {
    heading: "Payment & Security",
    links: [
      { label: "Cash on Delivery (COD)", href: "/checkout" },
      { label: "Direct Bank Transfer", href: "/checkout" },
      { label: "Visa / Mastercard / Amex", href: "/checkout" },
      { label: "SSL 256-Bit Protection", href: "/checkout" },
      { label: "Guaranteed Authentic", href: "/#about" },
    ],
  },
];

export interface StoreFooterProps {
  brandName?: string;
  tagline?: string;
  columns?: FooterColumn[];
  largeText?: string;
}

// --- 2. Main Component Export in Clean Light Mode ---
export function StoreFooter({
  brandName = "PRASANTHI CRAFT",
  tagline = "Your premier destination for official educational books, smart tech essentials, and fine stationery delivered islandwide across Sri Lanka.",
  columns = DEFAULT_STORE_COLUMNS,
  largeText = "PRASANTHI",
}: StoreFooterProps) {
  return (
    <footer className="relative z-10 w-full overflow-hidden bg-black border-t border-white/10 pt-14 pb-8 font-body text-slate-900">
      
      {/* Frosted Glass Card Container with Cyber Corner Accents */}
      <div 
        className="relative mx-auto max-w-[1400px] rounded-[28px] border border-slate-200 corner-accent-tl corner-accent-br overflow-hidden shadow-xs"
        style={{
          backdropFilter: "blur(14px) saturate(180%)",
          WebkitBackdropFilter: "blur(14px) saturate(180%)",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.04), 0 0 35px -10px rgba(255, 184, 0, 0.15)",
        }}
      >
        {/* Subtle Hollow Golden Outlined Text Inside the Card Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-15 sm:opacity-20">
          <svg
            viewBox="0 0 480 100"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[1250px] h-auto scale-110 sm:scale-100"
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="none"
              stroke="#FFB800"
              strokeWidth="1.2"
              strokeLinejoin="round"
              strokeDasharray="4 2"
              className="font-heading font-black tracking-widest uppercase"
              style={{ fontSize: "70px", letterSpacing: "0.22em" }}
            >
              {largeText}
            </text>
          </svg>
        </div>

        {/* Dynamic Glass Gloss Highlight Overlay */}
        <div className="pointer-events-none absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-gradient-to-br from-amber-400/10 via-[#FFB800]/5 to-transparent blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-12 px-6 py-12 sm:px-12 md:flex-row lg:px-16">
          
          {/* Brand & Mission Statement Column */}
          <div className="flex flex-col items-center md:items-start md:min-w-[240px] md:max-w-[280px]">
            <Link href="/" className="mb-4 flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-[#FFB800] to-yellow-400 p-0.5 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-black text-xl text-[#FFD600]">
                    L
                  </span>
                </div>
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-slate-950">
                {brandName}
              </span>
            </Link>

            <p className="mb-6 text-center text-xs leading-relaxed text-slate-600 md:text-left font-medium">
              {tagline}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-800 font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-800 font-semibold shadow-xs">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Islandwide Delivery</span>
              </div>
            </div>

            {/* Support Hotline / Social Icons */}
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-white/80 border border-slate-200 px-3 py-2 rounded-xl">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Hotline: +9477 423 0976</span>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns && columns.length > 0 && (
            <nav
              aria-label="Footer Navigation"
              className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4 md:gap-10 lg:gap-14"
            >
              {columns.map((col, colIndex) => (
                <div key={col.heading || colIndex} className="flex flex-col space-y-3.5">
                  <div className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-slate-950">
                    {col.headingHref ? (
                      <Link href={col.headingHref} className="hover:text-amber-700 transition-colors">
                        {col.heading}
                      </Link>
                    ) : (
                      <span>{col.heading}</span>
                    )}
                  </div>
                  <ul className="space-y-2.5">
                    {col.links.map((link, linkIndex) => (
                      <li key={link.label || linkIndex}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[0.82rem] leading-snug text-slate-600 hover:text-slate-950 font-medium transition-colors duration-150"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="w-3 h-3 text-amber-600" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-[0.82rem] leading-snug text-slate-600 hover:text-slate-950 font-medium transition-colors duration-150"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Centered Bottom Copyright & Powered by SASLK Bar */}
      <div className="relative z-10 mt-8 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-1.5 text-xs font-mono text-slate-400 border-t border-white/10 pt-6 font-medium text-center">
        <div suppressHydrationWarning>
          &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span>Powered by</span>
          <a
            href="https://saslk.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#FFD600] hover:text-white font-bold underline decoration-amber-500/50 underline-offset-2 transition"
          >
            SASLK
          </a>
        </div>
      </div>
    </footer>
  );
}

export default StoreFooter;
