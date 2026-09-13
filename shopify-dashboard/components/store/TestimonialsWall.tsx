"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export function TestimonialsWall() {
  const reviews = [
    {
      author: "Amila Upulitha",
      role: "Verified Parent, Galle",
      rating: 5,
      date: "2 days ago",
      content: "The Oxford Dictionary and Abacus Year 2 workbooks arrived in pristine condition in under 24 hours. The books are 100% genuine editions with crisp printing and sturdy protective packaging.",
      verifiedHardware: "Oxford Learner's Dictionary (10th Ed)",
      hash: "Order #1015"
    },
    {
      author: "Pradeepa Prasadini",
      role: "Secondary School Educator, Colombo",
      rating: 5,
      date: "1 week ago",
      content: "Ordered Casio FX-991CW ClassWiz scientific calculators and geometry kits for our senior exam batches. Genuine warranty cards were included and Cash on Delivery made the process effortless.",
      verifiedHardware: "Casio FX-991CW Calculator",
      hash: "Order #1011"
    },
    {
      author: "Isuru Abeyrama",
      role: "Architecture Student, Kandy",
      rating: 5,
      date: "2 weeks ago",
      content: "The rOtring Rapid Pro drafting pencils and fountain-friendly A5 journals exceeded my expectations. Smooth weighted ergonomics and no bleed-through on the pages. Outstanding service!",
      verifiedHardware: "rOtring Rapid PRO Drafting Set",
      hash: "Order #1014"
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-black font-bold">
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          <span>VERIFIED CUSTOMER REVIEWS</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Students &amp; Parents</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-body font-medium">
          Real feedback from verified shoppers, educators, and students across Sri Lanka.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
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

              <p className="text-xs text-slate-700 font-body leading-relaxed font-medium">
                &ldquo;{rev.content}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{rev.author}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[11px] font-mono text-slate-500">{rev.role}</div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono font-bold text-amber-700">{rev.hash}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{rev.verifiedHardware}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsWall;
