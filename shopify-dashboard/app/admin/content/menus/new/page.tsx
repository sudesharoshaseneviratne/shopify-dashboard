"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { ContentIcon } from "@shopify/polaris-icons";

export default function AddMenuPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [menuItems, setMenuItems] = useState<Array<{ id: number; name: string; link: string }>>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemLink, setNewItemLink] = useState("");

  const handleAddItem = () => {
    if (newItemName.trim()) {
      setMenuItems((prev) => [
        ...prev,
        { id: Date.now(), name: newItemName.trim(), link: newItemLink.trim() || "#" }
      ]);
      setNewItemName("");
      setNewItemLink("");
      setIsAddingItem(false);
    }
  };

  const handleRemoveItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    router.push("/admin/content/menus");
  };

  const handleSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="space-y-4 font-sans pb-16 max-w-[650px] mx-auto">
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1.5 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/content/menus"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Menus"
          >
            <ContentIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">Add menu</h1>
        </div>
      </div>

      {/* Card 1: Name */}
      <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
        <label className="text-[13px] font-semibold text-[#1a1a1a]">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Sidebar menu"
          className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] bg-white text-[#1a1a1a]"
        />
        <div className="text-[12px] text-[#616161]">
          Handle: <span className="font-mono text-[#303030]">{handleSlug || ""}</span>
        </div>
      </div>

      {/* Card 2: Menu items */}
      <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
        <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Menu items</h3>

        {/* Existing items list */}
        {menuItems.length > 0 && (
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-[#e1e3e5] rounded-lg px-3 py-2 bg-[#fafafa]"
              >
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#1a1a1a]">
                  <GripVertical className="w-4 h-4 text-[#8c8c8c] cursor-grab" />
                  <span>{item.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-[#616161] hover:text-[#d72c0d] p-1 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Item Input Form */}
        {isAddingItem ? (
          <div className="border border-[#e1e3e5] rounded-xl p-3 bg-[#fafafa] space-y-3 text-[13px]">
            <div className="space-y-1">
              <label className="font-medium text-[#303030]">Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., About us"
                className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-[#303030]">Link</label>
              <input
                type="text"
                value={newItemLink}
                onChange={(e) => setNewItemLink(e.target.value)}
                placeholder="Search or paste a link"
                className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setIsAddingItem(false)}
                className="px-3 py-1 text-[12px] font-medium text-[#303030] bg-white border border-[#c9cccf] rounded-md hover:bg-[#f6f6f7]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
                className="px-3 py-1 text-[12px] font-semibold bg-[#1a1a1a] text-white rounded-md hover:bg-[#303030]"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="text-[13px] font-medium text-[#303030] hover:text-[#1a1a1a] flex items-center gap-1.5 transition py-1"
          >
            <div className="w-5 h-5 rounded-full border border-[#c9cccf] flex items-center justify-center text-[#616161]">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>Add menu item</span>
          </button>
        )}
      </div>

      {/* Save Button (Bottom Right) */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-1.5 text-[13px] font-semibold bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition shadow-2xs"
        >
          Save
        </button>
      </div>
    </div>
  );
}
