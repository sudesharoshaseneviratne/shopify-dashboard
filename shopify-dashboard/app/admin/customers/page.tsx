"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PersonIcon } from "@shopify/polaris-icons";
import { Badge } from "@/components/admin/Badge";
import { 
  Search, 
  Columns, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  UserCheck, 
  Shield, 
  Mail, 
  Phone,
  Plus
} from "lucide-react";
import { useTableLogic } from "@/hooks/admin/useTableLogic";
import { getAdminCustomersAction, type AdminCustomerItem } from "@/app/actions/customers";

export default function CustomersPage() {
  const [customersData, setCustomersData] = useState<AdminCustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async (showLoadingSpinner = true) => {
    if (showLoadingSpinner) setIsLoading(true);
    try {
      const items = await getAdminCustomersAction();
      setCustomersData(items);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCustomers(false);
  };

  // Filter customers by search term
  const filteredCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customersData;
    const q = searchTerm.toLowerCase().trim();
    return customersData.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [customersData, searchTerm]);

  const {
    sortedData: customers,
    selectedIds,
    sortColumn,
    sortDirection,
    isAllSelected,
    handleSort,
    toggleSelectAll,
    handleRowCheckboxClick,
    isRowSelected,
  } = useTableLogic(filteredCustomers, "id");

  const renderSortIndicator = (colKey: string) => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  const webUsersCount = customersData.filter((c) => c.isRegisteredUser).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-bold text-[#1a1a1a] flex items-center gap-2">
            <PersonIcon className="w-5 h-5 fill-current text-[#1a1a1a]" />
            <span>Customers</span>
          </h1>
          <span className="text-[12px] font-medium bg-[#f1f2f4] text-[#616161] px-2 py-0.5 rounded-full">
            {customersData.length} total
          </span>
          {webUsersCount > 0 && (
            <span className="text-[12px] font-medium bg-[#e6f4ea] text-[#107c41] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#107c41]" />
              {webUsersCount} website users
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition flex items-center gap-1"
            title="Refresh customers from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#005bd3]" : "text-[#616161]"}`} />
          </button>
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
            Export
          </button>
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
            Import
          </button>
          <Link
            href="/admin/customers/new"
            className="px-3.5 py-1 text-[13px] font-semibold text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition inline-flex items-center gap-1 justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add customer</span>
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="polaris-card bg-white border border-[#e1e3e5] rounded-xl shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or location..."
                className="w-full text-[13px] bg-[#fafafa] border border-[#c9cccf] rounded-md pl-8 pr-3 py-1 outline-none focus:border-[#005bd3] focus:bg-white transition"
              />
            </div>
            {selectedIds.size > 0 && (
              <span className="text-[13px] font-medium text-[#1a1a1a]">
                {selectedIds.size} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f1f2f4] rounded-md border border-transparent transition">
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table w-full text-left">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-[#f7f7f7] select-none">
                <th className="px-3 py-2 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                  />
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("name")}>
                  Customer name {renderSortIndicator("name")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("subscription")}>
                  Email subscription {renderSortIndicator("subscription")}
                </th>
                <th className="px-3 py-2 cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("location")}>
                  Location {renderSortIndicator("location")}
                </th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("orders")}>
                  Orders {renderSortIndicator("orders")}
                </th>
                <th className="px-3 py-2 text-right cursor-pointer hover:text-[#1a1a1a] transition" onClick={() => handleSort("spent")}>
                  Amount spent {renderSortIndicator("spent")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#616161]">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#005bd3]" />
                      <span>Loading customers from database...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#616161]">
                    No customers found matching &ldquo;{searchTerm}&rdquo;.
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => {
                  const selected = isRowSelected(customer.id);
                  return (
                    <tr
                      key={customer.id}
                      className={`border-b border-[#f1f1f1] h-[44px] transition ${
                        selected ? "bg-[#f4f6f8]" : "hover:bg-[#f7f7f7]"
                      }`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          onClick={(e) => handleRowCheckboxClick(e, idx, customer.id)}
                          className="rounded-[4px] border-[#c9cccf] cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/customers/${customer.id}`} className="font-medium text-[#1a1a1a] hover:underline">
                            {customer.name}
                          </Link>
                          {customer.isRegisteredUser && (
                            <span 
                              className="px-1.5 py-0.5 rounded bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-semibold tracking-tight inline-flex items-center gap-0.5"
                              title="Registered Storefront Website Account"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Web User</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8c8c8c] truncate max-w-xs">
                          {customer.email}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant={customer.subscription === "Subscribed" ? "success" : "neutral"} icon="none">
                          {customer.subscription}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-[#616161] text-[13px]">
                        {customer.location ? (
                          customer.location
                        ) : (
                          <span className="text-[#8c8c8c]">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-[#1a1a1a] font-medium text-right text-[13px]">{customer.orders}</td>
                      <td className="px-3 py-2 text-[#1a1a1a] font-medium text-right text-[13px]">{customer.spent}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
