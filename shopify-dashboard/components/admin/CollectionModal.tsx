"use client";

import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import { getAdminCollectionsAction } from "@/app/actions/collections";

const fallbackCollections = [
  "Cold Storage",
  "Mining & ASICs",
  "Sovereign Nodes",
  "Security & Backup",
  "Cryptographic Relics"
];

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "remove";
  selectedCount: number;
  onSave?: (selectedCollections: string[]) => void;
}

export function CollectionModal({
  isOpen,
  onClose,
  mode,
  selectedCount,
  onSave,
}: CollectionModalProps) {
  const [collectionsList, setCollectionsList] = useState<string[]>(fallbackCollections);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedCollections, setCheckedCollections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      getAdminCollectionsAction().then((cols) => {
        if (cols && cols.length > 0) {
          setCollectionsList(cols.map((c) => c.title));
        }
      }).catch((err) => console.error("Failed to load collections in modal:", err));
    }
  }, [isOpen]);

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collectionsList;
    return collectionsList.filter((c) =>
      c.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, collectionsList]);

  if (!isOpen) return null;

  const toggleCollection = (name: string) => {
    const next = new Set(checkedCollections);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setCheckedCollections(next);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(Array.from(checkedCollections));
    }
    setCheckedCollections(new Set());
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setCheckedCollections(new Set());
    setSearchQuery("");
    onClose();
  };

  const titleText =
    mode === "add"
      ? `Add ${selectedCount} ${selectedCount === 1 ? "product" : "products"} to collection(s)`
      : `Remove ${selectedCount} ${selectedCount === 1 ? "product" : "products"} from collection(s)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl border border-[#e1e3e5] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e1e3e5]">
          <h2 className="text-[16px] font-semibold text-[#1a1a1a]">{titleText}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#616161] hover:text-[#1a1a1a] p-1 rounded-md hover:bg-[#f1f2f4] transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <input
            type="text"
            placeholder="Search for collections"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-[13.5px] border border-[#c9cccf] rounded-lg outline-none focus:border-[#005bd3] focus:ring-2 focus:ring-[#005bd3]/20 transition text-[#1a1a1a]"
          />
        </div>

        {/* Collections List */}
        <div className="px-6 py-2 max-h-[320px] overflow-y-auto flex flex-col gap-2.5 my-1">
          {filteredCollections.length === 0 ? (
            <div className="py-6 text-center text-[#616161] text-[13.5px]">
              No collections match "{searchQuery}"
            </div>
          ) : (
            filteredCollections.map((colName) => {
              const isChecked = checkedCollections.has(colName);
              return (
                <label
                  key={colName}
                  className="flex items-center gap-3 py-1 cursor-pointer text-[13.5px] text-[#303030] hover:text-[#1a1a1a] select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCollection(colName)}
                    className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                  />
                  <span>{colName}</span>
                </label>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e1e3e5] bg-white">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 text-[13.5px] font-medium text-[#303030] bg-white hover:bg-[#f6f6f7] border border-[#c9cccf] rounded-lg shadow-2xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={checkedCollections.size === 0}
            className="px-4 py-1.5 text-[13.5px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-lg shadow-2xs transition cursor-pointer disabled:bg-[#e4e5e7] disabled:text-[#8a8a8a] disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
