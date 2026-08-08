"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  ChevronUp, 
  Edit2, 
  MoreHorizontal, 
  Copy, 
  Plus, 
  AtSign, 
  Hash, 
  Paperclip,
  Image as ImageIcon
} from "lucide-react";
import { PersonIcon } from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";

const mockCustomerDetails: Record<string, any> = {
  "1": {
    name: "Amila Upulitha",
    spent: "Rs 20,560.00",
    ordersCount: "1",
    since: "About 14 hours",
    rfmGroup: "Champions",
    lastOrder: {
      id: "#1017",
      paymentStatus: "Payment pending",
      fulfillmentStatus: "Unfulfilled",
      total: "Rs 20,560.00",
      date: "August 8, 2026 at 11:38 am from Online Store",
      items: [
        {
          name: "BUILDING BLOCKS YEAR 3 SPELLING GRAMMER",
          qty: 3,
          price: "Rs 11,160.00"
        },
        {
          name: "BUILDING BLOCKS YEAR 4 SPELLING GRAMMER",
          qty: 3,
          price: "Rs 9,400.00"
        }
      ]
    },
    contact: {
      email: "upulitha84@gmail.com",
      note: "Will receive notifications in English"
    },
    address: {
      name: "Amila Upulitha",
      line1: "Kandapalathuduwa Welitha Uluvitiya Galle",
      line2: "Uluvitike",
      city: "GALLE",
      postal: "80168",
      country: "Sri Lanka",
      phone: "0718376329"
    }
  }
};

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const customerId = unwrappedParams?.id || "1";

  // Default to Amila Upulitha if mock data not specific
  const customer = mockCustomerDetails[customerId] || {
    name: customerId === "2" ? "Fathima Hirshard" : customerId === "4" ? "E. P. H. De Silva" : "Amila Upulitha",
    spent: "Rs 20,560.00",
    ordersCount: "1",
    since: "About 14 hours",
    rfmGroup: "Champions",
    lastOrder: mockCustomerDetails["1"].lastOrder,
    contact: mockCustomerDetails["1"].contact,
    address: mockCustomerDetails["1"].address
  };

  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans pb-16 max-w-[960px] mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1.5 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/customers"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Customers"
          >
            <PersonIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">{customer.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition shadow-2xs flex items-center gap-1">
            <span>More actions</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
          </button>
          <div className="flex items-center gap-0.5">
            <button className="p-1.5 text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-l-md transition">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-r-md transition">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div className="space-y-0.5">
          <div className="text-[12px] text-[#616161]">Amount spent</div>
          <div className="text-[14px] font-semibold text-[#1a1a1a]">{customer.spent}</div>
        </div>

        <div className="space-y-0.5">
          <div className="text-[12px] text-[#616161] border-b border-dashed border-[#616161] inline-block">Orders</div>
          <div className="text-[14px] font-semibold text-[#1a1a1a]">{customer.ordersCount}</div>
        </div>

        <div className="space-y-0.5">
          <div className="text-[12px] text-[#616161] border-b border-dashed border-[#616161] inline-block">Customer since</div>
          <div className="text-[14px] font-semibold text-[#1a1a1a]">{customer.since}</div>
        </div>

        <div className="space-y-0.5">
          <div className="text-[12px] text-[#616161]">RFM group</div>
          <div className="text-[14px] font-semibold text-[#1a1a1a]">{customer.rfmGroup}</div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Last Order Placed */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Last order placed</h3>

            <div className="border border-[#e1e3e5] rounded-xl p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Link href="/admin/orders/1017" className="text-[14px] font-bold text-[#1a1a1a] hover:underline">
                    {customer.lastOrder.id}
                  </Link>
                  <span className="bg-[#ffd8a8] text-[#3b2000] text-[12px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b2000]" />
                    {customer.lastOrder.paymentStatus}
                  </span>
                  <span className="bg-[#ffe8a3] text-[#3b2000] text-[12px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b2000]" />
                    {customer.lastOrder.fulfillmentStatus}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-[#1a1a1a]">
                  {customer.lastOrder.total}
                </div>
              </div>

              <div className="text-[12px] text-[#616161]">
                {customer.lastOrder.date}
              </div>

              <div className="border-t border-[#f1f2f4] pt-3 space-y-2">
                {customer.lastOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded border border-[#e1e3e5] bg-[#fafafa] flex items-center justify-center text-[#8c8c8c] shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-[#1a1a1a]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[#616161]">x {item.qty}</span>
                      <span className="font-medium text-[#1a1a1a]">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => router.push("/admin/orders")}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition shadow-2xs"
              >
                View all orders
              </button>
              <button
                onClick={() => router.push("/admin/orders/create")}
                className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs"
              >
                Create order
              </button>
            </div>
          </div>

          {/* Card 2: Blocks */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2 text-center">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a] text-left">Blocks</h3>
            <div className="py-2">
              <button className="px-4 py-1.5 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] transition text-[#303030] shadow-2xs inline-flex items-center gap-1">
                <Plus className="w-4 h-4 text-[#616161]" />
                <span>Block</span>
              </button>
            </div>
          </div>

          {/* Card 3: Timeline */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Timeline</h3>

            {/* Comment Input Box */}
            <div className="border border-[#e1e3e5] rounded-xl overflow-hidden bg-white p-3 space-y-3 shadow-2xs">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-[#00ffff] text-[#1a1a1a] font-bold text-[10px] flex items-center justify-center shrink-0">
                  LK
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a comment..."
                  rows={2}
                  className="w-full text-[13px] outline-none resize-none bg-transparent placeholder:text-[#8c8c8c]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#f1f2f4] pt-2">
                <div className="flex items-center gap-2 text-[#616161]">
                  <button className="p-1 hover:bg-[#f6f6f7] rounded"><AtSign className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-[#f6f6f7] rounded"><Hash className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-[#f6f6f7] rounded"><Paperclip className="w-4 h-4" /></button>
                </div>
                <button className="px-3 py-1 text-[12px] font-semibold bg-[#e4e5e7] text-[#8c8c8c] rounded-md hover:bg-[#dcdedf] transition cursor-not-allowed">
                  Post
                </button>
              </div>
            </div>

            <div className="text-[12px] text-[#616161] text-center">
              Only you and other staff can see comments
            </div>

            {/* Activity Feed */}
            <div className="space-y-4 pt-2">
              <div className="text-[12px] font-semibold text-[#616161]">Yesterday</div>

              <div className="space-y-4 pl-3 border-l-2 border-[#e1e3e5] relative">
                {/* Entry 1 */}
                <div className="relative pl-4 space-y-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#616161] absolute -left-[21px] top-1.5 border-2 border-white" />
                  <div className="flex items-center justify-between text-[13px] text-[#1a1a1a] flex-wrap gap-2">
                    <div>
                      Order Confirmation email for order <span className="font-semibold">#1017</span> sent to this customer ({customer.contact.email}).
                    </div>
                    <div className="text-[11px] text-[#616161]">11:38 AM</div>
                  </div>
                  <div>
                    <button className="px-2.5 py-1 text-[12px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] transition text-[#303030] shadow-2xs">
                      View email
                    </button>
                  </div>
                </div>

                {/* Entry 2 */}
                <div className="relative pl-4 space-y-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#616161] absolute -left-[21px] top-1.5 border-2 border-white" />
                  <div className="flex items-center justify-between text-[13px] text-[#1a1a1a] flex-wrap gap-2">
                    <div>
                      This customer placed order <span className="font-semibold">#1017</span> on Online Store (checkout #39104391905522).
                    </div>
                    <div className="text-[11px] text-[#616161]">11:38 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-4">
          {/* Card 1: Customer Details */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Customer</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Information */}
            <div className="space-y-1">
              <div className="text-[12px] font-semibold text-[#1a1a1a]">Contact information</div>
              <div className="flex items-center justify-between text-[13px]">
                <a href={`mailto:${customer.contact.email}`} className="text-[#005bd3] hover:underline">
                  {customer.contact.email}
                </a>
                <button onClick={handleCopyEmail} className="text-[#616161] hover:text-[#1a1a1a]" title="Copy email">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-[12px] text-[#616161]">{customer.contact.note}</div>
            </div>

            {/* Default Address */}
            <div className="border-t border-[#f1f2f4] pt-3 space-y-1 text-[13px] text-[#303030]">
              <div className="text-[12px] font-semibold text-[#1a1a1a]">Default address</div>
              <div>{customer.address.name}</div>
              <div>{customer.address.line1}</div>
              <div>{customer.address.line2}</div>
              <div>{customer.address.city}</div>
              <div>{customer.address.postal}</div>
              <div>{customer.address.country}</div>
              <div>{customer.address.phone}</div>
            </div>

            {/* Marketing Subscriptions */}
            <div className="border-t border-[#f1f2f4] pt-3 space-y-1">
              <div className="text-[12px] font-semibold text-[#1a1a1a]">Marketing subscriptions</div>
              <div className="text-[12px] text-[#616161]">Not subscribed to any channels</div>
            </div>

            {/* Tax Details */}
            <div className="border-t border-[#f1f2f4] pt-3 space-y-1">
              <div className="text-[12px] font-semibold text-[#1a1a1a]">Tax details</div>
              <div className="text-[12px] text-[#616161]">Collect tax</div>
            </div>
          </div>

          {/* Card 2: Store credit */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Store credit</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[12px] text-[#616161]">None</div>
          </div>

          {/* Card 3: Tags */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Tags</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              placeholder=""
              className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1 outline-none focus:border-[#005bd3]"
            />
          </div>

          {/* Card 4: Notes */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[12px] text-[#616161]">None</div>
          </div>
        </div>
      </div>
    </div>
  );
}
