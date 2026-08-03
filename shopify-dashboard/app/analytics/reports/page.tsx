import { FileBarChart2, Search, ArrowDownUp, Settings, ChevronDown, ShoppingBag } from "lucide-react";

export default function Reports() {
  const reports = [
    { name: "Sales by discount codes", category: "Sales", viewed: "Dec 9, 2025" },
    { name: "Sessions by location", category: "Acquisition", viewed: "" },
    { name: "Sessions by referrer", category: "Acquisition", viewed: "" },
    { name: "Sessions by social referrer", category: "Acquisition", viewed: "" },
    { name: "Sessions over time", category: "Acquisition", viewed: "" },
    { name: "Visitors over time", category: "Acquisition", viewed: "" },
    { name: "Visitors right now", category: "Acquisition", viewed: "" },
    { name: "Bounce rate over time", category: "Behavior", viewed: "" },
    { name: "Checkout conversion rate over time", category: "Behavior", viewed: "" },
    { name: "Conversion rate breakdown", category: "Behavior", viewed: "" },
    { name: "Conversion rate over time", category: "Behavior", viewed: "" },
    { name: "Customer behavior", category: "Behavior", viewed: "" },
    { name: "Product recommendation conversions over time", category: "Behavior", viewed: "" },
    { name: "Product recommendations with low engagement", category: "Behavior", viewed: "" },
    { name: "Search conversions over time", category: "Behavior", viewed: "" },
    { name: "Searches by search query", category: "Behavior", viewed: "" },
    { name: "Searches with no clicks", category: "Behavior", viewed: "" },
    { name: "Searches with no results", category: "Behavior", viewed: "" },
    { name: "Sessions by device type", category: "Behavior", viewed: "" },
    { name: "Sessions by landing page", category: "Behavior", viewed: "" },
    { name: "Shop Campaign ROAS", category: "Behavior", viewed: "" },
    { name: "Storefront agent assisted sessions", category: "Behavior", viewed: "" },
    { name: "Storefront agent conversations and feedback", category: "Behavior", viewed: "" },
    { name: "Customer cohort analysis", category: "Customers", viewed: "" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <FileBarChart2 className="w-5 h-5 text-gray-500" /> Reports
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-primary">
            New exploration
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card ">
        
        {/* Table Toolbar Actions */}
        <div className="flex flex-col border-b border-[#e1e3e5]">
          <div className="p-2 border-b border-[#ebebeb] flex items-center gap-2">
             <Search className="w-4 h-4 ml-2 text-gray-400" />
             <input type="text" placeholder="Search reports" className="flex-1 py-1.5 px-2 text-sm outline-none placeholder-gray-500" />
             <div className="flex items-center gap-2 pr-2 text-gray-500">
               <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent">
                 <ArrowDownUp className="w-4 h-4" />
               </button>
             </div>
          </div>
          <div className="p-2 flex items-center gap-2 text-sm text-gray-700">
             <button className="px-3 py-1.5 font-medium bg-gray-100 rounded flex items-center gap-1 hover:bg-gray-200">
               Created by <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
             </button>
             <button className="px-3 py-1.5 font-medium bg-gray-100 rounded flex items-center gap-1 hover:bg-gray-200">
               Category <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-white">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Last viewed <ArrowDownUp className="w-3 h-3 inline text-gray-400" /></th>
                <th className="p-3">Created by</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} className="border-b border-[#ebebeb] h-[44px] hover:bg-gray-50 transition cursor-pointer">
                  <td className="p-3 font-medium text-[#1a1a1a]">{r.name}</td>
                  <td className="p-3 text-[#1a1a1a]">
                     <span className="px-2 py-1 bg-gray-100 text-[#1a1a1a] rounded text-xs font-medium">{r.category}</span>
                  </td>
                  <td className="p-3 text-[#1a1a1a]">{r.viewed}</td>
                  <td className="p-3 text-[#1a1a1a] flex items-center gap-1.5 font-medium">
                    <ShoppingBag className="w-4 h-4 text-[#95bf47] fill-[#95bf47]" /> Shopify
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
}
