import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types/store';

export interface CircularModel {
  name: string;
  image: string;
}

interface CarSectionProps {
  title: string;
  bannerTitle: string;
  bannerSubtitle?: string;
  bannerImage?: string;
  bannerBgGradient?: string;
  models: CircularModel[];
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onSelectModel: (modelName: string) => void;
}

export const CarSection: React.FC<CarSectionProps> = ({
  title,
  bannerTitle,
  bannerSubtitle = "اطلب الآن",
  bannerImage,
  bannerBgGradient = "from-slate-100 via-gray-200 to-slate-100",
  models,
  products,
  onSelectProduct,
  onAddToCart,
  onSelectModel,
}) => {
  const fallbackImg = "/images/gmc_suburban.jpg";

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Large Promo Banner */}
        {bannerImage && (
          <div className={`relative w-full rounded-2xl overflow-hidden mb-8 shadow-sm border border-gray-200 bg-gradient-to-r ${bannerBgGradient} p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6`}>
            <div className="text-right z-10">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">
                {bannerTitle}
              </h3>
              <button
                onClick={() => onSelectModel(title)}
                className="bg-[#24292e] hover:bg-black text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-md transition transform active:scale-95"
              >
                {bannerSubtitle}
              </button>
            </div>
            
            <div className="max-w-xs sm:max-w-md max-h-44 sm:max-h-52 overflow-hidden flex items-center justify-center">
              <img
                src={bannerImage}
                alt={bannerTitle}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImg;
                }}
                className="w-full h-auto object-contain max-h-48 drop-shadow-md"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* 2. Circular Car Models Subcategories Grid */}
        {models.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
              {models.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectModel(m.name)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f1f5f9] border border-gray-200 group-hover:border-[#347b42] p-2 flex items-center justify-center shadow-sm group-hover:shadow transition overflow-hidden">
                    <img
                      src={m.image}
                      alt={m.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImg;
                      }}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-700 mt-2 text-center group-hover:text-[#347b42] transition line-clamp-1">
                    {m.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Section Title with green underline */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          <div className="inline-flex flex-col items-center mt-1">
            <span className="text-xs text-gray-500 font-bold">تسوق المزيد</span>
            <span className="w-12 h-1 bg-[#347b42] rounded-full mt-1"></span>
          </div>
        </div>

        {/* 4. Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
