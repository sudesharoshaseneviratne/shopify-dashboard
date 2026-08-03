import { ChevronDown, Search, Columns, Eye, LayoutTemplate, Link as LinkIcon, Settings } from "lucide-react";

export default function Metaobjects() {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <LayoutTemplate className="w-5 h-5" /> Metaobjects
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary text-gray-700">
            Manage
          </button>
          <button className="polaris-btn polaris-btn-primary">
            Add definition
          </button>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-between h-28">
             <div>
                <div className="text-sm font-medium text-gray-800">Available on storefront</div>
                <div className="text-xs text-gray-500 mt-0.5">23 entries</div>
             </div>
             <LinkIcon className="w-4 h-4 text-gray-400" />
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-between h-28">
             <div>
                <div className="text-sm font-medium text-gray-800">Active</div>
                <div className="text-xs text-gray-500 mt-0.5">23 entries</div>
             </div>
             <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-start h-28">
             <div className="text-sm font-medium text-gray-800">Web pages</div>
             <div className="text-xs text-gray-500 mt-0.5">0 entries</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-start h-28">
             <div className="text-sm font-medium text-gray-800">Draft</div>
             <div className="text-xs text-gray-500 mt-0.5">0 entries</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col h-[15rem]">
           <div className="text-sm font-medium text-gray-800 mb-4">Recent entries</div>
           
           <div className="flex-1 space-y-3">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                   <div className="w-5 h-5 bg-gray-100 rounded border flex items-center justify-center">
                     <LayoutTemplate className="w-3 h-3 text-gray-400" />
                   </div>
                   Arts
                </div>
                <div className="text-xs text-gray-500">Genre</div>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                   <div className="w-5 h-5 bg-gray-100 rounded border flex items-center justify-center">
                     <LayoutTemplate className="w-3 h-3 text-gray-400" />
                   </div>
                   Multicolor
                </div>
                <div className="text-xs text-gray-500">Color</div>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                   <div className="w-5 h-5 bg-gray-100 rounded border flex items-center justify-center">
                     <LayoutTemplate className="w-3 h-3 text-gray-400" />
                   </div>
                   School-age children
                </div>
                <div className="text-xs text-gray-500">Recommended age group</div>
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                   <div className="w-5 h-5 bg-gray-100 rounded border flex items-center justify-center">
                     <LayoutTemplate className="w-3 h-3 text-gray-400" />
                   </div>
                   Preschoolers
                </div>
                <div className="text-xs text-gray-500">Recommended age group</div>
             </div>
           </div>

           <div className="mt-4 pt-3 border-t text-sm font-medium text-[#1a1a1a] hover:text-black cursor-pointer">
             View all 23 entries
           </div>
        </div>
        
      </div>

      {/* Main Table Area (Empty State) */}
      <div className="polaris-card  overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-gray-50">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium rounded flex items-center gap-1 hover:bg-gray-100">
              Custom <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
            </button>
            <div className="flex items-center text-gray-500 text-sm font-medium gap-2 px-2 hover:bg-gray-100 cursor-pointer rounded py-1.5 w-64">
              <Search className="w-4 h-4" />
              Searching in Metaobject definitions...
            </div>
          </div>
          <div className="flex items-center gap-2 pr-2 text-gray-400">
            <button className="p-1.5 hover:bg-gray-200 rounded border border-transparent">
              <Columns className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded border border-transparent">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State Body */}
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <h3 className="text-base font-semibold text-[#1a1a1a] mb-1">No definitions found</h3>
          <p className="text-sm text-gray-500">Try changing the filters or search term</p>
        </div>
        
        <div className="p-4 text-center border-t border-[#e1e3e5] bg-white">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Learn more about metaobjects</a>
        </div>
      </div>
    </div>
  );
}
