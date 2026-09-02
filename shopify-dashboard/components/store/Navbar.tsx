"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  Zap, 
  Menu, 
  X, 
  Heart, 
  PhoneCall,
  Shield,
  Cpu,
  Server,
  Lock,
  Layers,
  ArrowRight,
  ChevronRight,
  User,
  LayoutDashboard,
  Package
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { LIVE_NETWORK_METRICS, STORE_PRODUCTS, type StoreCollection } from "@/lib/store/products";

const ICON_MAP: Record<string, any> = {
  Shield,
  Cpu,
  Server,
  Lock,
  Sparkles,
  Layers,
  Package,
};

function getIconForCollection(iconName?: string) {
  if (iconName && ICON_MAP[iconName]) return ICON_MAP[iconName];
  return Shield;
}

export interface StoreNavbarProps {
  settings?: {
    storeName?: string | null;
    supportPhone?: string | null;
    supportEmail?: string | null;
    marqueeAnnouncement?: string | null;
  } | null;
  collections?: StoreCollection[];
}

export function StoreNavbar({ settings, collections }: StoreNavbarProps = {}) {
  const router = useRouter();
  const { totalItemsCount, setIsCartOpen, wishlist } = useCart();
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const hotline = settings?.supportPhone || "+9475 245 5812";
  const marqueeText = settings?.marqueeAnnouncement || "USE VOUCHER CODE SATOSHI21 FOR 21% OFF";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Lock body scroll when category drawer is open
  useEffect(() => {
    if (categoryDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [categoryDrawerOpen]);

  // Close category drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && categoryDrawerOpen) {
        setCategoryDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [categoryDrawerOpen]);

  const navLinks = [
    { label: "HOME", href: "/store" },
    { label: "CATEGORIES", href: "/store#categories" },
    { label: "PRODUCTS", href: "/store/products" },
    { label: "REVIEWS", href: "/store/reviews" },
    { label: "ABOUT", href: "/store#about" },
    { label: "CONTACT", href: "/store#faq" },
  ];

  const categories = useMemo(() => {
    if (collections && collections.length > 0) {
      return collections.map((col) => ({
        name: col.title,
        href: `/store/products?category=${encodeURIComponent(col.title)}`,
        icon: getIconForCollection(col.icon),
        tagline: col.description || "Sovereign hardware protocol suite",
        color: "#FFB800",
        count: col.productCount ?? 0,
      }));
    }

    return [
      {
        name: "Cold Storage",
        href: "/store/products?category=Cold%20Storage",
        icon: Shield,
        tagline: "Air-gapped hardware vaults & signers",
        color: "#FFB800",
        count: 2,
      },
      {
        name: "Mining & ASICs",
        href: "/store/products?category=Mining%20%26%20ASICs",
        icon: Cpu,
        tagline: "Ultra-silent liquid cooled home ASICs",
        color: "#EAB308",
        count: 1,
      },
      {
        name: "Sovereign Nodes",
        href: "/store/products?category=Sovereign%20Nodes",
        icon: Server,
        tagline: "Dedicated Bitcoin Core & Lightning nodes",
        color: "#D97706",
        count: 2,
      },
      {
        name: "Security & Backup",
        href: "/store/products?category=Security%20%26%20Backup",
        icon: Lock,
        tagline: "Indestructible 316L stainless steel plates",
        color: "#CA8A04",
        count: 2,
      },
      {
        name: "Cryptographic Relics",
        href: "/store/products?category=Cryptographic%20Relics",
        icon: Sparkles,
        tagline: "Physical 24K gold timelocked sats proof bars",
        color: "#F59E0B",
        count: 1,
      },
    ];
  }, [collections]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/store/products");
    }
  };

  return (
    <>
      {/* 1. Top E-Commerce Announcement Marquee Ribbon (At the top of the document) */}
      <div className="w-full bg-slate-950 border-b border-slate-800 py-1.5 overflow-hidden relative text-white">
        {/* Left & Right gradient edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee items-center gap-10 text-[11px] font-mono text-slate-300">
          {[...Array(2)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB800] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFB800]"></span>
                </span>
                <span className="text-white font-semibold">MAINNET LIVE</span>
                <span className="text-slate-400">BLOCK #{LIVE_NETWORK_METRICS.blockHeight}</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-white">
                <Sparkles className="w-3 h-3 text-[#FFD600]" />
                <span>{marqueeText}</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5">
                <span className="text-white font-medium">FREE INSURED AIR-GAPPED SHIPPING OVER LKR 100,000</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-white">
                <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>BTC/USD: <strong className="text-[#FFD600]">${LIVE_NETWORK_METRICS.btcUsdPrice.toLocaleString()}</strong> ({LIVE_NETWORK_METRICS.priceChange24h})</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% REPRODUCIBLE OPEN-SOURCE FIRMWARE</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-white">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>LIMITED GENESIS 24K GOLD INGOT BATCH — ONLY 9 UNITS REMAINING</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3 h-3 text-[#FFD600]" />
                <span>SUB-SECOND LIGHTNING CHECKOUT (0% FEES)</span>
              </div>

              <span className="text-[#FFB800]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sticky Navigation Bar (Flush to top 0 with no gap) */}
      <header className="sticky top-0 z-50 w-full shadow-md select-none">

      {/* 2. Main Golden Header Row */}
      <div className="w-full bg-gradient-to-r from-[#FFB800] via-[#F59E0B] to-[#FFB800] text-slate-950 py-3 px-4 sm:px-6 lg:px-8 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Left: Hamburger (Opens Category Sidebar Drawer) + Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCategoryDrawerOpen(true)}
              className="p-2 rounded-xl bg-black/10 hover:bg-black/20 text-slate-950 transition cursor-pointer flex items-center gap-2"
              title="Open Categories Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/store" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-xl bg-slate-950 p-1 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="font-heading font-black text-2xl text-[#FFD600]">
                  ₿
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl tracking-tight text-slate-950 leading-none">
                  SATOSHI<span className="text-white">DEFI</span>
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-900 uppercase">
                  VAULT STORE
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Input Bar */}
          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-full pl-5 pr-14 py-2.5 text-xs sm:text-sm font-body outline-none shadow-sm focus:ring-2 focus:ring-slate-950 transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition flex items-center justify-center cursor-pointer shadow-xs"
                title="Search hardware"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Side: Support Hotline + Wishlist + Cart */}
          <div className="flex items-center gap-3.5 lg:gap-5 shrink-0">
            {/* Need Support Hotline */}
            <div className="hidden md:flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-950/10 border border-slate-950/20 flex items-center justify-center text-slate-950">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-bold text-slate-800 uppercase tracking-wider">
                  NEED SUPPORT
                </span>
                <span className="text-xs font-mono font-bold text-slate-950">
                  {hotline}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-7 w-[1px] bg-slate-950/20" />

            {/* Dedicated Wishlist Button */}
            <Link
              href="/store/products"
              className="relative p-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition-transform hover:scale-105 cursor-pointer shadow-md flex items-center justify-center"
              title="Saved Wishlist"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  wishlist.length > 0 ? "fill-rose-500 text-rose-500" : "text-white hover:text-rose-400"
                }`} 
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold border-2 border-[#FFB800] animate-in zoom-in-75">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Vault Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition-transform hover:scale-105 cursor-pointer shadow-md flex items-center justify-center"
              title="View Vault Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#FFD600]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold border-2 border-[#FFB800]">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile Icon Button & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className={`relative p-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition-transform hover:scale-105 cursor-pointer shadow-md flex items-center justify-center ${
                  isProfileOpen ? "ring-2 ring-slate-950 bg-slate-900" : ""
                }`}
                title="Customer Profile & Account"
                aria-label="User Profile"
              >
                <User className="w-5 h-5 text-white" />
              </button>

              {/* Profile Popover Card */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-950 text-white rounded-2xl border border-white/10 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFB800] to-amber-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-inner shrink-0">
                      LK
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>Learnix LK</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFB800]/20 text-[#FFD600] font-mono font-bold">
                          VIP
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        learnixlk@gmail.com
                      </div>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FFD600]" />
                      <span>Merchant Dashboard</span>
                    </Link>
                    <Link
                      href="/admin/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Order History</span>
                    </Link>
                    <Link
                      href="/store/products"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Saved Wishlist ({wishlist.length})</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <Link
                      href="/admin/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
                    >
                      <span>Store Settings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Visible on mobile screens) */}
        <div className="mt-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-full pl-4 pr-12 py-2 text-xs font-body outline-none shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1 p-1.5 rounded-full bg-slate-950 text-white flex items-center justify-center cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Bottom Black Navigation Row */}
      <div className="w-full bg-black text-white border-t border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-center">
          <nav className="flex items-center gap-10 lg:gap-14">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-heading font-bold uppercase tracking-wider text-slate-200 hover:text-[#FFD600] transition-colors duration-200 relative group py-1"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD600] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 4. Slide-Over Category Sidebar Drawer (Smooth animated popup from left) */}
      <div 
        className={`fixed inset-0 z-[60] flex transition-all duration-500 ease-out ${
          categoryDrawerOpen 
            ? "visible pointer-events-auto" 
            : "invisible pointer-events-none delay-500"
        }`}
        aria-hidden={!categoryDrawerOpen}
      >
        {/* Backdrop Overlay with smooth fade */}
        <div 
          onClick={() => setCategoryDrawerOpen(false)}
          className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ease-out ${
            categoryDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Left Slide-In Panel with smooth transform */}
        <div 
          className={`relative w-84 max-w-[85vw] bg-white h-full border-r-2 border-black shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            categoryDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          
          {/* Drawer Header */}
          <div className="p-5 border-b-2 border-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-amber-300 font-heading font-black text-lg">
                ₿
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-950">
                  Categories
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-800">
                  Sovereign Hardware Suites
                </span>
              </div>
            </div>

            <button
              onClick={() => setCategoryDrawerOpen(false)}
              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition cursor-pointer"
              title="Close Sidebar"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Categories List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-2">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400 px-3 py-1">
              Shop By Category
            </div>

            {categories.map((cat: any, idx: number) => {
              const Icon = cat.icon;
              const count = cat.count;

              return (
                <Link
                  key={idx}
                  href={cat.href}
                  onClick={() => setCategoryDrawerOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl border-2 border-black/10 hover:border-black hover:bg-amber-50/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-950 group-hover:text-amber-800 transition">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                        {cat.tagline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {count}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              );
            })}

            {/* View All Products Link */}
            <div className="pt-2">
              <Link
                href="/store/products"
                onClick={() => setCategoryDrawerOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-black text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_#FFB800] transition"
              >
                <span>Browse All Hardware</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Drawer Bottom Support Footer */}
          <div className="p-4 border-t-2 border-black/10 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>Support: <strong>{hotline}</strong></span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Lightning Network &amp; SegWit Fast Dispatch
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
