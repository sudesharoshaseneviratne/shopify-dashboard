import { Badge } from "@/components/Badge";
import { Search, Globe, ArrowRightToLine, ArrowDownUp, Columns, Network, Sparkles, X } from "lucide-react";

export default function Markets() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
          <Globe className="w-5 h-5" /> Markets
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-secondary">
            <Network className="w-4 h-4" /> Graph view
          </button>
          <button className="polaris-btn polaris-btn-primary">
            Create market
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="polaris-card ">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5]">
          <div className="flex items-center gap-2 flex-1">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 border border-transparent">
              <ArrowRightToLine className="w-4 h-4" />
            </button>
            <div className="flex-1 relative flex items-center max-w-2xl">
              <Search className="w-4 h-4 absolute left-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search in all markets" 
                className="w-full pl-9 pr-4 py-1 outline-none placeholder-gray-500 bg-gray-50 border border-[#e1e3e5] rounded-md"
              />
            </div>
          </div>
          <div className="flex items-center gap-1 pr-2 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent">
              <Columns className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent">
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="polaris-table whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#e1e3e5] text-[#616161] text-[12px] font-medium bg-white">
                <th className="p-3 w-80">Market <ArrowDownUp className="w-3 h-3 inline text-gray-400" /></th>
                <th className="p-3">Status</th>
                <th className="p-3">Includes</th>
                <th className="p-3">Customizations</th>
              </tr>
            </thead>
            <tbody>
              {/* Active Market */}
              <tr className="border-b border-[#ebebeb] h-[44px] hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-[#1a1a1a] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" /> Sri Lanka
                </td>
                <td className="p-3">
                  <Badge variant="success">Active</Badge>
                </td>
                <td className="p-3 text-gray-700 flex items-center gap-2">
                  <span className="text-lg leading-none">🇱🇰</span> Sri Lanka
                </td>
                <td className="p-3"></td>
              </tr>
              
              {/* Suggestions */}
              <tr className="border-b border-[#ebebeb] bg-[#f9f8fe] hover:bg-[#f3f0fd] transition group cursor-pointer">
                <td colSpan={3} className="p-3 font-medium text-[#7a49a5] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Create United States and Canada Market <span className="bg-[#e9dfff] px-1.5 py-0.5 rounded text-xs">+</span>
                </td>
                <td className="p-3 text-right">
                  <button className="p-1 text-[#7a49a5] opacity-50 hover:opacity-100">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr className="border-b border-[#ebebeb] bg-[#f9f8fe] hover:bg-[#f3f0fd] transition group cursor-pointer">
                <td colSpan={3} className="p-3 font-medium text-[#7a49a5] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Create European Union Market <span className="bg-[#e9dfff] px-1.5 py-0.5 rounded text-xs">+</span>
                </td>
                <td className="p-3 text-right">
                  <button className="p-1 text-[#7a49a5] opacity-50 hover:opacity-100">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-2 text-center bg-gray-50 rounded-b-lg border-t border-[#e1e3e5]">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Learn more about markets</a>
        </div>
      </div>
    </div>
  );
}
