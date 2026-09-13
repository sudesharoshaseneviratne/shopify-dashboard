import type { Metadata } from "next";
import { AppShell } from "@/components/admin/AppShell";

export const metadata: Metadata = {
  title: "Merchant Dashboard | Prasanthi Craft",
  description: "Merchant Management Dashboard for Prasanthi Craft",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
