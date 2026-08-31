import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

interface CheckoutPayload {
  productId: string;
  productName: string;
  amount: number;
  currency?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  sourceShop?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutPayload = await req.json();

    const {
      productId,
      productName,
      amount,
      currency = "eur",
      customerEmail,
      successUrl,
      cancelUrl,
      metadata = {},
      sourceShop = "shop-a",
    } = body;

    if (!productId || !productName || !amount || !successUrl || !cancelUrl) {
      return NextResponse.json(
        {
          error:
            "Fehlende Pflichtfelder: productId, productName, amount, successUrl, cancelUrl",
        },
        { status: 400 }
      );
    }

    if (amount < 50) {
      return NextResponse.json(
        { error: "Mindestbetrag ist 50 Cent" },
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
              metadata: { productId, sourceShop },
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        ...metadata,
        productId,
        sourceShop,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        sourceShop,
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
    console.error("[create-checkout] Fehler:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
