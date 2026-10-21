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

  try {
    let checkoutId = '';
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      checkoutId = body?.checkoutId || body?.checkout_id || body?.id || '';
    } else {
      checkoutId = (req.query?.checkoutId || req.query?.checkout_id || req.query?.id || '') as string;
    }

    if (!checkoutId) {
      return res.status(400).json({ verified: false, error: 'معرّف عملية الدفع غير موجود' });
    }

    const accountNo = process.env.PAYZATY_ACCOUNT_NO || "814816";
    const secretKey = process.env.PAYZATY_SECRET_KEY || "sk_c289dcd78b954cd0a2eb79bbe3fe3ac9";
    const env = process.env.PAYZATY_ENV || "production";
    const baseUrl = env === "production" ? "https://api.payzaty.com" : "https://api.sandbox.payzaty.com";

    const payzatyRes = await fetch(`${baseUrl}/checkout/${checkoutId}`, {
      method: 'GET',
      headers: {
        'X-AccountNo': accountNo,
        'X-SecretKey': secretKey,
      },
    });

    const text = await payzatyRes.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ verified: false, error: 'استجابة غير صالحة من بيزاتي', raw: text });
    }

    const rawStatus = (data.status || '').toLowerCase();
    const isPaid = data.paid === true || rawStatus === 'paid' || rawStatus === 'captured';

    return res.status(200).json({
      verified: true,
      paid: isPaid,
      status: isPaid ? 'success' : (rawStatus === 'pending' ? 'pending' : 'failed'),
      rawStatus: data.status,
      details: {
        paid: isPaid,
        amount: data.amount,
        currency: data.currency || 'SAR',
        reference: data.reference || '',
        customerName: data.customer?.name || '',
        customerEmail: data.customer?.email || '',
        customerPhone: data.customer?.phone || '',
        paymentMethod: data.payment_method || (data.card_type ? 'بطاقة بنكية' : 'دفع إلكتروني'),
        cardType: data.card_type || '',
        cardLast4: data.card_last4 || '',
        transactionId: data.transaction_id || data.id || checkoutId,
        createdAt: data.created_at || new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ verified: false, error: error.message || 'خطأ في التحقق من الدفع' });
  }
}
