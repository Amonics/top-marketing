# GitHub + Vercel mit einem neuen Konto — Klick für Klick

Du legst ein **neues** GitHub- und Vercel-Konto an, getrennt von deinem
bisherigen. Das geht, braucht aber drei Handgriffe, die sonst niemand erwähnt —
sie stehen unten als Schritt 2, 3 und 6.

---

## Zwei Dinge, die auf deinem Mac noch auf das alte Konto zeigen

Ich habe nachgesehen. Beides muss weg, sonst landet dein Projekt beim falschen
Konto oder der Upload schlägt fehl:

**1. Die vorhandenen Commits sind auf `asmoboy` ausgestellt**

```
9f34c93  asmoboy  <300537536+asmoboy@users.noreply.github.com>
bca91b2  asmoboy  <300537536+asmoboy@users.noreply.github.com>
```

Der Name des Autors steht dauerhaft in jedem Commit. Lädst du das so hoch,
erscheint auf deinem neuen Repository dein alter Benutzername — öffentlich
sichtbar, sobald du das Repository öffentlich schaltest. Schritt 3 setzt das
zurück.

**2. Im macOS-Schlüsselbund liegt eine Anmeldung für `github.com` als `asmoboy`**

Git fragt beim Hochladen nicht nach, sondern nimmt automatisch, was im
Schlüsselbund liegt. Mit dem alten Zugang bekommst du dann `repository not
found` — obwohl das Repository existiert. Schritt 6 räumt das weg.

---

# Schritt 1 — Neues GitHub-Konto anlegen

GitHub verlangt für jedes Konto eine **eigene E-Mail-Adresse**. Die Adresse
deines alten Kontos funktioniert nicht.

Falls du keine zweite Adresse hast: Gmail akzeptiert Punkte und `+`-Zusätze als
eigenständige Adressen. Aus `consultingiac24@gmail.com` wird zum Beispiel
`consultingiac24+topmarketing@gmail.com` — landet im selben Postfach, gilt bei
GitHub aber als andere Adresse.

1. [github.com/signup](https://github.com/signup) öffnen

   **Wichtig:** Wenn du im Browser noch beim alten Konto eingeloggt bist, mach
   das in einem **privaten Fenster** (`Cmd` + `Shift` + `N`). Sonst wirst du
   ständig zwischen den Konten hin- und hergeworfen.

2. E-Mail eintragen → **Continue**
3. Passwort festlegen → **Continue**
4. Benutzernamen wählen → **Continue**

   Der Benutzername steht später in jeder Adresse:
   `github.com/DEIN-NAME/top-marketing`. Etwas wie `topmarketing-de` oder
   `petru-topmarketing` passt.

5. Bei „Email preferences" `n` eintragen → **Continue**
6. Das Bilderrätsel lösen → **Create account**
7. Den sechsstelligen Code aus der E-Mail eintragen
8. Die Fragen nach Teamgröße und Interessen kannst du überspringen
   (**Skip personalization**)
9. Beim Plan **Free** wählen

**Notier dir den neuen Benutzernamen.** Du brauchst ihn in Schritt 4, 5 und 7.

---

# Schritt 2 — E-Mail-Adresse verbergen

Bevor du irgendetwas hochlädst. Sonst steht deine private E-Mail-Adresse für
immer in der Commit-Historie und ist für jeden lesbar, der das Repository sieht.

1. **Profilbild** oben rechts → **Settings**
2. Linke Seitenleiste → **Emails**
3. Zwei Häkchen setzen:
   - ☑ **Keep my email addresses private**
   - ☑ **Block command line pushes that expose my email**
4. Direkt darunter steht jetzt eine Adresse in der Form:

   ```
   12345678+DEIN-NAME@users.noreply.github.com
   ```

   **Diese Adresse kopieren.** Sie kommt im nächsten Schritt zum Einsatz.

Das zweite Häkchen ist eine Sicherung: Falls du die Adresse falsch einträgst,
lehnt GitHub den Upload ab, statt deine echte Adresse zu veröffentlichen.

---

# Schritt 3 — Commits auf das neue Konto umstellen

Ersetze in dem Befehl unten die beiden Platzhalter:

- `NEUER-BENUTZERNAME` → dein neuer GitHub-Benutzername
- `12345678+NEUER-BENUTZERNAME@users.noreply.github.com` → die noreply-Adresse
  aus Schritt 2

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && rm -rf .git && git init -b main -q && git config --local user.name "NEUER-BENUTZERNAME" && git config --local user.email "12345678+NEUER-BENUTZERNAME@users.noreply.github.com" && git add . && git commit -q -m "Top Marketing course shop" && git log --format="%h  %an  <%ae>"
```

**Was der Befehl macht:** Er wirft die alte Versionsgeschichte weg und legt einen
frischen Commit unter deinem neuen Namen an. Deine Dateien bleiben unverändert —
gelöscht wird nur der versteckte `.git`-Ordner mit der Historie. Da bisher
nichts hochgeladen wurde und nur zwei Commits von heute drin sind, geht dabei
nichts verloren.

Das `--local` ist der entscheidende Teil: Es setzt die Identität **nur für
dieses Projekt**. Deine globale Git-Konfiguration mit dem alten Konto bleibt
unangetastet, andere Projekte auf deinem Mac funktionieren weiter wie bisher.

**Erwartete Ausgabe:** eine Zeile mit deinem **neuen** Namen und der
noreply-Adresse. Steht da noch `asmoboy`, hast du einen Platzhalter nicht
ersetzt.

---

# Schritt 4 — Zwei-Faktor-Authentifizierung einschalten

Ein neues Konto ohne 2FA ist ein offenes Konto. Und hier hängt bald deine
Verkaufsseite dran: Wer das Konto übernimmt, ändert den Code, und Vercel stellt
die Änderung automatisch live.

1. **Profilbild** → **Settings**
2. Linke Seitenleiste → **Password and authentication**
3. Abschnitt **Two-factor authentication** → **Enable two-factor
   authentication**
4. **Authenticator app** wählen — **nicht SMS**. SMS lässt sich über den
   Mobilfunkanbieter abfangen.
5. QR-Code mit einer Authenticator-App am Handy scannen:
   - iPhone: die **Passwörter**-App von Apple, oder Google Authenticator, oder
     1Password
6. Die sechsstellige Zahl aus der App eintippen → **Continue**
7. **Recovery Codes** → **Download** klicken, Datei an einem Ort ablegen, den du
   in einem Jahr noch findest.

   Verlierst du Handy und Codes, kommst du nie wieder an dieses Konto. GitHub
   kann in dem Fall nicht helfen — es gibt keinen Support-Weg zurück.
8. **I have saved my recovery codes** → **Done**

---

# Schritt 5 — Repository anlegen

1. [github.com/new](https://github.com/new) öffnen

2. Ausfüllen:

   | Feld | Was eintragen |
   |---|---|
   | **Owner** | dein neuer Benutzername — steht schon da |
   | **Repository name** | `top-marketing` |
   | **Description** | leer lassen |
   | **Public / Private** | **Private** anklicken |

3. Darunter steht *"Initialize this repository with:"*:

   ```
   ☐  Add a README file
   ☐  Add .gitignore
   ☐  Choose a license
   ```

   **Alle drei leer lassen.** Kein Häkchen. Setzt du eins, erzeugt GitHub einen
   eigenen Commit, und dein Upload in Schritt 7 wird mit „Updates were rejected"
   abgelehnt.

4. Grüner Button **Create repository**

Die Seite mit den Befehlsvorschlägen danach kannst du ignorieren.

---

# Schritt 6 — Alte Anmeldung aus dem Schlüsselbund löschen

**Diesen Schritt nicht überspringen.** Im Schlüsselbund deines Macs liegt eine
Anmeldung für `github.com` als `asmoboy`. Git würde die automatisch nehmen und
mit einer irreführenden Fehlermeldung scheitern.

```bash
printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
```

Keine Ausgabe bedeutet: erledigt. Beim nächsten Upload fragt Git wieder nach
Benutzername und Passwort.

**Kontrolle** — hier darf `asmoboy` nicht mehr auftauchen:

```bash
security find-internet-password -s github.com 2>/dev/null | grep '"acct"' || echo "sauber, nichts gespeichert"
```

---

# Schritt 7 — Zugriffstoken erstellen

Im Terminal akzeptiert GitHub seit 2021 kein Kontopasswort. Du brauchst einen
Token.

Wir nehmen einen **Fine-grained Token** mit Zugriff auf genau dieses eine
Repository. Der ältere „classic"-Token hätte Vollzugriff auf alle deine
Repositories — bei einem Token, der auf deiner Festplatte liegt, unnötig.

1. [github.com/settings/tokens](https://github.com/settings/tokens) öffnen

   (Über die Oberfläche: **Profilbild** → **Settings** → ganz unten links
   **Developer settings** → **Personal access tokens** → **Fine-grained
   tokens**)

2. **Generate new token** oben rechts

3. Ausfüllen:

   | Feld | Wert |
   |---|---|
   | **Token name** | `Mac Terminal – top-marketing` |
   | **Expiration** | `90 days` |
   | **Resource owner** | dein neuer Benutzername |

4. **Repository access**:
   - **Only select repositories** anklicken
   - Im Feld darunter `top-marketing` suchen und auswählen

5. **Permissions** → **Repository permissions** aufklappen:
   - In der Liste **Contents** suchen
   - Dropdown rechts von *No access* auf **Read and write** stellen
   - Sonst nichts. `Metadata: Read-only` ergänzt GitHub automatisch — korrekt so.

6. Unten **Generate token**

7. Der Token beginnt mit `github_pat_` und wird **genau einmal angezeigt**.
   Kopiersymbol anklicken und sofort in den Passwortmanager legen
   (iCloud-Schlüsselbund, 1Password, Bitwarden).

   Nicht in eine Notiz. Nicht in eine Textdatei im Projektordner. Nicht per
   Nachricht an dich selbst.

---

# Schritt 8 — Hochladen

Ersetze `NEUER-BENUTZERNAME` durch deinen neuen GitHub-Benutzernamen:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git remote add origin https://github.com/NEUER-BENUTZERNAME/top-marketing.git
```

Dann hochladen:

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git push -u origin main
```

Das Terminal fragt:

```
Username for 'https://github.com':
```

→ neuen Benutzernamen eintippen, Enter

```
Password for 'https://NEUER-BENUTZERNAME@github.com':
```

→ **Token einfügen** (`Cmd` + `V`), nicht das GitHub-Passwort

Beim Einfügen bleibt die Zeile leer. Das ist normal — Terminals zeigen
Passworteingaben nie an. Enter drücken.

**Erwartete Ausgabe:**

```
Enumerating objects: 11, done.
...
To https://github.com/NEUER-BENUTZERNAME/top-marketing.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

---

# Schritt 9 — Kontrollieren

```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git log --format="%h  %an  <%ae>" && git status -sb
```

**Erwartet:** dein **neuer** Name als Autor, und `## main...origin/main`.

Dann im Browser `https://github.com/NEUER-BENUTZERNAME/top-marketing` öffnen:

- Sieben Dateien und der Ordner `assets` sind sichtbar
- Neben dem Namen steht ein graues **Private**
- Klick auf **1 commit** → als Autor steht dein neuer Benutzername, nicht
  `asmoboy`

---

# Schritt 10 — Vercel mit dem neuen Konto

1. **Erst im alten Vercel-Konto abmelden**, falls du eingeloggt bist:
   [vercel.com](https://vercel.com) → Profilbild → **Log Out**.

   Oder gleich ein privates Browserfenster nehmen — sauberer.

2. [vercel.com/signup](https://vercel.com/signup) öffnen

3. **Continue with GitHub** wählen

   Achte auf den Benutzernamen, der im GitHub-Fenster angezeigt wird. Steht dort
   noch das alte Konto, unten auf **Not you?** oder **Switch account** klicken.

4. GitHub fragt nach Zugriff: **Only select repositories** → nur
   `top-marketing` freigeben

5. Plan **Hobby** wählen — kostenlos, reicht für diese Seite

6. **Add New…** → **Project** → `top-marketing` → **Import**

7. Einstellungen:

   | Feld | Wert |
   |---|---|
   | Framework Preset | **Other** |
   | Root Directory | leer (`./`) |
   | Build Command | **leer lassen** |
   | Output Directory | **leer lassen** |
   | Install Command | **leer lassen** |

   Die Felder bleiben leer, weil die Seite kein Framework nutzt. Trägst du hier
   etwas ein, schlägt der Build fehl.

8. **Deploy**

Nach etwa 30 Sekunden bekommst du eine Adresse wie
`https://top-marketing.vercel.app`.

Prüf kurz durch: Filterleiste anklicken, ein Produkt in den Warenkorb legen,
Seite neu laden — der Warenkorb muss erhalten bleiben.

**Danach:** Domain verbinden, siehe [DEPLOY.md](DEPLOY.md), Teil 6.

---

# Sicherheits-Checkliste

| | Prüfen |
|---|---|
| ☐ | **2FA aktiv** — Settings → Password and authentication zeigt *enabled* |
| ☐ | **Recovery Codes gespeichert** — an einem Ort, den du wiederfindest |
| ☐ | **E-Mail privat** — Settings → Emails, beide Häkchen gesetzt |
| ☐ | **Commit zeigt neuen Namen** — `git log --format="%an <%ae>"` |
| ☐ | **Repository ist Private** — graues Label neben dem Namen |
| ☐ | **Token im Passwortmanager** — nicht in einer Datei |
| ☐ | **Token nur für ein Repository** — Fine-grained, `top-marketing` |
| ☐ | **Vercel nutzt das neue Konto** — Settings → oben steht der neue Name |

**Für später, wenn du Stripe anbindest:** Der geheime Schlüssel (`sk_live_…`)
darf niemals in eine Datei im Projektordner. Er gehört in die Environment
Variables von Vercel. Ein einmal committeter Schlüssel bleibt in der
Git-Historie, auch wenn du ihn löschst — man muss ihn dann bei Stripe
widerrufen.

---

# Wenn etwas schiefgeht

**`repository not found` beim Push**
Fast immer der Schlüsselbund. Schritt 6 nochmal ausführen, dann Schritt 8.

**`Authentication failed`**
Kontopasswort statt Token eingegeben, oder dem Token fehlt
`Contents: Read and write`. Schlüsselbund leeren (Schritt 6) und erneut
versuchen.

**`remote origin already exists`**
```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git remote set-url origin https://github.com/NEUER-BENUTZERNAME/top-marketing.git
```

**`Updates were rejected because the remote contains work`**
Beim Anlegen doch ein Häkchen gesetzt. Entweder das Repository auf GitHub
löschen und Schritt 5 ohne Häkchen wiederholen, oder zusammenführen:
```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git pull --rebase origin main && git push
```

**`push declined due to email privacy restrictions`**
Die noreply-Adresse in Schritt 3 stimmt nicht. Exakte Adresse in Settings →
Emails nachsehen und Schritt 3 mit dem korrigierten Wert wiederholen.

**Vercel zeigt 404**
`index.html` liegt nicht im Wurzelverzeichnis:
```bash
cd "/Users/petrubirgauan/Documents/Marketing Seite" && git ls-files
```
Dort muss `index.html` stehen, nicht `unterordner/index.html`.

**Seite lädt ohne Design**
Groß-/Kleinschreibung im Pfad. macOS ist tolerant, der Server von Vercel nicht.
Es muss exakt `assets/style.css` heißen.
