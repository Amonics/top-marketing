# Übergabe-Prompt

Diesen Text komplett kopieren und in eine neue Claude-Sitzung einfügen.

---

```
Hilf mir, meinen Online-Kursshop fertig live zu stellen. Ich bin kein
Entwickler. Erkläre mir jeden Schritt einzeln und sag mir genau, wo ich
klicken muss.

WIE DU MIT MIR ARBEITEN SOLLST
- Gib mir immer nur EINEN Schritt auf einmal und warte auf meine Rückmeldung.
- Bei DNS-Einträgen: niemals mehrere Einträge nebeneinander in einer Tabelle
  darstellen. Ich lese das falsch. Immer untereinander, ein Eintrag pro Block,
  jedes Feld auf einer eigenen Zeile:
      Typ:  A
      Name: @
      Wert: 216.198.79.1
- Sag mir bei jedem Befehl dazu, ob er ins Terminal gehört oder ob es nur
  Text zum Lesen ist. Ich habe schon versehentlich deine Erfolgsmeldungen
  ins Terminal kopiert.
- Prüf Ergebnisse selbst nach (dig, curl, git status), statt mich zu fragen,
  ob es geklappt hat.
- Antworte auf Deutsch.

PROJEKT
Ordner:      /Users/petrubirgauan/Documents/Marketing Seite
Was es ist:  Verkaufsseite für 29 Kurse zu Short-Form-Video
             (TikTok, YouTube, Instagram, Automation), Preise 45-500 EUR
Technik:     reines HTML/CSS/JS, kein Framework, kein Build-Schritt
             plus zwei Vercel-Serverless-Funktionen für Stripe
Dateien:     index.html, assets/style.css, assets/app.js, return.html,
             api/checkout.js, api/session-status.js, api/_catalogue.js,
             package.json

KONTEN
GitHub:      Benutzer topasmoboy, Repository topasmoboy/top-marketing (privat)
             Achtung: global ist in git noch ein ANDERES Konto (asmoboy)
             eingetragen. Dieses Projekt hat deshalb eine lokale
             git config (user.name/user.email) - die nicht überschreiben.
Vercel:      Team topmarketingcourse, Projekt top-marketing
Domain:      top-marketing.studio, gekauft bei Squarespace
Stripe:      Konto vorhanden, Publishable Key steht in assets/app.js

STAND DNS (bei Squarespace, Nameserver bleiben bei Squarespace)
Richtig gesetzt und fertig:
    A      @      216.198.79.1
    CNAME  www    cname.vercel-dns.com
    CNAME  _domainconnect  (Squarespace-intern, bleibt)
    TXT    @      v=spf1 -all
    TXT    _dmarc  und  TXT _domainkey  (E-Mail-Sicherheit, bleiben)

Noch zu löschen unter "Benutzerdefinierte Einträge":
    A  cname  76.76.21.21        <- falsch angelegt, muss weg
    A  @      216.198.79.1       <- Dublette, steht schon in der
                                    Voreinstellung "Vercel"

WAS SCHON FERTIG IST
- Seite gebaut, 29 Produkte, Kategoriefilter, Warenkorb mit localStorage
- Auf GitHub hochgeladen (Commit 374a031)
- Bei Vercel deployed, läuft unter top-marketing.vercel.app
- Stripe Embedded Checkout programmiert (bleibt auf der Seite, keine
  Weiterleitung), E-Mail-Pflicht, weltweite Länderauswahl, Preise werden
  serverseitig aus api/_catalogue.js geprüft
- Domain bei Vercel eingetragen, DNS bei Squarespace fast fertig

WAS NOCH OFFEN IST (in dieser Reihenfolge)
1. Die zwei falschen DNS-Einträge bei Squarespace löschen
2. Warten bis Vercel den Domain-Status auf "Valid" setzt und das
   HTTPS-Zertifikat ausgestellt ist
3. git push - der Stripe-Checkout ist lokal committet, aber noch nicht
   hochgeladen (1 Commit ahead)
4. STRIPE_SECRET_KEY in den Vercel Environment Variables eintragen.
   WICHTIG: Ich soll den Secret Key niemals in den Chat kopieren, nur
   direkt bei Vercel eintragen. Erinnere mich daran.
5. Auf Stripe-Testmodus umstellen zum Ausprobieren (pk_test in
   assets/app.js, sk_test bei Vercel), mit Testkarte 4242 4242 4242 4242
6. Stripe Tax aktivieren und in api/checkout.js automatic_tax auf true
   setzen - ich verkaufe digitale Kurse an Verbraucher in der EU
7. Rechtstexte: Impressum, Datenschutz, AGB, Widerrufsbelehrung.
   Stehen im Footer nur als leere Links. Pflicht vor dem ersten Verkauf.
8. Platzhalter-Testimonials im Abschnitt "Students" ersetzen oder löschen -
   aktuell steht dort sichtbarer Platzhaltertext
9. Auslieferung: Es gibt noch keinen Mitgliederbereich. Nach dem Kauf
   bekommt der Käufer nur die Stripe-Quittung, aber keinen Kurs.
   Berate mich, wie ich das am einfachsten löse.

Fang mit Punkt 1 an.
```
