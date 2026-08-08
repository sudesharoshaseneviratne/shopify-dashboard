"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Truck, 
  ChevronDown, 
  MoreHorizontal, 
  Edit2, 
  Package, 
  Check, 
  ExternalLink,
  ChevronUp,
  Clock
} from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { OrderIcon } from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";

// Mock Order database for previews
const mockOrderDetails: Record<string, any> = {
  "1018": {
    id: "#1018",
    date: "August 8, 2026 at 7:44 pm from Online Store",
    paymentStatus: "Payment pending",
    fulfillmentStatus: "Unfulfilled",
    product: {
      name: "iPrimary English Activity Book Year 4",
      price: 3024,
      qty: 1,
      image: "📚"
    },
    subtotal: 3024,
    shippingMethod: "Flat Shipping Rate (0.0 kg: Items 0.0 kg, Package 0.0 kg)",
    shippingPrice: 400,
    total: 3424,
    paid: 0,
    balance: 3424,
    notes: "No notes from customer",
    customer: {
      name: "Manoji Karunaratne",
      ordersCount: "1 order",
      email: "manojikarunaratne7@gmail.com",
      phone: "No phone number",
      shippingAddress: {
        name: "Manoji Karunaratne",
        line1: "658/5",
        line2: "Tri city gardens, Thunhadahena Rd,",
        city: "Korathota,Kaduwela, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 260 5026"
      }
    }
  },
  "1015": {
    id: "#1015",
    date: "Tuesday at 3:57 pm from Online Store",
    paymentStatus: "Payment pending",
    fulfillmentStatus: "Fulfilled",
    product: {
      name: "Abacus Year 1 Workbook 1",
      price: 1600,
      qty: 1,
      image: "📘"
    },
    subtotal: 1600,
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 460,
    total: 2060,
    paid: 0,
    balance: 2060,
    notes: "Please deliver before 5 PM",
    customer: {
      name: "Fathima Hirshard",
      ordersCount: "3 orders",
      email: "hirshard.f@example.com",
      phone: "+94 77 123 4567",
      shippingAddress: {
        name: "Fathima Hirshard",
        line1: "42/1 Galle Road",
        line2: "Colombo 03",
        city: "Colombo, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 123 4567"
      }
    }
  }
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Fallback order data if not found in mock database
  const orderIdClean = id.replace(/%23|#/g, "");
  const order = mockOrderDetails[orderIdClean] || {
    id: `#${orderIdClean}`,
    date: "August 8, 2026 at 7:44 pm from Online Store",
    paymentStatus: "Payment pending",
    fulfillmentStatus: "Unfulfilled",
    product: {
      name: "iPrimary English Activity Book Year 4",
      price: 3024,
      qty: 1,
      image: "📚"
    },
    subtotal: 3024,
    shippingMethod: "Flat Shipping Rate (0.0 kg: Items 0.0 kg, Package 0.0 kg)",
    shippingPrice: 400,
    total: 3424,
    paid: 0,
    balance: 3424,
    notes: "No notes from customer",
    customer: {
      name: "Manoji Karunaratne",
      ordersCount: "1 order",
      email: "manojikarunaratne7@gmail.com",
      phone: "No phone number",
      shippingAddress: {
        name: "Manoji Karunaratne",
        line1: "658/5",
        line2: "Tri city gardens, Thunhadahena Rd,",
        city: "Korathota,Kaduwela, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 260 5026"
      }
    }
  };

  const [isFulfilled, setIsFulfilled] = useState(order.fulfillmentStatus === "Fulfilled");
  const [isPaid, setIsPaid] = useState(order.paid > 0);
  const [isFulfillMenuOpen, setIsFulfillMenuOpen] = useState(false);
  const fulfillMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fulfillMenuRef.current && !fulfillMenuRef.current.contains(event.target as Node)) {
        setIsFulfillMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4 font-sans pb-12 max-w-[960px] mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1 border-b border-transparent">
        {/* Left Title & Status Badges */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/orders"
              className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
              title="Back to Orders"
            >
              <OrderIcon className="w-5 h-5 fill-current text-[#616161]" />
            </Link>
            <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
            <h1 className="text-[20px] font-bold text-[#1a1a1a]">{order.id}</h1>

            {/* Payment Pending Badge */}
            <span className="bg-[#ffd8a8] text-[#3b2000] text-[12px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b2000]" />
              {isPaid ? "Paid" : "Payment pending"}
            </span>

            {/* Fulfillment Badge */}
            <span className="bg-[#fef08a] text-[#854d0e] text-[12px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#854d0e]" />
              {isFulfilled ? "Fulfilled" : "Unfulfilled"}
            </span>
          </div>

          <div className="text-[12px] text-[#616161]">{order.date}</div>
        </div>

        {/* Right Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition">
            Restock
          </button>
          <button className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition">
            Edit
          </button>
          <button className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition flex items-center gap-1">
            <span>More actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
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
          {/* Card 1: Fulfillment Status Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            {/* Status Tag */}
            <div>
              <span className="bg-[#fef9c3] text-[#854d0e] px-2.5 py-1 rounded-md text-[12px] font-semibold inline-flex items-center gap-1.5 border border-[#fef08a]">
                <Clock className="w-3.5 h-3.5 text-[#854d0e]" />
                {isFulfilled ? "Fulfilled" : "Unfulfilled"}
              </span>
            </div>

            {/* Shipping Line Inner Box */}
            <div className="border border-[#e1e3e5] rounded-lg p-3 bg-white flex items-center gap-2.5 text-[13px] text-[#303030]">
              <Truck className="w-4 h-4 text-[#616161]" />
              <span className="font-medium">Flat Shipping Rate</span>
            </div>

            {/* Product Item Row */}
            <div className="border border-[#e1e3e5] rounded-lg p-3.5 flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[18px]">
                  {order.product.image}
                </div>
                <div className="font-semibold text-[#1a1a1a]">{order.product.name}</div>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <span className="text-[#616161]">
                  Rs {order.product.price.toLocaleString()}.00 ×{" "}
                  <span className="bg-[#f1f2f4] px-1.5 py-0.5 rounded text-[#1a1a1a] font-medium">
                    {order.product.qty}
                  </span>
                </span>
                <span className="font-medium text-[#1a1a1a]">
                  Rs {order.product.price.toLocaleString()}.00
                </span>
              </div>
            </div>

            {/* Footer Action Button */}
            <div className="flex items-center justify-end pt-1 relative" ref={fulfillMenuRef}>
              <div className="inline-flex rounded-md shadow-2xs">
                <button
                  onClick={() => {
                    setIsFulfilled(!isFulfilled);
                    setIsFulfillMenuOpen(false);
                  }}
                  className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-l-md transition"
                >
                  {isFulfilled ? "Mark as unfulfilled" : "Mark as fulfilled"}
                </button>
                <button
                  onClick={() => setIsFulfillMenuOpen(!isFulfillMenuOpen)}
                  className="px-2 py-1.5 bg-[#303030] text-white hover:bg-[#4a4a4a] rounded-r-md border-l border-[#3a3a3a] transition"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Fulfillment Actions Dropdown Popover (Matching Screenshot 1) */}
              {isFulfillMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-[190px] bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in duration-100 flex flex-col gap-0.5 text-[13px]">
                  <button
                    onClick={() => {
                      setIsFulfilled(false);
                      setIsFulfillMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                  >
                    Mark as in progress
                  </button>
                  <button
                    onClick={() => {
                      setIsFulfilled(false);
                      setIsFulfillMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition font-medium"
                  >
                    Mark as on hold
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Payment Pending Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#ffe8cc] text-[#994d00] px-2.5 py-1 rounded-md text-[12px] font-semibold inline-flex items-center gap-1.5 border border-[#ffd8a8]">
                <Clock className="w-3.5 h-3.5 text-[#994d00]" />
                {isPaid ? "Paid" : "Payment pending"}
              </span>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Breakdown Inner Box */}
            <div className="border border-[#e1e3e5] rounded-lg p-4 space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between text-[#303030]">
                <span>Subtotal</span>
                <span className="text-[#616161]">1 item</span>
                <span className="font-medium text-[#1a1a1a]">Rs{order.subtotal.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Shipping</span>
                <span className="text-[#616161] text-[12px]">{order.shippingMethod}</span>
                <span className="font-medium text-[#1a1a1a]">Rs{order.shippingPrice.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between font-bold text-[14px] text-[#1a1a1a] pt-1">
                <span>Total</span>
                <span>Rs{order.total.toLocaleString()}.00</span>
              </div>

              <hr className="border-[#e1e3e5]" />

              <div className="flex items-center justify-between text-[#303030]">
                <span>Paid</span>
                <span>Rs{isPaid ? order.total.toLocaleString() : "0"}.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Balance</span>
                <span className="font-semibold text-[#1a1a1a]">
                  Rs{isPaid ? "0.00" : `${order.total.toLocaleString()}.00`}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition">
                Send invoice
              </button>
              <button
                onClick={() => setIsPaid(!isPaid)}
                className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs"
              >
                {isPaid ? "Mark as unpaid" : "Mark as paid"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-4">
          {/* Notes Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[13px] text-[#616161]">{order.notes}</div>
          </div>

          {/* Customer Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Customer</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <Link href="/admin/customers" className="text-[13px] font-medium text-[#005bd3] hover:underline block">
                {order.customer.name}
              </Link>
              <div className="text-[12px] text-[#005bd3]">{order.customer.ordersCount}</div>
            </div>

            {/* Contact Information */}
            <div className="space-y-1 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Contact information</h4>
              <div className="text-[13px] text-[#005bd3] hover:underline cursor-pointer truncate">
                {order.customer.email}
              </div>
              <div className="text-[12px] text-[#616161]">{order.customer.phone}</div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-1 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Shipping address</h4>
              <div className="text-[13px] text-[#303030] space-y-0.5 leading-snug">
                <div>{order.customer.shippingAddress.name}</div>
                <div>{order.customer.shippingAddress.line1}</div>
                <div>{order.customer.shippingAddress.line2}</div>
                <div>{order.customer.shippingAddress.city}</div>
                <div>{order.customer.shippingAddress.country}</div>
                <div>{order.customer.shippingAddress.phone}</div>
              </div>
              <div className="pt-1">
                <a href="#" className="text-[12px] text-[#005bd3] hover:underline font-medium">
                  View map
                </a>
              </div>
            </div>

            {/* Billing Address */}
            <div className="space-y-1 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Billing address</h4>
              <div className="text-[13px] text-[#616161]">Same as shipping address</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
