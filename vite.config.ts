import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function payzatyDevApiPlugin(): Plugin {
  let env: Record<string, string> = {};

  return {
    name: 'payzaty-dev-api',
    configResolved(config) {
      env = loadEnv(config.mode, process.cwd(), '');
    },
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
        
        // Handle checkout
        if (req.method === 'POST' && (url.pathname === '/api/payment/checkout' || url.pathname === '/api/payzaty/checkout')) {
          let bodyStr = '';
          req.on('data', (chunk: any) => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              const body = JSON.parse(bodyStr || '{}');
              const accountNo = env.PAYZATY_ACCOUNT_NO || process.env.PAYZATY_ACCOUNT_NO || '814816';
              const secretKey = env.PAYZATY_SECRET_KEY || process.env.PAYZATY_SECRET_KEY || 'sk_c289dcd78b954cd0a2eb79bbe3fe3ac9';
              const payzatyEnv = env.PAYZATY_ENV || process.env.PAYZATY_ENV || 'production';
              const baseUrl = payzatyEnv === 'production' ? 'https://api.payzaty.com' : 'https://api.sandbox.payzaty.com';

              const origin = `http://${req.headers?.host || 'localhost'}`;
              const { amount, customer, reference, response_url, cancel_url, note } = body;

              let cleanDigits = (customer?.phone || '').toString().trim().replace(/\D/g, '');
              if (cleanDigits.startsWith('0')) {
                cleanDigits = '966' + cleanDigits.slice(1);
              } else if (!cleanDigits.startsWith('966')) {
                cleanDigits = '966' + cleanDigits;
              }
              const formattedPhone = '+966 ' + cleanDigits.slice(3);

              const orderRef = reference || `WRD-${Date.now()}`;
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
                response_url: response_url || `${origin}/payment/status?ref=${orderRef}`,
                cancel_url: cancel_url || `${origin}/payment?cancelled=true`,
                note,
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
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = payzatyRes.status;
              res.end(text);
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        // Handle verify
        if ((url.pathname === '/api/payment/verify' || url.pathname === '/api/payzaty/verify')) {
          const handleVerify = async (checkoutId: string) => {
            const accountNo = env.PAYZATY_ACCOUNT_NO || process.env.PAYZATY_ACCOUNT_NO || '814816';
            const secretKey = env.PAYZATY_SECRET_KEY || process.env.PAYZATY_SECRET_KEY || 'sk_c289dcd78b954cd0a2eb79bbe3fe3ac9';
            const payzatyEnv = env.PAYZATY_ENV || process.env.PAYZATY_ENV || 'production';
            const baseUrl = payzatyEnv === 'production' ? 'https://api.payzaty.com' : 'https://api.sandbox.payzaty.com';

            try {
              const payzatyRes = await fetch(`${baseUrl}/checkout/${checkoutId}`, {
                method: 'GET',
                headers: {
                  'X-AccountNo': accountNo,
                  'X-SecretKey': secretKey,
                },
              });

              const data: any = await payzatyRes.json();
              const rawStatus = (data.status || '').toLowerCase();
              const isPaid = data.paid === true || rawStatus === 'paid' || rawStatus === 'captured';

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
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
              }));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ verified: false, error: err.message }));
            }
          };

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', (chunk: any) => { bodyStr += chunk; });
            req.on('end', () => {
              const body = JSON.parse(bodyStr || '{}');
              handleVerify(body.checkoutId || body.checkout_id || url.searchParams.get('checkout_id') || '');
            });
            return;
          } else {
            handleVerify(url.searchParams.get('checkout_id') || url.searchParams.get('checkoutId') || url.searchParams.get('id') || '');
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), payzatyDevApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
