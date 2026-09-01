# Headless Checkout – Zentraler Payment-Server

Stripe-basierte Headless-Checkout-Architektur. Der Payment-Server (Site B) stellt eine API bereit, über die beliebige Shops (Site A) Stripe Checkout Sessions erstellen können.

## Architektur

```
Site A (Nischen-Shop)  ──POST /create-checkout-session──►  Site B (Payment API)
      toppepcopie                                            top-marketing
          │                                                       │
          │  window.location.href = url                           │  stripe.checkout.sessions.create()
          ▼                                                       ▼
   Stripe Checkout (gehostete Seite)                        Stripe API
```

## Schnellstart

### 1. Dependencies installieren

```bash
npm install
```

### 2. Server starten (Site B)

```bash
node backend/server.js
```

Der Server läuft auf \`http://localhost:3000\`.

### 3. Frontend öffnen (Site A)

Öffne \`frontend/index.html\` direkt im Browser oder über einen lokalen Webserver.

Klicke auf **"Jetzt Kaufen"** — der Button sendet einen POST-Request an den Server und leitet auf die Stripe Checkout-Seite um.

## API-Referenz

### POST /create-checkout-session

| Parameter    | Typ      | Beschreibung                                      |
|-------------|----------|---------------------------------------------------|
| items        | Array    | [{ name, price (Cent), quantity }]                |
| shopOrigin   | String   | Origin des aufrufenden Shops                      |
| successUrl   | String   | Redirect-URL nach erfolgreicher Zahlung           |
| cancelUrl    | String   | Redirect-URL bei Abbruch                          |

**Response:**
```json
{ "url": "https://checkout.stripe.com/c/pay/..." }
```

### GET /health

Health-Check. Gibt { status: "ok", timestamp: "..." } zurück.

## Produktion

1. **Stripe Secret Key austauschen** — Ersetze sk_test_DUMMY_KEY in backend/server.js durch deinen echten Stripe Secret Key. Verwende eine Umgebungsvariable (process.env.STRIPE_SECRET_KEY).
2. **HTTPS** — Das Frontend muss über HTTPS bereitgestellt werden.
3. **CORS einschränken** — In Produktion sollte cors() auf die erlaubten Origins beschränkt werden.
4. **Webhook** — Richte einen Stripe-Webhook ein, um Zahlungsbestätigungen serverseitig zu empfangen.
