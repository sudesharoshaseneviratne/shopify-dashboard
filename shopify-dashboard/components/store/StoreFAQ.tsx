"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Shield, CreditCard, Truck, BookOpen, CheckCircle } from "lucide-react";

export function StoreFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does islandwide courier delivery take?",
      answer: "Orders within Colombo and Western Province are typically delivered within 24 hours. For outstation locations (Kandy, Galle, Kurunegala, Jaffna, etc.), delivery takes 24-48 business hours via our registered express courier partners.",
      icon: Truck
    },
    {
      question: "Which payment methods do you accept?",
      answer: "We support Visa, Mastercard, and American Express with 256-bit SSL encryption, Cash on Delivery (pay cash to the delivery agent at your doorstep), and direct bank transfer to our Commercial Bank account.",
      icon: CreditCard
    },
    {
      question: "Are all books and workbooks authentic official editions?",
      answer: "Yes, 100%. All educational textbooks, dictionaries, and workbooks are sourced directly from authorized publishers including Oxford University Press, Cambridge, Pearson, and registered local educational bodies.",
      icon: BookOpen
    },
    {
      question: "What is your return & exchange policy?",
      answer: "We offer a hassle-free 7-day replacement guarantee. If a book or product arrives with any manufacturing defect, missing pages, or transit damage, contact our support hotline for an immediate courier replacement at no extra charge.",
      icon: Shield
    },
    {
      question: "Can I place bulk orders for schools or booklists?",
      answer: "Yes! We specialize in fulfilling annual school booklists, tuition center materials, and corporate stationery orders with volume discounts. Reach out to our hotline at +9477 423 0976 for custom quotations.",
      icon: CheckCircle
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-black font-bold">
          <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          <span>HELP &amp; CUSTOMER SUPPORT</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Questions</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-body font-medium">
          Everything you need to know about islandwide delivery, payment options, genuine quality, and book returns.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = faq.icon;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white border-2 border-black overflow-hidden transition-all duration-200 shadow-none hover:shadow-[4px_4px_0px_0px_#000000] hover:-translate-y-0.5 hover:-translate-x-0.5"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer bg-white transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <span className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-amber-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 pt-0 text-slate-600 text-xs sm:text-sm font-body leading-relaxed border-t border-slate-100 mt-2 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StoreFAQ;
