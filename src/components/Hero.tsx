import React from 'react';
import { Sparkles, ArrowLeft, Search, CheckCircle2 } from 'lucide-react';
import { storeConfig } from '../config/store';

interface HeroProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  brands: string[];
  productsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  brands,
  productsCount,
}) => {
  return (
    <div className="bg-gradient-to-b from-[#0a120c] via-[#101d13] to-[#0c150e] text-white border-b border-[#3d7a46]/20 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Info */}
          <div className="lg:col-span-7 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3d7a46]/20 border border-[#4ea259]/30 text-xs font-bold mb-4 text-emerald-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>المتجر السعودي المتخصص في قطع غيار وإكسسوارات السيارات</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
              قطع غيار سيارات أصلية وبديلة معتمدة لجميع الموديلات
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-2xl font-normal">
              نوفر كويلات، دينموهات، رديترات، أذرعة وعكوس، أقمشة فرامل، فلاتر، شاشات وداش كام مع شحن سريع وضمان استبدال معتمد لدى <strong className="text-emerald-400">{storeConfig.companyNameAr}</strong>.
            </p>

            {/* Quick Car / Brand Filter Bar */}
            <div className="bg-[#132216] border border-[#3d7a46]/40 p-4 rounded-2xl mb-6 shadow-xl">
              <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>ابحث عن قطعة لسيارتك: اختر الشركة أو الموديل</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">الشركة الصانعة / الماركة:</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => onSelectBrand(e.target.value)}
                    className="w-full bg-[#0a120c] border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-[#4ea259] focus:outline-none font-bold"
                  >
                    <option value="all">جميع الماركات ({brands.length})</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 font-bold">نوع القطعة / الفئة:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => onSelectCategory(e.target.value)}
                    className="w-full bg-[#0a120c] border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-[#4ea259] focus:outline-none font-bold"
                  >
                    <option value="all">جميع الفئات ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="bg-gradient-to-r from-[#3d7a46] to-[#2e5c35] hover:from-[#478f52] hover:to-[#386e40] text-white font-black shadow-lg shadow-[#3d7a46]/40 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition transform active:scale-95 border border-[#4ea259]/40"
              >
                <span>تصفح قطع الغيار الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ea259]" />
                متوفر <strong>{productsCount} قطعة</strong> جاهزة للشحن الفوري
              </span>
            </div>
          </div>

          {/* Right Hero Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#3d7a46]/50 group bg-[#132216]">
              <img
                src="/images/hero-banner.jpg"
                alt={storeConfig.storeNameAr}
                className="w-full h-72 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c150e] via-[#0c150e]/50 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold text-emerald-400 mb-1">{storeConfig.companyNameAr}</span>
                <h3 className="text-base sm:text-lg font-extrabold">ضمان أصالة وأداء قطع الغيار</h3>
                <p className="text-[11px] text-slate-300 mt-1">
                  السجل التجاري: {storeConfig.cr} • جازان - حي الرحاب 2
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Chips Bar */}
        <div id="catalog" className="mt-10 pt-6 border-t border-[#3d7a46]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300">تصفح حسب فئات الموديلات:</span>
            {(selectedCategory !== 'all' || selectedBrand !== 'all') && (
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectBrand('all');
                }}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                إلغاء التصفية
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#3d7a46] to-[#2e5c35] text-white font-black shadow-lg shadow-[#3d7a46]/30 border border-[#4ea259]/40'
                  : 'bg-[#132216] hover:bg-[#1a2f1f] text-slate-300 border border-[#3d7a46]/30'
              }`}
            >
              جميع القطع ({productsCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#3d7a46] to-[#2e5c35] text-white font-black shadow-lg shadow-[#3d7a46]/30 border border-[#4ea259]/40'
                    : 'bg-[#132216] hover:bg-[#1a2f1f] text-slate-300 border border-[#3d7a46]/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
