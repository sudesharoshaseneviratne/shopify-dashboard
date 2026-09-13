"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/admin/TopBar";
import { Sidebar } from "@/components/admin/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = pathname?.startsWith("/admin");

  if (!isAdmin) {
    return (
      <div 
        suppressHydrationWarning 
        className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#FFB800] selection:text-slate-950"
      >
        {children}
      </div>
    );
  }

  const isAuthPage = 
    pathname === "/admin/login" || 
    pathname === "/login" || 
    pathname?.startsWith("/admin/auth");
  const isBulkEditor = pathname?.startsWith("/admin/products/bulk-editor") || pathname?.startsWith("/admin/bulk-editor");

  if (isAuthPage) {
    return <div suppressHydrationWarning className="w-full min-h-screen bg-[#0b0d0e]">{children}</div>;
  }

  if (isBulkEditor) {
    return <div suppressHydrationWarning className="w-screen h-screen overflow-hidden bg-white text-[#1a1a1a] select-none">{children}</div>;
  }

  return (
    <div suppressHydrationWarning className="min-h-screen">
      <TopBar />
      <div className="flex h-[calc(100vh-48px)] overflow-hidden bg-[#1a1a1a]">
        <div className="flex w-full h-full bg-[#f1f1f1] rounded-t-2xl overflow-hidden shadow-2xl">
          <Sidebar />
          <main className="flex-1 overflow-y-auto px-[20px] py-[16px] bg-[#f1f2f4]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
