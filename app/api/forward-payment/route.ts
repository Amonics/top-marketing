import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

function verifyShopBSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

interface ForwardPayload {
  productId: string;
  productName: string;
  amount: number;
  currency?: string;
  customerEmail?: string;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-shop-signature");

    const webhookSecret = process.env.SHOP_B_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[forward-payment] SHOP_B_WEBHOOK_SECRET nicht gesetzt");
      return NextResponse.json(
        { error: "Server-Konfigurationsfehler" },
        { status: 500 }
      );
    }

    if (!verifyShopBSignature(rawBody, signature, webhookSecret)) {
      console.error("[forward-payment] Ungueltige Signatur");
      return NextResponse.json(
        { error: "Ungueltige Signatur" },
        { status: 401 }
      );
    }

    const body: ForwardPayload = JSON.parse(rawBody);

    const {
      productId,
      productName,
      amount,
      currency = "eur",
      customerEmail,
      returnUrl,
      cancelUrl,
      metadata = {},
    } = body;

    if (!productId || !productName || !amount || !returnUrl || !cancelUrl) {
      return NextResponse.json(
        {
          error:
            "Fehlende Pflichtfelder: productId, productName, amount, returnUrl, cancelUrl",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
              metadata: { productId, sourceShop: "shop-b" },
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        ...metadata,
        productId,
        sourceShop: "shop-b",
        returnUrl,
      },
      success_url: returnUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
    });

    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        sourceShop: "shop-b",
        productId,
        productName,
        amount,
        currency,
        customerEmail: customerEmail || null,
        status: "pending",
        metadata: metadata as object,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("[forward-payment] Fehler:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
