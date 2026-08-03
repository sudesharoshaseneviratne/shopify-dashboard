import { ArrowDownUp, Search, Columns, ClipboardList, Package2, Tag } from "lucide-react";

export default function PurchaseOrders() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
          <ClipboardList className="w-5 h-5" /> Purchase orders
        </h1>
      </div>

      {/* Main Area */}
      <div className="polaris-card  overflow-hidden flex flex-col min-h-[600px]">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-[#e1e3e5] bg-white">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 rounded flex items-center gap-1">
              All <ArrowDownUp className="w-3 h-3 text-gray-500 ml-1" />
            </button>
            <div className="flex items-center text-gray-500 text-sm font-medium gap-2 px-2 hover:bg-gray-50 cursor-pointer rounded py-1.5">
              <Search className="w-4 h-4" />
              Search and filter
            </div>
          </div>
          <div className="flex items-center gap-2 pr-2 text-gray-500">
            <button className="p-1.5 hover:bg-gray-100 rounded border border-transparent">
              <Columns className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50/50">
          
          {/* Mockup Illustration */}
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute inset-0 bg-[#f5f1e8] rounded-full scale-90 -z-10"></div>
            
            {/* Brown Boxes */}
            <div className="absolute right-6 top-16 w-16 h-20 bg-[#c49a62] rounded-sm shadow border border-[#a8824f]">
               <div className="absolute top-1/2 left-0 right-0 h-px bg-[#a8824f]"></div>
            </div>
            
            {/* Clipboard/Document */}
            <div className="absolute left-10 top-10 w-24 h-32 bg-white rounded-md shadow-lg border border-[#e1e3e5] flex flex-col p-3 z-10">
               <div className="flex gap-2 items-center mb-3">
                 <div className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center"><Tag className="w-2.5 h-2.5 text-teal-600" /></div>
                 <div className="w-10 h-1.5 bg-gray-200 rounded"></div>
               </div>
               <div className="flex gap-2 items-center mb-3">
                 <div className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center"><Package2 className="w-2.5 h-2.5 text-teal-600" /></div>
                 <div className="w-8 h-1.5 bg-gray-200 rounded"></div>
               </div>
               <div className="flex gap-2 items-center">
                 <div className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center"><Tag className="w-2.5 h-2.5 text-teal-600" /></div>
                 <div className="w-12 h-1.5 bg-gray-200 rounded"></div>
               </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">Manage your purchase orders</h2>
          <p className="text-gray-500 mb-6 text-sm text-center">
            Track and receive inventory ordered from suppliers.
          </p>
          <button className="px-4 py-2 text-sm font-medium text-white polaris-btn polaris-btn-primary">
            Create purchase order
          </button>
        </div>
        
        <div className="p-4 text-center bg-gray-50 border-t border-[#e1e3e5]">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Learn more about purchase orders</a>
        </div>
      </div>
    </div>
  );
}
