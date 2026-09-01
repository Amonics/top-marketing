const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('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');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// POST /create-checkout-session
// ---------------------------------------------------------------------------
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, shopOrigin, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'items must be a non-empty array.' });
    }
    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ error: 'successUrl and cancelUrl are required.' });
    }
    for (const item of items) {
      if (!item.name || typeof item.price !== 'number' || item.price <= 0) {
        return res.status(400).json({
          error: `Invalid item: each item needs a name and a positive price (cents). Got: ${JSON.stringify(item)}`
        });
      }
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price)
      },
      quantity: item.quantity || 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { shopOrigin: shopOrigin || 'unknown' }
    });

    console.log(`[checkout] Session created: ${session.id} | shop: ${shopOrigin || 'unknown'}`);
    return res.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Error creating session:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Headless Checkout API running on http://localhost:${PORT}`);
  console.log('[server] POST /create-checkout-session ready');
});
