import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { CartProvider } from "@/lib/store/cartContext";
import { StoreNavbar } from "@/components/store/Navbar";
import { StoreFooter } from "@/components/store/Footer";
import { CartDrawer } from "@/components/store/CartDrawer";
import { QuickViewModal } from "@/components/store/QuickViewModal";
import { getStoreSettings, getStoreCollections } from "@/lib/db/queries";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Satoshi DeFi | Sovereign Hardware, Cold Custody & Hydro-Mining",
  description: "Mathematical-grade Bitcoin cold storage, ultra-silent liquid cooled ASICs, and zero-knowledge sovereign nodes for decentralized financial independence.",
};

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, collections] = await Promise.all([
    getStoreSettings(),
    getStoreCollections(),
  ]);

  return (
    <div
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#FFB800] selection:text-slate-950 font-body relative overflow-x-clip`}
    >
      <CartProvider>
        {/* Storefront Content Shell */}
        <div suppressHydrationWarning className="relative z-10 flex flex-col min-h-screen">
          <StoreNavbar settings={settings} collections={collections} />
          <main suppressHydrationWarning className="flex-1">{children}</main>
          <StoreFooter />
        </div>

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <QuickViewModal />
      </CartProvider>
    </div>
  );
}
