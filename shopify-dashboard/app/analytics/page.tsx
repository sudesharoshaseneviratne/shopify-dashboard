import { Calendar, ChevronDown, MoreHorizontal } from "lucide-react";

export default function Analytics() {
  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           Analytics
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Today <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Aug 2, 2026 <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-3 py-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary flex items-center gap-2">
            <span className="font-serif italic font-bold">LKR</span> Rs
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button className="p-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button className="polaris-btn polaris-btn-secondary">
            Try targets <ChevronDown className="w-4 h-4" />
          </button>
          <button className="polaris-btn polaris-btn-primary">
            New exploration
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-between h-24 hover:shadow-md cursor-pointer transition">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start">Gross sales</div>
          <div className="flex items-baseline justify-between mt-2">
             <div className="text-lg font-semibold">LKR 0.00 <span className="text-gray-400 font-normal">—</span></div>
             <div className="w-8 h-[2px] bg-blue-300"></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-between h-24 hover:shadow-md cursor-pointer transition">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start">Returning customer rate</div>
          <div className="flex items-baseline justify-between mt-2">
             <div className="text-lg font-semibold">0% <span className="text-gray-400 font-normal">—</span></div>
             <div className="w-8 h-[2px] bg-blue-300"></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-between h-24 hover:shadow-md cursor-pointer transition">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start">Orders fulfilled</div>
          <div className="flex items-baseline justify-between mt-2">
             <div className="text-lg font-semibold">0 <span className="text-gray-400 font-normal">—</span></div>
             <div className="w-8 h-[2px] bg-blue-300"></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex flex-col justify-between h-24 hover:shadow-md cursor-pointer transition">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start">Orders</div>
          <div className="flex items-baseline justify-between mt-2">
             <div className="text-lg font-semibold">0 <span className="text-gray-400 font-normal">—</span></div>
             <div className="w-8 h-[2px] bg-blue-300"></div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total sales over time */}
        <div className="bg-white p-6 rounded-lg border border-[#e1e3e5]  col-span-2 flex flex-col">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start mb-1">Total sales over time</div>
          <div className="text-2xl font-semibold mb-6">LKR 0.00 <span className="text-gray-400 font-normal">—</span></div>
          
          <div className="flex-1 relative min-h-[250px] flex flex-col">
            <div className="flex-1 border-b border-[#ebebeb] relative">
              <span className="absolute -left-2 -top-2 text-xs text-gray-400 bg-white pr-2">LKR 10</span>
            </div>
            <div className="flex-1 border-b border-[#ebebeb] relative">
              <span className="absolute -left-2 -top-2 text-xs text-gray-400 bg-white pr-2">LKR 5</span>
            </div>
            <div className="flex-1 border-b border-gray-300 relative border-dashed">
              <span className="absolute -left-2 -top-2 text-xs text-gray-400 bg-white pr-2">LKR 0</span>
              {/* The Blue Line Mockup (flat line on 0) */}
              <div className="absolute bottom-0 left-8 right-0 h-[2px] bg-blue-500 translate-y-[1px]"></div>
            </div>
            {/* X axis labels */}
            <div className="flex justify-between text-[10px] text-gray-400 pt-2 ml-8">
               <span>12 AM</span><span>2 AM</span><span>4 AM</span><span>6 AM</span><span>8 AM</span><span>10 AM</span><span>12 PM</span><span>2 PM</span><span>4 PM</span><span>6 PM</span><span>8 PM</span><span>10 PM</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Aug 3, 2026</div>
            <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Aug 2, 2026</div>
          </div>
        </div>

        {/* Total sales breakdown */}
        <div className="bg-white p-6 rounded-lg border border-[#e1e3e5]  flex flex-col">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start mb-6">Total sales breakdown</div>
          <div className="flex-1">
             <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Gross sales</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Discounts</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Sales reversals</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Net sales</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Shipping charges</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Return fees</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr className="border-b border-[#ebebeb]">
                    <td className="py-2.5 text-blue-600 hover:underline cursor-pointer">Taxes</td>
                    <td className="py-2.5 text-right font-medium">LKR 0.00</td>
                    <td className="py-2.5 text-right text-gray-400 w-8">—</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-blue-600 hover:underline cursor-pointer font-semibold">Total sales</td>
                    <td className="py-3 text-right font-bold text-base">LKR 0.00</td>
                    <td className="py-3 text-right text-gray-400 w-8">—</td>
                  </tr>
                </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total sales by sales channel */}
        <div className="bg-white p-6 rounded-lg border border-[#e1e3e5]  flex flex-col min-h-[250px]">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start mb-6">Total sales by sales channel</div>
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
             No data for this date range
          </div>
        </div>

        {/* Average order value over time */}
        <div className="bg-white p-6 rounded-lg border border-[#e1e3e5]  flex flex-col min-h-[250px]">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start mb-1">Average order value over time</div>
          <div className="text-xl font-semibold mb-6">LKR 0.00 <span className="text-gray-400 font-normal">—</span></div>
          
          <div className="flex-1 relative flex flex-col text-[10px]">
            <div className="flex-1 border-b border-[#ebebeb] relative"><span className="absolute -left-2 -top-2 text-gray-400 bg-white pr-1">LKR 10</span></div>
            <div className="flex-1 border-b border-[#ebebeb] relative"><span className="absolute -left-2 -top-2 text-gray-400 bg-white pr-1">LKR 5</span></div>
            <div className="flex-1 border-b border-gray-300 relative border-dashed">
              <span className="absolute -left-2 -top-2 text-gray-400 bg-white pr-1">LKR 0</span>
              <div className="absolute bottom-0 left-6 right-0 h-[2px] bg-blue-500 translate-y-[1px]"></div>
            </div>
            <div className="flex justify-between text-gray-400 pt-2 ml-6">
               <span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Aug 3, 2026</div>
            <div className="flex items-center gap-1.5 text-xs text-[#1a1a1a]"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Aug 2, 2026</div>
          </div>
        </div>

        {/* Total sales by product */}
        <div className="bg-white p-6 rounded-lg border border-[#e1e3e5]  flex flex-col min-h-[250px]">
          <div className="text-sm font-medium text-gray-800 border-b border-dotted border-gray-400 inline-block self-start mb-6">Total sales by product</div>
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
             No data for this date range
          </div>
        </div>

      </div>

    </div>
  );
}
