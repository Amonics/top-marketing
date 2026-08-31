import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

async function notifyShopB(order: {
  stripeSessionId: string;
  productId: string;
  productName: string;
  amount: number;
  currency: string;
  customerEmail: string | null;
  status: string;
  metadata: unknown;
}) {
  const webhookUrl = process.env.SHOP_B_WEBHOOK_URL;
  const webhookSecret = process.env.SHOP_B_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("[stripe-webhook] Shop-B-Webhook nicht konfiguriert");
    return;
  }

  const payload = JSON.stringify({
    event: "payment.completed",
    order: {
      stripeSessionId: order.stripeSessionId,
      productId: order.productId,
      productName: order.productName,
      amount: order.amount,
      currency: order.currency,
      customerEmail: order.customerEmail,
      status: order.status,
      metadata: order.metadata,
    },
    timestamp: new Date().toISOString(),
  });

  const signature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shop-signature": signature,
      },
      body: payload,
    });

    if (!res.ok) {
      console.error(
        `[stripe-webhook] Shop-B-Webhook fehlgeschlagen: ${res.status} ${res.statusText}`
      );
    } else {
      console.log("[stripe-webhook] Shop B erfolgreich benachrichtigt");
    }
  } catch (err) {
    console.error("[stripe-webhook] Shop-B-Webhook Netzwerkfehler:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Keine Stripe-Signatur" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signatur ungueltig";
      console.error("[stripe-webhook] Signaturpruefung fehlgeschlagen:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const order = await prisma.order.update({
          where: { stripeSessionId: session.id },
          data: {
            status: "paid",
            customerEmail: session.customer_details?.email || undefined,
          },
        });

        console.log(
          `[stripe-webhook] Zahlung bestaetigt: ${order.id} (${order.sourceShop})`
        );

        if (order.sourceShop === "shop-b") {
          await notifyShopB(order);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.order.update({
          where: { stripeSessionId: session.id },
          data: { status: "failed" },
        });

        console.log(`[stripe-webhook] Session abgelaufen: ${session.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntent = charge.payment_intent as string;

        if (paymentIntent) {
          const sessions = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent,
            limit: 1,
          });

          if (sessions.data.length > 0) {
            const order = await prisma.order.update({
              where: { stripeSessionId: sessions.data[0].id },
              data: { status: "refunded" },
            });

            if (order.sourceShop === "shop-b") {
              await notifyShopB({ ...order, status: "refunded" });
            }
          }
        }
        break;
      }

      default:
        console.log(`[stripe-webhook] Event ignoriert: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    console.error("[stripe-webhook] Fehler:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
