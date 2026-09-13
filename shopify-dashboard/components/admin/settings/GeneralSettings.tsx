"use client";

import { useState } from "react";
import { 
  Store, 
  ChevronRight, 
  MoreHorizontal, 
  MapPin, 
  Building2, 
  Check, 
  ExternalLink 
} from "lucide-react";

export function GeneralSettings() {
  const [storeName, setStoreName] = useState("Prasanthi Craft");
  const [storeEmail, setStoreEmail] = useState("prasanthicrafts@gmail.com");
  const [storePhone, setStorePhone] = useState("+94774230976");
  const [storeAddress, setStoreAddress] = useState(
    "135/79 Neelammahara Road, Maharagama, 10290, Sri Lanka"
  );
  const [backupRegion, setBackupRegion] = useState("Sri Lanka");
  const [unitSystem, setUnitSystem] = useState("Metric system");
  const [weightUnit, setWeightUnit] = useState("Kilogram (kg)");
  const [timeZone, setTimeZone] = useState("(GMT+05:30) Sri Jayawardenepura");

  const [isSaved, setIsSaved] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setIsChanged(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const markChanged = () => {
    setIsChanged(true);
  };

  return (
    <div className="space-y-6 max-w-[840px] pb-12">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Store className="w-5 h-5 text-[#1a1a1a]" />
        <h1 className="text-[18px] font-semibold text-[#1a1a1a]">General</h1>
      </div>

      {/* Save Success Banner */}
      {isSaved && (
        <div className="p-3 bg-[#eefaf6] border border-[#a7f3d0] rounded-xl text-[13px] text-[#065f46] flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-[#059669]" />
          <span>General settings saved successfully.</span>
        </div>
      )}

      {/* Section 1: Business Details */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Business details</h2>
          <p className="text-[12px] text-[#616161]">
            Business entity used for financial products, markets, apps, and taxes in this shop
          </p>
        </div>

        {/* Business Entity Card */}
        <div className="border border-[#e1e3e5] rounded-xl p-3.5 flex items-center justify-between bg-white hover:bg-[#fafafa] transition">
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 rounded border border-[#e1e3e5] bg-[#f8f9fa] flex items-center justify-center text-[15px] overflow-hidden">
              🇱🇰
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#1a1a1a]">My Store - entity</div>
              <div className="text-[12px] text-[#616161]">Sri Lanka</div>
            </div>
          </div>
          <button className="text-[#616161] hover:text-[#1a1a1a] p-1.5 rounded-md hover:bg-[#f1f2f4] transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section 2: Store Contact Details */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Store contact details</h2>
        </div>

        <div className="border border-[#e1e3e5] rounded-xl overflow-hidden divide-y divide-[#e1e3e5] bg-white">
          {/* Row 1: Store Name & Contact */}
          <div className="p-3.5 flex items-center justify-between hover:bg-[#fafafa] transition cursor-pointer group">
            <div className="flex items-center gap-3.5">
              <Building2 className="w-4 h-4 text-[#616161] shrink-0" />
              <div>
                <div className="text-[13px] font-medium text-[#1a1a1a]">{storeName}</div>
                <div className="text-[12px] text-[#616161]">
                  {storeEmail} · {storePhone}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#616161] group-hover:text-[#1a1a1a] transition" />
          </div>

          {/* Row 2: Store Address */}
          <div className="p-3.5 flex items-center justify-between hover:bg-[#fafafa] transition cursor-pointer group">
            <div className="flex items-center gap-3.5">
              <MapPin className="w-4 h-4 text-[#616161] shrink-0" />
              <div>
                <div className="text-[13px] font-medium text-[#1a1a1a]">Store address</div>
                <div className="text-[12px] text-[#616161]">{storeAddress}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#616161] group-hover:text-[#1a1a1a] transition" />
          </div>
        </div>
      </div>

      {/* Section 3: Store Defaults */}
      <div className="bg-white border border-[#e1e3e5] rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Store defaults</h2>
        </div>

        {/* Currency Display Inner Box */}
        <div className="border border-[#e1e3e5] rounded-xl p-3.5 flex items-center justify-between bg-[#fafafa]">
          <div>
            <div className="text-[13px] font-medium text-[#1a1a1a]">Currency display</div>
            <div className="text-[12px] text-[#616161] flex items-center gap-1">
              <span>To manage the currencies customers see, go to</span>
              <a href="#" className="text-[#005bd3] hover:underline font-medium inline-flex items-center gap-0.5">
                Markets
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#f1f2f4] text-[#303030] text-[12px] font-medium px-2.5 py-1 rounded-md border border-[#e1e3e5]">
              Sri Lankan Rupee (LKR)
            </span>
            <button className="text-[#616161] hover:text-[#1a1a1a] p-1.5 rounded-md hover:bg-[#e4e5e7] transition">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Backup Region Select */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-[#303030]">Backup Region</label>
          <select
            value={backupRegion}
            onChange={(e) => {
              setBackupRegion(e.target.value);
              markChanged();
            }}
            className="w-full bg-white border border-[#c9cccf] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] shadow-2xs"
          >
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="India">India</option>
          </select>
          <p className="text-[12px] text-[#616161]">
            Determines settings for customers outside of your markets
          </p>
        </div>

        {/* Unit System & Weight Unit Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#303030]">Unit system</label>
            <select
              value={unitSystem}
              onChange={(e) => {
                setUnitSystem(e.target.value);
                markChanged();
              }}
              className="w-full bg-white border border-[#c9cccf] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] shadow-2xs"
            >
              <option value="Metric system">Metric system</option>
              <option value="Imperial system">Imperial system</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-[#303030]">Default weight unit</label>
            <select
              value={weightUnit}
              onChange={(e) => {
                setWeightUnit(e.target.value);
                markChanged();
              }}
              className="w-full bg-white border border-[#c9cccf] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] shadow-2xs"
            >
              <option value="Kilogram (kg)">Kilogram (kg)</option>
              <option value="Gram (g)">Gram (g)</option>
              <option value="Pound (lb)">Pound (lb)</option>
              <option value="Ounce (oz)">Ounce (oz)</option>
            </select>
          </div>
        </div>

        {/* Time Zone Select */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-[#303030]">Time zone</label>
          <select
            value={timeZone}
            onChange={(e) => {
              setTimeZone(e.target.value);
              markChanged();
            }}
            className="w-full bg-white border border-[#c9cccf] rounded-lg px-3 py-1.5 text-[13px] text-[#1a1a1a] focus:outline-none focus:border-[#1a1a1a] shadow-2xs"
          >
            <option value="(GMT+05:30) Sri Jayawardenepura">(GMT+05:30) Sri Jayawardenepura</option>
            <option value="(GMT+00:00) London">(GMT+00:00) London</option>
            <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
            <option value="(GMT+08:00) Singapore">(GMT+08:00) Singapore</option>
          </select>
          <p className="text-[12px] text-[#616161]">
            Sets the time for when orders and analytics are recorded
          </p>
        </div>
      </div>

      {/* Floating Save Bar when user changes settings */}
      {isChanged && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
          <span className="text-[13px]">Unsaved changes in General settings</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChanged(false)}
              className="px-3 py-1 text-[13px] font-medium text-[#e4e5e7] hover:text-white transition"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1 text-[13px] font-semibold bg-white text-[#1a1a1a] hover:bg-[#f6f6f7] rounded-lg shadow-2xs transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
