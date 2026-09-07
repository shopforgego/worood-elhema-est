import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#3d7a46] via-[#2e5c35] to-[#1e3b23] rounded-2xl p-2 shadow-lg shadow-[#3d7a46]/30 border border-[#4ea259]/40 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
          {/* Outer Shield */}
          <path d="M50 5 L88 25 L88 75 L50 95 L12 75 L12 25 Z" fill="none" stroke="#4ea259" strokeWidth="4" />
          {/* Gear Elements */}
          <circle cx="50" cy="50" r="26" fill="none" stroke="#ffffff" strokeWidth="4" strokeDasharray="6 4" />
          <path d="M38 36 L62 36 L58 64 L42 64 Z" fill="#ffffff" opacity="0.9" />
          <circle cx="50" cy="50" r="8" fill="#f59e0b" />
          <line x1="25" y1="50" x2="75" y2="50" stroke="#f59e0b" strokeWidth="3" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-black text-lg sm:text-xl text-white tracking-tight flex items-center gap-2">
          ورود الهمة
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3d7a46]/30 text-[#68cc74] border border-[#3d7a46]/50 font-bold">
            قطع غيار أصلية
          </span>
        </span>
        <span className="text-[11px] text-slate-400 font-medium tracking-wide">
          مؤسسة ورود الهمة التجارية لقطع غيار وإكسسوارات السيارات
        </span>
      </div>
    </div>
  );
};
