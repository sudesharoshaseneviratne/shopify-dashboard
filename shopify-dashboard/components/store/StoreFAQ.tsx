"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Shield, Zap, Truck, Lock } from "lucide-react";

export function StoreFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How are shipments packaged to prevent supply-chain interdiction?",
      answer: "Every hardware unit is hermetically sealed in a laser-serialized, tamper-evident Faraday pouch before entering courier transit. The package contains a multi-layer holographic seal that reveals irreversible microscopic fracturing if opened or X-rayed improperly. Upon unboxing, verify your package's hash code with our PGP public key.",
      icon: Truck
    },
    {
      question: "Which payment methods are accepted?",
      answer: "We natively support Bitcoin Lightning Network (LNURL / WebLN for zero-fee, sub-second settlement), On-Chain Bitcoin (Native SegWit / Taproot), and traditional credit/debit cards processed through our isolated, zero-retention PCI enclave.",
      icon: Zap
    },
    {
      question: "Is the firmware 100% open-source and reproducible?",
      answer: "Yes. All firmware source code is publicly accessible on GitHub and reproducible via Gitian deterministic builds. You can compile the exact binary from source, generate its SHA-256 checksum, and verify it bit-for-bit against the binary preloaded on your hardware before running it.",
      icon: Lock
    },
    {
      question: "What is your return policy & warranty protection?",
      answer: "We offer a 30-day sovereign money-back guarantee and a comprehensive 2-year replacement warranty on all hardware signers, ASIC mining rigs, and sovereign nodes. If a device exhibits any hardware fault, we dispatch a new sealed replacement immediately.",
      icon: Shield
    },
    {
      question: "What happens if I enter a duress PIN on the Satoshi ColdKey?",
      answer: "If forced under physical duress to unlock your device, entering your secondary 'Duress PIN' instantly presents a decoy wallet with a minimal plausible balance, or completely zeroizes volatile flash memory and secure enclaves in under 15 nanoseconds, rendering brute force impossible.",
      icon: HelpCircle
    }
  ];

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-black font-bold">
          <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          <span>SOVEREIGN DISPATCH PROTOCOL</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
          Frequently Answered <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">Queries</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-body font-medium">
          Everything you need to know about air-gapped shipping, warranty, Bitcoin settlement, and reproducible firmware.
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
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center text-black shrink-0">
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="font-heading font-bold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-black stroke-[2.5] shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-amber-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-700 font-body leading-relaxed border-t-2 border-black/10 animate-in slide-in-from-top-2 duration-200 font-medium">
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
