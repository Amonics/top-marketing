// Hands the browser the Stripe publishable key from the environment, so no
// key is ever written into the pages or the repository.
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return res.status(500).json({ error: 'Payments are not configured yet.' });
  }

  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json({ publishableKey });
}
