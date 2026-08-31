# Top Marketing — online stellen

Von den Dateien auf deinem Mac zu einer öffentlichen Adresse mit eigener Domain.

**Reihenfolge:** Erst Domain kaufen (Teil 1), dann GitHub (Teil 2–4), dann
Vercel (Teil 5), dann Domain verbinden (Teil 6). Die Domain zuerst, weil DNS
manchmal Stunden braucht — dann läuft das im Hintergrund, während du den Rest
machst.

**Zeitaufwand:** etwa 45 Minuten aktive Arbeit, plus Wartezeit beim DNS.

**Hinweis zum Ordnernamen:** Dein Ordner heißt `Marketing Seite`, mit
Leerzeichen. Auf der Kommandozeile bricht das Befehle ab, wenn der Pfad nicht in
Anführungszeichen steht. Deshalb steht in jedem Befehl unten der volle Pfad in
`"..."`. Kopier die Befehle unverändert.

---

# Teil 1 — Domain kaufen

## 1.1 Namen auswählen

`topmarketing.com` und `topmarketing.de` sind mit sehr hoher Wahrscheinlichkeit
seit Jahren vergeben — der Begriff ist zu generisch. Du brauchst eine Variante.
Diese Kandidaten passen zum Namen:

| Domain | Wirkung |
|---|---|
| `topmarketing.academy` | Sagt direkt, dass es Kurse sind |
| `topmarketing.courses` | Dito, etwas gebräuchlicher |
| `topmarketing.io` | Modern, im Digitalbereich üblich |
| `gettopmarketing.com` | `get`-Präfix, wenn `.com` unbedingt sein soll |
| `topmarketinglab.de` | Zusatzwort macht den Namen eintragbar |
| `top-marketing.de` | Bindestrich — funktioniert, wirkt aber älter |

**Meine Empfehlung:** `topmarketing.academy`. Die Endung erklärt das Produkt
mit, und generische `.com`-Domains sind bei diesem Begriff entweder vergeben
oder kosten vierstellig.

## 1.2 Verfügbarkeit prüfen

Ich kann von hier aus nicht nachsehen, ob eine Domain frei ist — das musst du
selbst prüfen. Geh auf einen dieser Anbieter und tipp den Namen ins Suchfeld:

- [inwx.de](https://www.inwx.de) — deutscher Anbieter, gute Preise, deutscher Support
- [namecheap.com](https://www.namecheap.com) — international, günstig
- [porkbun.com](https://porkbun.com) — meist die niedrigsten Preise

Preise liegen typisch bei 10–15 € pro Jahr für `.de`, 25–40 € für `.academy`.

## 1.3 Kaufen

Bei der Bestellung:

- **WHOIS-Schutz / Domain Privacy aktivieren.** Sonst steht deine Privatadresse
  öffentlich in der Domain-Datenbank. Bei den meisten Anbietern kostenlos.
- **Keine Zusatzpakete.** Kein Hosting, kein E-Mail-Paket, kein
  Website-Baukasten. Das Hosting macht Vercel und ist kostenlos.
- **Auto-Renew anlassen.** Eine abgelaufene Domain ist in Minuten weg.

Bezahlen und die Bestätigungsmail abwarten. Zugangsdaten zum Kundenkonto
notieren — du brauchst sie in Teil 6.

> **Bevor du dich auf den Namen festlegst:** „Top Marketing" ist als
> Bezeichnung sehr generisch, und es gibt in Deutschland mehrere Firmen, die so
> oder ähnlich heißen. Schützen lässt sich der Name deshalb kaum, und im
> ungünstigsten Fall meldet sich jemand mit älteren Rechten. Eine kostenlose
> Vorabprüfung geht im [DPMAregister](https://register.dpma.de) — Suche nach
> „Top Marketing" in Klasse 41 (Ausbildung, Unterhaltung). Zehn Minuten, die
> dir später viel Ärger sparen können.

---

# Teil 2 — Mac vorbereiten

## 2.1 Git prüfen

```bash
git --version
```

**Erwartete Ausgabe:** etwas wie `git version 2.39.5`.

Kommt stattdessen eine Fehlermeldung oder ein Installationsdialog: bestätige die
Installation der Command Line Tools und warte, bis sie durch ist. Danach den
Befehl oben nochmal ausführen.

## 2.2 GitHub-Konto anlegen

Falls du noch keins hast: [github.com/signup](https://github.com/signup).

Notier dir deinen **Benutzernamen** — er taucht in Schritt 4.2 im Befehl auf.

## 2.3 Git deinen Namen mitteilen

Einmalig pro Rechner. Git schreibt diese Angaben in jeden Commit.

```bash
git config --global user.name "Petru Birgauan"
```

```bash
git config --global user.email "consultingiac24@gmail.com"
```

Nimm die E-Mail-Adresse, mit der du dich bei GitHub registriert hast — sonst
ordnet GitHub deine Commits deinem Konto nicht zu.

**Kontrolle:**

```bash
git config --global --list | grep user
```

---

# Teil 3 — Projekt zu einem Git-Repository machen

## 3.1 Repository anlegen

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git init -b main
```

**Erwartete Ausgabe:** `Initialized empty Git repository in …/.git/`

Der Teil `-b main` legt fest, dass der Hauptzweig `main` heißt. GitHub erwartet
diesen Namen — ohne die Angabe heißt er auf älteren Git-Versionen `master` und
du bekommst später eine Fehlermeldung.

## 3.2 Prüfen, was aufgenommen wird

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git status --short
```

Du solltest sehen:

```
?? .gitignore
?? DEPLOY.md
?? assets/
?? index.html
?? top-marketing-standalone.html
```

Der Ordner `.claude` taucht eventuell auch auf — der stört nicht.

## 3.3 Ersten Commit erstellen

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git add . && git commit -m "Top Marketing course shop"
```

**Erwartete Ausgabe:** eine Zeile wie `[main (root-commit) a1b2c3d] Top Marketing course shop`
gefolgt von der Anzahl geänderter Dateien.

---

# Teil 4 — Zu GitHub hochladen

## 4.1 Leeres Repository auf GitHub anlegen

1. [github.com/new](https://github.com/new) öffnen
2. **Repository name:** `top-marketing`
3. **Description:** leer lassen oder `Kursshop für Short-Form-Video`
4. **Private** auswählen — du kannst es später jederzeit öffentlich schalten
5. **Wichtig — nichts ankreuzen:** kein „Add a README file", kein „Add
   .gitignore", keine „Choose a license". Das Repository muss vollständig leer
   sein. Kreuzt du etwas an, erzeugt GitHub einen eigenen Commit, und dein Push
   in Schritt 4.3 wird abgelehnt.
6. **Create repository** klicken

Auf der folgenden Seite zeigt GitHub dir Befehle an — die kannst du ignorieren,
die stehen hier unten schon fertig.

## 4.2 Lokales Projekt mit GitHub verbinden

**Ersetze `DEIN-NAME` durch deinen GitHub-Benutzernamen**, dann ausführen:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git remote add origin https://github.com/DEIN-NAME/top-marketing.git
```

**Kontrolle** — hier muss deine Adresse zweimal auftauchen:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git remote -v
```

## 4.3 Hochladen

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git push -u origin main
```

**Was jetzt passiert:** Beim ersten Mal öffnet sich normalerweise ein
Browserfenster zur GitHub-Anmeldung. Anmelden, Zugriff bestätigen, fertig.

**Falls das Terminal stattdessen nach `Username` und `Password` fragt:** GitHub
akzeptiert dort seit August 2021 kein Kontopasswort mehr. Du brauchst einen
Token:

1. [github.com/settings/tokens](https://github.com/settings/tokens) öffnen
2. **Generate new token** → **Generate new token (classic)**
3. **Note:** `Mac Terminal`
4. **Expiration:** `90 days` (oder länger)
5. Bei **Select scopes** den Haken bei **`repo`** setzen — das oberste Kästchen,
   die Unterpunkte werden automatisch mit ausgewählt
6. Ganz unten **Generate token**
7. Den angezeigten Token **sofort kopieren** — er wird nie wieder angezeigt
8. Zurück im Terminal: Benutzername eingeben, und beim Passwort den Token
   einfügen. Beim Einfügen bleibt die Zeile leer — das ist normal, tipp einfach
   Enter.

**Erfolg prüfen:** Lade dein Repository im Browser neu. Die Dateien sind da.

---

# Teil 5 — Auf Vercel veröffentlichen

## 5.1 Konto anlegen

1. [vercel.com/signup](https://vercel.com/signup) öffnen
2. **Continue with GitHub** wählen — nicht die E-Mail-Variante. So sind beide
   Konten sofort verbunden und du sparst dir einen Schritt.
3. GitHub fragt nach Zugriff. Wähle **Only select repositories** und gib nur
   `top-marketing` frei. Vercel braucht keinen Zugriff auf deine anderen
   Repositories.
4. Beim Plan **Hobby** wählen. Kostenlos, und für diese Seite völlig
   ausreichend.

## 5.2 Projekt importieren

1. Im Dashboard auf **Add New…** (oben rechts) → **Project**
2. In der Liste `top-marketing` suchen → **Import** klicken

## 5.3 Einstellungen

Auf der Konfigurationsseite:

| Feld | Wert |
|---|---|
| Project Name | `top-marketing` |
| Framework Preset | **Other** |
| Root Directory | leer lassen (`./`) |
| Build Command | **leer lassen** |
| Output Directory | **leer lassen** |
| Install Command | **leer lassen** |

Die Build-Felder bleiben leer, weil die Seite kein Framework benutzt — es sind
reine HTML-, CSS- und JS-Dateien. Vercel liefert sie unverändert aus. Trägst du
hier etwas ein, schlägt der Build fehl.

**Deploy** klicken.

## 5.4 Ergebnis

Nach etwa 30 Sekunden erscheint eine Erfolgsseite mit einer Adresse wie
`https://top-marketing.vercel.app`. Klick sie an — die Seite ist live und
öffentlich erreichbar.

Prüf kurz durch: Filterleiste anklicken, ein Produkt in den Warenkorb legen,
Seite neu laden (der Warenkorb muss erhalten bleiben).

---

# Teil 6 — Domain verbinden

## 6.1 Domain bei Vercel eintragen

1. Im Vercel-Dashboard dein Projekt öffnen
2. Oben auf **Settings** → links auf **Domains**
3. Deine Domain eintragen, z. B. `topmarketing.academy` — **ohne** `https://`
   und **ohne** `www`
4. **Add** klicken

Vercel zeigt dir jetzt an, welche DNS-Einträge du brauchst. **Nimm die Werte,
die Vercel dir anzeigt** — nicht die aus der Tabelle unten, falls sie abweichen.

Üblicherweise sind es diese zwei:

| Typ | Name / Host | Wert |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

Das `@` bedeutet „die Domain selbst", also `topmarketing.academy`. Der
`CNAME`-Eintrag sorgt dafür, dass auch `www.topmarketing.academy` funktioniert.

## 6.2 Einträge beim Domain-Anbieter setzen

Log dich beim Anbieter ein, bei dem du die Domain gekauft hast. Such nach
**DNS**, **DNS-Verwaltung**, **Nameserver** oder **Advanced DNS** — je nach
Anbieter anders benannt.

- **inwx:** Domains → Domain anklicken → Reiter *Nameserver / DNS*
- **Namecheap:** Domain List → *Manage* → Reiter *Advanced DNS*
- **Porkbun:** Domain Management → *DNS Records*

Vorhandene `A`- oder `CNAME`-Einträge, die auf eine Parkseite des Anbieters
zeigen, **löschen**. Dann die zwei Einträge von oben anlegen und speichern.

## 6.3 Warten

DNS-Änderungen brauchen zwischen 10 Minuten und 24 Stunden — meist etwa eine
Stunde. In der Vercel-Domains-Ansicht steht währenddessen *Invalid
Configuration*; sobald es durch ist, wechselt es auf ein grünes *Valid*.

Das HTTPS-Zertifikat richtet Vercel danach von selbst ein. Du musst nichts
kaufen und nichts konfigurieren.

## 6.4 Weiterleitung prüfen

Wenn beides grün ist, teste alle vier Varianten im Browser:

- `topmarketing.academy`
- `www.topmarketing.academy`
- `http://topmarketing.academy` (muss auf `https` springen)
- `top-marketing.vercel.app` (funktioniert weiterhin)

---

# Teil 7 — Änderungen veröffentlichen

Ab jetzt ist es ein einziger Befehl. Vercel merkt den Push und baut automatisch
neu:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git add . && git commit -m "Beschreibung der Änderung" && git push
```

Nach etwa 30 Sekunden ist die Änderung live. Den Fortschritt siehst du im
Vercel-Dashboard unter **Deployments**.

**Wichtig:** Wenn du `index.html`, `assets/style.css` oder `assets/app.js`
bearbeitest, ist `top-marketing-standalone.html` danach veraltet. Die Datei ist
nur eine Kopie zum lokalen Ansehen — für die Live-Seite zählt `index.html`.

---

# Wenn etwas klemmt

**`git push` → „repository not found"**
Die Remote-Adresse stimmt nicht. Korrigieren:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git remote set-url origin https://github.com/DEIN-NAME/top-marketing.git
```

**`git push` → „Updates were rejected … fetch first"**
Auf GitHub liegt bereits ein Commit, meist ein automatisch angelegtes README.
Zusammenführen:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git pull --rebase origin main && git push
```

**`git push` → „src refspec main does not match any"**
Es gibt noch keinen Commit. Zurück zu Schritt 3.3.

**Vercel zeigt 404**
`index.html` liegt nicht im Wurzelverzeichnis. Prüfen:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git ls-files
```

In der Ausgabe muss `index.html` stehen, nicht `unterordner/index.html`.

**Seite lädt, aber ohne Design**
Groß- und Kleinschreibung im Dateipfad. macOS unterscheidet sie nicht, der
Server von Vercel schon. Es muss exakt `assets/style.css` heißen.

**Domain zeigt „Invalid Configuration", auch nach Stunden**
Meist ein alter DNS-Eintrag, der noch auf die Parkseite des Anbieters zeigt.
Prüfen, was tatsächlich hinterlegt ist:

```bash
dig topmarketing.academy +short
```

Kommt nicht `76.76.21.21` zurück, ist der `A`-Eintrag falsch oder es steht noch
ein zweiter daneben.

**Änderung nicht sichtbar**
Erst im Vercel-Dashboard unter **Deployments** prüfen, ob der Build durch ist.
Wenn ja: Browser-Cache. `Cmd` + `Shift` + `R`.

---

# Was noch fehlt, bevor du verkaufst

Die Seite ist online, aber verkaufsfähig ist sie noch nicht:

1. **Bezahlung fehlt komplett.** Der Checkout-Button schreibt derzeit nur in die
   Browser-Konsole. Ohne angebundenen Zahlungsanbieter kann niemand kaufen.
2. **Testimonials sind sichtbarer Platzhaltertext.** Echte Zitate mit
   Einverständnis einsetzen oder den Abschnitt löschen. Erfundene Bewertungen
   sind in der EU abmahnfähig.
3. **Rechtstexte fehlen.** Impressum, Datenschutzerklärung, AGB und
   Widerrufsbelehrung sind leere Links im Footer. Alle vier sind für einen
   Verkauf an Verbraucher in der EU Pflicht.
4. **Widerrufsrecht.** Beim Verkauf digitaler Inhalte an Verbraucher gilt
   gesetzlich ein 14-tägiges Widerrufsrecht, unabhängig davon, was auf der Seite
   steht. Ausschließen lässt es sich nur, wenn der Käufer im Checkout dem
   sofortigen Zugang ausdrücklich zustimmt und bestätigt, dadurch sein
   Widerrufsrecht zu verlieren.
5. **E-Mail-Adresse.** Im Footer steht `hallo@topmarketing.de`. Sobald deine
   echte Domain steht, hier die passende Adresse eintragen.
