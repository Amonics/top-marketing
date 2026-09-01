const Stripe = require('stripe');

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items, shopOrigin, successUrl, cancelUrl } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array.' });
    }
    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'successUrl and cancelUrl are required.' });
    }
    for (const item of items) {
      if (!item.name || typeof item.price !== 'number' || item.price <= 0) {
        return res.status(400).json({
          error: 'Invalid item: each item needs a name and a positive price (cents). Got: ' + JSON.stringify(item)
        });
      }
    }

    // Map to Stripe line_items
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price)
      },
      quantity: item.quantity || 1
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { shopOrigin: shopOrigin || 'unknown' }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}