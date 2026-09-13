"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Filter,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

export default function StoreReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const allReviews = [
    {
      id: "rev-1",
      author: "Dr. K. Jayasuriya",
      role: "Senior Science Educator, Colombo",
      rating: 5,
      date: "Verified Order #LK-8849",
      content: "The Grade 11 Science companion workbook and past paper guides were received within 24 hours in Colombo. Crystal-clear diagrams and syllabus-aligned questions. An indispensable resource for O/L preparation.",
      verifiedHardware: "Advanced Science O/L Study Companion",
      category: "Books & Workbooks",
      hash: "INV-2026-0812",
      helpfulCount: 42,
    },
    {
      id: "rev-2",
      author: "Dilani Fernando",
      role: "Parent & Teacher, Kandy",
      rating: 5,
      date: "Verified Order #LK-8850",
      content: "Ordered 3 Casio scientific calculators and a complete stationery set for my twins. Authentic products with warranty cards included in the box. Cash on Delivery was completely seamless.",
      verifiedHardware: "Scientific Calculator FX-991CW",
      category: "Tech & Electronics",
      hash: "INV-2026-0819",
      helpfulCount: 38,
    },
    {
      id: "rev-3",
      author: "Rohan Samarasinghe",
      role: "University Engineering Student, Moratuwa",
      rating: 5,
      date: "Verified Order #LK-8852",
      content: "The ergonomic drafting pens and technical notebook have outstanding paper quality with zero ink bleed. Fast delivery to Moratuwa campus. Highly recommended for university work.",
      verifiedHardware: "Precision Drafting Fineliner Set",
      category: "Stationery & Office",
      hash: "INV-2026-0824",
      helpfulCount: 29,
    },
    {
      id: "rev-4",
      author: "Anoma Wickramasinghe",
      role: "School Administrator, Galle",
      rating: 5,
      date: "Verified Order #LK-8854",
      content: "Bulk ordered primary school stationery kits and geometry sets for our term start. Everything was neatly packed in secure moisture-sealed boxes and arrived right on schedule.",
      verifiedHardware: "Student Geometry & Math Kit",
      category: "School Essentials",
      hash: "INV-2026-0831",
      helpfulCount: 19,
    },
    {
      id: "rev-5",
      author: "Pradeep Perera",
      role: "IT Professional, Negombo",
      rating: 5,
      date: "Verified Order #LK-8856",
      content: "Bought the rechargeable LED desk study lamp with eye-care brightness levels. Excellent battery backup during evening power interruptions. Very pleased with Prasanthi Craft.",
      verifiedHardware: "Smart Eye-Care LED Study Lamp",
      category: "Tech & Electronics",
      hash: "INV-2026-0842",
      helpfulCount: 31,
    },
    {
      id: "rev-6",
      author: "Shiromi De Silva",
      role: "Art & Design Instructor, Kurunegala",
      rating: 5,
      date: "Verified Order #LK-8858",
      content: "Premium watercolor pencils and heavy sketch pad set. Rich pigmentation and durable wooden core. Genuine branded art supplies at competitive local prices.",
      verifiedHardware: "Professional Artist Color Pencil Set",
      category: "Stationery & Office",
      hash: "INV-2026-0850",
      helpfulCount: 25,
    }
  ];

  const categories = ["All", "Books & Workbooks", "Tech & Electronics", "Stationery & Office", "School Essentials"];

  const filteredReviews = selectedFilter === "All"
    ? allReviews
    : allReviews.filter((r) => r.category === selectedFilter);

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12 space-y-12">
      {/* Top Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/10 pb-6">
        <div>
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-700 hover:text-black font-bold uppercase mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Store Home</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-black font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>AUTHENTIC VERIFIED CUSTOMER REVIEWS</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Reviews &amp; Feedback</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body max-w-2xl mt-1">
            Genuine verified feedback from students, educators, and parents across Sri Lanka who trust Prasanthi Craft for school, university, and office supplies.
          </p>
        </div>

        {/* Rating Summary Badge */}
        <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-neo-card flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="font-mono text-3xl sm:text-4xl font-black text-slate-900">4.95</div>
            <div className="flex items-center gap-1 text-amber-500 mt-1 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
              ))}
            </div>
          </div>
          <div className="h-10 w-[1px] bg-slate-200" />
          <div className="text-left font-mono">
            <div className="text-xs font-bold text-slate-900">1,280+ Reviews</div>
            <div className="text-[10px] text-emerald-700 font-bold">100% Genuine Orders</div>
          </div>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>FILTER:</span>
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer shrink-0 border-2 border-black ${
              selectedFilter === cat
                ? "bg-black text-white shadow-[2px_2px_0px_0px_#FFB800]"
                : "bg-white hover:bg-slate-100 text-slate-800 shadow-none"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-black flex flex-col justify-between space-y-6 shadow-neo-card relative overflow-hidden group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-600 font-bold">{rev.date}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-body leading-relaxed font-medium">
                "{rev.content}"
              </p>
            </div>

            <div className="pt-4 border-t-2 border-black/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-heading font-black text-sm text-slate-900">{rev.author}</div>
                  <div className="text-[10px] font-mono text-slate-600 font-medium">{rev.role}</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-800 text-[10px] font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Verified Purchase</span>
                </div>
              </div>

              {/* Hardware & TX Hash Pill */}
              <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-black flex items-center justify-between text-[10px] font-mono text-black font-bold shadow-[2px_2px_0px_0px_#000]">
                <span className="truncate">{rev.verifiedHardware}</span>
                <span className="text-slate-600 ml-2 shrink-0 font-normal">{rev.hash}</span>
              </div>

              {/* Helpful Votes Count */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Verified Buyer Review</span>
                <span className="flex items-center gap-1 text-slate-700 font-bold">
                  <ThumbsUp className="w-3 h-3 text-amber-600" />
                  <span>{rev.helpfulCount} people found this helpful</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Products */}
      <div className="p-8 rounded-3xl bg-black text-white border-2 border-black shadow-neo-card text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black font-mono font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRUSTED BY THOUSANDS ACROSS SRI LANKA</span>
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-3xl">
          Ready to Order Your Educational Supplies?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-body max-w-xl mx-auto">
          Explore our complete catalog of textbooks, study workbooks, fine pens, drafting instruments, and student tech.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FFD600] hover:bg-[#FFC107] text-black font-heading font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-neo-btn transition cursor-pointer"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
