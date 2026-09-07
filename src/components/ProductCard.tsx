import React from 'react';
import { ShoppingCart, Eye, Star, ShieldCheck } from 'lucide-react';
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
    <div className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative h-56 sm:h-64 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.main_image || product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-md">
            خصم {discount}%
          </div>
        )}

        {/* Brand / Category Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
          {product.brand || "ورود الهمة"}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-3 bg-slate-900/90 text-white rounded-xl hover:bg-amber-500 hover:text-slate-950 transition transform hover:scale-110 shadow-lg"
            title="عرض التفاصيل"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="text-amber-400/90 font-medium">{product.category}</span>
            {product.sku && <span className="text-[10px] font-mono text-slate-500">#{product.sku}</span>}
          </div>

          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-sm sm:text-base text-white hover:text-amber-400 line-clamp-2 cursor-pointer transition mb-2"
          >
            {product.title}
          </h3>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-black text-amber-400">
              {product.price.toFixed(2)} {storeConfig.currencySymbol}
            </span>
            {product.regular_price && product.regular_price > product.price && (
              <span className="text-xs text-slate-500 line-through">
                {product.regular_price.toFixed(2)} {storeConfig.currencySymbol}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold py-2.5 px-4 rounded-xl border border-slate-700 hover:border-amber-400 transition transform active:scale-95 text-xs sm:text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>إضافة للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
