"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Bell, 
  SlidersHorizontal, 
  CheckCircle2, 
  Store, 
  ExternalLink,
  LogOut,
  User,
  X,
  ShoppingBag,
  Users,
  BarChart3,
  Tag,
  FileText,
  Globe,
  TrendingUp,
  Package
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const searchItems = [
  { title: "Home Dashboard", category: "Navigation", href: "/", icon: <ShoppingBag className="w-4 h-4" /> },
  { title: "Orders Overview", category: "Orders", href: "/orders", icon: <Package className="w-4 h-4" /> },
  { title: "Draft Orders", category: "Orders", href: "/orders/drafts", icon: <Package className="w-4 h-4" /> },
  { title: "Abandoned Checkouts", category: "Orders", href: "/orders/abandoned", icon: <Package className="w-4 h-4" /> },
  { title: "All Products", category: "Products", href: "/products", icon: <ShoppingBag className="w-4 h-4" /> },
  { title: "Product Collections", category: "Products", href: "/products/collections", icon: <ShoppingBag className="w-4 h-4" /> },
  { title: "Inventory Management", category: "Products", href: "/products/inventory", icon: <ShoppingBag className="w-4 h-4" /> },
  { title: "Purchase Orders", category: "Products", href: "/products/purchase-orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { title: "Stock Transfers", category: "Products", href: "/products/transfers", icon: <ShoppingBag className="w-4 h-4" /> },
  { title: "Gift Cards", category: "Products", href: "/products/gift-cards", icon: <Tag className="w-4 h-4" /> },
  { title: "Customers Directory", category: "Customers", href: "/customers", icon: <Users className="w-4 h-4" /> },
  { title: "Customer Segments", category: "Customers", href: "/customers/segments", icon: <Users className="w-4 h-4" /> },
  { title: "B2B Companies", category: "Customers", href: "/customers/companies", icon: <Users className="w-4 h-4" /> },
  { title: "Analytics Overview", category: "Analytics", href: "/analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { title: "Analytics Reports", category: "Analytics", href: "/analytics/reports", icon: <BarChart3 className="w-4 h-4" /> },
  { title: "Growth & Marketing", category: "Growth", href: "/growth", icon: <TrendingUp className="w-4 h-4" /> },
  { title: "Attribution Tracking", category: "Growth", href: "/growth/attribution", icon: <TrendingUp className="w-4 h-4" /> },
  { title: "Marketing Campaigns", category: "Growth", href: "/growth/campaigns", icon: <TrendingUp className="w-4 h-4" /> },
  { title: "Discounts & Promotions", category: "Discounts", href: "/discounts", icon: <Tag className="w-4 h-4" /> },
  { title: "Content Metaobjects", category: "Content", href: "/content/metaobjects", icon: <FileText className="w-4 h-4" /> },
  { title: "Media Files", category: "Content", href: "/content/files", icon: <FileText className="w-4 h-4" /> },
  { title: "Navigation Menus", category: "Content", href: "/content/menus", icon: <FileText className="w-4 h-4" /> },
  { title: "Blog Posts", category: "Content", href: "/content/blog-posts", icon: <FileText className="w-4 h-4" /> },
  { title: "Markets Overview", category: "Markets", href: "/markets", icon: <Globe className="w-4 h-4" /> },
  { title: "Catalogs", category: "Markets", href: "/markets/catalogs", icon: <Globe className="w-4 h-4" /> },
  { title: "Market Rollouts", category: "Markets", href: "/markets/rollouts", icon: <Globe className="w-4 h-4" /> }
];

export function TopBar() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredResults = searchItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <>
      <div className="h-[48px] w-full bg-[#1a1a1a] text-white flex items-center justify-between px-3 sticky top-0 z-50 select-none">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="https://www.saslk.com" target="_blank" className="flex items-center gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight">Powered by</span>
            <span className="text-[25px] font-extrabold italic tracking-tight text-[#00FFFF]">SASLK</span>
          </Link>
        </div>

        {/* Middle: Admin Search Input Bar (Matching Screenshot) */}
        <div ref={searchContainerRef} className="flex-1 max-w-[580px] mx-4 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-[#a1a1aa] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
              }}
              className="w-full h-8 bg-[#2b2b2b] text-white rounded-lg pl-9 pr-20 text-[13px] border border-transparent focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] focus:bg-[#202020] focus:outline-none transition-all placeholder:text-[#8c8c8c]"
            />
            <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
              <span className="text-[10px] text-[#a1a1aa] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#3f3f3f] font-mono">CTRL</span>
              <span className="text-[10px] text-[#a1a1aa] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#3f3f3f] font-mono">K</span>
            </div>
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-[#1a1a1a] rounded-2xl shadow-2xl border border-[#e1e3e5] p-2 z-50 max-h-[380px] overflow-y-auto">
              {filteredResults.length > 0 ? (
                <div className="flex flex-col gap-0.5">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#616161] uppercase tracking-wider">
                    Admin Navigation & Items
                  </div>
                  {filteredResults.map((result) => (
                    <button
                      key={result.href + result.title}
                      onClick={() => {
                        router.push(result.href);
                        setIsSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between px-3 py-2 text-[13px] rounded-xl hover:bg-[#f6f6f7] transition text-left group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-[#f1f2f4] text-[#616161] group-hover:bg-white group-hover:text-[#1a1a1a] transition">
                          {result.icon}
                        </span>
                        <div>
                          <div className="font-medium text-[#1a1a1a]">{result.title}</div>
                          <div className="text-[11px] text-[#616161]">{result.category}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#005bd3] opacity-0 group-hover:opacity-100 transition font-medium">
                        Jump to &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-[13px] text-[#616161]">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Popovers */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {/* Bell Icon & Alerts Popover */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsAlertsOpen(!isAlertsOpen);
                setIsAccountOpen(false);
              }}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition relative ${
                isAlertsOpen ? "bg-[#303030] text-white ring-1 ring-white/20" : "bg-[#2b2b2b] text-[#a1a1aa] hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#96bf48] rounded-full"></span>
            </button>

            {/* Alerts Popover Card */}
            {isAlertsOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-[340px] bg-white text-[#1a1a1a] border border-[#e1e3e5] rounded-2xl shadow-2xl p-4 z-50 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Alerts</h3>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer transition" />
                    <CheckCircle2 className="w-4 h-4 text-[#8a8a8a] hover:text-[#1a1a1a] cursor-pointer transition" />
                  </div>
                </div>

                <div className="mt-3 bg-[#f6f6f7] rounded-xl p-6 text-center text-[13px] text-[#616161] font-normal">
                  Alerts about your store and account will show here
                </div>
              </div>
            )}
          </div>

          {/* Learnix LK Store Avatar Button & Account Popover */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsAccountOpen(!isAccountOpen);
                setIsAlertsOpen(false);
              }}
              className={`px-2.5 py-1 rounded-xl flex items-center gap-2 border transition ${
                isAccountOpen ? "bg-[#303030] border-white/20 text-white" : "bg-[#2b2b2b] border-transparent text-[#e4e5e7] hover:bg-[#303030]"
              }`}
            >
              <div className="w-5 h-5 rounded bg-[#38bdf8] flex items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-[#0f172a]">LK</span>
              </div>
              <span className="text-[13px] font-medium text-white">Learnix LK</span>
            </button>

            {/* Account Popover Card */}
            {isAccountOpen && (
              <div className="absolute top-full right-0 mt-2.5 w-[280px] bg-white text-[#1a1a1a] border border-[#e1e3e5] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1">
                {/* Account Profile Section */}
                <div className="px-3 py-2 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#38bdf8] flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold text-[#0f172a]">LK</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a1a]">Learnix LK</div>
                    <div className="text-[12px] text-[#616161]">learnixlk@gmail.com</div>
                  </div>
                </div>

                {/* Visit Store Front Option */}
                <a 
                  href="https://www.saslk.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 text-[13px] font-medium text-[#303030] hover:bg-[#f6f6f7] rounded-xl transition text-left mt-1 group"
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-[#616161] group-hover:text-[#1a1a1a] transition" />
                    <span>Visit Store Front</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#1a1a1a] transition" />
                </a>

                <div className="border-t border-[#e1e3e5] my-1" />

                {/* Log Out Option */}
                <button 
                  onClick={() => {
                    setIsAccountOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[#ff0000] hover:bg-red-50 rounded-xl transition text-left"
                >
                  <LogOut className="w-4 h-4 text-[#ff0000]" />
                  <span className="text-[#ff0000]">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal Popup */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-[#1a1a1a] border border-[#e1e3e5] relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-[#8a8a8a] hover:text-[#1a1a1a] transition p-1 rounded-lg hover:bg-[#f1f2f4]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#d72c0d] flex items-center justify-center mb-4">
              <LogOut className="w-5 h-5" />
            </div>

            <h3 className="text-[17px] font-semibold text-[#1a1a1a] tracking-tight">Log out of Learnix LK?</h3>
            <p className="text-[13px] text-[#616161] mt-1.5 leading-relaxed">
              Are you sure you want to log out? You will need to sign back in to access your store admin dashboard.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold text-[#303030] border border-[#c9cccf] hover:bg-[#f6f6f7] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold bg-[#d72c0d] hover:bg-[#bc2200] text-white transition shadow-2xs"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
