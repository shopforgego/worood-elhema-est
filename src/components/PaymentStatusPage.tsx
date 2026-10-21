import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, ArrowRight, Printer, Share2, Building2, ShieldCheck, Phone, RotateCcw, Loader2 } from 'lucide-react';
import { storeConfig } from '../config/store';
import { Logo } from './Logo';

export const PaymentStatusPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [details, setDetails] = useState<any>(null);
  const [rawError, setRawError] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const checkoutId = params.get('checkout_id') || params.get('id') || params.get('checkoutId') || sessionStorage.getItem('payzaty_checkout_id') || '';
      const orderRef = params.get('ref') || sessionStorage.getItem('payzaty_ref') || '';
      const fallbackAmount = sessionStorage.getItem('payzaty_amount') || '';
      const fallbackCustomer = sessionStorage.getItem('payzaty_customer') || '';

      if (!checkoutId) {
        // If neither checkoutId in URL nor in sessionStorage
        // Check if there is a 'status=failed' query param
        if (params.get('cancelled') === 'true' || params.get('status') === 'failed') {
          setStatus('failed');
          setLoading(false);
          return;
        }
        setStatus('failed');
        setRawError('لم يتم العثور على معرّف العملية.');
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
          setRawError(data.error || 'تعذر التحقق من الدفع');
        }
      } catch (err: any) {
        setStatus('failed');
        setRawError(err.message || 'خطأ في الاتصال');
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 print:hidden">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#347b42] transition">
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمتجر الرئيسي</span>
          </a>
          <Logo />
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-8 flex-1">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Loader2 className="w-12 h-12 text-[#347b42] animate-spin mx-auto mb-4" />
            <h2 className="text-base font-extrabold text-slate-900 mb-1">جاري التحقق من عملية السداد...</h2>
            <p className="text-xs text-slate-500">نتواصل مع بوابة بيزاتي لتأكيد استلام الدفعة، يرجى الانتظار لحظات</p>
          </div>
        ) : status === 'success' ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xl print:shadow-none print:border-none">
            {/* Top Badge */}
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black border border-emerald-200 mb-2">
                عملية مقبولة وناجحة
              </span>
              <h1 className="text-xl font-black text-slate-900">تم الدفع بنجاح!</h1>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                شكراً لك، تم استلام دفعتك بنجاح لصالح مؤسسة ورود الهمة التجارية
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="my-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200">
                <span className="font-medium">المستفيد:</span>
                <span className="font-bold text-slate-900">{storeConfig.companyNameAr}</span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">رقم المرجع (Reference):</span>
                <span className="font-mono font-bold text-slate-900">{details?.reference || 'N/A'}</span>
              </div>

              {details?.transactionId && (
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-medium">معرّف المعاملة:</span>
                  <span className="font-mono text-slate-700">{details.transactionId}</span>
                </div>
              )}

              {details?.customerName && (
                <div className="flex justify-between items-center text-slate-500">
                  <span className="font-medium">اسم العميل:</span>
                  <span className="font-bold text-slate-900">{details.customerName}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">وسيلة الدفع:</span>
                <span className="font-bold text-slate-900">
                  {details?.cardType ? `${details.paymentMethod} (${details.cardType})` : (details?.paymentMethod || 'بيزاتي')}
                  {details?.cardLast4 ? ` •••• ${details.cardLast4}` : ''}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-500">
                <span className="font-medium">تاريخ وساعة السداد:</span>
                <span className="font-mono text-slate-700">
                  {details?.createdAt ? new Date(details.createdAt).toLocaleString('ar-SA') : new Date().toLocaleString('ar-SA')}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-900">المبلغ المدفوع:</span>
                <span className="text-base font-black text-emerald-600">
                  {Number(details?.amount || 0).toFixed(2)} {storeConfig.currencySymbol}
                </span>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 mb-6">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#347b42]" />
                <strong>سجل تجاري:</strong> {storeConfig.cr}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#347b42]" />
                <strong>رقم ضريبي:</strong> {storeConfig.taxNumber}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#347b42]" />
                <strong>الهاتف:</strong> {storeConfig.phone}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة أو حفظ الإيصال</span>
              </button>

              <a
                href="/"
                className="flex-1 bg-[#347b42] hover:bg-[#2d6838] text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 text-center"
              >
                <span>متابعة التسوق في المتجر</span>
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
                لم تكتمل المعاملة
              </span>
              <h1 className="text-xl font-black text-slate-900">فشلت عملية الدفع</h1>
              <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                لم يتم خصم أي مبلغ مالي من بطاقتك. قد يكون السبب إلغاء العملية، أو انتهاء الجلسة، أو عدم كفاية الرصيد.
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
                <span>إعادة المحاولة مجدداً</span>
              </a>

              <a
                href="/"
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 text-center"
              >
                <span>العودة للرئيسية</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[11px] text-slate-400 print:hidden">
        <p>© {new Date().getFullYear()} {storeConfig.companyNameAr} - بوابة الدفع الإلكتروني بيزاتي</p>
      </footer>
    </div>
  );
};
