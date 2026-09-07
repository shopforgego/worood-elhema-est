import React from 'react';
import { Search, ShoppingBag, ShieldCheck, Phone, FileText, Wrench } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 text-xs font-bold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black uppercase">عرض خاص</span>
            <span>شحن مجاني لكافة مدن المملكة للطلبات فوق {storeConfig.freeShippingThreshold} {storeConfig.currencySymbol}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              سجل تجاري معتمد: {storeConfig.cr}
            </span>
            <a href={`https://wa.me/${storeConfig.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              <Phone className="w-3.5 h-3.5" />
              خدمة العملاء: {storeConfig.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
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
                placeholder="ابحث برقم القطعة، الاسم، موديل السيارة (تويوتا، هيونداي، نيسان...)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pr-11 pl-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenPolicies('returns')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-lg border border-slate-800 transition"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              الاستبدال والاسترجاع
            </button>

            <button
              onClick={() => onOpenPolicies('shipping')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-lg border border-slate-800 transition"
            >
              <Wrench className="w-4 h-4 text-amber-400" />
              الشحن والضمان
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">السلة</span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-amber-400 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center border border-amber-400/50">
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
              placeholder="ابحث عن قطع الغيار وموديل سيارتك..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pr-10 pl-3 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
