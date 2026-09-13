"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  Plus, 
  Edit2, 
  Globe, 
  ChevronDown, 
  Check, 
  AlertTriangle,
  FileText,
  User,
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderIcon, OrderDraftIcon } from "@shopify/polaris-icons";
import { CountryPhoneInput } from "@/components/admin/CountryPhoneInput";

// Interface definitions
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
  isTaxable?: boolean;
  isPhysical?: boolean;
  weight?: number;
  image?: string;
  available?: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  ordersCount?: number;
}

const mockCatalogProducts: OrderItem[] = [
  { id: "p1", name: "Abacus Year 1 Workbook 1", price: 1600, quantity: 1, available: 3 },
  { id: "p2", name: "Abacus Year 1 Workbook 2", price: 1600, quantity: 1, available: 3 },
  { id: "p3", name: "Abacus Year 1 Workbook 3", price: 1590, quantity: 1, available: 3 },
  { id: "p4", name: "Abacus Year 2 Textbook", price: 3185, quantity: 1, available: 0 },
  { id: "p5", name: "Abacus Year 2 Workbook 1", price: 1590, quantity: 1, available: 15 },
  { id: "p6", name: "Abacus Year 2 Workbook 2", price: 1590, quantity: 1, available: 15 },
  { id: "p7", name: "Abacus Year 2 Workbook 3", price: 1590, quantity: 1, available: 3 },
];

const mockCustomers: Customer[] = [
  { id: "c1", name: "Alex Johnson", email: "learnlx@sandboxdf6dd766a1314ddcb1c51" },
  { id: "c2", name: "Amila Upulitha", email: "upulitha84@gmail.com" },
  { id: "c3", name: "Anthony Steven", phone: "+94776770221", email: "anthony@example.com" },
  { id: "c4", name: "Brandon Perry", email: "brandon.p@gmail.com" },
  { id: "c5", name: "chanu yehansa", email: "yehansa04@gmail.com" },
  { id: "c6", name: "Dahamsiri HA", phone: "+94769931118", email: "dahamsiri@example.com" },
  { id: "c7", name: "Delacruz Kara", email: "delacruz.kara@novalero.org" },
];

export default function CreateOrderPage() {
  const router = useRouter();

  // Order Items & Financials State
  const [items, setItems] = useState<OrderItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingAmount, setShippingAmount] = useState<number>(0);

  // UI Popovers & Modals State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const customerCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerCardRef.current && !customerCardRef.current.contains(event.target as Node)) {
        setIsCustomerSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Address Modal State
  const [addrCountry, setAddrCountry] = useState("Sri Lanka");
  const [addrFirstName, setAddrFirstName] = useState("");
  const [addrLastName, setAddrLastName] = useState("");
  const [addrCompany, setAddrCompany] = useState("");
  const [addrAddress, setAddrAddress] = useState("");
  const [addrSuite, setAddrSuite] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [savedAddress, setSavedAddress] = useState("");

  // Customer State
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Modal Form State
  const [newCustFirstName, setNewCustFirstName] = useState("");
  const [newCustLastName, setNewCustLastName] = useState("");
  const [newCustLanguage, setNewCustLanguage] = useState("English [Default]");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustMarketingEmail, setNewCustMarketingEmail] = useState(false);
  const [newCustMarketingSMS, setNewCustMarketingSMS] = useState(false);
  const [newCustMarketingWA, setNewCustMarketingWA] = useState(false);
  const [newCustNotes, setNewCustNotes] = useState("");

  // Custom Item Form State (Screenshot 3)
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("0.00");
  const [customQty, setCustomQty] = useState(1);
  const [customTaxable, setCustomTaxable] = useState(true);
  const [customPhysical, setCustomPhysical] = useState(true);
  const [customWeight, setCustomWeight] = useState("0");

  const [productSearch, setProductSearch] = useState("");
  const [searchByFilter, setSearchByFilter] = useState("All");
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<string[]>([]);

  const [notes, setNotes] = useState("");
  const [tempNoteInput, setTempNoteInput] = useState("");
  const [tags, setTags] = useState("");

  // Calculated Order Values
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount + shippingAmount);

  // Handlers
  const handleAddCustomItem = () => {
    if (!customName.trim()) return;
    const newItem: OrderItem = {
      id: `custom-${Date.now()}`,
      name: customName,
      price: parseFloat(customPrice) || 0,
      quantity: customQty,
      isCustom: true,
      isTaxable: customTaxable,
      isPhysical: customPhysical,
      weight: parseFloat(customWeight) || 0,
    };
    setItems((prev) => [...prev, newItem]);
    setCustomName("");
    setCustomPrice("0.00");
    setCustomQty(1);
    setCustomTaxable(true);
    setCustomPhysical(true);
    setCustomWeight("0");
    setIsCustomItemOpen(false);
  };

  const handleAddCatalogProducts = () => {
    const selectedItems = mockCatalogProducts
      .filter((p) => selectedCatalogIds.includes(p.id))
      .map((p) => ({ ...p, id: `${p.id}-${Date.now()}` }));
    setItems((prev) => [...prev, ...selectedItems]);
    setSelectedCatalogIds([]);
    setIsAddProductOpen(false);
  };

  const handleCreateCustomerSave = () => {
    const fullName = `${newCustFirstName} ${newCustLastName}`.trim() || "New Customer";
    const created: Customer = {
      id: `c-${Date.now()}`,
      name: fullName,
      email: newCustEmail || `${fullName.toLowerCase().replace(/\s+/g, "")}@example.com`,
      phone: newCustPhone,
    };
    setSelectedCustomer(created);
    setIsCreateCustomerOpen(false);
    setIsCustomerSearchOpen(false);
  };

  const handleSaveOrder = () => {
    router.push("/admin/orders");
  };

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const filteredCatalog = mockCatalogProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 font-sans pb-12 max-w-[960px] mx-auto">
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1.5 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/orders/drafts"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Drafts"
          >
            <OrderDraftIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Create order</h1>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Products Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Products</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-2.5 py-1 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md shadow-2xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" /> Add product
                </button>
                <button
                  onClick={() => setIsCustomItemOpen(true)}
                  className="px-2.5 py-1 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md shadow-2xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-[#616161]" /> Add custom item
                </button>
              </div>
            </div>

            {/* Items List / Empty State */}
            {items.length === 0 ? (
              <div className="py-8 text-center text-[#616161] text-[13px] border-t border-[#e1e3e5] pt-4">
                Add a product to calculate total and view payment options
              </div>
            ) : (
              <div className="border-t border-[#e1e3e5] pt-3 divide-y divide-[#f1f2f4]">
                {items.map((item, idx) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[#616161] text-[11px] font-semibold shrink-0">
                        📦
                      </div>
                      <div>
                        <div className="font-semibold text-[#1a1a1a]">{item.name}</div>
                        <div className="text-[12px] text-[#616161]">
                          Rs {item.price.toFixed(2)} LKR {item.isCustom ? "(Custom item)" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[#c9cccf] rounded-md bg-white">
                        <button
                          onClick={() => {
                            setItems((prev) =>
                              prev.map((it, i) =>
                                i === idx ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it
                              )
                            );
                          }}
                          className="px-2 py-0.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f6f6f7]"
                        >
                          -
                        </button>
                        <span className="px-2 font-medium text-[#1a1a1a] text-[12px]">{item.quantity}</span>
                        <button
                          onClick={() => {
                            setItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, quantity: it.quantity + 1 } : it))
                            );
                          }}
                          className="px-2 py-0.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f6f6f7]"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-medium text-[#1a1a1a] min-w-[70px] text-right">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-[#616161] hover:text-[#d72c0d] transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Payment</h2>

            <div className="border border-[#e1e3e5] rounded-lg p-3 space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#303030]">Subtotal</span>
                <span className="font-medium text-[#1a1a1a]">Rs {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-[#616161]">
                <button
                  onClick={() => setIsDiscountModalOpen(true)}
                  className="hover:text-[#005bd3] underline decoration-dashed transition"
                >
                  Add discount
                </button>
                <div className="flex items-center gap-3">
                  <span>—</span>
                  <span>Rs {discountAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[#616161]">
                <button
                  onClick={() => setIsShippingModalOpen(true)}
                  className="hover:text-[#005bd3] underline decoration-dashed transition"
                >
                  Add shipping or delivery
                </button>
                <div className="flex items-center gap-3">
                  <span>—</span>
                  <span>Rs {shippingAmount.toFixed(2)}</span>
                </div>
              </div>

              <hr className="border-[#e1e3e5]" />

              <div className="flex items-center justify-between font-semibold text-[14px] text-[#1a1a1a]">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-[12px] text-[#616161] pt-1">
              Add a product to calculate total and view payment options
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-4">
          {/* Notes Card */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
              <button
                onClick={() => {
                  setTempNoteInput(notes);
                  setIsAddNoteModalOpen(true);
                }}
                className="text-[#616161] hover:text-[#1a1a1a] transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[13px] text-[#616161]">{notes || "No notes"}</div>
          </div>

          {/* Customer Card */}
          <div ref={customerCardRef} className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3 relative z-30">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Customer</h3>

            {selectedCustomer ? (
              <div className="border border-[#e1e3e5] rounded-lg p-2.5 flex items-center justify-between text-[13px]">
                <div>
                  <div className="font-semibold text-[#005bd3]">{selectedCustomer.name}</div>
                  <div className="text-[12px] text-[#616161] truncate max-w-[180px]">
                    {selectedCustomer.email}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-[#616161] hover:text-[#1a1a1a]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center bg-white border border-[#c9cccf] rounded-lg px-2.5 py-1.5 focus-within:border-[#005bd3] focus-within:ring-1 focus-within:ring-[#005bd3] transition">
                  <Search className="w-4 h-4 text-[#616161] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search or create a customer"
                    value={customerSearchQuery}
                    onChange={(e) => {
                      setCustomerSearchQuery(e.target.value);
                      setIsCustomerSearchOpen(true);
                    }}
                    onFocus={() => setIsCustomerSearchOpen(true)}
                    className="w-full text-[13px] outline-none bg-transparent text-[#1a1a1a]"
                  />
                </div>

                {/* Customer Dropdown Popover */}
                {isCustomerSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e1e3e5] rounded-xl shadow-xl z-50 overflow-hidden text-[13px] animate-in fade-in duration-100 max-h-[300px] overflow-y-auto">
                    <button
                      onClick={() => {
                        setIsCreateCustomerOpen(true);
                        setIsCustomerSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2.5 text-[#303030] hover:bg-[#f6f6f7] border-b border-[#e1e3e5] text-left transition font-medium"
                    >
                      <Plus className="w-4 h-4 text-[#616161]" />
                      <span>Create a new customer</span>
                    </button>

                    {filteredCustomers.map((cust) => (
                      <button
                        key={cust.id}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setIsCustomerSearchOpen(false);
                        }}
                        className="w-full p-2.5 hover:bg-[#f6f6f7] text-left transition flex flex-col gap-0.5 border-b border-[#f1f2f4] last:border-0"
                      >
                        <div className="font-semibold text-[#1a1a1a]">{cust.name}</div>
                        <div className="text-[12px] text-[#616161] truncate">{cust.email}</div>
                        {cust.phone && <div className="text-[12px] text-[#616161]">{cust.phone}</div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL: NEW CUSTOMER WINDOW (User Request) --- */}
      {isCreateCustomerOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#f1f2f4] border border-[#e1e3e5] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-100 p-5 space-y-4">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between py-2 border-b border-[#e1e3e5]">
              <div className="flex items-center gap-2 text-[16px] font-bold text-[#1a1a1a]">
                <User className="w-5 h-5 text-[#303030]" />
                <span>New customer</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreateCustomerOpen(false)}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-[#e4e5e7] hover:bg-[#dcdedf] rounded-md transition"
                >
                  Close
                </button>
                <button
                  onClick={handleCreateCustomerSave}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md transition shadow-2xs"
                >
                  Save customer
                </button>
              </div>
            </div>

            {/* Modal Form Layout (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column (Customer Overview & Address) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Customer Overview Card */}
                <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-4">
                  <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Customer overview</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                    <div className="space-y-1">
                      <label className="font-medium text-[#303030]">First name</label>
                      <input
                        type="text"
                        value={newCustFirstName}
                        onChange={(e) => setNewCustFirstName(e.target.value)}
                        className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-[#303030]">Last name</label>
                      <input
                        type="text"
                        value={newCustLastName}
                        onChange={(e) => setNewCustLastName(e.target.value)}
                        className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-[13px]">
                    <label className="font-medium text-[#303030]">Language</label>
                    <select
                      value={newCustLanguage}
                      onChange={(e) => setNewCustLanguage(e.target.value)}
                      className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none bg-white focus:border-[#005bd3]"
                    >
                      <option value="English [Default]">English [Default]</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                    <div className="text-[12px] text-[#616161]">This customer will receive notifications in this language.</div>
                  </div>

                  <div className="space-y-1 text-[13px]">
                    <label className="font-medium text-[#303030]">Email</label>
                    <input
                      type="email"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                    />
                  </div>

                  <div className="space-y-1 text-[13px]">
                    <label className="font-medium text-[#303030]">Phone number</label>
                    <CountryPhoneInput
                      value={newCustPhone}
                      onChange={(val) => setNewCustPhone(val)}
                    />
                  </div>

                  {/* Marketing Checkboxes */}
                  <div className="space-y-2 pt-2 text-[13px]">
                    <label className="flex items-center gap-2 cursor-pointer text-[#8c8c8c]">
                      <input
                        type="checkbox"
                        checked={newCustMarketingEmail}
                        onChange={(e) => setNewCustMarketingEmail(e.target.checked)}
                        className="rounded border-[#c9cccf]"
                      />
                      <span>Customer agreed to receive marketing emails.</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#8c8c8c]">
                      <input
                        type="checkbox"
                        checked={newCustMarketingSMS}
                        onChange={(e) => setNewCustMarketingSMS(e.target.checked)}
                        className="rounded border-[#c9cccf]"
                      />
                      <span>Customer agreed to receive SMS marketing text messages.</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#8c8c8c]">
                      <input
                        type="checkbox"
                        checked={newCustMarketingWA}
                        onChange={(e) => setNewCustMarketingWA(e.target.checked)}
                        className="rounded border-[#c9cccf]"
                      />
                      <span>Customer agreed to receive WhatsApp marketing messages.</span>
                    </label>
                  </div>

                  <div className="p-3 bg-[#f8f9fa] border border-[#e1e3e5] rounded-lg text-[12px] text-[#616161]">
                    You should ask your customers for permission before you subscribe them to your marketing emails, SMS, or WhatsApp messages.
                  </div>
                </div>

                {/* Default Address Card */}
                <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-5 shadow-2xs space-y-3">
                  <div>
                    <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Default address</h2>
                    <div className="text-[12px] text-[#616161]">The primary address of this customer</div>
                  </div>

                  {savedAddress ? (
                    <div className="border border-[#e1e3e5] rounded-lg p-3 text-[13px] bg-[#f8f9fa] flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">{savedAddress}</div>
                        {(addrFirstName || addrLastName) && (
                          <div className="text-[12px] text-[#616161]">{addrFirstName} {addrLastName}</div>
                        )}
                      </div>
                      <button
                        onClick={() => setIsAddAddressModalOpen(true)}
                        className="text-[12px] font-medium text-[#005bd3] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="w-full flex items-center justify-between border border-[#c9cccf] rounded-lg px-3 py-2 text-[13px] hover:bg-[#f6f6f7] transition font-medium text-[#303030]"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#616161]" /> Add address
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#616161]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Sidebar Column */}
              <div className="space-y-4">
                {/* Notes Card */}
                <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
                    <Edit2 className="w-3.5 h-3.5 text-[#616161] cursor-pointer" />
                  </div>
                  <div className="text-[12px] text-[#616161]">Notes are private and won't be shared with the customer.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP MODAL: ADD DEFAULT ADDRESS (Stacked on top of New Customer) --- */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-[60] flex items-center justify-center p-4">
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e1e3e5]">
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Add default address</h3>
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-5 space-y-3.5 text-[13px] overflow-y-auto flex-1">
              {/* Country/region */}
              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Country/region</label>
                <div className="relative">
                  <select
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none bg-white focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] text-[#1a1a1a] appearance-none pr-8 font-medium"
                  >
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#616161] absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* First name & Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">First name</label>
                  <input
                    type="text"
                    value={addrFirstName}
                    onChange={(e) => setAddrFirstName(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">Last name</label>
                  <input
                    type="text"
                    value={addrLastName}
                    onChange={(e) => setAddrLastName(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Company</label>
                <input
                  type="text"
                  value={addrCompany}
                  onChange={(e) => setAddrCompany(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Address</label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-[#616161] pointer-events-none" />
                  <input
                    type="text"
                    value={addrAddress}
                    onChange={(e) => setAddrAddress(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg pl-9 pr-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>
              </div>

              {/* Apartment, suite, etc */}
              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Apartment, suite, etc</label>
                <input
                  type="text"
                  value={addrSuite}
                  onChange={(e) => setAddrSuite(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                />
              </div>

              {/* City & Postal code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">Postal code</label>
                  <input
                    type="text"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Phone</label>
                <CountryPhoneInput
                  value={addrPhone}
                  onChange={(val) => setAddrPhone(val)}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e1e3e5] bg-[#f8f9fa]">
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const formatted = [addrAddress, addrSuite, addrCity, addrCountry].filter(Boolean).join(", ");
                  setSavedAddress(formatted || "Address added");
                  setIsAddAddressModalOpen(false);
                }}
                className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD NOTE (Screenshot 3) --- */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e1e3e5]">
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Add note</h3>
              <button
                onClick={() => setIsAddNoteModalOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-2 text-[13px]">
              <div className="relative">
                <textarea
                  value={tempNoteInput}
                  onChange={(e) => setTempNoteInput(e.target.value.slice(0, 5000))}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg p-3 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] h-28 resize-none pr-14"
                />
                <div className="absolute bottom-2.5 right-3 text-[11px] text-[#8c8c8c] font-medium pointer-events-none">
                  {tempNoteInput.length}/5000
                </div>
              </div>
              <div className="text-[12px] text-[#616161]">
                To comment on a draft order or mention a staff member, use Timeline instead
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e1e3e5] bg-[#f8f9fa]">
              <button
                onClick={() => setIsAddNoteModalOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setNotes(tempNoteInput);
                  setIsAddNoteModalOpen(false);
                }}
                className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD CUSTOM ITEM --- */}
      {isCustomItemOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e1e3e5]">
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Add custom item</h3>
              <button
                onClick={() => setIsCustomItemOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-[13px]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1 space-y-1">
                  <label className="font-medium text-[#303030]">Item name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">Price</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-[12px] text-[#616161]">LKR</span>
                    <input
                      type="text"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full text-[13px] border border-[#c9cccf] rounded-lg pl-12 pr-2 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={customQty}
                    onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
                    className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e1e3e5] bg-[#f8f9fa]">
              <button
                onClick={() => setIsCustomItemOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomItem}
                disabled={!customName.trim()}
                className={cn(
                  "px-3.5 py-1.5 text-[13px] font-medium rounded-md transition",
                  customName.trim()
                    ? "bg-[#1a1a1a] text-white hover:bg-[#303030]"
                    : "bg-[#e3e3e3] text-[#8c8c8c] cursor-not-allowed"
                )}
              >
                Add item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: SELECT PRODUCTS --- */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl w-full max-w-2xl h-[540px] max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e1e3e5]">
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Select products</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Controls */}
            <div className="p-4 border-b border-[#e1e3e5] space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center border border-[#005bd3] ring-1 ring-[#005bd3] rounded-lg px-3 py-1.5 bg-white">
                  <Search className="w-4 h-4 text-[#616161] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-[13px] outline-none text-[#1a1a1a]"
                  />
                </div>

                <select
                  value={searchByFilter}
                  onChange={(e) => setSearchByFilter(e.target.value)}
                  className="text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 bg-white font-medium text-[#303030] outline-none cursor-pointer hover:border-[#a6a6a6]"
                >
                  <option value="All">Search by All</option>
                  <option value="Product title">Product title</option>
                  <option value="Product ID">Product ID</option>
                  <option value="Barcode">Barcode</option>
                  <option value="SKU">SKU</option>
                  <option value="Variant ID">Variant ID</option>
                  <option value="Variant title">Variant title</option>
                </select>
              </div>
            </div>

            {/* Products Table / Empty State */}
            <div className="overflow-y-auto flex-1 p-2">
              {filteredCatalog.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-[#616161] text-[13px] gap-2">
                  <Search className="w-8 h-8 text-[#a6a6a6]" />
                  <span>No products found matching "{productSearch}"</span>
                </div>
              ) : (
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#e1e3e5] text-[#616161] font-medium text-[12px]">
                      <th className="py-2 px-3 w-10"></th>
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3 text-center">Available</th>
                      <th className="py-2 px-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f2f4]">
                    {filteredCatalog.map((prod) => {
                      const isChecked = selectedCatalogIds.includes(prod.id);
                      return (
                        <tr
                          key={prod.id}
                          onClick={() => {
                            setSelectedCatalogIds((prev) =>
                              prev.includes(prod.id)
                                ? prev.filter((id) => id !== prod.id)
                                : [...prev, prod.id]
                            );
                          }}
                          className="hover:bg-[#f8f9fa] cursor-pointer transition"
                        >
                          <td className="py-2.5 px-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded border-[#c9cccf] text-[#005bd3] cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-[#f1f2f4] border border-[#e1e3e5] flex items-center justify-center text-[12px]">
                                📚
                              </div>
                              <span className="font-medium text-[#1a1a1a]">{prod.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {prod.available === 0 ? (
                              <span className="text-[#d72c0d] font-medium flex items-center justify-center gap-1 text-[12px]">
                                <AlertTriangle className="w-3.5 h-3.5" /> 0
                              </span>
                            ) : (
                              <span className="text-[#303030] font-medium">{prod.available}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-[#1a1a1a]">
                            Rs {prod.price.toFixed(2)} LKR
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#e1e3e5] bg-[#f8f9fa]">
              <span className="text-[12px] text-[#616161]">
                {selectedCatalogIds.length}/500 variants selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCatalogProducts}
                  disabled={selectedCatalogIds.length === 0}
                  className={cn(
                    "px-3.5 py-1.5 text-[13px] font-medium rounded-md transition",
                    selectedCatalogIds.length > 0
                      ? "bg-[#1a1a1a] text-white hover:bg-[#303030]"
                      : "bg-[#e3e3e3] text-[#8c8c8c] cursor-not-allowed"
                  )}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
