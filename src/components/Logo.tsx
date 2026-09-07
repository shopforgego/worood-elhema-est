import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-11 w-auto" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Speedometer Silhouette Crest */}
      <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 80" className="w-full h-full">
          {/* Outer Speedometer Arc */}
          <path
            d="M 15 65 A 40 40 0 1 1 85 65"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Active Speedometer Arc in Red/Green */}
          <path
            d="M 15 65 A 40 40 0 0 1 50 10"
            fill="none"
            stroke="#ef4444"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 50 10 A 40 40 0 0 1 85 65"
            fill="none"
            stroke="#347b42"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Gauge Needle */}
          <line x1="50" y1="50" x2="32" y2="28" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="50" r="7" fill="#1e293b" />
          {/* Car outline base */}
          <path d="M 28 65 Q 50 55 72 65 Z" fill="#347b42" />
        </svg>
      </div>

      <div className="flex flex-col text-right">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-base sm:text-lg text-[#347b42] tracking-tight">
            ورود الهمة
          </span>
          <span className="text-[10px] bg-[#347b42]/10 text-[#347b42] px-1.5 py-0.5 rounded font-bold border border-[#347b42]/20">
            قطع غيار
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-medium">
          المتجر السعودي لقطع غيار السيارات
        </span>
      </div>
    </div>
  );
};
