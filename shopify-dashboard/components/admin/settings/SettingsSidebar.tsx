"use client";

import { useState } from "react";
import { 
  Store, 
  FileText, 
  CreditCard, 
  Users, 
  Wallet, 
  ShoppingCart, 
  UserCheck, 
  Truck, 
  Percent, 
  MapPin, 
  LayoutGrid, 
  Radio, 
  Globe, 
  Activity, 
  Bell, 
  Database, 
  Languages, 
  ShieldCheck, 
  Search
} from "lucide-react";

export type SettingsTab = 
  | "general"
  | "plan"
  | "billing"
  | "users"
  | "payments"
  | "checkout"
  | "customer_accounts"
  | "shipping"
  | "taxes"
  | "locations"
  | "apps"
  | "sales_channels"
  | "domains"
  | "customer_events"
  | "notifications"
  | "metafields"
  | "languages"
  | "privacy"
  | "policies";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const settingsNavItems: { id: SettingsTab; label: string; icon: any }[] = [
  { id: "general", label: "General", icon: Store },
  { id: "plan", label: "Plan", icon: FileText },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "users", label: "Users", icon: Users },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "checkout", label: "Checkout", icon: ShoppingCart },
  { id: "customer_accounts", label: "Customer accounts", icon: UserCheck },
  { id: "shipping", label: "Shipping and delivery", icon: Truck },
  { id: "taxes", label: "Taxes and duties", icon: Percent },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "apps", label: "Apps", icon: LayoutGrid },
  { id: "sales_channels", label: "Sales channels", icon: Radio },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "customer_events", label: "Customer events", icon: Activity },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "metafields", label: "Metafields and metaobjects", icon: Database },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "privacy", label: "Customer privacy", icon: ShieldCheck },
  { id: "policies", label: "Policies", icon: FileText },
];

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = settingsNavItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[240px] md:w-[260px] bg-white h-full border-r border-[#e1e3e5] flex flex-col shrink-0 select-none">
      {/* Store Header */}
      <div className="p-3.5 border-b border-[#f1f2f4] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#005bd3] text-white font-bold flex items-center justify-center text-[13px] shadow-2xs">
          PC
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-[#1a1a1a] truncate leading-tight">
            Prasanthi Craft
          </span>
          <span className="text-[11px] text-[#616161] truncate">prasanthicraft.com</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f6f6f7] border border-[#e1e3e5] rounded-md pl-8 pr-2.5 py-1 text-[12.5px] text-[#1a1a1a] placeholder-[#8c8c8c] focus:outline-none focus:bg-white focus:border-[#1a1a1a] transition"
          />
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 text-[13px]">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition ${
                isActive
                  ? "bg-[#f1f2f4] font-semibold text-[#1a1a1a]"
                  : "text-[#303030] font-normal hover:bg-[#f6f6f7] hover:text-[#1a1a1a]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#1a1a1a]" : "text-[#616161]"
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="px-3 py-4 text-[12px] text-[#616161] text-center">
            No settings found
          </div>
        )}
      </div>

      {/* Footer User Profile */}
      <div className="p-3 border-t border-[#e1e3e5] bg-white flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-[#005bd3] text-white font-medium flex items-center justify-center text-[11px]">
          PC
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-semibold text-[#1a1a1a] truncate leading-tight">
            Prasanthi Craft
          </span>
          <span className="text-[11px] text-[#616161] truncate">prasanthicrafts@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
