"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  ShoppingBag, 
  Users, 
  Globe, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight, 
  ExternalLink,
  BarChart3,
  Zap,
  RefreshCw,
  Clock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Google Search Console Data
const gscKeywords = [
  { query: "online shopping sri lanka", clicks: 428, impressions: 8420, ctr: "5.08%", position: "3.2" },
  { query: "buy handcrafted gifts online", clicks: 312, impressions: 4150, ctr: "7.52%", position: "2.1" },
  { query: "organic tea pack order", clicks: 215, impressions: 3890, ctr: "5.53%", position: "4.5" },
  { query: "flat shipping rate store", clicks: 184, impressions: 2640, ctr: "6.97%", position: "1.8" },
  { query: "custom order items colombo", clicks: 142, impressions: 1980, ctr: "7.17%", position: "3.9" },
];

const gscLandingPages = [
  { url: "/products/organic-herbal-tea", clicks: 512, impressions: 9200, ctr: "5.57%", position: "2.4" },
  { url: "/products/handmade-ceramic-mug", clicks: 380, impressions: 6800, ctr: "5.59%", position: "3.1" },
  { url: "/collections/best-sellers", clicks: 290, impressions: 5400, ctr: "5.37%", position: "4.0" },
  { url: "/", clicks: 238, impressions: 7010, ctr: "3.39%", position: "1.2" },
];

export default function Home() {
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [gscTab, setGscTab] = useState<"keywords" | "pages" | "chart">("keywords");
  const [isRefreshingGSC, setIsRefreshingGSC] = useState(false);

  const handleRefreshGSC = () => {
    setIsRefreshingGSC(true);
    setTimeout(() => setIsRefreshingGSC(false), 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#f6f6f7] flex flex-col select-none relative pb-16 text-[#1a1a1a]">
      {/* Top Welcome Bar & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-1">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight flex items-center gap-2">
            Welcome back, Merchant
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-[13px] text-[#616161] mt-0.5">
            Here is your live store performance & Google organic search console summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Visitor Indicator */}
          <div className="bg-white border border-[#e1e3e5] px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-2 text-[12px] font-medium text-[#303030]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#107c41] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#107c41]"></span>
            </span>
            <span><strong className="text-[#1a1a1a]">4 live visitors</strong> browsing</span>
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#1a1a1a] text-[13px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs transition"
            >
              <Calendar className="w-4 h-4 text-[#616161]" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
            </button>

            {isDateOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#e1e3e5] rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 text-[13px]">
                {["Today", "Last 7 days", "Last 30 days", "Last 90 days", "All time"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setDateRange(item);
                      setIsDateOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-md transition font-medium",
                      dateRange === item ? "bg-[#f1f2f4] text-[#1a1a1a] font-semibold" : "text-[#303030] hover:bg-[#f6f6f7]"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Stat 1: Total Sales */}
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#616161] mb-2">
            <span className="text-[12px] font-medium">Total sales</span>
            <div className="p-1.5 bg-[#eaf4fe] text-[#005bd3] rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">
            Rs 63,944.00
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[12px]">
            <span className="font-semibold text-[#107c41] bg-[#e6f4ea] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +46.2%
            </span>
            <span className="text-[#616161]">vs previous period</span>
          </div>
        </div>

        {/* Stat 2: Total Orders */}
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#616161] mb-2">
            <span className="text-[12px] font-medium">Total orders</span>
            <div className="p-1.5 bg-[#eaf4fe] text-[#005bd3] rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">
            15 orders
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[12px]">
            <span className="font-semibold text-[#107c41] bg-[#e6f4ea] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +100%
            </span>
            <span className="text-[#616161]">vs previous period</span>
          </div>
        </div>

        {/* Stat 3: Conversion Rate */}
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#616161] mb-2">
            <span className="text-[12px] font-medium">Conversion rate</span>
            <div className="p-1.5 bg-[#fef3c7] text-[#b45309] rounded-lg">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">
            3.42%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[12px]">
            <span className="font-semibold text-[#107c41] bg-[#e6f4ea] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +1.2%
            </span>
            <span className="text-[#616161]">from 1,045 sessions</span>
          </div>
        </div>

        {/* Stat 4: Google Organic Clicks */}
        <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-[#616161] mb-2">
            <span className="text-[12px] font-medium">Google search clicks</span>
            <div className="p-1.5 bg-[#fce7f3] text-[#be185d] rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-[20px] font-bold text-[#1a1a1a] tracking-tight">
            1,420 clicks
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[12px]">
            <span className="font-semibold text-[#107c41] bg-[#e6f4ea] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +28.4%
            </span>
            <span className="text-[#616161]">organic GSC traffic</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Google Search Console Dashboard (Left 2 cols) & Action Items (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left Card: Google Search Console Analytics Integration */}
        <div className="lg:col-span-2 bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs p-5 flex flex-col justify-between">
          <div>
            {/* GSC Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f2f4]">
              <div className="flex items-center gap-3">
                {/* Google GSC Multi-Color Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] border border-[#e1e3e5] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-bold text-[#1a1a1a]">Google Search Console Analytics</h2>
                    <span className="bg-[#e6f4ea] text-[#107c41] text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#107c41]" /> Live Synced
                    </span>
                  </div>
                  <p className="text-[12px] text-[#616161]">
                    Organic search query clicks, impressions & Google search rankings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshGSC}
                  className="p-1.5 border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#616161] rounded-lg transition"
                  title="Refresh GSC Data"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isRefreshingGSC && "animate-spin text-[#005bd3]")} />
                </button>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 border border-[#c9cccf] hover:bg-[#f6f6f7] text-[#303030] text-[12px] font-medium rounded-lg flex items-center gap-1 transition shadow-2xs"
                >
                  <span>Open Console</span>
                  <ExternalLink className="w-3 h-3 text-[#616161]" />
                </a>
              </div>
            </div>

            {/* GSC Key Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 my-4 bg-[#f8f9fa] p-3 rounded-xl border border-[#e1e3e5]">
              <div>
                <div className="text-[11px] font-medium text-[#616161]">Total Organic Clicks</div>
                <div className="text-[16px] font-bold text-[#1a1a1a] mt-0.5">1,420</div>
                <div className="text-[11px] text-[#107c41] font-medium">+28.4% this month</div>
              </div>
              <div className="border-l border-[#e1e3e5] pl-3">
                <div className="text-[11px] font-medium text-[#616161]">Total Search Impressions</div>
                <div className="text-[16px] font-bold text-[#1a1a1a] mt-0.5">28,450</div>
                <div className="text-[11px] text-[#107c41] font-medium">+14.2% reach</div>
              </div>
              <div className="border-l border-[#e1e3e5] pl-3">
                <div className="text-[11px] font-medium text-[#616161]">Avg. Google Position</div>
                <div className="text-[16px] font-bold text-[#1a1a1a] mt-0.5">Pos 3.4</div>
                <div className="text-[11px] text-[#107c41] font-medium">Top 5 rank</div>
              </div>
            </div>

            {/* GSC Sub-tabs */}
            <div className="flex items-center gap-2 border-b border-[#e1e3e5] mb-3">
              <button
                onClick={() => setGscTab("keywords")}
                className={cn(
                  "pb-2 px-1 text-[13px] font-semibold border-b-2 transition",
                  gscTab === "keywords"
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#616161] hover:text-[#1a1a1a]"
                )}
              >
                Top Search Keywords
              </button>
              <button
                onClick={() => setGscTab("pages")}
                className={cn(
                  "pb-2 px-1 text-[13px] font-semibold border-b-2 transition",
                  gscTab === "pages"
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#616161] hover:text-[#1a1a1a]"
                )}
              >
                Top Landing Pages
              </button>
              <button
                onClick={() => setGscTab("chart")}
                className={cn(
                  "pb-2 px-1 text-[13px] font-semibold border-b-2 transition",
                  gscTab === "chart"
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#616161] hover:text-[#1a1a1a]"
                )}
              >
                Impressions Trend Chart
              </button>
            </div>

            {/* Tab Content */}
            {gscTab === "keywords" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-[#e1e3e5] text-[#616161] font-medium pb-1">
                      <th className="py-2 font-medium">Search Query</th>
                      <th className="py-2 font-medium text-right">Clicks</th>
                      <th className="py-2 font-medium text-right">Impressions</th>
                      <th className="py-2 font-medium text-right">CTR</th>
                      <th className="py-2 font-medium text-right">Avg. Rank</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f2f4]">
                    {gscKeywords.map((item, i) => (
                      <tr key={i} className="hover:bg-[#f6f6f7] transition">
                        <td className="py-2 font-medium text-[#1a1a1a] flex items-center gap-1.5">
                          <Search className="w-3 h-3 text-[#616161]" />
                          <span>{item.query}</span>
                        </td>
                        <td className="py-2 text-right font-semibold text-[#1a1a1a]">{item.clicks}</td>
                        <td className="py-2 text-right text-[#616161]">{item.impressions.toLocaleString()}</td>
                        <td className="py-2 text-right text-[#107c41] font-medium">{item.ctr}</td>
                        <td className="py-2 text-right">
                          <span className="bg-[#e4e5e7] text-[#1a1a1a] px-1.5 py-0.5 rounded font-mono text-[11px]">
                            #{item.position}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {gscTab === "pages" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px]">
                  <thead>
                    <tr className="border-b border-[#e1e3e5] text-[#616161] font-medium pb-1">
                      <th className="py-2 font-medium">Landing Page Path</th>
                      <th className="py-2 font-medium text-right">Clicks</th>
                      <th className="py-2 font-medium text-right">Impressions</th>
                      <th className="py-2 font-medium text-right">CTR</th>
                      <th className="py-2 font-medium text-right">Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f2f4]">
                    {gscLandingPages.map((item, i) => (
                      <tr key={i} className="hover:bg-[#f6f6f7] transition">
                        <td className="py-2 font-medium text-[#005bd3] hover:underline cursor-pointer">
                          {item.url}
                        </td>
                        <td className="py-2 text-right font-semibold text-[#1a1a1a]">{item.clicks}</td>
                        <td className="py-2 text-right text-[#616161]">{item.impressions.toLocaleString()}</td>
                        <td className="py-2 text-right text-[#107c41] font-medium">{item.ctr}</td>
                        <td className="py-2 text-right font-mono text-[11px] text-[#616161]">#{item.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {gscTab === "chart" && (
              <div className="py-4">
                <div className="flex items-center justify-between text-[12px] text-[#616161] mb-2">
                  <span>30-Day Search Performance (Blue: Clicks, Green: Impressions)</span>
                  <span className="font-semibold text-[#107c41]">+28% organic growth</span>
                </div>
                <div className="w-full h-36 bg-[#f8f9fa] rounded-xl border border-[#e1e3e5] p-3 flex items-end justify-between gap-1 relative overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full p-2 text-[#005bd3]" viewBox="0 0 300 80" preserveAspectRatio="none" fill="none">
                    <path d="M 0 60 Q 50 30 100 45 T 200 20 T 300 10" stroke="#005bd3" strokeWidth="2.5" fill="none" />
                    <path d="M 0 70 Q 50 50 100 60 T 200 40 T 300 30" stroke="#107c41" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#f1f2f4] flex items-center justify-between text-[12px]">
            <span className="text-[#616161]">Last synced 10 minutes ago via Google Search Console API</span>
            <Link href="/admin/settings" className="text-[#005bd3] font-semibold hover:underline flex items-center gap-1">
              Configure SEO settings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Card: Immediate Operational Actions & Stock Alerts */}
        <div className="flex flex-col gap-4">
          
          {/* Action Required Panel */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs p-5">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#b45309]" />
              Things to do today
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-[#fffbeb] border border-[#fef3c7] hover:bg-[#fef3c7]/60 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#d97706]" />
                  <div>
                    <div className="text-[13px] font-semibold text-[#92400e]">3 orders to fulfill</div>
                    <div className="text-[11px] text-[#b45309]">Ready for packaging & shipment</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#d97706]" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-[#f0fdf4] border border-[#dcfce7] hover:bg-[#dcfce7]/60 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  <div>
                    <div className="text-[13px] font-semibold text-[#166534]">3 payment pending orders</div>
                    <div className="text-[11px] text-[#15803d]">Awaiting customer payment capture</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#16a34a]" />
              </Link>
            </div>
          </div>

          {/* Low Stock Warning Panel */}
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-bold text-[#1a1a1a] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#c5221f]" />
                  Low Stock Inventory
                </h3>
                <Link href="/admin/products" className="text-[12px] text-[#005bd3] hover:underline font-medium">
                  Manage inventory
                </Link>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-[#fdf2f2] border border-[#f87171]/20 rounded-xl">
                  <div>
                    <div className="text-[12px] font-semibold text-[#991b1b]">Handmade Ceramic Mug</div>
                    <div className="text-[11px] text-[#b91c1c]">SKU: MUG-001</div>
                  </div>
                  <span className="bg-[#fecaca] text-[#991b1b] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    2 left
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#fffbeb] border border-[#fcd34d]/30 rounded-xl">
                  <div>
                    <div className="text-[12px] font-semibold text-[#92400e]">Organic Herbal Tea Pack</div>
                    <div className="text-[11px] text-[#b45309]">SKU: TEA-ORGANIC-02</div>
                  </div>
                  <span className="bg-[#fef3c7] text-[#92400e] text-[11px] font-bold px-2 py-0.5 rounded-full">
                    1 left
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#f1f2f4] text-center">
              <Link href="/admin/products" className="text-[12px] text-[#616161] hover:text-[#1a1a1a] font-medium flex items-center justify-center gap-1">
                View all product stock levels <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Row: Conversion Funnel & Top Selling Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Conversion Funnel */}
        <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs p-5">
          <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1">Conversion Funnel</h3>
          <p className="text-[12px] text-[#616161] mb-4">Customer journey from store visit to purchase</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[12px] mb-1 font-medium">
                <span>1. Store Sessions</span>
                <span className="font-semibold text-[#1a1a1a]">1,045 (100%)</span>
              </div>
              <div className="w-full bg-[#f1f2f4] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#005bd3] h-full rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] mb-1 font-medium">
                <span>2. Added to Cart</span>
                <span className="font-semibold text-[#1a1a1a]">312 (29.8%)</span>
              </div>
              <div className="w-full bg-[#f1f2f4] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#38bdf8] h-full rounded-full w-[30%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] mb-1 font-medium">
                <span>3. Reached Checkout</span>
                <span className="font-semibold text-[#1a1a1a]">84 (8.0%)</span>
              </div>
              <div className="w-full bg-[#f1f2f4] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#f59e0b] h-full rounded-full w-[12%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[12px] mb-1 font-medium">
                <span>4. Sessions Converted (Purchased)</span>
                <span className="font-semibold text-[#107c41]">15 (1.4%)</span>
              </div>
              <div className="w-full bg-[#f1f2f4] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#107c41] h-full rounded-full w-[6%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xs p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">Top Selling Products</h3>
              <p className="text-[12px] text-[#616161]">Best performing items by revenue this month</p>
            </div>
            <Link href="/admin/products" className="text-[12px] text-[#005bd3] hover:underline font-medium">
              View products
            </Link>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8f9fa] transition border border-[#f1f2f4]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f1f2f4] flex items-center justify-center font-bold text-[#303030] text-[13px]">
                  #1
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1a1a1a]">Organic Herbal Tea Pack</div>
                  <div className="text-[11px] text-[#616161]">18 units sold</div>
                </div>
              </div>
              <div className="text-[13px] font-bold text-[#1a1a1a]">Rs 21,600.00</div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8f9fa] transition border border-[#f1f2f4]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f1f2f4] flex items-center justify-center font-bold text-[#303030] text-[13px]">
                  #2
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1a1a1a]">Handmade Ceramic Mug</div>
                  <div className="text-[11px] text-[#616161]">12 units sold</div>
                </div>
              </div>
              <div className="text-[13px] font-bold text-[#1a1a1a]">Rs 18,000.00</div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f8f9fa] transition border border-[#f1f2f4]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f1f2f4] flex items-center justify-center font-bold text-[#303030] text-[13px]">
                  #3
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-[#1a1a1a]">Sri Lankan Cinnamon Oil</div>
                  <div className="text-[11px] text-[#616161]">8 units sold</div>
                </div>
              </div>
              <div className="text-[13px] font-bold text-[#1a1a1a]">Rs 12,400.00</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
