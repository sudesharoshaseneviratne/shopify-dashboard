"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { SettingsSidebar, SettingsTab } from "@/components/admin/settings/SettingsSidebar";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { GenericSettingsTab } from "@/components/admin/settings/GenericSettingsTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const router = useRouter();

  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex bg-[#f1f2f4] rounded-xl overflow-hidden shadow-sm border border-[#e1e3e5]">
      {/* Settings Navigation Sidebar */}
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Settings Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative bg-[#f1f2f4]">
        {/* Top Right Close (X) Button */}
        <div className="absolute top-4 right-4 z-10">
          <Link
            href="/admin"
            className="p-1.5 rounded-lg text-[#616161] hover:text-[#1a1a1a] hover:bg-[#e4e5e7] bg-white border border-[#e1e3e5] shadow-2xs transition flex items-center justify-center cursor-pointer"
            title="Exit Settings"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === "general" ? (
          <GeneralSettings />
        ) : (
          <GenericSettingsTab tab={activeTab} />
        )}
      </div>
    </div>
  );
}
