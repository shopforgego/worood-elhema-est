import React from 'react';
import { Search, ShoppingBag, Menu, User, Phone, ShieldCheck } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenMenu: () => void;
  onOpenPolicies: (tab: 'returns' | 'shipping' | 'terms' | 'privacy') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenMenu,
  onOpenPolicies,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top micro bar */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 text-xs text-gray-600 py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#347b42]">مؤسسة ورود الهمة التجارية</span>
            <span className="text-gray-400">|</span>
            <span>قطع غيار أصلية ومطابقة لمواصفات الوكالة مع شحن سريع لجميع مدن المملكة</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#347b42]" />
              سجل تجاري: {storeConfig.cr}
            </span>
            <a href={`https://wa.me/${storeConfig.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[#347b42] font-bold">
              <Phone className="w-3.5 h-3.5 text-[#347b42]" />
              خدمة العملاء: {storeConfig.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Right Section: Menu button + Search icon */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenMenu}
              className="flex items-center gap-1.5 text-gray-700 hover:text-[#347b42] p-1.5 rounded-lg hover:bg-gray-100 transition font-bold text-xs"
            >
              <Menu className="w-5 h-5 text-[#347b42]" />
              <span className="hidden sm:inline">القائمة</span>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <a href="#">
              <Logo />
            </a>
          </div>

          {/* Left Section: User icon + Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onOpenPolicies('returns')}
              className="p-2 text-gray-600 hover:text-[#347b42] rounded-lg hover:bg-gray-100 transition hidden sm:flex items-center"
              title="الضمان والسياسات"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#f8f9fa] hover:bg-gray-100 border border-gray-200 text-gray-800 px-3 py-2 rounded-xl transition"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#347b42]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-700 font-mono">
                {cartTotal.toFixed(2)} {storeConfig.currencySymbol}
              </span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-2.5 pb-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن قطعة غيار، رقم القطعة (SKU)، نوع السيارة (فورد، تندرا، لكزس، جمس)..."
              className="w-full bg-[#f8f9fa] border border-gray-200 text-gray-800 rounded-xl py-2.5 pr-11 pl-4 text-xs placeholder-gray-400 focus:outline-none focus:border-[#347b42] focus:bg-white transition"
            />
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 px-2 py-0.5 rounded"
              >
                مسح
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
