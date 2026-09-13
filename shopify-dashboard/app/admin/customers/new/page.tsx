"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronRight, 
  Plus, 
  Edit2, 
  X, 
  ChevronDown
} from "lucide-react";
import { PersonIcon } from "@shopify/polaris-icons";
import { CountryPhoneInput } from "@/components/admin/CountryPhoneInput";
import { cn } from "@/lib/utils";
import { createAdminCustomerAction } from "@/app/actions/customers";

export default function NewCustomerPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [language, setLanguage] = useState("English (Default)");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [agreeEmailMarketing, setAgreeEmailMarketing] = useState(false);
  const [agreeSmsMarketing, setAgreeSmsMarketing] = useState(false);
  const [agreeWhatsappMarketing, setAgreeWhatsappMarketing] = useState(false);

  const [taxSettings, setTaxSettings] = useState("Collect tax");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  // Address Modal State
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState<string | null>(null);

  // Address Modal Fields
  const [addrCountry, setAddrCountry] = useState("Sri Lanka");
  const [addrFirstName, setAddrFirstName] = useState("");
  const [addrLastName, setAddrLastName] = useState("");
  const [addrCompany, setAddrCompany] = useState("");
  const [addrAddress, setAddrAddress] = useState("");
  const [addrSuite, setAddrSuite] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");
  const [addrPhone, setAddrPhone] = useState("");

  const handleSaveAddress = () => {
    const parts = [addrAddress, addrSuite, addrCity, addrCountry].filter(Boolean);
    if (parts.length > 0) {
      setSavedAddress(parts.join(", "));
    } else {
      setSavedAddress("Address added");
    }
    setIsAddAddressModalOpen(false);
  };

  const handleSaveCustomer = async () => {
    if (!firstName && !lastName) {
      setErrorMessage("Please enter at least a first or last name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const res = await createAdminCustomerAction({
      firstName,
      lastName,
      email,
      phone: phone || addrPhone,
      location: savedAddress || addrCity ? `${addrCity}, Sri Lanka` : "Sri Lanka",
      notes,
      tags,
      agreeEmailMarketing,
    });

    setIsSaving(false);

    if (res.success) {
      router.push("/admin/customers");
    } else {
      setErrorMessage(res.error || "Failed to create customer.");
    }
  };

  return (
    <div className="space-y-4 font-sans pb-16 max-w-[960px] mx-auto">
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1.5 text-[18px] font-bold text-[#1a1a1a]">
          <Link
            href="/admin/customers"
            className="p-1 rounded-md text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] transition flex items-center justify-center cursor-pointer"
            title="Back to Customers"
          >
            <PersonIcon className="w-5 h-5 fill-current text-[#616161]" />
          </Link>
          <span className="text-[#616161] text-[15px] font-normal leading-none">›</span>
          <h1 className="text-[18px] font-bold text-[#1a1a1a]">New customer</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/customers"
            className="px-3 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition shadow-2xs"
          >
            Discard
          </Link>
          <button
            onClick={handleSaveCustomer}
            disabled={isSaving}
            className="px-4 py-1.5 text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md transition shadow-2xs disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? "Saving..." : "Save customer"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Card 1: Customer Overview */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-4">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Customer overview</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#303030]">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[#303030]">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]"
              >
                <option>English (Default)</option>
                <option>Sinhala</option>
                <option>Tamil</option>
              </select>
              <div className="text-[12px] text-[#616161]">This customer will receive notifications in this language.</div>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Phone number</label>
              <CountryPhoneInput
                value={phone}
                onChange={(val) => setPhone(val)}
              />
            </div>

            {/* Marketing Checkboxes */}
            <div className="space-y-2 pt-1 text-[13px] text-[#616161]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeEmailMarketing}
                  onChange={(e) => setAgreeEmailMarketing(e.target.checked)}
                  className="rounded border-[#c9cccf]"
                />
                <span>Customer agreed to receive marketing emails.</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeSmsMarketing}
                  onChange={(e) => setAgreeSmsMarketing(e.target.checked)}
                  className="rounded border-[#c9cccf]"
                />
                <span>Customer agreed to receive SMS marketing text messages.</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeWhatsappMarketing}
                  onChange={(e) => setAgreeWhatsappMarketing(e.target.checked)}
                  className="rounded border-[#c9cccf]"
                />
                <span>Customer agreed to receive WhatsApp marketing messages.</span>
              </label>
            </div>

            {/* Info Callout Box */}
            <div className="bg-[#f6f6f7] border border-[#e1e3e5] p-3 rounded-lg text-[12px] text-[#616161]">
              You should ask your customers for permission before you subscribe them to your marketing emails, SMS, or WhatsApp messages.
            </div>
          </div>

          {/* Card 2: Default Address */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Default address</h3>
              <div className="text-[12px] text-[#616161]">The primary address of this customer</div>
            </div>

            {savedAddress ? (
              <div className="border border-[#e1e3e5] rounded-xl p-3 bg-[#fafafa] flex items-center justify-between text-[13px]">
                <div className="font-medium text-[#1a1a1a]">{savedAddress}</div>
                <button
                  onClick={() => setIsAddAddressModalOpen(true)}
                  className="text-[12px] text-[#005bd3] hover:underline font-medium"
                >
                  Edit address
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddAddressModalOpen(true)}
                className="w-full border border-[#e1e3e5] rounded-xl p-3 bg-white hover:bg-[#fafafa] transition flex items-center justify-between text-[13px] text-[#1a1a1a] font-medium group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-[#c9cccf] flex items-center justify-center text-[#616161] group-hover:border-[#1a1a1a] transition">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>Add address</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#616161]" />
              </button>
            )}
          </div>

          {/* Card 3: Tax Details */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Tax details</h3>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#303030]">Tax settings</label>
              <select
                value={taxSettings}
                onChange={(e) => setTaxSettings(e.target.value)}
                className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]"
              >
                <option>Collect tax</option>
                <option>Customer is tax-exempt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar Cards) */}
        <div className="space-y-4">
          {/* Card 1: Notes */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Notes</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[12px] text-[#616161]">
              Notes are private and won't be shared with the customer.
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full text-[13px] border border-[#c9cccf] rounded-lg p-2.5 outline-none focus:border-[#005bd3] resize-y bg-white"
            />
          </div>

          {/* Card 2: Tags */}
          <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#1a1a1a]">Tags</h3>
              <button className="text-[#616161] hover:text-[#1a1a1a] transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder=""
              className="w-full text-[13px] border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white"
            />
          </div>
        </div>
      </div>

      {/* --- ADD ADDRESS POPUP OVERLAY MODAL --- */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e1e3e5] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e1e3e5]">
              <h3 className="text-[15px] font-semibold text-[#1a1a1a]">Add address</h3>
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="text-[#616161] hover:text-[#1a1a1a] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-[13px] max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Country/region</label>
                <select
                  value={addrCountry}
                  onChange={(e) => setAddrCountry(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3] bg-white text-[#303030]"
                >
                  <option>Sri Lanka</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>India</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">First name</label>
                  <input
                    type="text"
                    value={addrFirstName}
                    onChange={(e) => setAddrFirstName(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">Last name</label>
                  <input
                    type="text"
                    value={addrLastName}
                    onChange={(e) => setAddrLastName(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Company</label>
                <input
                  type="text"
                  value={addrCompany}
                  onChange={(e) => setAddrCompany(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Address</label>
                <input
                  type="text"
                  value={addrAddress}
                  onChange={(e) => setAddrAddress(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Apartment, suite, etc</label>
                <input
                  type="text"
                  value={addrSuite}
                  onChange={(e) => setAddrSuite(e.target.value)}
                  className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-[#303030]">Postal code</label>
                  <input
                    type="text"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    className="w-full border border-[#c9cccf] rounded-lg px-3 py-1.5 outline-none focus:border-[#005bd3]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[#303030]">Phone</label>
                <CountryPhoneInput
                  value={addrPhone}
                  onChange={(val) => setAddrPhone(val)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#e1e3e5] bg-[#f8f9fa]">
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="px-3.5 py-1.5 text-[13px] font-medium text-[#303030] bg-white border border-[#c9cccf] hover:bg-[#f6f6f7] rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-3.5 py-1.5 text-[13px] font-medium bg-[#1a1a1a] text-white hover:bg-[#303030] rounded-md transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
