import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Banknote, CheckCircle, Truck, Loader2 } from 'lucide-react';
import { CartItem } from '../types/store';
import { storeConfig } from '../config/store';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (orderData: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'apple_pay' | 'payzaty' | 'cod'>('mada');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'جازان',
    district: '',
    street: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= storeConfig.freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : storeConfig.shippingCost;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.phone || !formData.district) {
      alert('يرجى ملء جميع الحقول الإلزامية (الاسم، الجوال، الحي)');
      return;
    }

    const orderNumber = `WRD-${Math.floor(100000 + Math.random() * 900000)}`;

    if (paymentMethod === 'cod') {
      onOrderSuccess({
        orderNumber,
        customer: formData,
        items,
        total,
        paymentMethod,
        date: new Date().toLocaleDateString('ar-SA'),
      });
      return;
    }

    // Electronic payment via Payzaty (Mada, Apple Pay, Visa/MC)
    setIsSubmitting(true);
    try {
      const origin = window.location.origin;
      const responseUrl = `${origin}/payment/status?ref=${orderNumber}`;
      const cancelUrl = `${origin}/?cancelled=true`;

      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customer: {
            name: formData.fullName.trim(),
            email: storeConfig.email,
            phone: formData.phone.trim(),
          },
          reference: orderNumber,
          response_url: responseUrl,
          cancel_url: cancelUrl,
          note: `طلب متجر #${orderNumber} - ${formData.city} (${formData.district})`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.checkout_url) {
        try {
          sessionStorage.setItem('payzaty_checkout_id', data.checkout_id || '');
          sessionStorage.setItem('payzaty_amount', total.toFixed(2));
          sessionStorage.setItem('payzaty_customer', formData.fullName.trim());
          sessionStorage.setItem('payzaty_ref', orderNumber);
        } catch (_) {}

        window.location.href = data.checkout_url;
      } else {
        setErrorMessage(data.error || 'تعذر إنشاء جلسة الدفع الإلكتروني، يرجى المحاولة لاحقاً');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage('خطأ في الاتصال ببوابة الدفع، يرجى التحقق من الاتصال والمحاولة مجدداً');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8f9fa]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white border border-gray-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#f8f9fa]/60">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base text-gray-900">إتمام الطلب والدفع الآمن</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Customer Info */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">1. بيانات التوصيل والاستلام</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1 font-medium">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="مثال: عبدالله محمد"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1 font-medium">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05xxxxxxxx"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1 font-medium">المدينة *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1 font-medium">الحي والشارع *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="اسم الحي ورقم الشارع"
                  className="w-full bg-[#f8f9fa] border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">2. طريقة الدفع المفضلة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition ${
                paymentMethod === 'mada' ? 'bg-amber-500/10 border-amber-500 text-emerald-400' : 'bg-[#f8f9fa] border-gray-200 text-gray-700 hover:border-slate-700'
              }`}>
                <input type="radio" name="payment" checked={paymentMethod === 'mada'} onChange={() => setPaymentMethod('mada')} className="hidden" />
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">بطاقة مدى / فيزا</span>
              </label>

              <label className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition ${
                paymentMethod === 'apple_pay' ? 'bg-amber-500/10 border-amber-500 text-emerald-400' : 'bg-[#f8f9fa] border-gray-200 text-gray-700 hover:border-slate-700'
              }`}>
                <input type="radio" name="payment" checked={paymentMethod === 'apple_pay'} onChange={() => setPaymentMethod('apple_pay')} className="hidden" />
                <span className="text-base font-black mb-0.5"> Pay</span>
                <span className="text-xs font-bold">Apple Pay</span>
              </label>


              <label className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition ${
                paymentMethod === 'cod' ? 'bg-amber-500/10 border-amber-500 text-emerald-400' : 'bg-[#f8f9fa] border-gray-200 text-gray-700 hover:border-slate-700'
              }`}>
                <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <Banknote className="w-5 h-5 mb-1" />
                <span className="text-xs font-bold">عند الاستلام</span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>قيمة المنتجات ({items.length} قطع):</span>
              <span className="font-bold text-gray-800">{subtotal.toFixed(2)} {storeConfig.currencySymbol}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>الشحن:</span>
              <span className={shipping === 0 ? "text-emerald-400 font-bold" : "text-gray-800 font-bold"}>
                {shipping === 0 ? "مجاني" : `${shipping.toFixed(2)} ${storeConfig.currencySymbol}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>المبلغ المستحق للدفع:</span>
              <span className="text-emerald-400">{total.toFixed(2)} {storeConfig.currencySymbol}</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#347b42] to-[#2d6838] hover:from-[#478f52] hover:to-[#386e40] text-white font-black py-3.5 rounded-xl shadow-lg shadow-[#3d7a46]/30 transition transform active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>جاري الاتصال ببوابة بيزاتي...</span>
              </>
            ) : (
              <span>تأكيد الطلب والدفع الفوري ({total.toFixed(2)} {storeConfig.currencySymbol})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
