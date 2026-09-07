import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
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

  return (
    <div className="group bg-[#0f172a] border border-slate-800 hover:border-red-500/60 shadow-lg hover:shadow-red-500/10 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col">
      <div className="relative h-60 bg-black/5 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.main_image || product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md shadow">
            خصم {discount}%
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {product.brand || "أصلي"}
        </div>
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

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] text-red-400 font-bold mb-1 block">{product.category}</span>
          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-xs sm:text-sm line-clamp-2 cursor-pointer hover:underline mb-2"
          >
            {product.title}
          </h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-red-400 font-mono">
              {product.price.toFixed(2)} {storeConfig.currencySymbol}
            </span>
            {product.regular_price && product.regular_price > product.price && (
              <span className="text-xs opacity-40 line-through">
                {product.regular_price.toFixed(2)} {storeConfig.currencySymbol}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black shadow-lg shadow-red-600/30 py-2.5 px-3 rounded-xl transition text-xs font-bold"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إضافة للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
