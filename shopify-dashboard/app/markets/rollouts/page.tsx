import { Rocket } from "lucide-react";

export default function Rollouts() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[20px] font-semibold text-[#202223] flex items-center gap-2">
           <Rocket className="w-5 h-5 text-gray-500" /> Rollouts
        </h1>
        <div className="flex items-center gap-2">
          <button className="polaris-btn polaris-btn-primary">
            Create rollout
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="polaris-card  flex flex-col min-h-[500px] justify-between">
        
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          
          {/* Mockup Illustration */}
          <div className="relative w-48 h-40 mb-6 flex items-center justify-center">
            {/* Background circle */}
            <div className="absolute inset-0 bg-gray-100 rounded-[50%] scale-[0.8] -z-10"></div>
            
            {/* Tree Diagram Illustration */}
            <div className="relative w-36 h-32 flex flex-col items-center justify-between z-10">
               {/* Top Node */}
               <div className="w-8 h-8 bg-white border-2 border-[#e1e3e5] rounded flex items-center justify-center  relative z-20">
                 <div className="w-4 h-4 text-gray-400 bg-gray-200 rounded-full flex flex-col items-center overflow-hidden">
                   <div className="w-2 h-2 bg-white rounded-full mt-0.5"></div>
                   <div className="w-3 h-2 bg-white rounded-t-lg mt-0.5"></div>
                 </div>
               </div>
               
               {/* Connecting Lines */}
               <div className="absolute top-8 w-px h-6 bg-gray-300"></div>
               <div className="absolute top-14 w-20 h-px bg-gray-300"></div>
               <div className="absolute top-14 left-8 w-px h-6 bg-gray-300"></div>
               <div className="absolute top-14 right-8 w-px h-6 bg-gray-300"></div>
               
               {/* Bottom Nodes */}
               <div className="w-full flex justify-between px-3 mt-10">
                  {/* Left Card */}
                  <div className="w-12 h-16 bg-white border border-[#e1e3e5] rounded  flex flex-col">
                    <div className="flex-1 p-1">
                      <div className="w-4 h-4 bg-blue-100 mb-1 rounded flex items-center justify-center"><div className="w-2 h-2 bg-blue-400 rounded-full"></div></div>
                      <div className="w-full h-1 bg-gray-200 rounded mb-0.5"></div>
                      <div className="w-2/3 h-1 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-2 bg-[#2c6ecb] rounded-b w-full"></div>
                  </div>
                  
                  {/* Right Card */}
                  <div className="w-12 h-16 bg-white border border-[#e1e3e5] rounded  flex flex-col">
                    <div className="flex-1 p-1">
                      <div className="w-4 h-4 bg-red-100 mb-1 rounded flex items-center justify-center"><div className="w-2 h-2 bg-red-400 rounded-full"></div></div>
                      <div className="w-full h-1 bg-gray-200 rounded mb-0.5"></div>
                      <div className="w-2/3 h-1 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-2 bg-[#de3618] rounded-b w-full"></div>
                  </div>
               </div>
            </div>
          </div>

          <h2 className="text-base font-semibold text-[#1a1a1a] mb-2 text-center max-w-sm">Test and time your launches</h2>
          <p className="text-gray-500 mb-6 text-sm text-center max-w-sm">
            Schedule a set of changes for an upcoming sale, or try different designs to see which performs best.
          </p>
          <button className="px-4 py-2 text-sm font-medium text-white polaris-btn polaris-btn-primary">
            Create rollout
          </button>
        </div>
        
        <div className="p-4 text-center border-t border-[#e1e3e5] bg-white rounded-b-lg">
          <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Learn more about rollouts</a>
        </div>
      </div>
    </div>
  );
}
