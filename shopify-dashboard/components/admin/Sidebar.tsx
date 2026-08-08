"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  HomeIcon, HomeFilledIcon,
  OrderIcon, OrderFilledIcon,
  ProductIcon, ProductFilledIcon,
  PersonIcon, PersonFilledIcon,
  DiscountIcon, DiscountFilledIcon,
  ContentIcon, ContentFilledIcon,
  SettingsFilledIcon 
} from "@shopify/polaris-icons";

const mainNavItems = [
  { name: "Home", href: "/admin", icon: HomeIcon, filledIcon: HomeFilledIcon },
  { name: "Orders", href: "/admin/orders", icon: OrderIcon, filledIcon: OrderFilledIcon, badge: "3", subItems: [
    { name: "Drafts", href: "/admin/orders/drafts" },
    { name: "Abandoned checkouts", href: "/admin/orders/abandoned" },
  ]},
  { name: "Products", href: "/admin/products", icon: ProductIcon, filledIcon: ProductFilledIcon, subItems: [
    { name: "Collections", href: "/admin/products/collections" },
    { name: "Inventory", href: "/admin/products/inventory" },
    { name: "Purchase orders", href: "/admin/products/purchase-orders" },
    { name: "Transfers", href: "/admin/products/transfers" },
    { name: "Gift cards", href: "/admin/products/gift-cards" },
  ]},
  { name: "Customers", href: "/admin/customers", icon: PersonIcon, filledIcon: PersonFilledIcon, subItems: [
    { name: "Segments", href: "/admin/customers/segments" },
    { name: "Companies", href: "/admin/customers/companies" },
  ]},
  { name: "Discounts", href: "/admin/discounts", icon: DiscountIcon, filledIcon: DiscountFilledIcon },
  { name: "Content", href: "/admin/content/metaobjects", icon: ContentIcon, filledIcon: ContentFilledIcon, subItems: [
    { name: "Metaobjects", href: "/admin/content/metaobjects" },
    { name: "Files", href: "/admin/content/files" },
    { name: "Menus", href: "/admin/content/menus" },
    { name: "Blog posts", href: "/admin/content/blog-posts" },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();

  const isCurrentPath = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="w-[240px] bg-[#f1f1f1] h-full overflow-y-auto flex flex-col text-[13px] border-r border-[#e1e3e5] rounded-tl-2xl select-none shrink-0">
      <div className="flex-1 py-2 px-1.5 flex flex-col gap-0.5">
        {mainNavItems.map((item) => {
          const isActive = isCurrentPath(item.href);
          const hasSubActive = item.subItems?.some(
            (sub) => pathname === sub.href || (sub.href === "/admin/orders/drafts" && pathname === "/admin/orders/create")
          );
          const isOrdersDetailActive =
            item.href === "/admin/orders" &&
            pathname.startsWith("/admin/orders/") &&
            pathname !== "/admin/orders/drafts" &&
            pathname !== "/admin/orders/abandoned" &&
            pathname !== "/admin/orders/create";
          const isCustomersDetailActive =
            item.href === "/admin/customers" &&
            pathname.startsWith("/admin/customers/");
          const isMainDirectActive = pathname === item.href || isOrdersDetailActive || isCustomersDetailActive;
          const isExpanded = isActive || hasSubActive || isOrdersDetailActive || isCustomersDetailActive;

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
                  <IconComponent className="w-4 h-4 fill-current shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#e4e5e7] text-[#303030] text-[11px] font-semibold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Render Sub-items (Only when active) */}
              {item.subItems && isExpanded && (
                <div className="ml-7 flex flex-col gap-0.5 mt-0.5 mb-1">
                  {item.subItems.map((sub) => {
                    const isSubActive =
                      pathname === sub.href ||
                      pathname.startsWith(`${sub.href}/`) ||
                      (sub.href === "/admin/orders/drafts" && pathname === "/admin/orders/create");
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-[13px] transition flex items-center justify-between",
                          isSubActive
                            ? "bg-white font-semibold text-[#1a1a1a] shadow-2xs"
                            : "text-[#4a4a4a] hover:bg-[#e3e3e3] hover:text-[#1a1a1a]"
                        )}
                      >
                        <span>{sub.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Settings Item */}
      <div className="p-1.5 border-t border-[#e1e3e5] bg-[#f1f1f1]">
        <Link
          href="/admin/settings"
          className={cn(
            "flex items-center gap-2 px-2.5 py-[6px] rounded-md transition text-[#303030] font-medium hover:bg-[#e3e3e3] hover:text-[#1a1a1a]",
            pathname === "/admin/settings" && "bg-white font-semibold text-[#1a1a1a] shadow-2xs"
          )}
        >
          <SettingsFilledIcon className="w-4 h-4 fill-current shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
