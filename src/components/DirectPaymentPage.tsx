import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2, CheckCircle2, Building2, Phone, Mail, FileText, Globe } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

export const DirectPaymentPage: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [amount, setAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'apple_pay' | 'card'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Read URL query params (e.g. ?amount=250&name=...&ref=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qAmount = params.get('amount');
    const qName = params.get('name');
    const qPhone = params.get('phone');
    const qEmail = params.get('email');
    const qNote = params.get('note') || params.get('ref') || params.get('invoice');

    if (qAmount && !isNaN(Number(qAmount))) {
      setAmount(qAmount);
    }
    if (qName) setCustomerName(qName);
    if (qPhone) setPhone(qPhone);
    if (qEmail) setEmail(qEmail);
    if (qNote) setNote(qNote);
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
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال اسم العميل الكامل' : 'Please enter the customer name');
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
      const responseUrl = `${origin}/payment/status?ref=${orderRef}`;
      const cancelUrl = `${origin}/payment?cancelled=true`;

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
          note: note.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.checkout_url) {
        // Save temporary info in sessionStorage for fallback verification
        try {
          sessionStorage.setItem('payzaty_checkout_id', data.checkout_id || '');
          sessionStorage.setItem('payzaty_amount', parsedAmount.toFixed(2));
          sessionStorage.setItem('payzaty_customer', customerName.trim());
          sessionStorage.setItem('payzaty_ref', orderRef);
        } catch (_) {}

        // Redirect to Payzaty secure gateway
        window.location.href = data.checkout_url;
      } else {
        setErrorMsg(data.error || (lang === 'ar' ? 'تعذر إنشاء جلسة الدفع، يرجى المحاولة لاحقاً' : 'Could not create payment session'));
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(lang === 'ar' ? 'خطأ في الاتصال، يرجى التحقق من الشبكة والمحاولة مجدداً' : 'Network error, please try again');
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
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-100 transition"
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
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            {lang === 'ar'
              ? 'بوابة الدفع الإلكتروني المباشر لخدمات وقطع غيار وإكسسوارات السيارات المعتمدة'
              : 'Direct Electronic Payment Gateway for Wurud Alhimah Auto Parts & Services'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#347b42]" />
              <strong>{lang === 'ar' ? 'س.ت:' : 'CR:'}</strong> {storeConfig.cr}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#347b42]" />
              <strong>{lang === 'ar' ? 'الرقم الضريبي:' : 'VAT:'}</strong> {storeConfig.taxNumber}
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <strong className="text-emerald-700">{lang === 'ar' ? 'دفع آمن ومحمي SSL' : 'SSL Encrypted'}</strong>
            </span>
          </div>
        </div>

        {/* Payment Form Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#347b42]/10 text-[#347b42] flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {lang === 'ar' ? 'إجراء دفعة مالية' : 'Make a Payment'}
                </h2>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'أدخل المبلغ والبيانات للمتابعة إلى بوابة بيزاتي' : 'Enter amount and details to proceed'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ar' ? 'بوابة بيزاتي المرخصة' : 'Licensed Payzaty'}</span>
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
                <span className="absolute left-4 top-3 text-xs font-bold text-slate-500 pt-0.5" style={lang === 'ar' ? { left: '1rem' } : { right: '1rem', left: 'auto' }}>
                  {storeConfig.currencySymbol} ({storeConfig.currency})
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

            {/* Invoice Note or Reference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{lang === 'ar' ? 'ملاحظة أو رقم الفاتورة / أمر الشراء' : 'Invoice Reference / Note'}</span>
                <span className="text-[10px] text-slate-400 font-normal">{lang === 'ar' ? 'اختياري' : 'Optional'}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: دفعة قطع غيار جيب شيروكي أو فاتورة #1024' : 'e.g. Spare parts order #1024'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-2.5 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-[#347b42] focus:bg-white transition"
                />
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" style={lang === 'ar' ? { left: '0.85rem' } : { right: '0.85rem', left: 'auto' }} />
              </div>
            </div>

            {/* Payment Methods Accepted Banner */}
            <div className="pt-2 pb-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {lang === 'ar' ? 'طرق الدفع المتاحة عبر بوابة بيزاتي:' : 'Supported payment channels:'}
              </label>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>مدى (Mada)</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <span className="text-sm font-black"></span>
                  <span>Apple Pay</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <span>Visa & MasterCard</span>
                </div>
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
              تشفير مصرفي 256-bit
            </span>
            <span>•</span>
            <span>معتمد من البنك المركزي السعودي</span>
            <span>•</span>
            <span>إشعار فوري بعد السداد</span>
          </div>
        </div>

        {/* Contact info below */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>
            {lang === 'ar' ? 'هل تواجه مشكلة في السداد؟ تواصل مع خدمة العملاء:' : 'Need help with payment? Contact customer support:'}
          </p>
          <div className="flex items-center justify-center gap-4 font-bold text-slate-700 pt-1">
            <a href={`tel:${storeConfig.phone}`} className="flex items-center gap-1 hover:text-[#347b42]">
              <Phone className="w-3.5 h-3.5" />
              <span>{storeConfig.phone}</span>
            </a>
            <a href={`mailto:${storeConfig.email}`} className="flex items-center gap-1 hover:text-[#347b42]">
              <Mail className="w-3.5 h-3.5" />
              <span>{storeConfig.email}</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
        <p>© {new Date().getFullYear()} {storeConfig.companyNameAr} - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};
