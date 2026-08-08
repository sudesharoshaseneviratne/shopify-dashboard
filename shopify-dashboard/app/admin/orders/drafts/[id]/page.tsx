"use client";

import { use } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  MoreHorizontal, 
  Globe, 
  Edit2
} from "lucide-react";
import { OrderDraftIcon } from "@shopify/polaris-icons";

const mockDraftDetails: Record<string, any> = {
  "D2": {
    id: "#D2",
    updatedInfo: "Updated by Learnix LK July 27, 7:54 pm",
    completedDate: "Jul 27, 2026, 7:54 PM",
    isCompleted: true,
    product: {
      name: "Junior Artist 5 : Version 1 : International Edition",
      price: 2036,
      qty: 1,
      image: "🎨"
    },
    subtotal: 2036,
    discount: 0,
    shippingMethod: "Custom",
    shippingPrice: 400,
    taxStatus: "Customer exempt",
    total: 2436,
    notes: "No notes",
    customer: {
      name: "E. P. H. De Silva",
      ordersCount: "1 order",
      taxExempt: "Customer is tax-exempt",
      email: "No email provided",
      phone: "+94 77 426 1514",
      shippingAddress: {
        name: "E. P. H. De Silva",
        line1: "62, Pallegunnapana,",
        line2: "Polgolla",
        city: "Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 428 1514"
      }
    }
  },
  "D3": {
    id: "#D3",
    updatedInfo: "Updated by Learnix LK Wednesday at 1:46 pm",
    completedDate: "Wednesday at 1:46 PM",
    isCompleted: true,
    product: {
      name: "Abacus Year 2 Workbook 2",
      price: 47000,
      qty: 1,
      image: "📘"
    },
    subtotal: 47000,
    discount: 0,
    shippingMethod: "Flat Shipping Rate",
    shippingPrice: 0,
    taxStatus: "Not calculated",
    total: 47000,
    notes: "Urgent delivery requested",
    customer: {
      name: "K.D.J Tharini Kumaragama",
      ordersCount: "4 orders",
      taxExempt: "",
      email: "tharini.k@example.com",
      phone: "+94 71 888 9999",
      shippingAddress: {
        name: "K.D.J Tharini Kumaragama",
        line1: "15/3 Kandy Road",
        line2: "Peradeniya",
        city: "Kandy, Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 71 888 9999"
      }
    }
  }
};

export default function DraftDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const draftIdClean = id.replace(/%23|#/g, "");
  
  const draft = mockDraftDetails[draftIdClean] || {
    id: `#${draftIdClean}`,
    updatedInfo: "Updated by Learnix LK July 27, 7:54 pm",
    completedDate: "Jul 27, 2026, 7:54 PM",
    isCompleted: true,
    product: {
      name: "Junior Artist 5 : Version 1 : International Edition",
      price: 2036,
      qty: 1,
      image: "🎨"
    },
    subtotal: 2036,
    discount: 0,
    shippingMethod: "Custom",
    shippingPrice: 400,
    taxStatus: "Customer exempt",
    total: 2436,
    notes: "No notes",
    customer: {
      name: "E. P. H. De Silva",
      ordersCount: "1 order",
      taxExempt: "Customer is tax-exempt",
      email: "No email provided",
      phone: "+94 77 426 1514",
      shippingAddress: {
        name: "E. P. H. De Silva",
        line1: "62, Pallegunnapana,",
        line2: "Polgolla",
        city: "Sri Lanka",
        country: "Sri Lanka",
        phone: "+94 77 428 1514"
      }
    }
  };

  return (
    <div className="space-y-4 font-sans pb-12 max-w-[960px] mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
        {/* Left Title */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders/drafts"
              className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
              title="Back to Drafts"
            >
              <OrderDraftIcon className="w-5 h-5 fill-current text-[#616161]" />
            </Link>
            <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
            <h1 className="text-[20px] font-bold text-[#1a1a1a]">{draft.id}</h1>
          </div>
          <div className="text-[12px] text-[#616161] pl-0.5">{draft.updatedInfo}</div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition">
            Duplicate
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

      {/* Top Banner Alert (Completed) */}
      {draft.isCompleted && (
        <div className="rounded-xl overflow-hidden shadow-2xs">
          <div className="bg-[#008060] text-white px-4 py-2.5 text-[14px] font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-white stroke-[3]" />
            <span>Completed</span>
          </div>
          <div className="bg-[#f1f2f4] border border-t-0 border-[#e1e3e5] px-4 py-3 text-[13px] text-[#303030]">
            Order created on {draft.completedDate}. You can view the order or create a new order.
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Products Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Products</h3>

            <div className="border border-[#e1e3e5] rounded-lg p-3.5 flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[18px]">
                  {draft.product.image}
                </div>
                <div className="font-semibold text-[#1a1a1a]">{draft.product.name}</div>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <span className="text-[#616161]">
                  Rs {draft.product.price.toLocaleString()}.00 ×{" "}
                  <span className="bg-[#f1f2f4] px-1.5 py-0.5 rounded text-[#1a1a1a] font-medium">
                    {draft.product.qty}
                  </span>
                </span>
                <span className="font-medium text-[#1a1a1a]">
                  Rs {draft.product.price.toLocaleString()}.00
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Breakdown Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Payment</h3>

            <div className="border border-[#e1e3e5] rounded-lg p-4 space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between text-[#303030]">
                <span>Subtotal</span>
                <span className="text-[#616161]">1 item</span>
                <span className="font-medium text-[#1a1a1a]">Rs {draft.subtotal.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Discount</span>
                <span className="text-[#616161]">—</span>
                <span className="font-medium text-[#1a1a1a]">Rs 0.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Shipping</span>
                <span className="text-[#616161]">{draft.shippingMethod}</span>
                <span className="font-medium text-[#1a1a1a]">Rs {draft.shippingPrice.toLocaleString()}.00</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Estimated tax</span>
                <span className="text-[#616161]">{draft.taxStatus}</span>
                <span></span>
              </div>

              <div className="flex items-center justify-between font-bold text-[14px] text-[#1a1a1a] pt-1">
                <span>Total</span>
                <span>Rs {draft.total.toLocaleString()}.00</span>
              </div>
            </div>

            <div className="text-[12px] text-[#616161] pt-1">
              Payment due when invoice is sent.
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-4">
          {/* Notes Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
            <div className="text-[13px] text-[#616161]">{draft.notes}</div>
          </div>

          {/* Customer Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Customer</h3>

            <div className="space-y-1">
              <Link href="/admin/customers" className="text-[13px] font-medium text-[#005bd3] hover:underline block">
                {draft.customer.name}
              </Link>
              <div className="text-[12px] text-[#005bd3]">{draft.customer.ordersCount}</div>
              {draft.customer.taxExempt && (
                <div className="text-[12px] text-[#616161]">{draft.customer.taxExempt}</div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-1 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Contact information</h4>
              <div className="text-[13px] text-[#616161]">{draft.customer.email}</div>
              <div className="text-[12px] text-[#303030]">{draft.customer.phone}</div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-1 pt-1 border-t border-[#f1f2f4]">
              <h4 className="text-[12px] font-semibold text-[#1a1a1a]">Shipping address</h4>
              <div className="text-[13px] text-[#303030] space-y-0.5 leading-snug">
                <div>{draft.customer.shippingAddress.name}</div>
                <div>{draft.customer.shippingAddress.line1}</div>
                <div>{draft.customer.shippingAddress.line2}</div>
                <div>{draft.customer.shippingAddress.city}</div>
                <div>{draft.customer.shippingAddress.phone}</div>
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

          {/* Markets Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Markets</h3>
            <div className="inline-flex items-center gap-1.5 bg-[#f1f2f4] px-2.5 py-1 rounded-md text-[13px] text-[#303030] font-medium">
              <Globe className="w-3.5 h-3.5 text-[#616161]" />
              <span>Sri Lanka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
