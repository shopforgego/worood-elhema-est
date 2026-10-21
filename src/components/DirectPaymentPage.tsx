import React, { useState, useEffect } from 'react';
import { Lock, CreditCard, ArrowRight, Loader2, CheckCircle2, Globe } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

const PAYMENT_METHODS = [
  { id: 'mastercard', alt: 'Mastercard', src: '/payment-methods/mastercard.svg', className: 'h-5' },
  { id: 'visa', alt: 'Visa', src: '/payment-methods/visa.svg', className: 'h-3.5' },
  { id: 'mada', alt: 'mada', src: '/payment-methods/mada.svg', className: 'h-4.5' },
  { id: 'apple-pay', alt: 'Apple Pay', src: '/payment-methods/apple-pay.svg', className: 'h-4.5' },
];

export const DirectPaymentPage: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('en');
  const [amount, setAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Read URL query params (e.g. ?amount=250&name=...&lang=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qAmount = params.get('amount');
    const qName = params.get('name');
    const qPhone = params.get('phone');
    const qEmail = params.get('email');
    const qLang = params.get('lang');

    if (qLang === 'ar') {
      setLang('ar');
    }
    if (qAmount && !isNaN(Number(qAmount))) {
      setAmount(qAmount);
    }
    if (qName) setCustomerName(qName);
    if (qPhone) setPhone(qPhone);
    if (qEmail) setEmail(qEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال مبلغ صحيح أكبر من 0' : 'Please enter a valid amount greater than 0');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال اسم العميل الكامل' : 'Please enter your full name');
      return;
    }

    if (!phone.trim()) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال رقم الجوال' : 'Please enter your phone number');
      return;
    }

    setLoading(true);

    try {
      const origin = window.location.origin;
      const orderRef = `WRD-PAY-${Date.now().toString().slice(-6)}`;
      const responseUrl = `${origin}/payment/status?ref=${orderRef}&lang=${lang}`;
      const cancelUrl = `${origin}/payment?cancelled=true&lang=${lang}`;

      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          customer: {
            name: customerName.trim(),
            email: email.trim() || storeConfig.email,
            phone: phone.trim(),
          },
          reference: orderRef,
          response_url: responseUrl,
          cancel_url: cancelUrl,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.checkout_url) {
        try {
          sessionStorage.setItem('payzaty_checkout_id', data.checkout_id || '');
          sessionStorage.setItem('payzaty_amount', parsedAmount.toFixed(2));
          sessionStorage.setItem('payzaty_customer', customerName.trim());
          sessionStorage.setItem('payzaty_ref', orderRef);
        } catch (_) {}

        window.location.href = data.checkout_url;
      } else {
        setErrorMsg(data.error || (lang === 'ar' ? 'تعذر إنشاء جلسة الدفع، يرجى المحاولة لاحقاً' : 'Could not create payment session, please try again'));
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(lang === 'ar' ? 'خطأ في الاتصال، يرجى التحقق من الشبكة والمحاولة مجدداً' : 'Network error, please check connection and try again');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-[#347b42] transition text-xs font-bold">
            <ArrowRight className={`w-4 h-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
            <span>{lang === 'ar' ? 'العودة للمتجر الرئيسي' : 'Back to Store'}</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 flex-1">
        {/* Brand Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6 text-center">
          <div className="flex justify-center mb-3">
            <Logo />
          </div>
          <h1 className="text-lg font-black text-slate-900 mb-1">
            {lang === 'ar' ? storeConfig.companyNameAr : storeConfig.companyNameEn}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-3">
            {lang === 'ar'
              ? 'بوابة الدفع الإلكتروني المباشر لخدمات وقطع غيار وإكسسوارات السيارات المعتمدة'
              : 'Direct Electronic Payment Gateway for Auto Parts & Accessories'}
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-700 pt-3 border-t border-slate-100">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold">{lang === 'ar' ? 'دفع آمن ومحمي بأعلى معايير التشفير SSL' : '256-bit SSL Secure Encrypted Checkout'}</span>
          </div>
        </div>

        {/* Payment Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#347b42]/10 text-[#347b42] flex items-center justify-center font-bold">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {lang === 'ar' ? 'إجراء دفعة مالية' : 'Make a Payment'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'أدخل المبلغ والبيانات للمتابعة إلى بوابة بيزاتي' : 'Enter amount and details to proceed to secure Payzaty gateway'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ar' ? 'بوابة بيزاتي المرخصة' : 'Licensed Payzaty Gateway'}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'ar' ? 'المبلغ المطلوب سداده *' : 'Payment Amount *'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-3 px-4 text-base font-black text-slate-900 focus:outline-none focus:border-[#347b42] focus:bg-white transition"
                />
                <span
                  className="absolute top-3 text-xs font-bold text-slate-500 pt-0.5"
                  style={lang === 'ar' ? { left: '1rem' } : { right: '1rem' }}
                >
                  {storeConfig.currency}
                </span>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'ar' ? 'اسم العميل / المستفيد *' : 'Customer Full Name *'}
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={lang === 'ar' ? 'مثال: عبدالله محمد الشمري' : 'e.g. John Doe'}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-[#347b42] focus:bg-white transition"
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'ar' ? 'رقم الجوال *' : 'Mobile Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-[#347b42] focus:bg-white transition text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {lang === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-[#347b42] focus:bg-white transition text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Accepted payment methods */}
            <div className="pt-2 pb-1">
              <label className="block text-xs font-semibold text-slate-700 mb-2.5">
                {lang === 'ar' ? 'طرق الدفع المقبولة' : 'Accepted payment methods'}
              </label>
              <div className="flex flex-wrap items-center gap-2" dir="ltr" aria-label="Accepted payment methods">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    title={method.alt}
                    className="flex h-8 min-w-[54px] items-center justify-center rounded-md bg-white px-2.5 border border-slate-200 shadow-xs"
                  >
                    <img
                      src={method.src}
                      alt={method.alt}
                      className={`${method.className} w-auto object-contain`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#347b42] to-[#2d6838] hover:from-[#3e934f] hover:to-[#347b42] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#347b42]/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{lang === 'ar' ? 'جاري إنشاء جلسة الدفع الآمن...' : 'Connecting to secure gateway...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? `الانتقال للدفع الآن ${amount ? `(${parseFloat(amount || '0').toFixed(2)} ${storeConfig.currencySymbol})` : ''}`
                      : `Proceed to Pay ${amount ? `(${parseFloat(amount || '0').toFixed(2)} SAR)` : ''}`}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Security Assurance */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              {lang === 'ar' ? 'تشفير مصرفي 256-bit' : '256-bit Bank Encryption'}
            </span>
            <span>•</span>
            <span>{lang === 'ar' ? 'معتمد من البنك المركزي السعودي' : 'Saudi Central Bank Approved'}</span>
            <span>•</span>
            <span>{lang === 'ar' ? 'إشعار فوري بعد السداد' : 'Instant Receipt'}</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} {lang === 'ar' ? storeConfig.companyNameAr : storeConfig.companyNameEn} - {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
      </footer>
    </div>
  );
};
