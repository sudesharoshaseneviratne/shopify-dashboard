import { ArrowRightLeft, MapPin } from "lucide-react";

export default function Transfers() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <ArrowRightLeft className="w-5 h-5 text-gray-400 rotate-90" /> Transfers
        </h1>
      </div>

      {/* Main Area */}
      <div className="polaris-card  flex flex-col min-h-[600px] justify-between">
        
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          
          {/* Mockup Illustration */}
          <div className="relative w-64 h-40 mb-8 flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute inset-0 bg-gray-50 rounded-full scale-75 -z-10"></div>
            
            {/* Left Card */}
            <div className="absolute left-6 top-6 w-20 h-28 bg-white rounded-lg shadow-md border border-[#e1e3e5] flex flex-col p-2 z-10 -rotate-3 transition-transform hover:rotate-0">
               <div className="flex justify-end mb-2">
                 <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                   <MapPin className="w-2.5 h-2.5 text-gray-400" />
                 </div>
               </div>
               <div className="flex-1 bg-gray-300 rounded-t border-b border-gray-400 w-2/3 self-end relative">
                 <div className="absolute top-0 right-3 w-1.5 h-full bg-gray-400"></div>
               </div>
               <div className="h-6 mt-1 flex items-center justify-center text-xs font-semibold text-gray-700 bg-gray-100 rounded-sm">
                 6
               </div>
            </div>

            {/* Right Card */}
            <div className="absolute right-6 top-6 w-20 h-28 bg-white rounded-lg shadow-md border border-[#e1e3e5] flex flex-col p-2 z-10 rotate-3 transition-transform hover:rotate-0">
               <div className="flex justify-end mb-2">
                 <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center">
                   <MapPin className="w-2.5 h-2.5 text-teal-600" />
                 </div>
               </div>
               <div className="flex-1 bg-teal-600/80 rounded-t border-b border-teal-700 w-2/3 self-end relative">
                 <div className="absolute top-0 right-3 w-1.5 h-full bg-teal-700/50"></div>
               </div>
               <div className="h-6 mt-1 flex items-center justify-center text-xs font-semibold text-gray-700 bg-gray-100 rounded-sm">
                 4
               </div>
            </div>

            {/* Center Arrow */}
            <div className="absolute z-20 w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

          </div>

          <h2 className="text-base font-semibold text-[#1a1a1a] mb-1">Move inventory between locations</h2>
          <p className="text-gray-500 mb-6 text-sm text-center">
            Move and track inventory between your business locations.
          </p>
          <button className="px-4 py-2 text-sm font-medium text-white polaris-btn polaris-btn-primary">
            Create transfer
          </button>
        </div>
        
        <div className="p-4 text-center border-t border-[#e1e3e5]">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Learn more about transfers</a>
        </div>
      </div>
    </div>
  );
}
