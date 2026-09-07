import React from 'react';
import { Search, ShoppingBag, ShieldCheck, FileText, MessageCircle, Truck } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenPolicies: (tab: 'returns' | 'shipping' | 'terms' | 'privacy') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenPolicies,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c150e]/95 text-white border-b border-[#3d7a46]/30 backdrop-blur-md shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1b3b21] via-[#3d7a46] to-[#1b3b21] text-white font-bold text-xs py-1.5 px-4 border-b border-[#4ea259]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-black/30 text-amber-300 px-2 py-0.5 rounded text-[10px] font-black flex items-center gap-1">
              <Truck className="w-3 h-3" />
              شحن لكافة المناطق
            </span>
            <span>قطع غيار سيارات أصلية وبديلة معتمدة لجميع الشركات والموديلات في المملكة</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:flex items-center gap-1 opacity-90">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              سجل تجاري: {storeConfig.cr}
            </span>
            <a 
              href={`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent('السلام عليكم، أريد الاستفسار عن توفر قطعة غيار لسيارتي')}`}
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-emerald-200 hover:text-white font-bold bg-black/20 px-2 py-0.5 rounded transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              استفسار برقم الهيكل: {storeConfig.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="flex-shrink-0">
            <Logo />
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم القطعة، رقم القطعة (SKU)، نوع السيارة (فورد، تندرا، لكزس، جمس)..."
                className="w-full bg-[#132216] border border-[#3d7a46]/50 text-white rounded-xl py-2.5 pr-11 pl-4 text-xs placeholder-slate-400 focus:outline-none focus:border-[#4ea259] focus:ring-1 focus:ring-[#4ea259] transition shadow-inner"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#4ea259]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenPolicies('returns')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-[#3d7a46] transition bg-[#132216]/60"
            >
              <FileText className="w-4 h-4 text-[#4ea259]" />
              الضمان والاسترجاع
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-[#3d7a46] to-[#2e5c35] hover:from-[#478f52] hover:to-[#386e40] text-white font-black shadow-lg shadow-[#3d7a46]/30 px-4 py-2.5 rounded-xl transition transform active:scale-95 border border-[#4ea259]/30"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">سلة المشتريات</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قطعة غيار أو موديل السيارة..."
              className="w-full bg-[#132216] border border-[#3d7a46]/50 text-white rounded-xl py-2 pr-9 pl-3 text-xs placeholder-slate-400 focus:outline-none focus:border-[#4ea259]"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-[#4ea259]" />
          </div>
        </div>
      </div>
    </header>
  );
};
