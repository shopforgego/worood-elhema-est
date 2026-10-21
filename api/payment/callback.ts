export default async function handler(req: any, res: any) {
  try {
    const checkoutId = req.query?.checkout_id || req.query?.checkoutId || req.query?.id || '';
    const ref = req.query?.ref || req.query?.reference || '';
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'worood.shopforgego.com';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const origin = `${proto}://${host}`;

    const target = new URL('/payment/status', origin);
    if (checkoutId) target.searchParams.set('checkout_id', checkoutId);
    if (ref) target.searchParams.set('ref', ref);

    return res.redirect(303, target.toString());
  } catch (error) {
    return res.redirect(303, '/payment/status?status=failed');
  }
}
