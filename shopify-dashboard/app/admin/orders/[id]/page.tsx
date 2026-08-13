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
  Clock,
  Plus,
  Search,
  Printer,
  Archive,
  Eye,
  X,
  Send,
  DollarSign,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/admin/Badge";
import { OrderIcon } from "@shopify/polaris-icons";
import { getOrderDetail, initialOrdersList } from "@/lib/admin/ordersData";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const order = getOrderDetail(id);

  const [isFulfilled, setIsFulfilled] = useState(order.fulfillmentStatus === "Fulfilled");
  const [isPaid, setIsPaid] = useState(order.paymentStatus === "Paid");
  const [isFulfillMenuOpen, setIsFulfillMenuOpen] = useState(false);
  const fulfillMenuRef = useRef<HTMLDivElement>(null);

  const [isHeaderMoreActionsOpen, setIsHeaderMoreActionsOpen] = useState(false);
  const [actionsSearchQuery, setActionsSearchQuery] = useState("");
  const headerActionsRef = useRef<HTMLDivElement>(null);

  // New Modals & Timeline States
  const [isFulfillModalOpen, setIsFulfillModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("TRK-98421054");
  const [carrier, setCarrier] = useState("Sri Lanka Post");
  const [refundReason, setRefundReason] = useState("Customer request");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Timeline Comments
  const [comments, setComments] = useState<
    Array<{ id: string; author: string; text: string; time: string }>
  >([
    { id: "1", author: "Learnix LK", text: "Order confirmed and verified with customer.", time: "Today at 2:15 pm" },
  ]);
  const [newCommentText, setNewCommentText] = useState("");

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "You",
        text: newCommentText.trim(),
        time: "Just now",
      },
    ]);
    setNewCommentText("");
    showToast("Staff note added to timeline");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state if id param changes
  useEffect(() => {
    setIsFulfilled(order.fulfillmentStatus === "Fulfilled");
    setIsPaid(order.paymentStatus === "Paid");
  }, [id, order.fulfillmentStatus, order.paymentStatus]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fulfillMenuRef.current && !fulfillMenuRef.current.contains(event.target as Node)) {
        setIsFulfillMenuOpen(false);
      }
      if (headerActionsRef.current && !headerActionsRef.current.contains(event.target as Node)) {
        setIsHeaderMoreActionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Up / Down order navigation
  const currentIndex = initialOrdersList.findIndex(
    (o) => o.id.replace("#", "") === order.cleanId
  );

  const handlePrevOrder = () => {
    if (currentIndex > 0) {
      const prevId = initialOrdersList[currentIndex - 1].id.replace("#", "");
      router.push(`/admin/orders/${prevId}`);
    }
  };

  const handleNextOrder = () => {
    if (currentIndex >= 0 && currentIndex < initialOrdersList.length - 1) {
      const nextId = initialOrdersList[currentIndex + 1].id.replace("#", "");
      router.push(`/admin/orders/${nextId}`);
    }
  };

  const totalItemsCount = order.products.reduce((acc, p) => acc + p.qty, 0);

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

            {/* Payment Status Badge */}
            <Badge
              variant={isPaid ? "neutral" : "warning"}
              icon={isPaid ? "square" : "ring"}
            >
              {isPaid ? "Paid" : "Payment pending"}
            </Badge>

            {/* Fulfillment Status Badge */}
            <Badge
              variant={isFulfilled ? "neutral" : "amber"}
              icon={isFulfilled ? "square" : "ring"}
            >
              {isFulfilled ? "Fulfilled" : "Unfulfilled"}
            </Badge>

            {/* Archived Status Badge */}
            {order.status === "Archived" && (
              <Badge variant="neutral" icon="none">
                Archived
              </Badge>
            )}

            {/* Due Badge */}
            {order.due && (
              <Badge variant="danger" icon="none">
                Due
              </Badge>
            )}
          </div>

          <div className="text-[12px] text-[#616161]">{order.date}</div>
        </div>

        {/* Right Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition">
            Restock
          </button>
          <Link
            href={`/admin/orders/${order.cleanId}/edit`}
            className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition inline-flex items-center justify-center"
          >
            Edit
          </Link>

          {/* More Actions Dropdown Popover (Matching Screenshot 2) */}
          <div className="relative" ref={headerActionsRef}>
            <button
              onClick={() => setIsHeaderMoreActionsOpen(!isHeaderMoreActionsOpen)}
              className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition flex items-center gap-1"
            >
              <span>More actions</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#616161]" />
            </button>

            {isHeaderMoreActionsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-[220px] bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-1 z-50 animate-in fade-in duration-100 divide-y divide-[#f1f2f4] text-[12.5px]">
                {/* Search Bar */}
                <div className="p-1 pb-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search actions"
                      value={actionsSearchQuery}
                      onChange={(e) => setActionsSearchQuery(e.target.value)}
                      className="w-full bg-[#f6f6f7] border border-[#e1e3e5] rounded-md pl-7 pr-2 py-1 text-[12px] text-[#1a1a1a] focus:outline-none focus:bg-white focus:border-[#1a1a1a]"
                    />
                  </div>
                </div>

                {/* Main Action Items */}
                <div className="py-1 space-y-0.5">
                  {("duplicate".includes(actionsSearchQuery.toLowerCase())) && (
                    <button
                      onClick={() => {
                        setIsHeaderMoreActionsOpen(false);
                        router.push("/admin/orders/create");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#616161]" />
                      <span>Duplicate</span>
                    </button>
                  )}

                  {("cancel order".includes(actionsSearchQuery.toLowerCase())) && (
                    <button
                      onClick={() => {
                        setIsHeaderMoreActionsOpen(false);
                        alert("Order cancellation initiated.");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                    >
                      <X className="w-3.5 h-3.5 text-[#616161]" />
                      <span>Cancel order</span>
                    </button>
                  )}

                  {("archive".includes(actionsSearchQuery.toLowerCase())) && (
                    <button
                      onClick={() => {
                        setIsHeaderMoreActionsOpen(false);
                        alert("Order archived.");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                    >
                      <Archive className="w-3.5 h-3.5 text-[#616161]" />
                      <span>Archive</span>
                    </button>
                  )}

                  {("view order status page".includes(actionsSearchQuery.toLowerCase())) && (
                    <button
                      onClick={() => {
                        setIsHeaderMoreActionsOpen(false);
                        alert("Opening order status page...");
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#616161]" />
                      <span>View order status page</span>
                    </button>
                  )}
                </div>

                {/* Print Section */}
                <div className="py-1 space-y-0.5">
                  <div className="px-2.5 pt-1.5 pb-0.5 text-[11px] font-medium text-[#616161]">Print</div>
                  <button
                    onClick={() => {
                      setIsHeaderMoreActionsOpen(false);
                      window.print();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#616161]" />
                    <span>Print order page</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsHeaderMoreActionsOpen(false);
                      window.print();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#616161]" />
                    <span>Print packing slips</span>
                  </button>
                </div>

                {/* Apps Section */}
                <div className="py-1 space-y-0.5">
                  <div className="px-2.5 pt-1.5 pb-0.5 text-[11px] font-medium text-[#616161]">Apps</div>
                  <button
                    onClick={() => {
                      setIsHeaderMoreActionsOpen(false);
                      alert("Running Flow automation...");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                  >
                    <div className="w-4 h-4 rounded bg-[#008060] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      F
                    </div>
                    <span>Run Flow automation</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsHeaderMoreActionsOpen(false);
                      alert("Searching Flow runs...");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition text-left"
                  >
                    <div className="w-4 h-4 rounded bg-[#008060] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      F
                    </div>
                    <span>Search Flow runs</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Previous / Next Order Chevron buttons */}
          <div className="flex items-center gap-0.5 border border-[#c9cccf] rounded-md bg-white p-0.5">
            <button
              onClick={handlePrevOrder}
              disabled={currentIndex <= 0}
              title="Previous order"
              className="p-1 hover:bg-[#f6f6f7] disabled:opacity-40 disabled:cursor-not-allowed text-[#616161] rounded"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextOrder}
              disabled={currentIndex < 0 || currentIndex >= initialOrdersList.length - 1}
              title="Next order"
              className="p-1 hover:bg-[#f6f6f7] disabled:opacity-40 disabled:cursor-not-allowed text-[#616161] rounded"
            >
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
              <Badge
                variant={isFulfilled ? "neutral" : "amber"}
                icon={isFulfilled ? "square" : "ring"}
              >
                {isFulfilled ? "Fulfilled" : "Unfulfilled"}
              </Badge>
            </div>

            {/* Shipping Line Inner Box */}
            <div className="border border-[#e1e3e5] rounded-lg p-3 bg-white flex items-center gap-2.5 text-[13px] text-[#303030]">
              <Truck className="w-4 h-4 text-[#616161]" />
              <span className="font-medium">{order.shippingMethod}</span>
            </div>

            {/* Products List */}
            <div className="space-y-2">
              {order.products.map((prod, idx) => (
                <div key={idx} className="border border-[#e1e3e5] rounded-lg p-3.5 flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[18px]">
                      {prod.image}
                    </div>
                    <div className="font-semibold text-[#1a1a1a]">{prod.name}</div>
                  </div>

                  <div className="flex items-center gap-4 text-[13px]">
                    <span className="text-[#616161]">
                      Rs {prod.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ×{" "}
                      <span className="bg-[#f1f2f4] px-1.5 py-0.5 rounded text-[#1a1a1a] font-medium">
                        {prod.qty}
                      </span>
                    </span>
                    <span className="font-medium text-[#1a1a1a]">
                      Rs {(prod.price * prod.qty).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
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

              {/* Fulfillment Actions Dropdown Popover */}
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

          {/* Card 2: Payment Status Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant={isPaid ? "neutral" : "warning"}
                icon={isPaid ? "square" : "ring"}
              >
                {isPaid ? "Paid" : "Payment pending"}
              </Badge>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Breakdown Inner Box */}
            <div className="border border-[#e1e3e5] rounded-lg p-4 space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between text-[#303030]">
                <span>Subtotal</span>
                <span className="text-[#616161]">{totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}</span>
                <span className="font-medium text-[#1a1a1a]">Rs{order.subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Shipping</span>
                <span className="text-[#616161] text-[12px]">{order.shippingMethod}</span>
                <span className="font-medium text-[#1a1a1a]">Rs{order.shippingPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center justify-between font-bold text-[14px] text-[#1a1a1a] pt-1">
                <span>Total</span>
                <span>Rs{order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <hr className="border-[#e1e3e5]" />

              <div className="flex items-center justify-between text-[#303030]">
                <span>Paid</span>
                <span>Rs{isPaid ? order.total.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}</span>
              </div>

              <div className="flex items-center justify-between text-[#303030]">
                <span>Balance</span>
                <span className="font-semibold text-[#1a1a1a]">
                  Rs{isPaid ? "0.00" : order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button 
                onClick={() => setIsRefundModalOpen(true)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition"
              >
                Refund
              </button>
              <button className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition">
                Send invoice
              </button>
              <button
                onClick={() => {
                  setIsPaid(!isPaid);
                  showToast(isPaid ? "Order marked as unpaid" : "Payment captured for order");
                }}
                className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs"
              >
                {isPaid ? "Mark as unpaid" : "Mark as paid"}
              </button>
            </div>
          </div>

          {/* Card 3: Interactive Timeline Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[14px] font-semibold text-[#1a1a1a] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#616161]" />
              <span>Timeline</span>
            </h3>

            {/* Leave a Comment Input */}
            <div className="flex items-center gap-2 bg-[#f6f6f7] p-2 rounded-xl border border-[#e1e3e5]">
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                className="flex-1 text-[13px] bg-transparent outline-none px-2 text-[#1a1a1a]"
              />
              <button
                onClick={handleAddComment}
                disabled={!newCommentText.trim()}
                className="px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] disabled:opacity-40 text-white rounded-lg text-[12px] font-medium transition shrink-0 flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
            </div>

            {/* Chronological Activity Feed */}
            <div className="space-y-3 pt-2 text-[13px]">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-[#fafafa] border border-[#f1f2f4] animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="w-7 h-7 rounded-full bg-[#1a1a1a] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {c.author.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-[#1a1a1a]">{c.author}</span>
                      <span className="text-[#8c8c8c]">{c.time}</span>
                    </div>
                    <p className="text-[#303030]">{c.text}</p>
                  </div>
                </div>
              ))}

              {/* Standard Event History */}
              <div className="flex items-center gap-3 text-[#616161] py-1 px-1">
                <div className="w-2 h-2 rounded-full bg-[#008060] shrink-0" />
                <span className="flex-1">Order confirmation email was sent to customer</span>
                <span className="text-[12px] text-[#8c8c8c]">{order.date}</span>
              </div>
              <div className="flex items-center gap-3 text-[#616161] py-1 px-1">
                <div className="w-2 h-2 rounded-full bg-[#005bd3] shrink-0" />
                <span className="flex-1">Order created from Online Store</span>
                <span className="text-[12px] text-[#8c8c8c]">{order.date}</span>
              </div>
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#000000] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 text-[13px] font-medium border border-[#262626] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#8c8c8c] hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fulfill Items Modal Popup */}
      {isFulfillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl border border-[#e1e3e5] overflow-hidden animate-in zoom-in-95 duration-150 text-[13px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e1e3e5]">
              <h3 className="text-[16px] font-semibold text-[#1a1a1a]">Fulfill items for {order.id}</h3>
              <button onClick={() => setIsFulfillModalOpen(false)} className="text-[#616161] hover:text-[#1a1a1a]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#616161] mb-1">Tracking number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#616161] mb-1">Shipping carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                >
                  <option>Sri Lanka Post</option>
                  <option>DHL Express</option>
                  <option>FedEx</option>
                  <option>UPS</option>
                  <option>Other</option>
                </select>
              </div>
              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="rounded border-[#c9cccf]" />
                <span>Send shipment details to customer now</span>
              </label>
            </div>
            <div className="px-5 py-3.5 bg-[#f6f6f7] border-t border-[#e1e3e5] flex justify-end gap-2">
              <button
                onClick={() => setIsFulfillModalOpen(false)}
                className="px-3 py-1.5 border border-[#c9cccf] rounded-lg text-[#303030] hover:bg-[#e4e5e7] transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsFulfilled(true);
                  setIsFulfillModalOpen(false);
                  showToast(`Order ${order.id} fulfilled via ${carrier}`);
                }}
                className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#303030] text-white rounded-lg transition font-medium shadow-2xs"
              >
                Fulfill items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal Popup */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-[480px] bg-white rounded-2xl shadow-2xl border border-[#e1e3e5] overflow-hidden animate-in zoom-in-95 duration-150 text-[13px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e1e3e5]">
              <h3 className="text-[16px] font-semibold text-[#1a1a1a]">Refund order {order.id}</h3>
              <button onClick={() => setIsRefundModalOpen(false)} className="text-[#616161] hover:text-[#1a1a1a]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#616161] mb-1">Reason for refund</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                />
              </div>
              <div className="p-3 bg-[#f6f6f7] rounded-xl border border-[#e1e3e5] space-y-1">
                <div className="flex justify-between text-[#616161]">
                  <span>Total refundable</span>
                  <span className="font-semibold text-[#1a1a1a]">Rs{order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-[#f6f6f7] border-t border-[#e1e3e5] flex justify-end gap-2">
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="px-3 py-1.5 border border-[#c9cccf] rounded-lg text-[#303030] hover:bg-[#e4e5e7] transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsPaid(false);
                  setIsRefundModalOpen(false);
                  showToast(`Refunded Rs${order.total.toLocaleString("en-US")} for ${order.id}`);
                }}
                className="px-4 py-1.5 bg-[#c5221f] hover:bg-[#a81c19] text-white rounded-lg transition font-medium shadow-2xs"
              >
                Refund Rs{order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
