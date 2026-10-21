import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Printer, RotateCcw, Loader2, Globe } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

export const PaymentStatusPage: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('en');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [details, setDetails] = useState<any>(null);
  const [rawError, setRawError] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qLang = params.get('lang');
    if (qLang === 'ar') {
      setLang('ar');
    }

    const verify = async () => {
      const checkoutId = params.get('checkout_id') || params.get('id') || params.get('checkoutId') || sessionStorage.getItem('payzaty_checkout_id') || '';
      const orderRef = params.get('ref') || sessionStorage.getItem('payzaty_ref') || '';
      const fallbackAmount = sessionStorage.getItem('payzaty_amount') || '';
      const fallbackCustomer = sessionStorage.getItem('payzaty_customer') || '';

      if (!checkoutId) {
        if (params.get('cancelled') === 'true' || params.get('status') === 'failed') {
          setStatus('failed');
          setLoading(false);
          return;
        }
        setStatus('failed');
        setRawError(lang === 'ar' ? 'لم يتم العثور على معرّف العملية.' : 'Transaction ID not found.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/payment/verify?checkout_id=${encodeURIComponent(checkoutId)}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        const data = await res.json();

        if (res.ok && data.verified) {
          if (data.paid || data.status === 'success') {
            setStatus('success');
          } else if (data.status === 'pending') {
            setStatus('pending');
          } else {
            setStatus('failed');
          }
          setDetails({
            ...data.details,
            reference: data.details?.reference || orderRef,
            amount: data.details?.amount || (fallbackAmount ? parseFloat(fallbackAmount) : 0),
            customerName: data.details?.customerName || fallbackCustomer,
          });
        } else {
          setStatus('failed');
          setRawError(data.error || (lang === 'ar' ? 'تعذر التحقق من الدفع' : 'Payment verification failed'));
        }
      } catch (err: any) {
        setStatus('failed');
        setRawError(err.message || (lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error'));
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#347b42] transition">
            <ArrowRight className={`w-4 h-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
            <span>{lang === 'ar' ? 'العودة للمتجر الرئيسي' : 'Back to Store'}</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            <Logo />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 flex-1">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Loader2 className="w-12 h-12 text-[#347b42] animate-spin mx-auto mb-4" />
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              {lang === 'ar' ? 'جاري التحقق من عملية السداد...' : 'Verifying payment status...'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'ar' ? 'نتواصل مع بوابة بيزاتي لتأكيد استلام الدفعة، يرجى الانتظار لحظات' : 'Connecting to Payzaty gateway to confirm your payment, please wait a moment'}
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl print:shadow-none print:border-none">
            {/* Top Badge */}
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black border border-emerald-200 mb-2">
                {lang === 'ar' ? 'عملية مقبولة وناجحة' : 'Payment Approved & Verified'}
              </span>
              <h1 className="text-xl font-black text-slate-900">
                {lang === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'شكراً لك، تم استلام دفعتك بنجاح لصالح مؤسسة ورود الهمة التجارية'
                  : 'Thank you! Your payment has been received successfully.'}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200">
                <span className="font-medium">{lang === 'ar' ? 'المستفيد:' : 'Beneficiary:'}</span>
                <span className="font-bold text-slate-900">{lang === 'ar' ? storeConfig.companyNameAr : storeConfig.companyNameEn}</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">{lang === 'ar' ? 'رقم المرجع:' : 'Reference:'}</span>
                <span className="font-mono font-bold text-slate-900">{details?.reference || 'N/A'}</span>
              </div>

              {details?.transactionId && (
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-medium">{lang === 'ar' ? 'معرّف المعاملة:' : 'Transaction ID:'}</span>
                  <span className="font-mono text-slate-700">{details.transactionId}</span>
                </div>
              )}

              {details?.customerName && (
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-medium">{lang === 'ar' ? 'اسم العميل:' : 'Customer Name:'}</span>
                  <span className="font-bold text-slate-900">{details.customerName}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">{lang === 'ar' ? 'وسيلة الدفع:' : 'Payment Method:'}</span>
                <span className="font-bold text-slate-900">
                  {details?.cardType ? `${details.paymentMethod} (${details.cardType})` : (details?.paymentMethod || 'Payzaty')}
                  {details?.cardLast4 ? ` •••• ${details.cardLast4}` : ''}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">{lang === 'ar' ? 'تاريخ وساعة السداد:' : 'Date & Time:'}</span>
                <span className="font-mono text-slate-700">
                  {details?.createdAt ? new Date(details.createdAt).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US') : new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-900">{lang === 'ar' ? 'المبلغ المدفوع:' : 'Amount Paid:'}</span>
                <span className="text-base font-black text-emerald-600">
                  {Number(details?.amount || 0).toFixed(2)} {storeConfig.currency}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'ar' ? 'طباعة أو حفظ الإيصال' : 'Print / Save Receipt'}</span>
              </button>

              <a
                href="/"
                className="flex-1 bg-[#347b42] hover:bg-[#2d6838] text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 text-center"
              >
                <span>{lang === 'ar' ? 'متابعة التسوق في المتجر' : 'Return to Store'}</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-xl">
            <div className="text-center pb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-10 h-10" />
              </div>
              <span className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-black border border-red-200 mb-2">
                {lang === 'ar' ? 'لم تكتمل المعاملة' : 'Transaction Not Completed'}
              </span>
              <h1 className="text-xl font-black text-slate-900">
                {lang === 'ar' ? 'فشلت عملية الدفع' : 'Payment Failed'}
              </h1>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'لم يتم خصم أي مبلغ مالي من بطاقتك. قد يكون السبب إلغاء العملية، أو انتهاء الجلسة، أو عدم كفاية الرصيد.'
                  : 'No funds were charged. The session may have expired, been cancelled, or declined by the issuing bank.'}
              </p>
              {rawError && (
                <p className="text-[11px] text-red-600 font-mono mt-2 bg-red-50 p-2 rounded-lg max-w-sm mx-auto">
                  {rawError}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
              <a
                href="/pay"
                className="flex-1 bg-[#347b42] hover:bg-[#2d6838] text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 text-center"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعادة المحاولة مجدداً' : 'Try Again'}</span>
              </a>

              <a
                href="/"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 text-center"
              >
                <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400 print:hidden">
        <p>© {new Date().getFullYear()} {lang === 'ar' ? storeConfig.companyNameAr : storeConfig.companyNameEn} - {lang === 'ar' ? 'بوابة الدفع الإلكتروني بيزاتي' : 'Payzaty Payment Gateway'}</p>
      </footer>
    </div>
  );
};
