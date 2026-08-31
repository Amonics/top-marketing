"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SessionStatus {
  status: string;
  customerEmail: string | null;
}

export default function CheckoutReturn() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Keine Session-ID gefunden");
      setLoading(false);
      return;
    }

    async function checkStatus() {
      try {
        const res = await fetch(
          `/api/create-checkout?session_id=${sessionId}`,
          { method: "GET" }
        );
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        } else {
          setError("Statusabfrage fehlgeschlagen");
        }
      } catch {
        setError("Netzwerkfehler bei der Statusabfrage");
      } finally {
        setLoading(false);
      }
    }

    checkStatus();
  }, [sessionId]);

  if (loading) {
    return (
      <main
        style={{
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1>Zahlung wird ueberprueft...</h1>
        <p>Bitte warten.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          padding: "2rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <h1>Fehler</h1>
        <p>{error}</p>
        <a href="/">Zurueck zur Startseite</a>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
      }}
    >
      {status?.status === "complete" ? (
        <>
          <h1>Zahlung erfolgreich!</h1>
          <p>
            Vielen Dank fuer deinen Einkauf.
            {status.customerEmail && (
              <>
                {" "}
                Eine Bestaetigung wurde an{" "}
                <strong>{status.customerEmail}</strong> gesendet.
              </>
            )}
          </p>
        </>
      ) : (
        <>
          <h1>Zahlung ausstehend</h1>
          <p>
            Deine Zahlung wird noch verarbeitet. Du erhaeltst eine E-Mail
            sobald alles bestaetigt ist.
          </p>
        </>
      )}
    </main>
  );
}
