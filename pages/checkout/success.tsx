import { useRouter } from "next/router";
import React from "react";

export default function SuccessPage() {
  const { query } = useRouter();
  return (
    <div style={{ padding: 24 }}>
      <h1>Payment success ✅</h1>
      <p>Session: {String(query.session_id ?? "")}</p>
      <p>You can now create an order via webhook, but checkout redirect is working.</p>
    </div>
  );
}
