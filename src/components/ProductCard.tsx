import React from 'react';
import { ShoppingBag, Eye, Star } from 'lucide-react';
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
    <div className="group bg-white border border-gray-200 hover:border-[#347b42]/50 shadow-sm hover:shadow-md rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image */}
        <div className="relative h-48 sm:h-52 bg-[#fcfcfc] overflow-hidden cursor-pointer p-2 flex items-center justify-center border-b border-gray-100" onClick={() => onSelect(product)}>
          <img
            src={product.main_image || product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2.5 right-2.5 bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded shadow">
              {discount}%
            </div>
          )}

          {/* Brand watermark or badge */}
          {product.brand && product.brand !== 'None' && (
            <div className="absolute top-2.5 left-2.5 bg-white/90 border border-gray-200 text-gray-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
              {product.brand}
            </div>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(product);
              }}
              className="p-2.5 bg-white text-gray-800 rounded-xl hover:scale-110 transition shadow"
              title="عرض التفاصيل"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Category Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">
              {product.category}
            </span>
            {product.compatibility && product.compatibility !== product.category && (
              <span className="text-[10px] bg-emerald-50 text-[#347b42] px-2 py-0.5 rounded font-bold">
                {product.compatibility}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-xs sm:text-[13px] text-gray-800 line-clamp-2 cursor-pointer hover:text-[#347b42] transition mb-2 leading-snug"
          >
            {product.title}
          </h3>

          <div className="text-[11px] text-gray-400 font-medium mb-1">
            شحن سريع مجاني
          </div>
        </div>
      </div>

      {/* Pricing & CTA Button */}
      <div className="p-3.5 pt-0">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-gray-900 font-mono">
              {product.price.toFixed(2)} ﷼
            </span>
            {product.regular_price && product.regular_price > product.price && (
              <span className="text-xs text-red-500 line-through font-mono">
                {product.regular_price.toFixed(2)} ﷼
              </span>
            )}
          </div>
        </div>

        {/* Salla Style Full-Width Green Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full flex items-center justify-center gap-1.5 bg-[#347b42] hover:bg-[#2d6838] active:bg-[#25572e] text-white font-black py-2.5 px-3 rounded-xl transition text-xs shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>أضف للسلة</span>
        </button>
      </div>
    </div>
  );
};
