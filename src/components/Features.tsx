import React from 'react';
import { ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { storeConfig } from '../config/store';

export const Features: React.FC = () => {
  return (
    <section className="py-6 bg-[#0c150e] border-b border-[#3d7a46]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#132216] border border-[#3d7a46]/30 hover:border-[#4ea259] shadow-lg p-4 rounded-2xl flex items-center gap-3 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#3d7a46]/20 flex items-center justify-center flex-shrink-0 text-[#4ea259]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">قطع أصلية ومضمونة</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">مطابقة 100% لمواصفات الوكالة والمصنع</p>
            </div>
          </div>

          <div className="bg-[#132216] border border-[#3d7a46]/30 hover:border-[#4ea259] shadow-lg p-4 rounded-2xl flex items-center gap-3 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#3d7a46]/20 flex items-center justify-center flex-shrink-0 text-[#4ea259]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">شحن سريع لجميع المناطق</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">توصيل سريع للورش والمنازل في المملكة والخليج</p>
            </div>
          </div>

          <div className="bg-[#132216] border border-[#3d7a46]/30 hover:border-[#4ea259] shadow-lg p-4 rounded-2xl flex items-center gap-3 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#3d7a46]/20 flex items-center justify-center flex-shrink-0 text-[#4ea259]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">ضمان الاسترجاع والاستبدال</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">ضمان حق العميل وسياسة استبدال مرنة 7 أيام</p>
            </div>
          </div>

          <div className="bg-[#132216] border border-[#3d7a46]/30 hover:border-[#4ea259] shadow-lg p-4 rounded-2xl flex items-center gap-3 transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#3d7a46]/20 flex items-center justify-center flex-shrink-0 text-[#4ea259]">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">فحص التوافق برقم الهيكل</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">استشارة فنية فورية عبر واتساب {storeConfig.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
