"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, Check, X, Shield, Cpu, Zap, ArrowRight } from "lucide-react";
import { STORE_PRODUCTS, StoreProduct } from "@/lib/store/products";
import { useCart } from "@/lib/store/cartContext";

export function SpecsComparisonTable() {
  const { formatPrice, addItem } = useCart();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    "coldkey-prime-mk4",
    "sovereign-node-x1",
    "quantum-hsm-vault"
  ]);

  const toggleSelect = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 2) {
        setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
      }
    } else {
      if (selectedProductIds.length < 4) {
        setSelectedProductIds([...selectedProductIds, id]);
      } else {
        setSelectedProductIds([...selectedProductIds.slice(1), id]);
      }
    }
  };

  const selectedProducts = STORE_PRODUCTS.filter((p) => selectedProductIds.includes(p.id));

  return (
    <section id="compare" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#EA580C] font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>CRYPTOGRAPHIC BENCHMARK MATRIX</span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900">
            Hardware <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#F7931A]">Comparison</span>
          </h2>
        </div>

        {/* Product selector buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 font-semibold whitespace-nowrap">Compare:</span>
          {STORE_PRODUCTS.map((p) => {
            const isSel = selectedProductIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition cursor-pointer ${
                  isSel
                    ? "bg-orange-100 text-[#EA580C] border border-orange-300 font-bold shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {p.name.split(" ")[0]} {p.name.split(" ")[1]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Comparison Table */}
      <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 sm:p-6 text-slate-600 font-bold w-1/4 uppercase tracking-wider text-[11px]">
                  Cryptographic Parameters
                </th>
                {selectedProducts.map((product) => (
                  <th key={product.id} className="p-4 sm:p-6 w-1/4 align-top">
                    <div className="space-y-2">
                      <span className="text-[10px] text-[#EA580C] font-bold uppercase tracking-wider block">
                        {product.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="text-base font-bold text-slate-900">
                        {formatPrice(product.priceUsd)}
                      </div>
                      <button
                        onClick={() => addItem(product, 1)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#F7931A] text-white font-heading font-bold text-[10px] uppercase tracking-wider shadow-xs hover:scale-105 transition cursor-pointer"
                      >
                        + Add to Vault
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-6 font-semibold text-slate-600">Security Enclave</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 sm:p-6 text-slate-900 font-bold">
                    <span className="px-2 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                      {p.securityRating}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-6 font-semibold text-slate-600">Air-Gap Method</td>
                {selectedProducts.map((p) => {
                  const isAirGapped = p.features.some((f) => f.toLowerCase().includes("air-gapped") || f.toLowerCase().includes("optical"));
                  return (
                    <td key={p.id} className="p-4 sm:p-6 text-slate-900">
                      {isAirGapped ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>100% Optical QR PSBT</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <span>Dedicated LAN / Tor</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-6 font-semibold text-slate-600">Active Firmware</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 sm:p-6 text-[#EA580C] font-semibold">
                    {p.firmwareVersion}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-6 font-semibold text-slate-600">Entropy Generation</td>
                {selectedProducts.map((p) => {
                  const entropy = p.specs.find((s) => s.label.toLowerCase().includes("entropy"))?.value || "True Hardware Noise";
                  return (
                    <td key={p.id} className="p-4 sm:p-6 text-slate-800">
                      {entropy}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-6 font-semibold text-slate-600">Dispatch Lead Time</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 sm:p-6 text-slate-600">
                    {p.leadTime}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-4 sm:p-6 font-semibold text-slate-600">Stock Status</td>
                {selectedProducts.map((p) => (
                  <td key={p.id} className="p-4 sm:p-6">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{p.inventory} Units In Vault</span>
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
