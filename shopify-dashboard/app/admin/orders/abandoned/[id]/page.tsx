"use client";

import { use, useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  ShoppingCart, 
  ExternalLink,
  MessageSquare,
  Check
} from "lucide-react";

const mockAbandonedDetails: Record<string, any> = {
  "39106630222066": {
    id: "#39106630222066",
    subtitle: "Sri Lanka, August 8, 2026 at 7:52 pm",
    recoveryStatus: "Not Recovered",
    channel: "Online Store",
    product: {
      name: "iPrimary English Activity Book Year 4",
      status: "Pre-order",
      price: 3024,
      qty: 1,
      image: "📚"
    },
    subtotal: 3024,
    shippingMethod: "Flat Shipping Rate (0.0 kg)",
    shippingPrice: 400,
    estimatedTax: 0,
    total: 3424,
    customer: {
      name: "Manoji Karunaratne",
      ordersCount: "1 order",
      email: "manojikarunaratne7@gmail.com",
      accountStatus: "No account",
      shippingAddress: {
        name: "Manoji Karunaratne",
        line1: "658/5",
        line2: "Tri city gardens",
        line3: "Thunhadahena Rd",
        city: "Korathota Kaduwela",
        country: "Sri Lanka",
        phone: "0772605026"
      }
    }
  }
};

export default function AbandonedCheckoutDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const checkoutIdClean = id.replace(/%23|#/g, "");
  
  const checkout = mockAbandonedDetails[checkoutIdClean] || {
    id: `#${checkoutIdClean}`,
    subtitle: "Sri Lanka, August 8, 2026 at 7:52 pm",
    recoveryStatus: "Not Recovered",
    channel: "Online Store",
    product: {
      name: "iPrimary English Activity Book Year 4",
      status: "Pre-order",
      price: 3024,
      qty: 1,
      image: "📚"
    },
    subtotal: 3024,
    shippingMethod: "Flat Shipping Rate (0.0 kg)",
    shippingPrice: 400,
    estimatedTax: 0,
    total: 3424,
    customer: {
      name: "Manoji Karunaratne",
      ordersCount: "1 order",
      email: "manojikarunaratne7@gmail.com",
      accountStatus: "No account",
      shippingAddress: {
        name: "Manoji Karunaratne",
        line1: "658/5",
        line2: "Tri city gardens",
        line3: "Thunhadahena Rd",
        city: "Korathota Kaduwela",
        country: "Sri Lanka",
        phone: "0772605026"
      }
    }
  };

  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans pb-12 max-w-[960px] mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
        {/* Left Title & Status Badge */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/orders/abandoned"
              className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
              title="Back to Abandoned Checkouts"
            >
              <ShoppingCart className="w-5 h-5 text-[#303030]" />
            </Link>
            <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
            <h1 className="text-[20px] font-bold text-[#1a1a1a]">{checkout.id}</h1>

            <span className="bg-[#ffe8cc] text-[#994d00] text-[12px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center border border-[#ffd8a8]">
              {checkout.recoveryStatus}
            </span>
          </div>
          <div className="text-[12px] text-[#616161] pl-0.5">{checkout.subtitle}</div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition">
            Print
          </button>
          <div className="flex items-center gap-0.5 border border-[#c9cccf] rounded-md bg-white p-0.5">
            <button className="p-1 hover:bg-[#f6f6f7] text-[#616161] rounded">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:bg-[#f6f6f7] text-[#616161] rounded">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Checkout Details Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f1f2f4] pb-3">
              <div>
                <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Checkout details</h3>
                <div className="text-[12px] text-[#616161]">From {checkout.channel}</div>
              </div>
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 text-[12px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] transition inline-flex items-center gap-1.5 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#008060]" /> : <Copy className="w-3.5 h-3.5 text-[#616161]" />}
                <span>{copied ? "Copied!" : "Copy checkout URL"}</span>
              </button>
            </div>

            {/* Product Item Row */}
            <div className="border border-[#e1e3e5] rounded-lg p-3.5 flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[18px]">
                  {checkout.product.image}
                </div>
                <div>
                  <div className="font-semibold text-[#1a1a1a]">{checkout.product.name}</div>
                  <div className="text-[12px] text-[#616161]">Status: {checkout.product.status}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <span className="text-[#616161]">
                  Rs {checkout.product.price.toLocaleString()}.00 ×{" "}
                  <span className="bg-[#f1f2f4] px-1.5 py-0.5 rounded text-[#1a1a1a] font-medium">
                    {checkout.product.qty}
                  </span>
                </span>
                <span className="font-medium text-[#1a1a1a]">
                  Rs {checkout.product.price.toLocaleString()}.00
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 text-[13px] pt-1">
              <div className="flex items-center justify-between text-[#303030]">
                <span>Subtotal</span>
                <span className="text-[#616161]">1 item</span>
                <span className="font-medium text-[#1a1a1a]">Rs {checkout.subtotal.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Shipping</span>
                <span className="text-[#616161] text-[12px]">{checkout.shippingMethod}</span>
                <span className="font-medium text-[#1a1a1a]">Rs {checkout.shippingPrice.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Estimated tax</span>
                <span className="font-medium text-[#1a1a1a]">Rs 0.00</span>
              </div>

              <div className="flex items-center justify-between font-bold text-[14px] text-[#1a1a1a] pt-1 border-t border-[#f1f2f4]">
                <span>Total</span>
                <span>Rs {checkout.total.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between font-bold text-[13px] text-[#1a1a1a] pt-2">
                <span>To be paid by customer</span>
                <span>Rs {checkout.total.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Card 2: Automations Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div>
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Automations</h3>
              <div className="text-[12px] text-[#616161]">
                Automations triggered by this abandoned checkout.{" "}
                <a href="#" className="text-[#005bd3] hover:underline">
                  Learn more
                </a>
              </div>
            </div>

            <div className="border border-[#e1e3e5] rounded-lg p-3 space-y-3 bg-white text-[13px]">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#005bd3] hover:underline cursor-pointer">
                  Recover abandoned checkout
                </span>
                <button className="px-2.5 py-1 text-[12px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] transition">
                  View runs
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#f1f2f4]">
                <div className="flex items-center gap-2 text-[#303030]">
                  <MessageSquare className="w-4 h-4 text-[#616161]" />
                  <span>You left items at checkout</span>
                </div>
                <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-medium px-2 py-0.5 rounded">
                  Not sent
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Notes Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note to this checkout"
                className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] transition bg-white"
              />
              <div className="flex justify-end">
                <button
                  disabled={!note.trim()}
                  className="px-3.5 py-1.5 text-[12px] font-medium bg-[#e4e5e7] text-[#8c8c8c] disabled:opacity-70 rounded-md transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-4">
          {/* Customer Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Customer</h3>

            <div className="space-y-0.5">
              <Link href="/admin/customers" className="text-[13px] font-medium text-[#005bd3] hover:underline block">
                {checkout.customer.name}
              </Link>
              <div className="text-[12px] text-[#005bd3]">{checkout.customer.ordersCount}</div>
            </div>

            {/* Contact Information */}
            <div className="space-y-0.5 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Contact information</h4>
              <div className="text-[13px] text-[#005bd3] hover:underline cursor-pointer truncate">
                {checkout.customer.email}
              </div>
              <div className="text-[12px] text-[#616161]">{checkout.customer.accountStatus}</div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-0.5 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Shipping address</h4>
              <div className="text-[13px] text-[#303030] space-y-0.5 leading-snug">
                <div>{checkout.customer.shippingAddress.name}</div>
                <div>{checkout.customer.shippingAddress.line1}</div>
                <div>{checkout.customer.shippingAddress.line2}</div>
                <div>{checkout.customer.shippingAddress.line3}</div>
                <div>{checkout.customer.shippingAddress.city}</div>
                <div>{checkout.customer.shippingAddress.country}</div>
                <div>{checkout.customer.shippingAddress.phone}</div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-0.5 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Billing address</h4>
              <div className="text-[13px] text-[#616161]">Same as shipping address</div>
            </div>

            {/* Marketing Subscriptions */}
            <div className="space-y-0.5 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Marketing subscriptions</h4>
              <div className="text-[12px] text-[#616161]">Not subscribed to any channels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
