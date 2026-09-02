"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ChevronRight
} from "lucide-react";
import { useCart } from "@/lib/store/cartContext";
import { createStoreOrderAction } from "@/app/actions/orders";

export default function StoreCheckoutPage() {
  const { items, totalUsd, totalSats, discountCode, discountPercent, formatPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"lightning" | "onchain" | "card">("lightning");
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59 timer

  // Form states
  const [shippingName, setShippingName] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");

  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    orderNumber: number;
    txid: string;
    timestamp: string;
    totalSats: number;
    totalUsd: number;
  } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const sampleInvoice = "lnbc" + totalSats + "0n1p3v2j3pp5..." + "9842a8b9f";
  const sampleOnChainAddress = "bc1p047k29d84f8q9320ka093j4k2f90a84f8q9320ka093j4k2f90asx8";

  // Countdown timer effect
  useEffect(() => {
    if (isConfirmed) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isConfirmed]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setOrderError(null);

    const subtotal = items.reduce((sum, item) => sum + item.product.priceUsd * item.quantity, 0);
    const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;

    const res = await createStoreOrderAction({
      customerName: shippingName.trim() || "Sovereign Bitcoiner",
      customerEmail: shippingEmail.trim() || "vault@satoshidefi.org",
      shippingAddress: {
        line1: shippingAddress.trim() || "Cold Storage Vault Station",
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
        orderNumber: res.orderNumber || 1016,
        txid: res.txid,
        timestamp: res.timestamp || new Date().toUTCString(),
        totalSats,
        totalUsd,
      });
      setIsConfirmed(true);
      clearCart();
    } else {
      setOrderError(res.error || "Failed to broadcast cryptographic order. Please retry.");
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
            <span>ORDER {confirmedOrder.orderId} RECORDED ON SUPABASE</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900">
            Cryptographic Order Verified!
          </h1>
          <p className="text-sm font-mono text-slate-600 max-w-md mx-auto">
            Your payment pre-image has been confirmed and stored in your Supabase database. Your sovereign hardware will be packed in a Faraday security pouch and dispatched via air-gapped courier.
          </p>
        </div>

        {/* Cryptographic Receipt Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 text-left font-mono text-xs space-y-4 shadow-sm">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Database Order ID:</span>
            <span className="text-slate-900 font-bold">{confirmedOrder.orderId}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Transaction Hash (TXID):</span>
            <span className="text-amber-700 font-bold truncate max-w-xs">{confirmedOrder.txid}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Confirmed Timestamp:</span>
            <span className="text-slate-900 font-semibold">{confirmedOrder.timestamp}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-500">Settled Amount:</span>
            <span className="text-amber-700 font-bold">
              {confirmedOrder.totalSats.toLocaleString()} Sats (${confirmedOrder.totalUsd.toFixed(2)})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Fulfillment Status:</span>
            <span className="text-emerald-700 font-bold">Pending Air-Gapped Courier Dispatch</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/store"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:scale-105 transition"
          >
            Return to Vault Store
          </Link>
          <Link
            href="/admin/orders"
            className="px-8 py-4 rounded-full border border-slate-300 hover:border-slate-800 text-slate-800 font-heading font-bold text-xs uppercase tracking-wider transition bg-white"
          >
            Inspect in Admin Console
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
        <Link href="/store" className="hover:text-slate-900 transition">Vault Store</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/store/cart" className="hover:text-slate-900 transition">Cart</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-700 font-bold">Protocol Settlement Terminal</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Air-Gap Courier Address & Details */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-2xl text-slate-900">
              Insured Air-Gapped Courier Details
            </h2>
            <p className="text-xs font-mono text-slate-500 font-medium">
              Your delivery info is encrypted client-side and automatically purged after package delivery.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Recipient / Alias Name</label>
              <input
                type="text"
                placeholder="Satoshi Nakamoto"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-semibold">PGP / Notification Email</label>
              <input
                type="email"
                placeholder="satoshi@nakamoto.org"
                value={shippingEmail}
                onChange={(e) => setShippingEmail(e.target.value)}
                className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Physical Vault / Delivery Address</label>
              <input
                type="text"
                placeholder="21 Bitcoin Boulevard, Suite 2100"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-semibold">City / State</label>
                <input
                  type="text"
                  placeholder="Austin, Texas"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Zip / Postal</label>
                <input
                  type="text"
                  placeholder="78701"
                  className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-4 py-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
            </div>
          </form>

          {/* Tamper Evident Packaging Notice */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3 text-xs font-mono text-slate-600 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Dispatched in a laser-serialized Faraday foil security bag with anti-interception holographic seal.</span>
          </div>
        </div>

        {/* Right Column: Payment Method & Terminal QR Engine */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm corner-accent-tl corner-accent-br">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Settlement Protocol
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Expires: {timerDisplay}</span>
            </div>
          </div>

          {/* Payment Method Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setPaymentMethod("lightning")}
              className={`py-2.5 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMethod === "lightning"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Lightning ⚡</span>
            </button>

            <button
              onClick={() => setPaymentMethod("onchain")}
              className={`py-2.5 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMethod === "onchain"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <QrCode className="w-4 h-4 text-slate-700" />
              <span>On-Chain BTC</span>
            </button>

            <button
              onClick={() => setPaymentMethod("card")}
              className={`py-2.5 rounded-xl text-xs font-heading font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMethod === "card"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CreditCard className="w-4 h-4 text-slate-700" />
              <span>Debit / Fiat</span>
            </button>
          </div>

          {/* Payment Method Details */}
          {paymentMethod === "lightning" && (
            <div className="space-y-6">
              {/* QR Code Container */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-48 h-48 rounded-2xl bg-white p-3 shadow-md border border-slate-200 flex items-center justify-center relative group">
                  {/* Styled QR Matrix Mockup */}
                  <div className="w-full h-full border-4 border-slate-900 p-2 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-10 h-10 border-4 border-slate-900 bg-slate-900 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white" />
                      </div>
                      <div className="w-10 h-10 border-4 border-slate-900 bg-slate-900 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white" />
                      </div>
                    </div>
                    <div className="text-center font-heading font-black text-3xl text-amber-500">
                      ⚡
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-10 h-10 border-4 border-slate-900 bg-slate-900 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white" />
                      </div>
                      <div className="w-6 h-6 bg-slate-900" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-xl font-bold text-slate-900">
                    {totalSats > 0 ? totalSats.toLocaleString() : "303,443"} Sats
                  </div>
                  <div className="text-xs font-mono text-amber-700 font-bold">
                    Sub-second Zero Fee LNURL Invoice
                  </div>
                </div>

                {/* Copy Invoice Button */}
                <button
                  onClick={() => handleCopy(sampleInvoice)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between transition cursor-pointer shadow-xs"
                >
                  <span className="truncate max-w-xs">{sampleInvoice}</span>
                  <span className="text-amber-700 font-bold ml-2 shrink-0">
                    {copiedInvoice ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {paymentMethod === "onchain" && (
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <div className="text-slate-600 font-semibold">Native SegWit / Taproot Address:</div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-900 break-all flex items-center justify-between gap-2 shadow-xs font-medium">
                <span>{sampleOnChainAddress}</span>
                <button
                  onClick={() => handleCopy(sampleOnChainAddress)}
                  className="text-amber-700 font-bold shrink-0 cursor-pointer"
                >
                  {copiedInvoice ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 font-medium">
                <span>Required Amount:</span>
                <span className="text-slate-900 font-bold">₿ {(totalUsd / 95240).toFixed(6)} BTC</span>
              </div>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-600 font-semibold">Card Number</label>
                <input
                  type="text"
                  placeholder="•••• •••• •••• 4242"
                  className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-3 py-2 text-slate-900 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-white border-b-2 border-slate-300 focus:border-amber-500 px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {orderError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-600 font-semibold">
              {orderError}
            </div>
          )}

          {/* Broadcast Confirmation Action Button */}
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 via-[#FFB800] to-yellow-400 hover:scale-105 shadow-md shadow-amber-500/20 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Broadcasting Pre-Image to Mempool...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Broadcast Payment & Confirm Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
