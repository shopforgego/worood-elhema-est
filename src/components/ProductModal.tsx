import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Check, MessageCircle } from 'lucide-react';
import { Product } from '../types/store';
import { storeConfig } from '../config/store';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(product.main_image || product.image);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.main_image || product.image];

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، أريد الاستفسار عن توافق قطعة الغيار التالية مع سيارتي برقم الهيكل (VIN):\nاسم القطعة: ${product.title}\nالكود: ${product.sku || product.id}\nالسعر: ${product.price} ر.س`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white border border-gray-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 text-gray-900">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Gallery */}
          <div className="flex flex-col gap-3">
            <div className="h-72 sm:h-80 bg-[#f8f9fa] rounded-2xl overflow-hidden border border-gray-200 p-4 flex items-center justify-center">
              <img
                src={selectedImg}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-[#f8f9fa] p-1 ${
                      selectedImg === img ? 'border-[#347b42]' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#347b42] font-bold mb-2">
                <span className="bg-emerald-50 px-2 py-0.5 rounded">{product.category}</span>
                {product.brand && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">• {product.brand}</span>}
                {product.sku && <span className="text-gray-400 font-mono">({product.sku})</span>}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-3 leading-snug">
                {product.title}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-black text-[#347b42] font-mono">
                  {product.price.toFixed(2)} {storeConfig.currencySymbol}
                </span>
                {product.regular_price && product.regular_price > product.price && (
                  <span className="text-sm text-red-500 line-through">
                    {product.regular_price.toFixed(2)} {storeConfig.currencySymbol}
                  </span>
                )}
                <span className="text-xs text-gray-400">شامل الضريبة والشحن</span>
              </div>

              <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-4 mb-4">
                <h4 className="text-xs font-bold text-gray-700 mb-1.5">وصف القطعة والمواصفات:</h4>
                <p className="text-xs text-gray-600 leading-relaxed max-h-36 overflow-y-auto">
                  {product.description}
                </p>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 mb-6">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#347b42]" />
                  <span>متوفر في المستودع جاهز للشحن</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#347b42]" />
                  <span>ضمان أصالة وأداء معتمد</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-700 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-bold text-[#347b42]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-700 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#347b42] hover:bg-[#2d6838] text-white font-black py-3 px-6 rounded-xl shadow transition transform active:scale-95 text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>إضافة إلى السلة ({ (product.price * quantity).toFixed(2) } {storeConfig.currencySymbol})</span>
                </button>
              </div>

              <a
                href={`https://wa.me/${storeConfig.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-[#347b42] border border-[#347b42]/30 py-2.5 px-4 rounded-xl text-xs font-bold transition"
              >
                <MessageCircle className="w-4 h-4 text-[#347b42]" />
                <span>فحص التوافق برقم الهيكل (VIN) عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
