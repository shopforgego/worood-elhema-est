import React from 'react';
import { ShoppingBag, Eye, Star, MessageCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types/store';
import { storeConfig } from '../config/store';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const discount = product.regular_price && product.regular_price > product.price
    ? Math.round(((product.regular_price - product.price) / product.regular_price) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أريد الاستفسار عن توافق قطعة الغيار التالية:\nاسم القطعة: ${product.title}\nالكود (SKU): ${product.sku || product.id}\nالسعر: ${product.price} ر.س`
  );

  return (
    <div className="group bg-[#111c13] border border-[#3d7a46]/30 hover:border-[#4ea259] shadow-lg hover:shadow-[#3d7a46]/20 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Box */}
        <div className="relative h-56 bg-[#0a120c] overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
          <img
            src={product.main_image || product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow">
              خصم {discount}%
            </div>
          )}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {product.brand || "أصلي"}
          </div>
          {product.sku && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono">
              {product.sku}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="p-3 bg-white text-slate-900 rounded-xl hover:scale-110 transition shadow-lg"
              title="عرض التفاصيل"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] text-[#4ea259] font-bold truncate">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating || '4.9'}</span>
            </div>
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-2 cursor-pointer hover:text-emerald-300 transition mb-2.5 leading-snug"
          >
            {product.title}
          </h3>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-4 pt-0">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
            {product.price.toFixed(2)} {storeConfig.currencySymbol}
          </span>
          {product.regular_price && product.regular_price > product.price && (
            <span className="text-xs text-slate-500 line-through">
              {product.regular_price.toFixed(2)} {storeConfig.currencySymbol}
            </span>
          )}
          <span className="text-[10px] text-slate-400 mr-auto">شامل الضريبة</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="col-span-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#3d7a46] to-[#2e5c35] hover:from-[#478f52] hover:to-[#386e40] text-white font-black shadow-lg shadow-[#3d7a46]/20 py-2.5 px-3 rounded-xl transition text-xs border border-[#4ea259]/30 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إضافة للسلة</span>
          </button>

          <a
            href={`https://wa.me/${storeConfig.whatsapp}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="col-span-1 flex items-center justify-center bg-[#132216] hover:bg-[#1a2f1f] text-emerald-400 hover:text-emerald-300 border border-[#3d7a46]/40 rounded-xl transition"
            title="استفسار عبر واتساب"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
