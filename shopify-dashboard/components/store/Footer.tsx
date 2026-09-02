"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  ArrowUpRight
} from "lucide-react";

// --- 1. Footer Link Interfaces & Curated Store Data ---
export interface FooterColumn {
  heading: string;
  headingHref?: string;
  links: { label: string; href: string; external?: boolean }[];
}

export const DEFAULT_STORE_COLUMNS: FooterColumn[] = [
  {
    heading: "Hardware Enclaves",
    headingHref: "/store/products",
    links: [
      { label: "ColdKey Prime MK-IV", href: "/store/products/coldkey-prime-mk4" },
      { label: "Orion Hydro-ASIC 140", href: "/store/products/orion-hydro-miner-140" },
      { label: "Sovereign ZK-Node X1", href: "/store/products/sovereign-node-x1" },
      { label: "CipherSteel 24 Seed Plate", href: "/store/products/ciphersteel-seed-plate" },
      { label: "Nostr Lightning POS", href: "/store/products/nostr-pos-terminal" },
      { label: "Genesis Gold 21K Ingot", href: "/store/products/genesis-block-gold-ingot" },
    ],
  },
  {
    heading: "Protocol Security",
    links: [
      { label: "BIP-174 Air-Gapped PSBT", href: "/store/products" },
      { label: "CC EAL6+ Certified Enclave", href: "/store/products" },
      { label: "Stratum V2 Hydro Protocol", href: "/store/products" },
      { label: "Reproducible Gitian Builds", href: "/store/products" },
      { label: "Tor v3 & I2P Onion Routing", href: "/store/products" },
    ],
  },
  {
    heading: "Settlement & Support",
    links: [
      { label: "Lightning Network (LNURL)", href: "/store/checkout" },
      { label: "Native SegWit & Taproot", href: "/store/checkout" },
      { label: "Air-Gapped Insured Courier", href: "/store#faq" },
      { label: "2-Year Hardware Warranty", href: "/store#faq" },
      { label: "PGP Key Verification", href: "/store#faq" },
    ],
  },
  {
    heading: "Network Proof",
    links: [
      { label: "Mempool Space Live", href: "https://mempool.space", external: true },
      { label: "Bitcoin Core v28.0", href: "https://bitcoincore.org", external: true },
      { label: "LNbits Lightning Suite", href: "https://lnbits.com", external: true },
      { label: "Admin Operations Console", href: "/admin" },
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
  brandName = "SATOSHI DEFI",
  tagline = "Engineered for financial sovereignty. Mathematical-grade cold keys, residential liquid ASICs, and zero-knowledge Bitcoin nodes with no telemetry backdoors.",
  columns = DEFAULT_STORE_COLUMNS,
  largeText = "SATOSHI",
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
              stroke="#EAB308"
              strokeWidth="0.75"
              fill="none"
              className="font-heading font-black text-[96px] tracking-tight uppercase"
            >
              {largeText}
            </text>
          </svg>
        </div>

        {/* Foreground Content inside the Footer Card */}
        <div className="relative z-10 flex flex-col gap-10 px-8 sm:px-12 py-12 md:flex-row md:items-start md:justify-between md:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start md:min-w-[240px] md:max-w-[280px]">
            <Link href="/store" className="mb-4 flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-[#FFB800] to-yellow-400 p-0.5 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-black text-xl text-[#FFD600]">
                    ₿
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

            {/* Trust Enclave Badges */}
            <div className="flex flex-wrap gap-2 text-[11px] font-mono mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-800 font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>BIP-174 Air-Gapped</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-800 font-semibold shadow-xs">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>EAL6+ Verified</span>
              </div>
            </div>

            {/* Social / Decentralized Comms Icons */}
            <div className="flex gap-3">
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="p-2.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 transition shadow-xs cursor-pointer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 transition shadow-xs cursor-pointer"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .29a12 12 0 00-3.797 23.401c.6.11.82-.26.82-.577v-2.17c-3.338.726-4.042-1.415-4.042-1.415-.546-1.387-1.332-1.756-1.332-1.756-1.09-.744.084-.729.084-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.306 3.495.999.106-.775.418-1.307.76-1.608-2.665-.301-5.466-1.332-5.466-5.933 0-1.31.469-2.381 1.236-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.007-.322 3.301 1.23a11.502 11.502 0 016.002 0c2.292-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.119 3.176.77.841 1.235 1.912 1.235 3.222 0 4.61-2.805 5.629-5.476 5.925.429.369.813 1.096.813 2.211v3.285c0 .32.217.694.825.576A12 12 0 0012 .29" />
                </svg>
              </a>
              {/* Lightning / Nostr Zap */}
              <a
                href="/store/products"
                aria-label="Lightning Network"
                className="p-2.5 rounded-xl bg-white hover:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 transition shadow-xs cursor-pointer"
              >
                <Zap className="h-4 w-4 text-amber-600" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {columns && (
            <nav className="flex w-full flex-wrap gap-x-8 gap-y-10 text-center md:w-auto md:flex-nowrap md:justify-end md:text-left md:gap-x-12">
              {columns.map((col, idx) => (
                <div key={idx} className="min-w-[140px]">
                  {col.headingHref ? (
                    <Link
                      href={col.headingHref}
                      className="mb-4 block text-[0.75rem] font-mono font-bold tracking-[0.14em] text-amber-800 uppercase hover:text-slate-950 transition-colors duration-150"
                    >
                      {col.heading}
                    </Link>
                  ) : (
                    <span className="mb-4 block text-[0.75rem] font-mono font-bold tracking-[0.14em] text-amber-800 uppercase">
                      {col.heading}
                    </span>
                  )}
                  <ul className="space-y-2.5">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[0.82rem] leading-snug text-slate-600 hover:text-slate-950 font-medium transition-colors inline-flex items-center gap-1"
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
          &copy; {new Date().getFullYear()} {brandName} LABS. All rights reserved.
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
