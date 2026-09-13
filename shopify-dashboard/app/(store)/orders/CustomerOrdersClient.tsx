"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  ChevronRight, 
  ArrowLeft, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  Lock, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useCustomerAuth } from "@/lib/store/customerAuthContext";
import type { CustomerSession } from "@/app/actions/customers";
import type { CustomerOrder } from "@/app/actions/orders";

interface CustomerOrdersClientProps {
  customer: CustomerSession | null;
  initialOrders: CustomerOrder[];
}

export function CustomerOrdersClient({ customer: initialCustomer, initialOrders }: CustomerOrdersClientProps) {
  const { customer: authCustomer, openAuthModal } = useCustomerAuth();
  const [orders] = useState<CustomerOrder[]>(initialOrders);

  // Use client customer if hydrated, else server customer
  const currentCustomer = authCustomer || initialCustomer;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-amber-700 font-bold">My Order History</span>
      </nav>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-black/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 border-2 border-black shadow-[2px_2px_0px_0px_#000] text-xs font-mono text-slate-950 font-bold mb-3">
            <Package className="w-3.5 h-3.5 text-black" />
            <span>CUSTOMER ORDER DASHBOARD</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-[#FFB800] to-yellow-500">History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body max-w-xl mt-1">
            Track your purchases, courier delivery statuses, and order summaries on Prasanthi Craft.
          </p>
        </div>

        {/* Customer Profile Pill (if logged in) */}
        {currentCustomer && (
          <div className="p-3.5 rounded-2xl bg-[#0F131F] border border-white/10 text-white flex items-center gap-3.5 shadow-md shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-[#FFB800] flex items-center justify-center font-heading font-black text-slate-950 text-sm shadow-xs shrink-0">
              {currentCustomer.name
                ? currentCustomer.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "U"}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xs text-white truncate max-w-[160px]">
                  {currentCustomer.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/30">
                  MEMBER
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                {currentCustomer.email}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!currentCustomer ? (
        /* Unauthenticated Gate */
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-black flex items-center justify-center mx-auto text-amber-900 shadow-[2px_2px_0px_0px_#000]">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-2xl text-slate-900">
              Sign In to View Orders
            </h2>
            <p className="text-xs sm:text-sm font-body text-slate-600 max-w-md mx-auto">
              Please log in to your Prasanthi Craft customer account to view your past purchases, track active courier dispatches, and download receipts.
            </p>
          </div>
          <button
            onClick={() => openAuthModal("login")}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Sign In to Customer Account
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-black flex items-center justify-center mx-auto text-slate-500 shadow-[2px_2px_0px_0px_#000]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-2xl text-slate-900">
              No Orders Found Yet
            </h2>
            <p className="text-xs sm:text-sm font-body text-slate-600 max-w-md mx-auto">
              You haven't placed any orders yet. Browse our selection of curriculum textbooks, educational workbooks, fine stationery, and smart tech.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:scale-105 transition cursor-pointer"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => {
            const isPaid = order.paymentStatus.toLowerCase().includes("paid");
            const isDelivered = order.fulfillmentStatus.toLowerCase().includes("fulfilled") || 
                                order.fulfillmentStatus.toLowerCase().includes("delivered");

            return (
              <div 
                key={order.id}
                className="rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden transition hover:shadow-[6px_6px_0px_0px_#FFB800]"
              >
                {/* Order Top Bar */}
                <div className="p-5 sm:p-6 bg-slate-50 border-b-2 border-black flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-lg text-slate-950">
                        {order.id}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        • {order.date}
                      </span>
                    </div>

                    {/* Payment Pill */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                      isPaid 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-amber-50 text-amber-800 border-amber-300"
                    }`}>
                      {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                      <span>{order.paymentStatus}</span>
                    </span>

                    {/* Fulfillment Pill */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                      isDelivered 
                        ? "bg-blue-50 text-blue-800 border-blue-300"
                        : "bg-slate-100 text-slate-800 border-slate-300"
                    }`}>
                      <Truck className="w-3 h-3 text-blue-600" />
                      <span>{order.fulfillmentStatus}</span>
                    </span>
                  </div>

                  {/* Total Amount */}
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                      TOTAL AMOUNT
                    </div>
                    <div className="font-mono font-black text-lg sm:text-xl text-slate-950">
                      LKR {order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Items & Shipping Content */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Items List (8 cols) */}
                  <div className="lg:col-span-8 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                      PURCHASED ITEMS ({order.items.length})
                    </div>

                    <div className="space-y-2.5">
                      {order.items.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 font-bold shrink-0 shadow-2xs">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <Package className="w-5 h-5 text-amber-700" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">
                                {item.name}
                              </h4>
                              <span className="text-[11px] font-mono text-slate-500">
                                Qty: {item.qty}
                              </span>
                            </div>
                          </div>

                          <div className="text-right font-mono font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                            LKR {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Support Details (4 cols) */}
                  <div className="lg:col-span-4 p-4 rounded-2xl bg-amber-50/70 border-2 border-black space-y-4 shadow-[2px_2px_0px_0px_#000]">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 uppercase">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        <span>DELIVERY ADDRESS</span>
                      </div>
                      <div className="text-xs font-body text-slate-700 mt-1.5 leading-relaxed">
                        <p className="font-bold text-slate-900">{order.shippingAddress?.name || currentCustomer.name}</p>
                        <p>{order.shippingAddress?.line1 || "Customer Delivery Address"}</p>
                        <p>{order.shippingAddress?.city || "Sri Lanka"}</p>
                        {order.shippingAddress?.phone && (
                          <p className="font-mono text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-amber-700" />
                            <span>{order.shippingAddress.phone}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-600">Need Order Help?</span>
                      <a 
                        href="tel:+94774230976" 
                        className="font-bold text-amber-800 hover:underline flex items-center gap-1"
                      >
                        <span>Call Support</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Store Navigation Link */}
      <div className="text-center pt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-mono text-amber-800 font-bold hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Browsing Store Products</span>
        </Link>
      </div>
    </div>
  );
}
