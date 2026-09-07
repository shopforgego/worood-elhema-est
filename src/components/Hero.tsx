import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles, ArrowLeft, Wrench } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800 pt-8 pb-12">
      {/* Background Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-400 text-xs font-bold mb-4 shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الكتالوج المعتمد لقطع غيار وإكسسوارات السيارات 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              أفضل قطع الغيار والإكسسوارات <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                لجميع موديلات السيارات في المملكة
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-2xl font-normal">
              نوفر لك في <span className="text-amber-400 font-bold">{storeConfig.companyNameAr}</span> تشكيلة واسعة من قطع الغيار الأصلية والبديلة عالية الجودة، إضاءات LED، ستائر وحماية، إلكترونيات وداش كام، وزينة السيارات مع شحن سريع وضمان استبدال معتمد.
            </p>

            {/* Quick Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-200">قطع أصلية ومضمونة</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
                <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-200">توصيل سريع لكافة المناطق</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-200">استبدال واسترجاع ميسر</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#products-section"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 text-sm"
              >
                <span>استكشف الكتالوج الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
              <span className="text-xs text-slate-400">متوفر أكثر من <strong className="text-amber-400">{productsCount} منتجاً</strong> جاهز للشحن الفوري</span>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1200&auto=format&fit=crop"
                alt="قطع غيار وإكسسوارات السيارات"
                className="w-full h-72 sm:h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5" />
                  {storeConfig.companyNameAr}
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  عناية فائقة وتجهيز احترافي لمركبتك
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  السجل التجاري: {storeConfig.cr} • المقر الرئيسي: {storeConfig.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div id="products-section" className="mt-10 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              جميع المنتجات
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
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
