"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductIcon } from "@shopify/polaris-icons";
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Plus, 
  Edit2, 
  Tag, 
  Info, 
  Settings, 
  Check, 
  Upload, 
  FileText,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  List,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddProductPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("Short sleeve t-shirt");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [compareAtPrice, setCompareAtPrice] = useState("0.00");
  const [chargeTax, setChargeTax] = useState(true);
  const [trackInventory, setTrackInventory] = useState(true);
  const [isPhysicalProduct, setIsPhysicalProduct] = useState(true);
  const [quantity, setQuantity] = useState("0");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [continueSelling, setContinueSelling] = useState(false);
  const [productWeight, setProductWeight] = useState("0.0");
  const [selectedStatus, setSelectedStatus] = useState<"Active" | "Draft" | "Unlisted">("Active");

  // Accordion Expand States (Screenshots 3, 4, 5)
  const [isPriceAccordionOpen, setIsPriceAccordionOpen] = useState(true);
  const [isInventoryAccordionOpen, setIsInventoryAccordionOpen] = useState(true);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    router.push("/admin/products");
  };

  return (
    <div className="space-y-4 font-sans pb-16 max-w-[960px] mx-auto">
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1.5 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/products"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Products"
          >
            <ProductIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Add product</h1>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Title & Description */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#1a1a1a]">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short sleeve t-shirt"
                className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] transition bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-[#1a1a1a]">Description</label>
              {/* Rich Text Toolbar */}
              <div className="border border-[#c9cccf] rounded-lg overflow-hidden focus-within:border-[#005bd3] focus-within:ring-1 focus-within:ring-[#005bd3] transition">
                <div className="bg-[#f6f6f7] border-b border-[#e1e3e5] px-2 py-1 flex items-center gap-1 text-[13px] text-[#616161] flex-wrap">
                  <select className="bg-transparent hover:bg-[#e4e5e7] rounded px-1.5 py-0.5 outline-none text-[12px] font-medium text-[#303030]">
                    <option>Paragraph</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-1" />
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><Bold className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><Italic className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><Underline className="w-3.5 h-3.5" /></button>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-1" />
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><List className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><LinkIcon className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><ImageIcon className="w-3.5 h-3.5" /></button>
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><Video className="w-3.5 h-3.5" /></button>
                  <span className="w-px h-4 bg-[#e1e3e5] mx-1" />
                  <button className="p-1 hover:bg-[#e4e5e7] rounded text-[#303030]"><Code className="w-3.5 h-3.5" /></button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder=""
                  className="w-full text-[13px] p-3 outline-none resize-y bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Media */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Media</h3>
            <div className="border-2 border-dashed border-[#c9cccf] rounded-xl p-6 text-center bg-[#fafafa] space-y-2">
              <div className="flex items-center justify-center gap-2">
                <button className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition shadow-2xs">
                  Upload new
                </button>
                <button className="px-3.5 py-1.5 text-[13px] font-medium text-[#005bd3] hover:underline transition">
                  Select existing
                </button>
              </div>
              <div className="text-[12px] text-[#616161]">Accepts images, videos, or 3D models</div>
            </div>
          </div>

          {/* Card 3: Category */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Category</h3>
            <select className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] bg-white text-[#303030]">
              <option>Choose a product category</option>
              <option>Apparel & Accessories</option>
              <option>Book & Media</option>
              <option>Electronics</option>
            </select>
            <div className="text-[12px] text-[#616161]">
              Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
            </div>
          </div>

          {/* Card 4: Price */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Price</h3>

            <div className="space-y-1">
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1.5 text-[13px] text-[#616161]">Rs</span>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg pl-9 pr-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] bg-white font-medium text-[#1a1a1a]"
                />
              </div>
            </div>

            {/* Additional display prices (Screenshots 3 & 4) */}
            <div className="border-t border-[#f1f2f4] pt-3 space-y-3">
              <button
                type="button"
                onClick={() => setIsPriceAccordionOpen(!isPriceAccordionOpen)}
                className="w-full flex items-center justify-between text-[12px] font-semibold text-[#616161] hover:text-[#1a1a1a]"
              >
                <span>Additional display prices</span>
                <ChevronUp className={cn("w-4 h-4 transition", !isPriceAccordionOpen && "rotate-180")} />
              </button>

              {isPriceAccordionOpen && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[12px] font-medium text-[#303030] flex items-center gap-1">
                        Compare-at price
                        <HelpCircle className="w-3.5 h-3.5 text-[#616161]" />
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1.5 text-[13px] text-[#616161]">Rs</span>
                        <input
                          type="text"
                          value={compareAtPrice}
                          onChange={(e) => setCompareAtPrice(e.target.value)}
                          className="w-full text-[13px] border border-[#c9cccf] rounded-lg pl-9 pr-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-medium text-[#303030]">Unit price</label>
                      <select className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] bg-white text-[#616161]">
                        <option>--</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={chargeTax}
                      onChange={(e) => setChargeTax(e.target.checked)}
                      className="rounded border-[#c9cccf]"
                    />
                    <span>Charge tax on this product</span>
                  </label>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="bg-[#f1f2f4] text-[#616161] text-[12px] px-3 py-1 rounded-md">Cost --</span>
                    <span className="bg-[#f1f2f4] text-[#616161] text-[12px] px-3 py-1 rounded-md">Profit --</span>
                    <span className="bg-[#f1f2f4] text-[#616161] text-[12px] px-3 py-1 rounded-md">Margin --</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 5: Inventory */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Inventory</h3>
              <label className="flex items-center gap-2 text-[12px] text-[#616161] cursor-pointer">
                <span>Inventory tracked</span>
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                  className="w-4 h-4 accent-[#1a1a1a]"
                />
              </label>
            </div>

            {/* Location Quantity Box */}
            <div className="border border-[#e1e3e5] rounded-lg overflow-hidden bg-white text-[13px]">
              <div className="bg-[#fafafa] px-3 py-2 text-[12px] font-semibold text-[#616161] flex justify-between border-b border-[#e1e3e5]">
                <span>Quantity</span>
                <span>Quantity</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-[#1a1a1a]">135/79 Neelammahara Road</span>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-24 text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1 text-center outline-none focus:border-[#005bd3]"
                />
              </div>
            </div>

            {/* More Details Expandable Accordion (Screenshots 4 & 5) */}
            <div className="border-t border-[#f1f2f4] pt-3 space-y-3">
              <button
                type="button"
                onClick={() => setIsInventoryAccordionOpen(!isInventoryAccordionOpen)}
                className="w-full flex items-center justify-between text-[12px] font-semibold text-[#616161] hover:text-[#1a1a1a]"
              >
                <span>More details</span>
                <ChevronUp className={cn("w-4 h-4 transition", !isInventoryAccordionOpen && "rotate-180")} />
              </button>

              {isInventoryAccordionOpen && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[12px] font-medium text-[#303030]">SKU (Stock Keeping Unit)</label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-medium text-[#303030]">Barcode (ISBN, UPC, GTIN, etc.)</label>
                      <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-[13px] text-[#1a1a1a] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={continueSelling}
                        onChange={(e) => setContinueSelling(e.target.checked)}
                        className="rounded border-[#c9cccf]"
                      />
                      <span>Continue selling when out of stock</span>
                    </label>

                    <span className="bg-[#f1f2f4] text-[#616161] text-[11px] font-medium px-2 py-0.5 rounded inline-flex items-center gap-1">
                      <Info className="w-3 h-3 text-[#616161]" /> POS excluded
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 6: Shipping */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Shipping</h3>
              <label className="flex items-center gap-2 text-[12px] text-[#616161] cursor-pointer">
                <span>Physical product</span>
                <input
                  type="checkbox"
                  checked={isPhysicalProduct}
                  onChange={(e) => setIsPhysicalProduct(e.target.checked)}
                  className="w-4 h-4 accent-[#1a1a1a]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[12px] font-medium text-[#303030] flex items-center gap-1">
                  Package <Info className="w-3.5 h-3.5 text-[#616161]" />
                </label>
                <select className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]">
                  <option>🏬 Store default • Sample box - 22 × 13.7 × 4.2 cm, 0 kg</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#303030]">Product weight</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={productWeight}
                    onChange={(e) => setProductWeight(e.target.value)}
                    className="w-full text-[13px] border border-r-0 border-[#c9cccf] rounded-l-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                  />
                  <select className="text-[13px] border border-[#c9cccf] rounded-r-lg px-2 py-1.5 outline-none bg-[#f6f6f7] text-[#303030]">
                    <option>kg</option>
                    <option>lb</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-[#f1f2f4] pt-3 flex items-center justify-between text-[12px] font-semibold text-[#616161]">
              <div className="flex items-center gap-2">
                <button className="bg-[#f1f2f4] px-2.5 py-1 rounded-md hover:bg-[#e4e5e7] transition text-[#303030]">Country of origin</button>
                <button className="bg-[#f1f2f4] px-2.5 py-1 rounded-md hover:bg-[#e4e5e7] transition text-[#303030]">HS Code</button>
              </div>
              <ChevronDown className="w-4 h-4 cursor-pointer" />
            </div>
          </div>

          {/* Card 7: Variants */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Variants</h3>
            <button className="text-[13px] font-medium text-[#303030] hover:text-[#1a1a1a] flex items-center gap-1.5 transition">
              <Plus className="w-4 h-4 text-[#616161]" />
              <span>Add options like size or color</span>
            </button>
          </div>

          {/* Card 8: Product metafields */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Product metafields</h3>
              <button className="px-2.5 py-1 text-[12px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] transition shadow-2xs">
                Add definition
              </button>
            </div>
            <div>
              <button className="bg-[#f1f2f4] text-[#303030] text-[12px] font-medium px-2.5 py-1 rounded-md hover:bg-[#e4e5e7] transition inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 text-[#616161]" /> Disclosures
              </button>
            </div>
          </div>

          {/* Card 9: Search Engine Listing */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Search engine listing</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[12px] text-[#616161]">
              Add a title and description to see how this product might appear in a search engine listing
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-4">
          {/* Card 1: Status (Screenshot 2) */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2 relative" ref={statusDropdownRef}>
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Status</h3>
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full flex items-center justify-between border border-[#c9cccf] rounded-lg px-3 py-1.5 bg-white text-[13px] text-[#303030] font-medium hover:bg-[#f6f6f7] transition"
            >
              <span>{selectedStatus}</span>
              <ChevronDown className="w-4 h-4 text-[#616161]" />
            </button>

            {/* Status Dropdown Popover (Screenshot 2) */}
            {isStatusDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e1e3e5] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in duration-100 flex flex-col gap-1 text-[13px]">
                <button
                  onClick={() => {
                    setSelectedStatus("Active");
                    setIsStatusDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded-lg transition flex flex-col gap-0.5",
                    selectedStatus === "Active" ? "bg-[#f1f2f4] font-semibold" : "hover:bg-[#f6f6f7]"
                  )}
                >
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    {selectedStatus === "Active" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                    <span>Active</span>
                  </div>
                  <div className="text-[11px] text-[#616161] pl-5">Sell via selected sales channels and markets</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedStatus("Draft");
                    setIsStatusDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded-lg transition flex flex-col gap-0.5",
                    selectedStatus === "Draft" ? "bg-[#f1f2f4] font-semibold" : "hover:bg-[#f6f6f7]"
                  )}
                >
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    {selectedStatus === "Draft" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                    <span>Draft</span>
                  </div>
                  <div className="text-[11px] text-[#616161] pl-5">Not visible on selected sales channels or markets</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedStatus("Unlisted");
                    setIsStatusDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded-lg transition flex flex-col gap-0.5",
                    selectedStatus === "Unlisted" ? "bg-[#f1f2f4] font-semibold" : "hover:bg-[#f6f6f7]"
                  )}
                >
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    {selectedStatus === "Unlisted" && <Check className="w-3.5 h-3.5 text-[#1a1a1a]" />}
                    <span>Unlisted</span>
                  </div>
                  <div className="text-[11px] text-[#616161] pl-5">Accessible only by direct link</div>
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Publishing */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Publishing</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[12px] font-medium text-[#303030] flex items-center gap-1.5">
              <span>📢</span>
              <span>All channels</span>
            </div>
          </div>

          {/* Card 3: Product organization */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-[13px] font-semibold text-[#1a1a1a]">
              <span>Product organization</span>
              <Info className="w-3.5 h-3.5 text-[#616161]" />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Type</label>
              <select className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]">
                <option>None</option>
                <option>Apparel</option>
                <option>Book</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Vendor</label>
              <select className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]">
                <option>None</option>
                <option>Learnix LK</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Collections</label>
              <button className="w-full text-left text-[13px] font-medium text-[#303030] bg-[#f1f2f4] hover:bg-[#e4e5e7] rounded-lg px-3 py-1.5 transition flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#616161]" />
                <span>Add collections</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Tags</label>
              <button className="w-full text-left text-[13px] font-medium text-[#303030] bg-[#f1f2f4] hover:bg-[#e4e5e7] rounded-lg px-3 py-1.5 transition flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#616161]" />
                <span>Add tags</span>
              </button>
            </div>
          </div>

          {/* Card 4: Theme template */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Theme template</h3>
            <select className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]">
              <option>Default product</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
