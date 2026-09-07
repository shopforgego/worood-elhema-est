import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { storeConfig } from '../config/store';

export const Features: React.FC = () => {
  return (
    <section className="py-8 bg-slate-900/50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">شحن سريع ومجاني</h4>
              <p className="text-xs text-slate-400 mt-0.5">مجاني للطلبات فوق {storeConfig.freeShippingThreshold} {storeConfig.currencySymbol}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">قطع معتمدة ومضمونة</h4>
              <p className="text-xs text-slate-400 mt-0.5">مطابقة للمواصفات القياسية السعودية</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">استبدال واسترجاع ميسر</h4>
              <p className="text-xs text-slate-400 mt-0.5">خلال 14 يوماً وفق اشتراطات وزارة التجارة</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">دعم واستشارات فنية</h4>
              <p className="text-xs text-slate-400 mt-0.5">متواجدون لخدمتكم: {storeConfig.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
