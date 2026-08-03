import { Gift } from "lucide-react";

export default function GiftCards() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <Gift className="w-5 h-5 text-gray-500" /> Gift cards
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded  bg-gray-50 hover:bg-gray-100 flex items-center gap-1">
            Export
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="polaris-card  flex flex-col min-h-[600px] justify-between">
        
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          
          {/* Mockup Illustration */}
          <div className="relative w-48 h-40 mb-6 flex items-center justify-center">
            {/* Background blob */}
            <div className="absolute inset-0 bg-[#e6f4f1] rounded-[40%] scale-75 -z-10 -translate-x-2 translate-y-2"></div>
            
            {/* Gift Box */}
            <div className="relative w-28 h-20 bg-[#409b91] rounded-sm shadow-md flex items-center justify-center overflow-hidden">
               {/* Vertical Ribbon */}
               <div className="absolute w-4 h-full bg-[#348077]"></div>
               {/* Horizontal Ribbon */}
               <div className="absolute h-4 w-full bg-[#348077]"></div>
               
               {/* Bow loops */}
               <div className="absolute -top-4 w-12 h-6 flex justify-between">
                 <div className="w-6 h-6 border-[3px] border-[#348077] rounded-full translate-x-2"></div>
                 <div className="w-6 h-6 border-[3px] border-[#348077] rounded-full -translate-x-2"></div>
               </div>
            </div>
          </div>

          <h2 className="text-base font-semibold text-[#1a1a1a] mb-2">Start selling gift cards</h2>
          <p className="text-gray-500 mb-6 text-sm text-center max-w-sm">
            Add gift card products to sell or create gift cards and send them directly to your customers.
          </p>
          <div className="flex gap-3 mb-6">
            <button className="px-4 py-2 text-sm font-medium border polaris-btn polaris-btn-secondary">
              Create gift card
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white polaris-btn polaris-btn-primary">
              Add gift card product
            </button>
          </div>

          <p className="text-xs text-gray-500">
            By using gift cards, you agree to our <a href="#" className="underline text-[#1a1a1a]">Terms of Service</a>
          </p>
        </div>
        
        <div className="p-4 text-center border-t border-[#e1e3e5]">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Learn more about gift cards</a>
        </div>
      </div>
    </div>
  );
}
