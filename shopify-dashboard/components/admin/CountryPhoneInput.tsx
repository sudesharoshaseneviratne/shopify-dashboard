"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CountryCode {
  name: string;
  code: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { name: "Afghanistan", code: "+93", flag: "🇦🇫" },
  { name: "Åland Islands", code: "+358", flag: "🇦🇽" },
  { name: "Albania", code: "+355", flag: "🇦🇱" },
  { name: "Algeria", code: "+213", flag: "🇩🇿" },
  { name: "Andorra", code: "+376", flag: "🇦🇩" },
  { name: "Angola", code: "+244", flag: "🇦🇴" },
  { name: "Anguilla", code: "+1", flag: "🇦🇮" },
  { name: "Antigua & Barbuda", code: "+1", flag: "🇦🇬" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "Armenia", code: "+374", flag: "🇦🇲" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Austria", code: "+43", flag: "🇦🇹" },
  { name: "Bahamas", code: "+1", flag: "🇧🇸" },
  { name: "Bahrain", code: "+973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
  { name: "Barbados", code: "+1", flag: "🇧🇧" },
  { name: "Belgium", code: "+32", flag: "🇧🇪" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "Denmark", code: "+45", flag: "🇩🇰" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Finland", code: "+358", flag: "🇫🇮" },
  { name: "France", code: "+33", flag: "🇫🇷" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Hong Kong", code: "+852", flag: "🇭🇰" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Indonesia", code: "+62", flag: "🇮🇩" },
  { name: "Ireland", code: "+353", flag: "🇮🇪" },
  { name: "Israel", code: "+972", flag: "🇮🇱" },
  { name: "Italy", code: "+39", flag: "🇮🇹" },
  { name: "Japan", code: "+81", flag: "🇯🇵" },
  { name: "Kuwait", code: "+965", flag: "🇰🇼" },
  { name: "Malaysia", code: "+60", flag: "🇲🇾" },
  { name: "Maldives", code: "+960", flag: "🇲🇻" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿" },
  { name: "Norway", code: "+47", flag: "🇳🇴" },
  { name: "Oman", code: "+968", flag: "🇴🇲" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Qatar", code: "+974", flag: "🇶🇦" },
  { name: "Saudi Arabia", code: "+966", flag: "🇸🇦" },
  { name: "Singapore", code: "+65", flag: "🇸🇬" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "South Korea", code: "+82", flag: "🇰🇷" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "+94", flag: "🇱🇰" },
  { name: "Sweden", code: "+46", flag: "🇸🇪" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭" },
  { name: "Thailand", code: "+66", flag: "🇹🇭" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "Vietnam", code: "+84", flag: "🇻🇳" },
];

interface CountryPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountryPhoneInput({
  value,
  onChange,
  placeholder = "",
  className,
}: CountryPhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
    COUNTRY_CODES.find((c) => c.name === "Sri Lanka") || COUNTRY_CODES[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsOpen(false);
    // If value doesn't start with phone code or is empty, we can format it
    if (!value || value.startsWith("+")) {
      onChange(`${country.code} `);
    }
  };

  return (
    <div className={cn("flex items-center gap-2 relative", className)}>
      {/* Country Selector Dropdown Button */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 border border-[#c9cccf] rounded-lg px-2.5 py-[7px] bg-white text-[13px] hover:bg-[#f6f6f7] transition focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3]"
        >
          <span className="text-[16px] leading-none">{selectedCountry.flag}</span>
          <ChevronsUpDown className="w-3 h-3 text-[#616161]" />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-[260px] bg-white border border-[#e1e3e5] rounded-xl shadow-2xl z-[100] overflow-hidden text-[13px] animate-in fade-in duration-100 max-h-[260px] flex flex-col">
            <div className="px-3 py-2 text-[12px] font-semibold text-[#616161] border-b border-[#e1e3e5] bg-[#f8f9fa]">
              Country
            </div>
            <div className="overflow-y-auto flex-1 p-1">
              {COUNTRY_CODES.map((country) => {
                const isSelected = country.name === selectedCountry.name;
                return (
                  <button
                    key={country.name}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition text-[13px]",
                      isSelected
                        ? "bg-[#e4e5e7] font-semibold text-[#1a1a1a]"
                        : "hover:bg-[#f1f2f4] text-[#303030]"
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-[14px]">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </span>
                    <span className="text-[12px] text-[#616161] font-mono shrink-0 ml-2">
                      ({country.code})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] focus:ring-1 focus:ring-[#005bd3] transition bg-white"
      />
    </div>
  );
}
