import React, { useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  qty: number;
};

export function CheckoutButton({ cartItems }: { cartItems: CartItem[] }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
      }

      if (!res.ok) {
        console.error("Checkout API error:", res.status, text);
        throw new Error(data?.error ?? `Checkout failed (${res.status})`);
      }

      const url = data?.url;
      if (!url) throw new Error("Checkout session URL missing from API response");

      window.location.assign(url);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Checkout failed");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      {error ? <div style={{ marginBottom: 8, color: "red" }}>{error}</div> : null}
      <button type="button" disabled={processing || cartItems.length === 0} onClick={handleCheckout}>
        {processing ? "Processing…" : "Checkout"}
      </button>
    </div>
  );
}
