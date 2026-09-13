"use client";

import { useState } from "react";
import { 
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
  Plus, 
  ExternalLink,
  Check
} from "lucide-react";
import { SettingsTab } from "./SettingsSidebar";

interface GenericSettingsTabProps {
  tab: SettingsTab;
}

export function GenericSettingsTab({ tab }: GenericSettingsTabProps) {
  const [saved, setSaved] = useState(false);

  const handleAction = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getTabDetails = () => {
    switch (tab) {
      case "plan":
        return {
          title: "Plan",
          icon: FileText,
          description: "Manage your store plan, features, and subscriptions",
          cards: [
            {
              title: "Current plan details",
              content: (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-[#fafafa] border border-[#e1e3e5] rounded-xl">
                    <div>
                      <div className="text-[14px] font-semibold text-[#1a1a1a]">Shopify Basic Plan</div>
                      <div className="text-[12px] text-[#616161]">Billed monthly at $39/mo</div>
                    </div>
                    <span className="bg-[#a6f4c5] text-[#064e3b] text-[12px] font-semibold px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <button onClick={handleAction} className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-lg transition shadow-2xs">
                    Change plan
                  </button>
                </div>
              )
            }
          ]
        };

      case "billing":
        return {
          title: "Billing",
          icon: CreditCard,
          description: "Manage your payment methods, invoices, and billing profile",
          cards: [
            {
              title: "Payment methods",
              content: (
                <div className="space-y-3">
                  <div className="p-3.5 border border-[#e1e3e5] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-[#616161]" />
                      <div>
                        <div className="text-[13px] font-medium text-[#1a1a1a]">Visa ending in 4242</div>
                        <div className="text-[12px] text-[#616161]">Expires 12/2028 · Primary</div>
                      </div>
                    </div>
                    <button onClick={handleAction} className="text-[13px] text-[#005bd3] font-medium hover:underline">Edit</button>
                  </div>
                  <button onClick={handleAction} className="px-3.5 py-1.5 text-[13px] font-medium border border-[#c9cccf] bg-white text-[#303030] hover:bg-[#f6f6f7] rounded-lg transition shadow-2xs flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add payment method
                  </button>
                </div>
              )
            }
          ]
        };

      case "users":
        return {
          title: "Users and permissions",
          icon: Users,
          description: "Control staff accounts and administrative permissions",
          cards: [
            {
              title: "Store owner",
              content: (
                <div className="p-3.5 border border-[#e1e3e5] rounded-xl flex items-center justify-between bg-[#fafafa]">
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a1a]">Prasanthi Craft (You)</div>
                    <div className="text-[12px] text-[#616161]">prasanthicrafts@gmail.com · Full access</div>
                  </div>
                  <span className="text-[12px] font-medium text-[#616161] bg-[#e4e5e7] px-2.5 py-0.5 rounded-full">Owner</span>
                </div>
              )
            }
          ]
        };

      case "payments":
        return {
          title: "Payments",
          icon: Wallet,
          description: "Configure payment providers and payout accounts",
          cards: [
            {
              title: "Payment providers",
              content: (
                <div className="space-y-3">
                  <div className="p-3.5 border border-[#e1e3e5] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-[#1a1a1a]">Shopify Payments</div>
                      <div className="text-[12px] text-[#616161]">Accept credit cards, Apple Pay, Google Pay</div>
                    </div>
                    <button onClick={handleAction} className="px-3 py-1 text-[12px] font-medium bg-[#1a1a1a] text-white rounded-md">Manage</button>
                  </div>
                  <div className="p-3.5 border border-[#e1e3e5] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-semibold text-[#1a1a1a]">PayPal Express Checkout</div>
                      <div className="text-[12px] text-[#616161]">Connected account: prasanthicrafts@gmail.com</div>
                    </div>
                    <button onClick={handleAction} className="px-3 py-1 text-[12px] font-medium border border-[#c9cccf] rounded-md">Manage</button>
                  </div>
                </div>
              )
            }
          ]
        };

      case "checkout":
        return {
          title: "Checkout",
          icon: ShoppingCart,
          description: "Customize your checkout experience and order processing rules",
          cards: [
            {
              title: "Customer contact method",
              content: (
                <div className="space-y-2 text-[13px] text-[#303030]">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="contact" defaultChecked className="accent-[#1a1a1a]" />
                    <span>Phone number or email</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="contact" className="accent-[#1a1a1a]" />
                    <span>Email only</span>
                  </label>
                </div>
              )
            }
          ]
        };

      case "shipping":
        return {
          title: "Shipping and delivery",
          icon: Truck,
          description: "Manage shipping rates, local delivery, and pickup options",
          cards: [
            {
              title: "General shipping rates",
              content: (
                <div className="p-3.5 border border-[#e1e3e5] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a1a]">Domestic (Sri Lanka)</div>
                    <div className="text-[12px] text-[#616161]">Flat Shipping Rate: LKR 400.00</div>
                  </div>
                  <button onClick={handleAction} className="text-[13px] text-[#005bd3] font-medium hover:underline">Manage</button>
                </div>
              )
            }
          ]
        };

      case "locations":
        return {
          title: "Locations",
          icon: MapPin,
          description: "Manage places where you fulfill orders and stock inventory",
          cards: [
            {
              title: "Fulfillment locations",
              content: (
                <div className="p-3.5 border border-[#e1e3e5] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-[#1a1a1a]">Default Store Location (Maharagama)</div>
                    <div className="text-[12px] text-[#616161]">135/79 Neelammahara Road, Maharagama, Sri Lanka</div>
                  </div>
                  <span className="bg-[#a6f4c5] text-[#064e3b] text-[12px] font-semibold px-2 py-0.5 rounded-full">Primary</span>
                </div>
              )
            }
          ]
        };

      default:
        const capitalized = tab.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        return {
          title: capitalized,
          icon: FileText,
          description: `Manage settings and options for ${capitalized.toLowerCase()}`,
          cards: [
            {
              title: `${capitalized} configuration`,
              content: (
                <div className="p-4 border border-[#e1e3e5] rounded-xl bg-[#fafafa] space-y-3">
                  <div className="text-[13px] text-[#303030]">
                    Configure default preferences and rules for {capitalized.toLowerCase()} in your store.
                  </div>
                  <button onClick={handleAction} className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-lg transition shadow-2xs">
                    Save preferences
                  </button>
                </div>
              )
            }
          ]
        };
    }
  };

  const details = getTabDetails();
  const Icon = details.icon;

  return (
    <div className="space-y-6 max-w-[840px] pb-12">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-[#1a1a1a]" />
        <h1 className="text-[18px] font-semibold text-[#1a1a1a]">{details.title}</h1>
      </div>

      {saved && (
        <div className="p-3 bg-[#eefaf6] border border-[#a7f3d0] rounded-xl text-[13px] text-[#065f46] flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-[#059669]" />
          <span>{details.title} preferences updated.</span>
        </div>
      )}

      <p className="text-[13px] text-[#616161]">{details.description}</p>

      {/* Cards */}
      <div className="space-y-5">
        {details.cards.map((card, idx) => (
          <div key={idx} className="bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
            <h2 className="text-[14px] font-semibold text-[#1a1a1a]">{card.title}</h2>
            <div>{card.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
