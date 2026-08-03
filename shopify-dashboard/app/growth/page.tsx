import { Badge } from "@/components/Badge";
import { ChevronDown, Calendar, Search } from "lucide-react";

export default function Growth() {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
        Growth
      </h1>

      {/* Autopilot Banner */}
      <div className="bg-[#f3f4f6] rounded-xl p-6 relative overflow-hidden flex justify-between items-center  border border-[#e1e3e5]">
        <div className="max-w-xl z-10 relative">
          <Badge variant="neutral" className="mb-3 bg-blue-100 text-blue-800 border-transparent">Early access</Badge>
          <h2 className="text-2xl font-semibold mb-2">Run your marketing on autopilot</h2>
          <p className="text-[#1a1a1a] mb-6 leading-relaxed">
            Campaign Autopilot promotes your products across top channels, and keeps refining the strategy while you stay in control.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-1.5 text-sm font-medium text-white polaris-btn polaris-btn-primary">
              Join waitlist
            </button>
            <button className="px-4 py-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary">
              Learn more
            </button>
          </div>
        </div>
        
        {/* Placeholder Graphic for Sunglasses/Chart */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-green-50 to-transparent flex items-center justify-center">
           <div className="w-48 h-32 bg-white rounded-lg shadow-lg relative border border-[#e1e3e5] -rotate-3 translate-x-4">
              <div className="absolute top-2 left-3 text-[10px] font-semibold text-gray-500">Sales by channel</div>
              <div className="absolute top-5 left-3 text-sm font-bold">1,048 <span className="text-green-500 text-[10px]">+12%</span></div>
              <svg className="absolute bottom-4 left-0 w-full h-12" viewBox="0 0 100 30" preserveAspectRatio="none">
                <path d="M0,30 L0,20 C10,15 20,25 30,10 C40,0 50,20 60,15 C70,10 80,25 90,5 C95,0 100,10 100,10 L100,30 Z" fill="rgba(34, 197, 94, 0.2)" />
                <path d="M0,20 C10,15 20,25 30,10 C40,0 50,20 60,15 C70,10 80,25 90,5 C95,0 100,10 100,10" fill="none" stroke="#22c55e" strokeWidth="2" />
              </svg>
              {/* Abstract sunglasses shape */}
              <div className="absolute -top-6 -right-6 w-24 h-12 bg-green-900 rounded-full opacity-90 rotate-12 flex justify-between px-2 items-center">
                <div className="w-8 h-8 rounded-full bg-black opacity-50"></div>
                <div className="w-8 h-8 rounded-full bg-black opacity-50"></div>
              </div>
           </div>
           <button className="absolute top-4 right-4 bg-white border px-2 py-1 rounded text-xs text-gray-500 hover:text-black  flex items-center gap-1">
             X Dismiss
           </button>
        </div>
      </div>

      {/* Performance Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Performance</h3>
          <div className="flex gap-4 items-center">
             <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border polaris-btn polaris-btn-secondary">
               <Calendar className="w-4 h-4 text-gray-500" />
               Last 30 days <ChevronDown className="w-4 h-4 text-gray-500" />
             </button>
             <button className="text-sm font-medium text-[#1a1a1a] hover:text-black">
               View details
             </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Sales Chart Card */}
          <div className="bg-white p-5 rounded-xl border border-[#e1e3e5]  flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-1">
                <div className="text-sm text-[#1a1a1a] font-medium">Sales attributed to marketing</div>
                <div className="text-green-600 text-sm font-semibold flex items-center bg-green-50 px-1.5 rounded">
                  ↗ 64%
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-[20px] font-semibold text-[#202223]">LKR 23,172.00</div>
                <div className="text-xs text-gray-500">of LKR 25,608.00 total store sales</div>
              </div>
            </div>
            
            <div className="mt-8 relative h-16 w-full">
              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                {/* Dotted baseline */}
                <line x1="0" y1="28" x2="100" y2="28" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
                {/* Spiky line chart */}
                <path d="M0,28 L20,28 L22,15 L24,28 L40,28 L43,5 L46,28 L60,28 L63,22 L66,28 L80,28 L82,26 L84,28 L100,28" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Sessions by traffic type Card */}
          <div className="bg-white p-5 rounded-xl border border-[#e1e3e5]  flex flex-col justify-between">
            <div>
              <div className="text-sm text-[#1a1a1a] font-medium mb-3">Sessions by traffic type</div>
              <div className="flex gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Unknown</div>
                  <div className="font-semibold text-sm">386</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Organic</div>
                  <div className="font-semibold text-sm">360</div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Direct</div>
                  <div className="font-semibold text-sm">277</div>
                </div>
              </div>
            </div>
            
            <div className="flex h-12 w-full rounded-md overflow-hidden gap-0.5">
              <div className="bg-cyan-400 h-full" style={{ width: '40%' }}></div>
              <div className="bg-purple-500 h-full" style={{ width: '35%' }}></div>
              <div className="bg-blue-500 h-full" style={{ width: '25%' }}></div>
            </div>
          </div>
        </div>

        {/* Small Channel Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#e1e3e5]  flex flex-col justify-between h-32">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-1.5"><span className="w-3 h-3 bg-red-400 rounded-sm"></span> Google Search</span>
              <span className="text-gray-500 text-xs">316 sessions</span>
            </div>
            <div>
              <div className="text-lg font-semibold">LKR 23,172.00</div>
              <div className="text-[10px] text-gray-500 leading-tight mt-0.5">Order value for <span className="font-semibold text-gray-700">5 orders</span> at <span className="font-semibold text-gray-700">1.58%</span> conversion rate.</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-[#e1e3e5]  flex flex-col justify-between h-32">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-600 rounded-sm"></span> Facebook</span>
              <span className="text-gray-500 text-xs">302 sessions</span>
            </div>
            <div className="text-lg font-semibold">LKR 0.00</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e1e3e5]  flex flex-col justify-between h-32">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-500 rounded-sm"></span> Direct</span>
              <span className="text-gray-500 text-xs">277 sessions</span>
            </div>
            <div className="text-lg font-semibold">LKR 0.00</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e1e3e5]  flex flex-col justify-between h-32">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-600 rounded-sm"></span> Bing</span>
              <span className="text-gray-500 text-xs">37 sessions</span>
            </div>
            <div className="text-lg font-semibold">LKR 0.00</div>
          </div>
        </div>
      </div>

      {/* Campaign Autopilot Section */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Campaign Autopilot</h3>
        <div className="bg-white p-4 rounded-lg border border-[#e1e3e5]  flex items-center justify-between">
          <div className="text-sm text-[#1a1a1a]">
            Campaign Autopilot is in early access, join waitlist and we'll notify you when you're in.
          </div>
          <button className="polaris-btn polaris-btn-secondary">
            Join waitlist
          </button>
        </div>
      </div>
      
      <div className="pb-12 text-center text-sm text-gray-500">
        End of mockup
      </div>

    </div>
  );
}
