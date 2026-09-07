import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-11 h-11 flex-shrink-0 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl p-1.5 shadow-lg shadow-amber-500/20 border border-amber-400/40 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
          <path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="none" stroke="currentColor" strokeWidth="6" />
          <path d="M25 45 L50 30 L75 45 L70 65 L30 65 Z" fill="currentColor" />
          <circle cx="50" cy="55" r="8" fill="#f59e0b" />
          <line x1="35" y1="58" x2="65" y2="58" stroke="#0f172a" strokeWidth="3" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight flex items-center gap-1.5">
          ورود الهمة
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
            للسيارات
          </span>
        </span>
        <span className="text-[11px] text-slate-400 font-medium tracking-wide">
          قطع غيار واكسسوارات السيارات الأصلية
        </span>
      </div>
    </div>
  );
};
