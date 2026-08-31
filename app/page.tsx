export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Top Marketing — Payment Gateway</h1>
      <p>Dieser Service verarbeitet Zahlungen fuer alle verbundenen Shops.</p>
      <section style={{ marginTop: "2rem" }}>
        <h2>Endpunkte</h2>
        <ul>
          <li>
            <code>POST /api/create-checkout</code> — Erstellt eine
            Stripe-Checkout-Session
          </li>
          <li>
            <code>POST /api/forward-payment</code> — Empfaengt
            Checkout-Anfragen von Shop B
          </li>
          <li>
            <code>POST /api/stripe-webhook</code> — Empfaengt Stripe-Events
          </li>
        </ul>
      </section>
    </main>
  );
}
