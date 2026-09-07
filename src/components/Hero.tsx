import React from 'react';
import { ShieldCheck, Truck, Sparkles, ArrowLeft } from 'lucide-react';
import { storeConfig } from '../config/store';

interface HeroProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  productsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  productsCount,
}) => {
  return (
    <div className="bg-gradient-to-b from-[#0b1120] via-[#141d33] to-[#090d16] text-white border-b border-current/10 pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 border border-current/10 text-xs font-bold mb-4">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>🏎️ تجهيزات وزينة السيارات المتقدمة</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
              إكسسوارات وزينة وتجهيزات السيارات الرياضية
            </h1>

            <p className="text-sm sm:text-base opacity-90 mb-6 leading-relaxed max-w-2xl font-normal">
              ستائر متحركة، شاشات أندرويد وداش كام، إضاءات LED محيطية، ومستلزمات حماية المقصورة والهيكل - مرحباً بكم في <strong className="underline decoration-current/30">{storeConfig.companyNameAr}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#products-grid"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black shadow-lg shadow-red-600/30 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition transform active:scale-95"
              >
                <span>تسوق التشكيلة الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
              <span className="text-xs opacity-75">متوفر أكثر من <strong>{productsCount} منتجاً</strong> معتمد</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-red-500/40 group">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
                alt="{storeConfig.storeNameAr}"
                className="w-full h-72 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold opacity-80 mb-1">{storeConfig.companyNameAr}</span>
                <h3 className="text-base font-extrabold">{storeConfig.taglineAr}</h3>
                <p className="text-[11px] opacity-75 mt-1">السجل التجاري: {storeConfig.cr} • المقر: {storeConfig.city}</p>
              </div>
            </div>
          </div>
        </div>

        <div id="products-grid" className="mt-8 pt-6 border-t border-current/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? ' bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black shadow-lg shadow-red-600/30 '
                  : 'bg-black/10 hover:bg-black/20 border border-current/10 opacity-80'
              }`}
            >
              جميع المنتجات ({productsCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? ' bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black shadow-lg shadow-red-600/30 '
                    : 'bg-black/10 hover:bg-black/20 border border-current/10 opacity-80'
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
