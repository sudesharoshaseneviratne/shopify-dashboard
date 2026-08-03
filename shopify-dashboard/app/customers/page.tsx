"use client";

import { Badge } from "@/components/Badge";
import { Search, Columns, Users, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { useTableLogic } from "@/hooks/useTableLogic";

const initialCustomers = [
  { id: 1, name: "ekanayakewasantha58@gmail.com", subscription: "Subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 2, name: "Fathima Hirshard", subscription: "Not subscribed", location: "Colombo, Sri Lanka", orders: "1", spent: "Rs 2,060.00" },
  { id: 3, name: "Isuru Abeyrama", subscription: "Not subscribed", location: "Tangalle, Sri Lanka", orders: "1", spent: "Rs 3,960.00" },
  { id: 4, name: "E. P. H. De Silva", subscription: "Not subscribed", location: "Polgolla, Sri Lanka", orders: "1", spent: "Rs 2,436.00" },
  { id: 5, name: "Priyanka Rupasinghe", subscription: "Not subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 6, name: "Alex Johnson", subscription: "Subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 7, name: "Krishni Maheshika", subscription: "Subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 8, name: "fathima Raihana", subscription: "Not subscribed", location: "AMPARA, Sri Lanka", orders: "1", spent: "Rs 4,200.00" },
  { id: 9, name: "Pradeepa Prasadini", subscription: "Not subscribed", location: "Select an option..., Sri Lanka", orders: "1", spent: "Rs 8,560.00" },
  { id: 10, name: "Lakmi Nimeshika", subscription: "Not subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 11, name: "Manjula Karunanayaka", subscription: "Not subscribed", location: "Hokandara South, Hokandara, Sri Lanka", orders: "1", spent: "Rs 4,392.00" },
  { id: 12, name: "Nilushi Wickramasinghe", subscription: "Subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 13, name: "chanu yehansa", subscription: "Not subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 14, name: "Victoria Bloom", subscription: "Not subscribed", location: "Wariyapola, Sri Lanka", orders: "1", spent: "Rs 3,400.00" },
  { id: 15, name: "Dahamsiri HA", subscription: "Not subscribed", location: "Embilipitiya, Sri Lanka", orders: "1", spent: "Rs 12,324.00" },
  { id: 16, name: "Dulanjali Gamage", subscription: "Subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 17, name: "Ethan Williams", subscription: "Not subscribed", location: "", orders: "0", spent: "Rs 0.00" },
  { id: 18, name: "Dihan Hettige", subscription: "Not subscribed", location: "Colombo, Sri Lanka", orders: "1", spent: "Rs 1,612.00" },
  { id: 19, name: "learnix.lk@ilovemyemail.net", subscription: "Not subscribed", location: "Sri Lanka", orders: "0", spent: "Rs 0.00" },
  { id: 20, name: "Dhammika Wijesooriya", subscription: "Not subscribed", location: "", orders: "0", spent: "Rs 0.00" },
];

export default function Customers() {
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
  } = useTableLogic(initialCustomers, "id");

  const renderSortIndicator = (colKey: string) => {
    if (sortColumn !== colKey) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#1a1a1a] inline ml-0.5" />
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[18px] font-semibold text-[#1a1a1a] flex items-center gap-2">
          <div className="bg-white p-1 rounded-md border border-[#e1e3e5] shadow-xs">
            <Users className="w-4 h-4 text-[#303030]" />
          </div>
          Customers
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
            Export
          </button>
          <button className="px-2.5 py-1 text-[13px] font-medium border border-[#c9cccf] rounded-md bg-white hover:bg-[#f6f6f7] text-[#303030] shadow-2xs transition">
            Import
          </button>
          <button className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs transition">
            Add customer
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="polaris-card">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#616161] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search customers"
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
          <table className="polaris-table">
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
              {customers.map((customer, idx) => {
                const selected = isRowSelected(customer.id);
                return (
                  <tr
                    key={customer.id}
                    className={`border-b border-[#f1f1f1] h-[40px] transition ${
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
                    <td className="px-3 py-2 font-medium text-[#1a1a1a] hover:underline cursor-pointer">{customer.name}</td>
                    <td className="px-3 py-2">
                      <Badge variant={customer.subscription === "Subscribed" ? "success" : "neutral"} icon="none">
                        {customer.subscription}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-[#616161]">
                      {customer.location ? (
                        customer.location
                      ) : (
                        <span className="text-[#8c8c8c]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[#1a1a1a] font-medium text-right">{customer.orders}</td>
                    <td className="px-3 py-2 text-[#1a1a1a] font-medium text-right">{customer.spent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
