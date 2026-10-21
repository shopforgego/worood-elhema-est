export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-AccountNo, X-SecretKey'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { amount, customer, reference, response_url, cancel_url, note } = body || {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'المبلغ غير صالح' });
    }

    const accountNo = process.env.PAYZATY_ACCOUNT_NO || "814816";
    const secretKey = process.env.PAYZATY_SECRET_KEY || "sk_c289dcd78b954cd0a2eb79bbe3fe3ac9";
    const env = process.env.PAYZATY_ENV || "production";
    const baseUrl = env === "production" ? "https://api.payzaty.com" : "https://api.sandbox.payzaty.com";

    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'worood.shopforgego.com';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${proto}://${host}`;

    // Normalize phone number to Saudi international format (+966 5XXXXXXXX)
    let rawPhone = (customer?.phone || '').toString().trim().replace(/[^\d+]/g, '');
    let cleanDigits = rawPhone.replace(/\D/g, '');
    if (cleanDigits.startsWith('0')) {
      cleanDigits = '966' + cleanDigits.slice(1);
    } else if (!cleanDigits.startsWith('966')) {
      cleanDigits = '966' + cleanDigits;
    }
    const formattedPhone = '+966 ' + cleanDigits.slice(3);

    const orderRef = reference || `WRD-${Date.now()}`;
    const targetResponseUrl = response_url || `${origin}/payment/status?ref=${orderRef}`;
    const targetCancelUrl = cancel_url || `${origin}/payment?cancelled=true`;

    const payload = {
      amount: parseFloat(Number(amount).toFixed(2)),
      currency: 'SAR',
      language: 'ar',
      reference: orderRef,
      customer: {
        name: customer?.name || 'عميل ورود الهمة',
        email: customer?.email || 'woroodelhema1@gmail.com',
        phone: formattedPhone,
      },
      response_url: targetResponseUrl,
      cancel_url: targetCancelUrl,
      note: note || undefined,
    };

    const payzatyRes = await fetch(`${baseUrl}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AccountNo': accountNo,
        'X-SecretKey': secretKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await payzatyRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, error: 'استجابة غير صالحة من بوابة بيزاتي', raw: text });
    }

    if (!payzatyRes.ok || !data.checkout_url) {
      return res.status(payzatyRes.status || 400).json({
        success: false,
        error: data.error_text || data.error || data.message || 'فشل في إنشاء جلسة الدفع',
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      checkout_url: data.checkout_url,
      checkout_id: data.checkout_id || data.id,
      reference: orderRef,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'حدث خطأ في الخادم' });
  }
}
