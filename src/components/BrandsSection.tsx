import React from 'react';

interface BrandsSectionProps {
  brands: any[];
  selectedBrand: string;
  onSelectBrand: (brandName: string) => void;
}

export const BrandsSection: React.FC<BrandsSectionProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
}) => {
  return (
    <section className="py-6 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900">الماركات التجارية</h2>
            <p className="text-xs text-gray-400">تسوق أفضل الماركات العالمية</p>
          </div>
          <button
            onClick={() => onSelectBrand('all')}
            className="text-xs text-gray-600 hover:text-[#347b42] font-bold relative pb-1 group"
          >
            <span>عرض الكل</span>
            <span className="block h-0.5 bg-[#347b42] w-full rounded-full transition-all group-hover:w-full"></span>
          </button>
        </div>

        {/* Horizontal Brands Carousel */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {brands.slice(0, 20).map((brand) => (
            <button
              key={brand.id || brand.name}
              onClick={() => onSelectBrand(brand.name)}
              className={`flex-shrink-0 w-24 sm:w-28 h-16 sm:h-20 bg-white rounded-xl border p-2 flex flex-col items-center justify-center transition-all ${
                selectedBrand === brand.name
                  ? 'border-[#347b42] shadow-md ring-2 ring-[#347b42]/20 bg-[#347b42]/5'
                  : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow'
              }`}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-10 sm:max-h-12 max-w-[80px] object-contain"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs font-bold text-gray-700 text-center">{brand.name}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
