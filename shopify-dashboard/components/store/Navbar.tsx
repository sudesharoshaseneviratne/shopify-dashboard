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
  Package,
  LogOut
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { useCustomerAuth } from "@/lib/store/customerAuthContext";
import { LIVE_NETWORK_METRICS, STORE_PRODUCTS, type StoreCollection } from "@/lib/store/products";
import { isShowcaseCollection, SHOWCASE_SECTIONS } from "@/lib/store/collections";
import { searchStoreProductsAction, type SearchProductResult } from "@/app/actions/products";

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
  const { totalItemsCount, setIsCartOpen, wishlist, formatPrice } = useCart();
  const { customer, openAuthModal, logout } = useCustomerAuth();
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProductResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const hotline = settings?.supportPhone || "+9477 423 0976";
  const marqueeText = settings?.marqueeAnnouncement || "USE VOUCHER CODE WELCOME10 FOR 10% OFF";

  // Debounced live database search
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchStoreProductsAction(q);
        setSearchResults(results);
        setIsSearchOpen(true);
      } catch (err) {
        console.error("Live database search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close profile and search dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      const inDesktop = searchContainerRef.current?.contains(target);
      const inMobile = mobileSearchContainerRef.current?.contains(target);
      if (!inDesktop && !inMobile) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    { label: "HOME", href: "/" },
    { label: "CATEGORIES", href: "/#categories" },
    { label: "PRODUCTS", href: "/products" },
    { label: "REVIEWS", href: "/reviews" },
    { label: "ABOUT", href: "/#about" },
    { label: "CONTACT", href: "/#faq" },
  ];

  const categories = useMemo(() => {
    // Filter out the 4 homepage showcase collections so they are NOT in the category list
    const productCollections = (collections || []).filter((c) => !isShowcaseCollection(c));

    if (productCollections.length > 0) {
      return productCollections.map((col) => ({
        name: col.title,
        href: `/products?category=${encodeURIComponent(col.title)}`,
        icon: getIconForCollection(col.icon),
        tagline: col.description || "Curated learning & lifestyle products",
        color: "#FFB800",
        count: col.productCount ?? 0,
      }));
    }

    return [
      {
        name: "Cake Toppers",
        href: "/products?category=Cake%20Toppers",
        icon: Layers,
        tagline: "Custom & pre-cut celebration toppers",
        color: "#FFB800",
        count: 25,
      },
      {
        name: "Pipe cleaner products",
        href: "/products?category=Pipe%20cleaner%20products",
        icon: Package,
        tagline: "Chenille stems & DIY craft supplies",
        color: "#EAB308",
        count: 25,
      },
      {
        name: "Happy birthday",
        href: "/products?category=Happy%20birthday",
        icon: Sparkles,
        tagline: "Birthday die cuts & decorations",
        color: "#D97706",
        count: 25,
      },
      {
        name: "Valentine",
        href: "/products?category=Valentine",
        icon: Sparkles,
        tagline: "Romantic cutouts & party decor",
        color: "#CA8A04",
        count: 25,
      },
      {
        name: "Christmas",
        href: "/products?category=Christmas",
        icon: Layers,
        tagline: "Holiday season crafting shapes",
        color: "#F59E0B",
        count: 25,
      },
    ];
  }, [collections]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <>
      {/* 1. Global Announcement Marquee Bar */}
      <div className="w-full bg-slate-950 text-white overflow-hidden py-2 border-b border-amber-500/20 relative z-30 select-none">
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
                <span className="text-white font-semibold">STORE LIVE</span>
                <span className="text-slate-400">ISLANDWIDE DELIVERY</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-white">
                <Sparkles className="w-3 h-3 text-[#FFD600]" />
                <span>{marqueeText}</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5">
                <span className="text-white font-medium">FREE ISLANDWIDE SHIPPING ON ORDERS OVER LKR 5,000</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% AUTHENTIC QUALITY GUARANTEED</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-white">
                <Zap className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>FAST 24-48 HOUR COURIER DISPATCH ACROSS SRI LANKA</span>
              </div>

              <span className="text-[#FFB800]">✦</span>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>NEW TERM BOOKS &amp; STATIONERY NOW IN STOCK</span>
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

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-xl bg-slate-950 p-1 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="font-heading font-black text-2xl text-[#FFD600]">
                  P
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl tracking-tight text-slate-950 leading-none">
                  PRASANTHI<span className="text-white">CRAFT</span>
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-900 uppercase">
                  ONLINE STORE
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Input Bar with Live Database Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-auto hidden sm:block relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) {
                    setIsSearchOpen(true);
                  }
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search craft items, toppers, die cuts..."
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-full pl-5 pr-20 py-2.5 text-xs sm:text-sm font-body outline-none shadow-sm focus:ring-2 focus:ring-slate-950 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-12 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition flex items-center justify-center cursor-pointer shadow-xs"
                title="Search store"
              >
                {isSearching ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </form>

            {/* Desktop Live Search Instant Results Popover */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
                {/* Header bar */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-slate-600">
                      {isSearching ? "Searching database..." : `${searchResults.length} product${searchResults.length === 1 ? "" : "s"} found`}
                    </span>
                  </div>
                  {isSearching ? (
                    <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Press Enter for all</span>
                  )}
                </div>

                {/* Results List */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-6 text-center text-xs font-mono space-y-2">
                      <div className="text-slate-500 font-semibold">No products matching &quot;{searchQuery}&quot; found</div>
                      <p className="text-slate-400 text-[11px]">
                        Check your spelling or browse our full catalog.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        <span>Search Full Catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    searchResults.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/products/${prod.slug || prod.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="p-3 flex items-center gap-3 hover:bg-amber-50/60 transition group cursor-pointer"
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 text-amber-600 font-bold group-hover:scale-105 transition-transform">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-amber-600" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 truncate max-w-[130px]">
                              {prod.category}
                            </span>
                            {prod.inStock ? (
                              <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                In Stock
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-rose-600">Out of stock</span>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-xs sm:text-sm text-slate-950">
                            {formatPrice(prod.priceUsd)}
                          </div>
                          <span className="text-[10px] font-mono text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                            View →
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* Footer bar */}
                {searchResults.length > 0 && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 hover:brightness-105 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                    >
                      <span>View all results for &quot;{searchQuery}&quot; in catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
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
              href="/products"
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
              {!customer ? (
                <button
                  onClick={() => openAuthModal("login")}
                  className="relative p-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition-transform hover:scale-105 cursor-pointer shadow-md flex items-center justify-center group"
                  title="Sign In or Create Account"
                  aria-label="Customer Login"
                >
                  <User className="w-5 h-5 text-white group-hover:text-[#FFD600] transition-colors" />
                </button>
              ) : (
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className={`relative p-1 rounded-full bg-slate-950 hover:bg-slate-800 text-white transition-transform hover:scale-105 cursor-pointer shadow-md flex items-center justify-center ring-2 ${
                    isProfileOpen ? "ring-[#FFB800] bg-slate-900" : "ring-amber-500/50"
                  }`}
                  title={`Customer: ${customer.name} (${customer.email})`}
                  aria-label="Customer Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFB800] via-amber-300 to-yellow-200 text-slate-950 font-black flex items-center justify-center text-xs shadow-inner shrink-0">
                    {customer.name
                      ? customer.name
                          .split(" ")
                          .filter(Boolean)
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "CU"}
                  </div>
                </button>
              )}

              {/* Profile Popover Card (Logged In) */}
              {isProfileOpen && customer && (
                <div className="absolute right-0 mt-3 w-72 bg-slate-950 text-white rounded-2xl border border-amber-500/30 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FFB800] to-amber-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-inner shrink-0">
                      {customer.name
                        ? customer.name
                            .split(" ")
                            .filter(Boolean)
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "CU"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{customer.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFB800]/20 text-[#FFD600] font-mono font-bold shrink-0">
                          {customer.role === "admin" ? "ADMIN" : "MEMBER"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {customer.email}
                      </div>
                    </div>
                  </div>

                  {/* Customer Quick Stats */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-xl bg-white/5 border border-white/10 text-center">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Orders</span>
                      <span className="text-xs font-bold font-mono text-[#FFD600]">{customer.ordersCount}</span>
                    </div>
                    <div className="border-l border-white/10">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Spent</span>
                      <span className="text-xs font-bold font-mono text-white">LKR {customer.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="py-1 space-y-1">
                    <Link
                      href="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Package className="w-4 h-4 text-[#FFD600]" />
                      <span>Order History</span>
                    </Link>
                    <Link
                      href="/products"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>Saved Wishlist ({wishlist.length})</span>
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <button
                      onClick={async () => {
                        await logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Visible on mobile screens) */}
        <div ref={mobileSearchContainerRef} className="mt-2.5 sm:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setIsSearchOpen(true);
                }
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Search craft items, toppers, die cuts..."
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-full pl-4 pr-16 py-2 text-xs font-body outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setIsSearchOpen(false);
                }}
                className="absolute right-9 p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 p-1.5 rounded-full bg-slate-950 text-white flex items-center justify-center cursor-pointer"
            >
              {isSearching ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
            </button>
          </form>

          {/* Mobile Live Search Dropdown Popover */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-900">
              <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-600 font-medium">
                  {isSearching ? "Searching..." : `${searchResults.length} product${searchResults.length === 1 ? "" : "s"} found`}
                </span>
                {isSearching ? (
                  <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-[9px] text-slate-400">Tap result to view</span>
                )}
              </div>

              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-4 text-center text-xs font-mono space-y-2">
                    <div className="text-slate-500 font-semibold">No products found</div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold"
                    >
                      <span>Search Catalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug || prod.id}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="p-2.5 flex items-center gap-2.5 hover:bg-amber-50/60 transition"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                          {prod.name}
                        </h4>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          {prod.category}
                        </div>
                      </div>
                      <div className="text-right shrink-0 font-mono font-bold text-xs text-slate-950">
                        {formatPrice(prod.priceUsd)}
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="p-2 bg-slate-50 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-heading font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <span>View all results →</span>
                  </button>
                </div>
              )}
            </div>
          )}
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
                L
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-950">
                  Categories
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-800">
                  Curated Store Catalog
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

          {/* Drawer Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* 1. Homepage Showcase Sections (Links directly to the 4 sections on the home page) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase font-bold text-amber-800 px-3 py-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Home Showcase Sections</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {SHOWCASE_SECTIONS.map((sec) => {
                  const Icon = sec.id === "best-sellers" ? Flame : sec.id === "new-arrivals" ? Zap : sec.id === "featured-products" ? Sparkles : Package;
                  return (
                    <Link
                      key={sec.id}
                      href={sec.href}
                      onClick={() => setCategoryDrawerOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-amber-300/80 bg-amber-50/50 hover:bg-amber-100/80 hover:border-amber-400 transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-200/70 border border-amber-300 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="font-heading font-bold text-xs text-slate-950 group-hover:text-amber-900 transition">
                            {sec.title}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium line-clamp-1">
                            {sec.tagline}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 2. Shop By Category (Product Categories ONLY) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
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
                    className="flex items-center justify-between p-3 rounded-xl border-2 border-black/10 hover:border-black hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 group-hover:scale-105 transition-transform">
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
            </div>

            {/* View All Products Link */}
            <div className="pt-2">
              <Link
                href="/products"
                onClick={() => setCategoryDrawerOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-black text-white font-heading font-bold text-xs uppercase tracking-wider hover:bg-slate-900 border-2 border-black shadow-[3px_3px_0px_0px_#FFB800] transition"
              >
                <span>Browse All Products</span>
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
