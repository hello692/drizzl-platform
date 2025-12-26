import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  qty: number;
};

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY in environment");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function isValidItems(items: any): items is CartItem[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (i) =>
        i &&
        typeof i.productId === "string" &&
        typeof i.name === "string" &&
        Number.isFinite(i.priceCents) &&
        Number.isFinite(i.qty) &&
        i.qty >= 1 &&
        i.priceCents >= 0,
    )
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { items } = req.body ?? {};
    if (!isValidItems(items)) return res.status(400).json({ error: "Invalid cart items" });

    const origin =
      (req.headers.origin as string | undefined) ||
      (process.env.NEXT_PUBLIC_SITE_URL as string | undefined) ||
      "http://localhost:3000";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      line_items: items.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.priceCents),
          product_data: {
            name: i.name,
            metadata: { productId: i.productId },
          },
        },
      })),
      metadata: {
        cart: JSON.stringify(items.map((i) => ({ productId: i.productId, qty: i.qty }))),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return res.status(500).json({ error: err?.message ?? "Server error creating checkout session" });
  }
}
