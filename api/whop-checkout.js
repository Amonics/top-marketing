import { CATALOGUE, CODES } from './_catalogue.js';

/* Whop checkout — creates the one-off plan the embed on /checkout.html pays.

   The amount is worked out HERE, from CATALOGUE, exactly like
   /api/payment-intent does for Stripe. The browser only ever sends course ids
   and quantities: a visitor can edit the page freely, so a price that arrived
   in the request would be worthless. This also means the endpoint cannot be
   used to charge an arbitrary amount for something that is not one of our
   courses — it can only ever sell what is in the catalogue.

   Needs two environment variables at Vercel:
     WHOP_API_KEY      — secret, never in the repo
     WHOP_COMPANY_ID   — the biz_… id of the Whop business for this shop
*/

const WHOP_API = 'https://api.whop.com/api/v1/checkout_configurations';

// Order reference: TM- + 8 unambiguous characters (no 0/O/1/I).
function reference() {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return 'TM-' + out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.WHOP_API_KEY || !process.env.WHOP_COMPANY_ID) {
    return res.status(500).json({ error: 'Payments are not configured yet.' });
  }

  try {
    const { items = [], code = null, email = '', returnUrl = '' } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    let cents = 0;
    const names = [];

    for (const item of items) {
      const product = CATALOGUE[item?.id];
      if (!product) {
        return res.status(400).json({ error: `Unknown course: ${item?.id}` });
      }
      const qty = Math.min(Math.max(parseInt(item.qty, 10) || 1, 1), 10);
      cents += product.cents * qty;
      names.push(`${qty}× ${product.name}`);
    }

    const rate = code && CODES[code] ? CODES[code] : 0;
    cents = Math.round(cents * (1 - rate));

    if (cents < 50) {
      return res.status(400).json({ error: 'Order total is too low.' });
    }

    const ref = reference();
    const label = names.join(', ').slice(0, 120) || 'Course order';

    const whopRes = await fetch(WHOP_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'payment',
        plan: {
          company_id: process.env.WHOP_COMPANY_ID,
          currency: 'eur',
          // Whop takes the price in euros, not cents.
          initial_price: cents / 100,
          plan_type: 'one_time',
          // Our listed prices are what the customer pays, so VAT is inside
          // them rather than added on top at the last step.
          override_tax_type: 'inclusive',
          title: label,
          description: label,
          product: { external_identifier: ref, title: label },
        },
        ...(returnUrl ? { redirect_url: returnUrl } : {}),
        metadata: { ref, courses: names.join(', ').slice(0, 450), email: email || '' },
      }),
    });

    if (!whopRes.ok) {
      const detail = await whopRes.text().catch(() => '');
      console.error('whop checkout failed', whopRes.status, detail);
      return res
        .status(502)
        .json({ error: 'We could not start the payment. Please try again.' });
    }

    const data = await whopRes.json();
    const planId = data?.plan?.id || data?.plan_id;
    if (!planId) {
      console.error('whop returned no plan id', JSON.stringify(data).slice(0, 500));
      return res
        .status(502)
        .json({ error: 'We could not start the payment. Please try again.' });
    }

    return res.status(200).json({ planId, ref, amount: cents });
  } catch (err) {
    console.error('whop checkout failed', err);
    return res
      .status(500)
      .json({ error: 'We could not start the payment. Please try again.' });
  }
}
