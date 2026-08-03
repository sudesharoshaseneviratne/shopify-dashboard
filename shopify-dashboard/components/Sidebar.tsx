"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, HomeFilledIcon,
  OrderIcon, OrderFilledIcon,
  ProductIcon, ProductFilledIcon,
  PersonIcon, PersonFilledIcon,
  ChartHistogramGrowthIcon,
  DiscountIcon, DiscountFilledIcon,
  ContentIcon, ContentFilledIcon,
  MarketsIcon, MarketsFilledIcon,
  ChartVerticalIcon, ChartVerticalFilledIcon,
  ChatIcon,
  StoreOnlineIcon, StoreFilledIcon,
  AutomationIcon, AutomationFilledIcon,
  SettingsIcon, SettingsFilledIcon 
} from "@shopify/polaris-icons";

const mainNavItems = [
  { name: "Home", href: "/", icon: HomeIcon, filledIcon: HomeFilledIcon },
  { name: "Orders", href: "/orders", icon: OrderIcon, filledIcon: OrderFilledIcon, badge: "3", subItems: [
    { name: "Drafts", href: "/orders/drafts" },
    { name: "Abandoned checkouts", href: "/orders/abandoned" },
  ]},
  { name: "Products", href: "/products", icon: ProductIcon, filledIcon: ProductFilledIcon, subItems: [
    { name: "Collections", href: "/products/collections" },
    { name: "Inventory", href: "/products/inventory" },
    { name: "Purchase orders", href: "/products/purchase-orders" },
    { name: "Transfers", href: "/products/transfers" },
    { name: "Gift cards", href: "/products/gift-cards" },
  ]},
  { name: "Customers", href: "/customers", icon: PersonIcon, filledIcon: PersonFilledIcon, subItems: [
    { name: "Segments", href: "/customers/segments" },
    { name: "Companies", href: "/customers/companies" },
  ]},
  { name: "Growth", href: "/growth", icon: ChartHistogramGrowthIcon, filledIcon: ChartHistogramGrowthIcon, subItems: [
    { name: "Attribution", href: "/growth/attribution" },
    { name: "Campaigns", href: "/growth/campaigns" },
  ]},
  { name: "Discounts", href: "/discounts", icon: DiscountIcon, filledIcon: DiscountFilledIcon },
  { name: "Content", href: "/content/metaobjects", icon: ContentIcon, filledIcon: ContentFilledIcon, subItems: [
    { name: "Metaobjects", href: "/content/metaobjects" },
    { name: "Files", href: "/content/files" },
    { name: "Menus", href: "/content/menus" },
    { name: "Blog posts", href: "/content/blog-posts" },
  ]},
  { name: "Markets", href: "/markets", icon: MarketsIcon, filledIcon: MarketsFilledIcon, subItems: [
    { name: "Catalogs", href: "/markets/catalogs" },
    { name: "Rollouts", href: "/markets/rollouts" },
  ]},
  { name: "Analytics", href: "/analytics", icon: ChartVerticalIcon, filledIcon: ChartVerticalFilledIcon, subItems: [
    { name: "Reports", href: "/analytics/reports" },
  ]},
];

const salesChannels = [
  { name: "Inbox", href: "/inbox", icon: ChatIcon, filledIcon: ChatIcon, badge: "1" },
  { name: "Online Store", href: "/online-store", icon: StoreOnlineIcon, filledIcon: StoreFilledIcon },
];

const apps = [
  { name: "Messaging", href: "/apps/messaging", icon: ChatIcon, filledIcon: ChatIcon },
  { name: "Flow", href: "/apps/flow", icon: AutomationIcon, filledIcon: AutomationFilledIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  const isCurrentPath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="w-[240px] bg-[#f1f1f1] h-full overflow-y-auto flex flex-col text-[13px] border-r border-[#e1e3e5] rounded-tl-2xl select-none shrink-0">
      <div className="flex-1 py-2 px-1.5 flex flex-col gap-0.5">
        {mainNavItems.map((item) => {
          const isActive = isCurrentPath(item.href);
          const hasSubActive = item.subItems?.some((sub) => pathname === sub.href);
          const isMainDirectActive = pathname === item.href;
          
          // Use outline icon when active/transparent, dark filled icon when inactive
          const IconComponent = (isMainDirectActive || hasSubActive) ? item.icon : item.filledIcon;

          return (
            <div key={item.name} className="flex flex-col">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-2.5 py-[6px] rounded-md transition",
                  isMainDirectActive
                    ? "bg-white font-semibold text-[#1a1a1a] shadow-2xs"
                    : hasSubActive
                    ? "text-[#1a1a1a] font-semibold hover:bg-[#e3e3e3]"
                    : "text-[#303030] font-medium hover:bg-[#e3e3e3] hover:text-[#1a1a1a]"
                )}
              >
                <div className="flex items-center gap-2">
                  <IconComponent className={cn("w-4 h-4 shrink-0 fill-current", isMainDirectActive || hasSubActive ? "text-[#1a1a1a]" : "text-[#303030]")} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#e3e3e3] text-[#4a4a4a] text-[11px] px-1.5 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>

              {(isActive || hasSubActive) && item.subItems && (
                <div className="flex flex-col ml-3.5 mt-0.5 mb-0.5 gap-0.5 pl-2.5 border-l border-[#c9cccf]">
                  {item.subItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-[5px] rounded-md transition text-[13px]",
                          isSubActive 
                            ? "bg-white text-[#1a1a1a] font-semibold shadow-2xs" 
                            : "text-[#4a4a4a] font-normal hover:text-[#1a1a1a] hover:bg-[#e3e3e3]"
                        )}
                      >
                        {isSubActive && (
                          <span className="text-[#616161] text-[11px]">└</span>
                        )}
                        <span>{subItem.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-3 mb-0.5 px-2.5 flex items-center justify-between text-[#5c5f62] font-semibold text-[11px] hover:text-[#1a1a1a] cursor-pointer">
          <span>Sales channels</span>
          <span>›</span>
        </div>
        {salesChannels.map((item) => {
          const isChannelActive = pathname === item.href;
          const IconComponent = isChannelActive ? item.icon : item.filledIcon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-2.5 py-[6px] rounded-md transition",
                isChannelActive
                  ? "bg-white font-semibold text-[#1a1a1a] shadow-2xs"
                  : "text-[#303030] font-medium hover:bg-[#e3e3e3] hover:text-[#1a1a1a]"
              )}
            >
              <div className="flex items-center gap-2">
                <IconComponent className={cn("w-4 h-4 shrink-0 fill-current", isChannelActive ? "text-[#1a1a1a]" : "text-[#303030]")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-[#e3e3e3] text-[#4a4a4a] text-[11px] px-1.5 py-0.5 rounded-full font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-3 mb-0.5 px-2.5 flex items-center justify-between text-[#5c5f62] font-semibold text-[11px] hover:text-[#1a1a1a] cursor-pointer">
          <span>Apps</span>
          <span>›</span>
        </div>
        {apps.map((item) => {
          const isAppActive = pathname === item.href;
          const IconComponent = isAppActive ? item.icon : item.filledIcon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2.5 py-[6px] rounded-md transition",
                isAppActive
                  ? "bg-white font-semibold text-[#1a1a1a] shadow-2xs"
                  : "text-[#303030] font-medium hover:bg-[#e3e3e3] hover:text-[#1a1a1a]"
              )}
            >
              <IconComponent className={cn("w-4 h-4 shrink-0 fill-current", isAppActive ? "text-[#1a1a1a]" : "text-[#303030]")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-1.5 py-2 border-t border-[#e1e3e5] bg-[#f1f1f1]">
        {(() => {
          const isSettingsActive = pathname === "/settings";
          const IconComponent = isSettingsActive ? SettingsIcon : SettingsFilledIcon;
          return (
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-md transition",
                isSettingsActive
                  ? "bg-white font-semibold text-[#1a1a1a] shadow-2xs"
                  : "text-[#303030] font-medium hover:bg-[#e3e3e3] hover:text-[#1a1a1a]"
              )}
            >
              <IconComponent className={cn("w-4 h-4 shrink-0 fill-current", isSettingsActive ? "text-[#1a1a1a]" : "text-[#303030]")} />
              <span>Settings</span>
            </Link>
          );
        })()}
      </div>
    </div>
  );
}
