import Stripe from 'stripe';
import { CATALOGUE, CODES } from './_catalogue.js';

// Built inside the handler: with no key configured, `new Stripe(undefined)`
// throws while the file is loading and the checks below never run.
let stripe;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Payments are not configured yet.' });
  }

  stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items = [], code = null } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    // The amount is worked out here, from CATALOGUE. Whatever price the
    // browser claims is ignored — a visitor can edit the page freely.
    let cents = 0;
    const names = [];

    for (const item of items) {
      const product = CATALOGUE[item?.id];
      if (!product) {
        return res.status(400).json({ error: `Unknown course: ${item?.id}` });
      }
      const qty = Math.min(Math.max(parseInt(item.qty, 10) || 1, 1), 10);
      // CATALOGUE already stores integer cents, so nothing is rounded here.
      cents += product.cents * qty;
      names.push(`${qty}× ${product.name}`);
    }

    const rate = code && CODES[code] ? CODES[code] : 0;
    cents = Math.round(cents * (1 - rate));

    if (cents < 50) {
      return res.status(400).json({ error: 'Order total is too low.' });
    }

    const intent = await stripe.paymentIntents.create({
      amount: cents,
      currency: 'eur',
      // Listed explicitly rather than using automatic_payment_methods, which
      // would pull in Stripe Link — the one-click option that carries Stripe's
      // own branding and email prompt. Add 'paypal', 'klarna' or others here
      // once they are switched on in the Stripe dashboard.
      payment_method_types: ['card'],
      description: names.join(', ').slice(0, 350),
      metadata: {
        discount_code: code ?? '',
        courses: names.join(', ').slice(0, 450),
      },
    });

    return res.status(200).json({
      clientSecret: intent.client_secret,
      amount: cents,
    });
  } catch (err) {
    console.error('payment intent failed', err);
    return res
      .status(500)
      .json({ error: 'We could not start the payment. Please try again.' });
  }
}
