import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones, CheckCircle } from 'lucide-react';
import { storeConfig } from '../config/store';

export const Features: React.FC = () => {
  return (
    <section className="py-6 border-b border-current/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f172a] border border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-red-500/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold">تجهيزات سهلة التركيب</h4>
              <p className="text-[11px] opacity-70 mt-0.5">Plug & Play بدون تجريح أسلاك الوكالة</p>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-red-500/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 text-red-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold">خامات مقاومة للحرارة</h4>
              <p className="text-[11px] opacity-70 mt-0.5">تتحمل أشعة الشمس ودرجات الحرارة العالية</p>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-red-500/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 text-red-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold">شحن سريع لكافة المدن</h4>
              <p className="text-[11px] opacity-70 mt-0.5">توصيل سريع لباب منزلك أو ورشتك</p>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-red-500/10 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center flex-shrink-0 text-red-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold">استشارات التوافق الفوري</h4>
              <p className="text-[11px] opacity-70 mt-0.5">تواصل مباشر مع فنيين عبر واتساب</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
