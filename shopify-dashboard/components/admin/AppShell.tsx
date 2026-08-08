"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "@/components/admin/TopBar";
import { Sidebar } from "@/components/admin/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname === "/login";

  if (isLoginPage) {
    return <div className="w-full min-h-screen bg-[#0b0d0e]">{children}</div>;
  }

  return (
    <>
      <TopBar />
      <div className="flex h-[calc(100vh-48px)] overflow-hidden bg-[#1a1a1a]">
        <div className="flex w-full h-full bg-[#f1f1f1] rounded-t-2xl overflow-hidden shadow-2xl">
          <Sidebar />
          <main className="flex-1 overflow-y-auto px-[20px] py-[16px] bg-[#f1f2f4]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
