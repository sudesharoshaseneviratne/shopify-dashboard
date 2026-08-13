"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  X, 
  Search, 
  Check, 
  Clock, 
  ArrowLeft 
} from "lucide-react";
import { OrderIcon } from "@shopify/polaris-icons";
import { Badge } from "@/components/admin/Badge";
import { getOrderDetail } from "@/lib/admin/ordersData";

export default function OrderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const initialOrder = getOrderDetail(id);

  const [products, setProducts] = useState(
    initialOrder.products.map((p, idx) => ({
      id: idx + 1,
      name: p.name,
      price: p.price,
      qty: p.qty,
      image: p.image || "📚"
    }))
  );

  const [shippingFee, setShippingFee] = useState(initialOrder.shippingPrice || 400);
  const [reasonForEdit, setReasonForEdit] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Available catalog items to add
  const catalogProducts = [
    { name: "IPRIMARY RECEPTION ACTIVITY BOOK: ENGLISH RECEPTION 1 SUMMER", price: 2100, image: "📘" },
    { name: "IPRIMARY RECEPTION ACTIVITY BOOK: WORLD AROUND US RECEPTION 1 SPRING", price: 2100, image: "📕" },
    { name: "IPRIMARY RECEPTION ACTIVITY BOOK: WORLD AROUND US RECEPTION 1 SUMMER", price: 2100, image: "📗" },
    { name: "Edexcel International GCSE (9-1) Mathematics A", price: 4080, image: "📐" },
    { name: "Pearson Edexcel International GCSE Chemistry", price: 2036, image: "🧪" },
    { name: "Abacus Year 1 Workbook 1", price: 1600, image: "📙" }
  ];

  const filteredCatalog = catalogProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleQtyChange = (prodId: number, newQty: number) => {
    if (newQty < 1) return;
    setProducts((prev) =>
      prev.map((item) => (item.id === prodId ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveItem = (prodId: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== prodId));
  };

  const handleAddCatalogItem = (catItem: { name: string; price: number; image: string }) => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: catItem.name,
        price: catItem.price,
        qty: 1,
        image: catItem.image
      }
    ]);
    setIsProductModalOpen(false);
  };

  const handleAddCustomItem = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "Custom Item",
        price: 1500,
        qty: 1,
        image: "📦"
      }
    ]);
  };

  // Calculations
  const subtotal = products.reduce((acc, p) => acc + p.price * p.qty, 0);
  const total = subtotal + shippingFee;
  const initialTotal = initialOrder.total;
  const isChanged =
    products.length !== initialOrder.products.length ||
    subtotal !== initialOrder.subtotal ||
    reasonForEdit.trim() !== "";

  const handleUpdateOrder = () => {
    setToastMessage("Order updated successfully");
    setTimeout(() => {
      router.push(`/admin/orders/${initialOrder.cleanId}`);
    }, 1000);
  };

  return (
    <div className="space-y-5 font-sans pb-12 max-w-[980px] mx-auto select-none">
      {/* Header Bar */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/admin/orders/${initialOrder.cleanId}`}
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Order"
          >
            <OrderIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <Link
            href={`/admin/orders/${initialOrder.cleanId}`}
            className="text-[18px] font-semibold text-[#616161] hover:text-[#1a1a1a] transition"
          >
            {initialOrder.id}
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[20px] font-bold text-[#1a1a1a]">Edit order</h1>
        </div>

        <div className="text-[12px] text-[#616161]">
          {initialOrder.date}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#eefaf6] border border-[#a7f3d0] rounded-xl text-[13px] text-[#065f46] flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-[#059669]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Product Items Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="amber" icon="ring">
                Unfulfilled
              </Badge>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProductModalOpen(true)}
                  className="px-3 py-1.5 text-[13px] font-medium border border-[#c9cccf] bg-white hover:bg-[#f6f6f7] rounded-lg text-[#303030] shadow-2xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add product</span>
                </button>
                <button
                  onClick={handleAddCustomItem}
                  className="px-3 py-1.5 text-[13px] font-medium border border-[#c9cccf] bg-white hover:bg-[#f6f6f7] rounded-lg text-[#303030] shadow-2xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add custom item</span>
                </button>
              </div>
            </div>

            {/* Product Item List */}
            <div className="border border-[#e1e3e5] rounded-xl overflow-hidden divide-y divide-[#e1e3e5]">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[18px] shrink-0">
                      {item.image}
                    </div>
                    <div className="text-[13px] font-semibold text-[#1a1a1a] leading-snug truncate">
                      {item.name}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[13px] self-end sm:self-center shrink-0">
                    <span className="text-[#005bd3] font-medium">
                      Rs{item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>

                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item.id, parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 text-center border border-[#c9cccf] rounded-lg text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] shadow-2xs font-medium"
                    />

                    <span className="font-semibold text-[#1a1a1a] min-w-[75px] text-right">
                      Rs{(item.price * item.qty).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition"
                      title="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="p-8 text-center text-[13px] text-[#616161]">
                  No items in order. Click "Add product" to add items.
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Payment Breakdown Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 space-y-4">
              <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Payment</h2>

              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between text-[#303030]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1a1a1a]">
                    Rs{subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#303030]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShippingFee(shippingFee === 0 ? 400 : 0)}
                      className="text-[#005bd3] font-medium hover:underline text-[13px]"
                    >
                      Edit shipping fees
                    </button>
                  </div>
                  <span className="text-[#616161] text-[12px]">Flat Shipping Rate</span>
                  <span className="font-medium text-[#1a1a1a]">
                    Rs{shippingFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center justify-between font-bold text-[14px] text-[#1a1a1a] pt-1">
                  <span>Total</span>
                  <span>Rs{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>

                <hr className="border-[#e1e3e5]" />

                <div className="flex items-center justify-between text-[#303030]">
                  <span>Paid</span>
                  <span>Rs0.00</span>
                </div>
              </div>
            </div>

            <div className="bg-[#f6f6f7] border-t border-[#e1e3e5] px-5 py-3 text-[12px] text-[#616161]">
              Taxes are estimated until you update the order
            </div>
          </div>

          {/* Card 3: Reason for edit Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-2">
            <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Reason for edit</h2>
            <input
              type="text"
              value={reasonForEdit}
              onChange={(e) => setReasonForEdit(e.target.value)}
              placeholder=""
              className="w-full bg-white border border-[#c9cccf] rounded-lg px-3 py-2 text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] shadow-2xs"
            />
            <p className="text-[12px] text-[#616161]">Only visible to staff</p>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="space-y-4">
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4 sticky top-4">
            <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Summary</h2>

            <div className="text-[13px] text-[#616161]">
              {isChanged ? (
                <div className="space-y-1 text-[#303030]">
                  <div className="font-medium text-[#1a1a1a]">Updated total:</div>
                  <div>Rs{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>
              ) : (
                "No changes have been made"
              )}
            </div>

            <button
              onClick={handleUpdateOrder}
              disabled={!isChanged}
              className={`w-full py-2 px-4 rounded-lg text-[13px] font-semibold transition shadow-2xs ${
                isChanged
                  ? "bg-[#1a1a1a] text-white hover:bg-[#303030] cursor-pointer"
                  : "bg-[#e4e5e7] text-[#8c8c8c] cursor-not-allowed"
              }`}
            >
              Update order
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl border border-[#e1e3e5] w-full max-w-[520px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e1e3e5]">
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Add products</h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-[#e1e3e5]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#616161] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg pl-9 pr-3 py-1.5 text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a]"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto divide-y divide-[#f1f2f4]">
              {filteredCatalog.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddCatalogItem(cat)}
                  className="p-3.5 flex items-center justify-between hover:bg-[#f6f6f7] transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[16px]">
                      {cat.image}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#1a1a1a] line-clamp-1">
                        {cat.name}
                      </div>
                      <div className="text-[12px] text-[#616161]">
                        Rs{cat.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-[12px] font-semibold bg-[#1a1a1a] text-white rounded-md hover:bg-[#303030]">
                    Add
                  </button>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-[#e1e3e5] flex justify-end">
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-medium border border-[#c9cccf] bg-white rounded-lg hover:bg-[#f6f6f7]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
