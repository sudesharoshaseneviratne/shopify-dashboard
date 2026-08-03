import { Building2, Info, X } from "lucide-react";

export default function Companies() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[18px] font-semibold text-[#1a1a1a] flex items-center gap-2">
          <div className="bg-white p-1 rounded-md border border-[#e1e3e5] shadow-xs">
            <Building2 className="w-4 h-4 text-[#303030]" />
          </div> 
          Companies
        </h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs">
            Add company
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#e4f1fe] border border-[#bce0fd] rounded-t-lg p-3 flex items-start gap-3 text-[13px] text-[#003b70]">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold mb-0.5">App behavior with B2B orders</div>
          <p className="text-[12px] text-[#003b70]/90">Some apps may not attribute B2B orders correctly on your current plan. Check that B2B orders are assigned to a company, not just an individual customer. If you notice orders are not assigned to a company, contact the app developer.</p>
        </div>
        <button className="text-[#003b70] hover:text-black">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Area Card */}
      <div className="bg-white border border-[#e1e3e5] border-t-0 rounded-b-lg flex flex-col min-h-[460px] justify-between">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          
          {/* Mockup Illustration */}
          <div className="relative w-44 h-36 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#f1f2f4] rounded-[50%] scale-[0.8] -z-10 translate-x-3"></div>
            
            {/* Storefront Illustration */}
            <div className="relative w-32 h-24 flex">
               <div className="w-2/3 h-full bg-[#3d988b] flex flex-col justify-end p-1.5 relative z-10 rounded-xs">
                 <div className="absolute top-3 left-0 right-0 h-3 bg-white/20"></div>
                 <div className="h-10 bg-[#df5a48] mt-1.5 flex justify-between p-1 shadow-inner">
                   <div className="w-2.5 h-full bg-white/20"></div>
                   <div className="w-3.5 h-full bg-[#c84635]"></div>
                   <div className="w-2.5 h-full bg-white/20"></div>
                 </div>
                 <div className="h-1.5 w-full bg-[#2c756b] mt-1"></div>
               </div>
               
               <div className="w-1/3 h-full bg-white border border-[#e1e3e5] border-l-0 flex flex-col justify-center items-center gap-1 z-0">
                 <div className="w-7 h-1 bg-[#e1e3e5] rounded"></div>
                 <div className="w-9 h-1 bg-[#e1e3e5] rounded"></div>
                 <div className="w-5 h-1 bg-[#e1e3e5] rounded"></div>
                 <div className="w-7 h-1.5 bg-[#007a5a] rounded mt-1"></div>
               </div>
            </div>
          </div>

          <h2 className="text-[15px] font-semibold text-[#1a1a1a] mb-1.5 text-center max-w-sm">Bring the power of customization to your B2B business</h2>
          <p className="text-[#616161] mb-5 text-[13px] text-center max-w-md">
            Everything you need for B2B in one place. Get started by adding a company and assigning custom pricing, net payment terms, and permissions for multiple locations and buyers.
          </p>
          <button className="px-3 py-1.5 text-[13px] font-medium text-white bg-[#1a1a1a] hover:bg-[#303030] rounded-md shadow-2xs">
            Add company
          </button>
        </div>
      </div>
    </div>
  );
}
