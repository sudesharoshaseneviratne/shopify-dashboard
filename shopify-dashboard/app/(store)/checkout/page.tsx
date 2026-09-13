"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Building2, 
  CheckCircle2, 
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  Phone
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { useCustomerAuth } from "@/lib/store/customerAuthContext";
import { createStoreOrderAction } from "@/app/actions/orders";

export default function StoreCheckoutPage() {
  const { items, totalUsd, discountCode, discountPercent, formatPrice, clearCart } = useCart();
  const { customer, refreshCustomer } = useCustomerAuth();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Form states
  const [shippingName, setShippingName] = useState(customer?.name || "");
  const [shippingEmail, setShippingEmail] = useState(customer?.email || "");
  const [shippingPhone, setShippingPhone] = useState(customer?.phone || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState(customer?.location || "Colombo");

  // Auto-fill if customer logs in or loads
  useEffect(() => {
    if (customer) {
      if (!shippingName && customer.name) setShippingName(customer.name);
      if (!shippingEmail && customer.email) setShippingEmail(customer.email);
      if (!shippingPhone && customer.phone) setShippingPhone(customer.phone);
      if (!shippingCity && customer.location) setShippingCity(customer.location);
    }
  }, [customer]);

  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    orderNumber: number;
    txid: string;
    timestamp: string;
    totalUsd: number;
  } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleConfirmOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (items.length === 0) return;
    if (!shippingName.trim()) {
      setOrderError("Please provide your recipient name.");
      return;
    }
    if (!shippingEmail.trim()) {
      setOrderError("Please provide your email address for order confirmation.");
      return;
    }
    if (!shippingAddress.trim()) {
      setOrderError("Please provide your delivery address.");
      return;
    }

    setIsProcessing(true);
    setOrderError(null);

    const subtotal = items.reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0);
    const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;

    const res = await createStoreOrderAction({
      customerName: shippingName.trim(),
      customerEmail: shippingEmail.trim(),
      shippingAddress: {
        line1: shippingAddress.trim(),
        city: shippingCity.trim() || "Colombo",
        country: "Sri Lanka",
      },
      paymentMethod,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.priceUsd,
        quantity: i.quantity,
      })),
      subtotal,
      discountCode: discountCode || undefined,
      discountAmount,
      total: totalUsd,
    });

    setIsProcessing(false);

    if (res.success && res.orderId && res.txid) {
      setConfirmedOrder({
        orderId: res.orderId,
        orderNumber: res.orderNumber || 1001,
        txid: res.txid,
        timestamp: new Date().toLocaleString(),
        totalUsd,
      });
      setIsConfirmed(true);
      clearCart();
      refreshCustomer().catch(() => {});
    } else {
      setOrderError(res.error || "Failed to process your order. Please try again.");
    }
  };

  if (isConfirmed && confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-lg animate-in zoom-in-95">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span>ORDER #{confirmedOrder.orderNumber} CONFIRMED</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your order has been recorded successfully. Our logistics team is preparing your package for islandwide dispatch within 24 hours.
          </p>
        </div>

        {/* Receipt Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-left font-mono text-xs space-y-4 shadow-sm">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Order Reference:</span>
            <span className="text-slate-900 font-bold">#{confirmedOrder.orderNumber} ({confirmedOrder.orderId})</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Customer Name:</span>
            <span className="text-slate-900 font-semibold">{shippingName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Delivery Destination:</span>
            <span className="text-slate-900 font-semibold">{shippingCity}, Sri Lanka</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Payment Mode:</span>
            <span className="text-amber-700 font-bold uppercase">{paymentMethod}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Total Amount:</span>
            <span className="text-amber-700 font-bold text-sm">
              {formatPrice(confirmedOrder.totalUsd)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fulfillment Status:</span>
            <span className="text-emerald-700 font-bold">Processing (Express Courier Delivery)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:scale-105 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/products"
            className="px-8 py-4 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 font-heading font-bold text-xs uppercase tracking-wider transition bg-white"
          >
            Browse More Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-900 transition">Store</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/cart" className="hover:text-slate-900 transition">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-700 font-bold">Secure Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery Address Form */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-2xl text-slate-900">
              Delivery Information
            </h2>
            <p className="text-xs font-mono text-slate-500 font-medium">
              Please enter your destination details for express doorstep delivery across Sri Lanka.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleConfirmOrder(); }} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Recipient Full Name</label>
              <input
                type="text"
                required
                placeholder="Amila Upulitha"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="customer@gmail.com"
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="077 123 4567"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Delivery Address</label>
              <input
                type="text"
                required
                placeholder="135/79 Neelammahara Road, Maharagama"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">City / District</label>
                <input
                  type="text"
                  required
                  placeholder="Colombo"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Country</label>
                <input
                  type="text"
                  disabled
                  value="Sri Lanka"
                  className="w-full bg-slate-50 border-b-2 border-slate-200 px-4 py-3 text-xs font-mono text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </form>

          {/* Trust badge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-xs font-mono text-slate-600 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Secure SSL Encrypted Checkout. Official warranty and money-back guarantee on all items.</span>
          </div>
        </div>

        {/* Right Column: Payment Method Selection */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm corner-accent-tl corner-accent-br">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Payment Method
            </h2>
            <div className="text-xs font-mono text-slate-500">
              Select your payment mode
            </div>
          </div>

          {/* Payment Method Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`py-2.5 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMethod === "card"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`py-2.5 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMethod === "cod"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Cash on Delivery</span>
            </button>

            <button
              onClick={() => setPaymentMethod("bank")}
              className={`py-2.5 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMethod === "bank"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Bank Transfer</span>
            </button>
          </div>

          {/* Payment Method Details */}
          {paymentMethod === "card" && (
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold pb-2 border-b border-slate-200">
                <span>Credit / Debit Card (Instant Checkout)</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Visa / Mastercard / Amex</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-600 font-semibold">Card Number</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• 4242"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold">CVC / CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Truck className="w-4 h-4" />
                <span>Cash on Delivery (Islandwide)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Pay in cash directly to our delivery courier when the package arrives at your doorstep. Please keep the exact amount ready upon delivery.
              </p>
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <div className="text-slate-800 font-bold">Direct Bank Deposit Details:</div>
              <div className="space-y-1 text-slate-600">
                <div><strong>Bank:</strong> Commercial Bank of Ceylon</div>
                <div><strong>Account Name:</strong> Prasanthi Craft (Pvt) Ltd</div>
                <div><strong>Account Number:</strong> 1000 4589 2314</div>
                <div><strong>Branch:</strong> Maharagama Branch</div>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Please quote your Order Number as payment reference when transferring.
              </p>
            </div>
          )}

          {/* Order Summary in Checkout */}
          <div className="pt-2 border-t border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({items.length}):</span>
              <span>{formatPrice(totalUsd)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount ({discountCode}):</span>
                <span>-{discountPercent}%</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Islandwide Delivery:</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-amber-600">{formatPrice(totalUsd)}</span>
            </div>
          </div>

          {orderError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-600 font-semibold">
              {orderError}
            </div>
          )}

          {/* Submit Action Button */}
          <button
            onClick={() => handleConfirmOrder()}
            disabled={isProcessing || items.length === 0}
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 hover:scale-105 shadow-md shadow-amber-500/20 text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Confirming Your Order...</span>
              </>
            ) : (
              <>
                <span>Complete Order ({formatPrice(totalUsd)})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
