# Website-Paket – Einrichtung pro Kunde

Stand: 09.10.2026 · Interne Checkliste von My Digital World (info@my-digital-world.de).
Gilt für jede Kunden-Website aus diesem Baukasten. ZB Interieur ist der erste Kunde.
**Keine Passwörter oder geheimen Schlüssel in diese Datei schreiben.**

---

## 1. Besucherstatistik (Pirsch)

Pirsch (pirsch.io, Emvi Software GmbH, Server in Deutschland) zählt Besucher **ohne
Cookies**. Deshalb braucht die Website **keinen Cookie-Banner** für die Statistik.
Ein Absatz in der Datenschutzerklärung ist trotzdem Pflicht (siehe Schritt 6).

Alle Kunden laufen über **ein** Pirsch-Konto von My Digital World. Jede Website ist dort
ein eigenes Dashboard. Die Kosten richten sich nach den Seitenaufrufen aller Websites
zusammen und gehören in den Paketpreis.

**Standard in allen Paketen.** Möchte ein Kunde keine Statistik, wird für seine Seite kein
Pirsch-Dashboard angelegt und der Code bleibt leer. Dann lädt die Seite nichts, und der
Datenschutz-Abschnitt dazu erscheint auch nicht.

**Wo der Code eingetragen wird:**
- Neue Kunden-Webseiten aus der Vorlage (`Desktop/webseiten-baukasten/vorlage`):
  `src/config/site.ts` → `statistik.pirschCode`. Der Datenschutz-Abschnitt wird dort
  automatisch angehängt, `npm run pruefen` warnt bei leerem oder falschem Code.
- Die ZB-Website (dieses Projekt): `src/lib/analytics.ts` → `PIRSCH_CODE`.

### Einrichtung (ca. 15 Minuten)

| # | Schritt | Wo |
|---|---|---|
| 1 | Neues Dashboard anlegen: „+“ oben → Domain des Kunden, z. B. `kunde.de` | Pirsch |
| 2 | Läuft die Seite vorerst unter einer anderen Adresse (z. B. `kunde.netlify.app`), dafür ein **eigenes** Dashboard anlegen. Ein Code gilt immer nur für die Domain seines Dashboards | Pirsch |
| 3 | **Identifikationscode** kopieren: Einstellungen → **Integration** → Wert bei `data-code="…"`. Achtung: nicht die Dashboard-ID und nicht das Feld „Benutzerdefinierte Domain“ verwenden | Pirsch |
| 4 | Code eintragen (öffentlicher Wert, darf ins Repo): Vorlage → `site.ts` `statistik.pirschCode`, ZB → `src/lib/analytics.ts` | Code |
| 5 | Interne Seiten ausschließen: `EXCLUDED_PATHS` in derselben Datei anpassen | Code |
| 6 | Absatz „Cookies & Webanalyse“ in die Datenschutzerklärung übernehmen (Vorlage: `src/pages/LegalPages.tsx`, Funktion `DatenschutzPage`) und Firmennamen anpassen | Code |
| 7 | Veröffentlichen, eine Seite aufrufen, im Dashboard muss „1 aktiver Besucher“ erscheinen | Pirsch |
| 8 | **Monatsbericht** einrichten: Einstellungen → **Berichte** → „Berichte hinzufügen“ → Empfänger eintragen und mit Enter bestätigen, Intervall **Monatlich**, Startdatum = 1. des nächsten Monats, Häkchen zusätzlich bei **Events** | Pirsch |
| 9 | **Traffic-Warnung** einschalten: gleiche Seite, „Traffic-Warnungen aktivieren“, Schwellenwert **3 Tage**. Meldet, wenn die Seite keine Besucher mehr hat, z. B. bei einem Ausfall | Pirsch |
| 10 | Dem Kunden die Anleitung `docs/KUNDENINFO-STATISTIK.md` schicken. Wenn gewünscht, Kunden-Adresse als zweiten Empfänger in den Monatsbericht aufnehmen | Mail |

### Was automatisch gezählt wird

Eingebaut in `src/components/Analytics.tsx` und `src/lib/submitNetlifyForm.ts`, gleich für jeden Kunden:

| Event in Pirsch | Wann |
|---|---|
| (Seitenaufruf) | jede Seite, auch beim Wechsel ohne Neuladen |
| `Anruf` | Klick auf einen Telefon-Link |
| `E-Mail` | Klick auf einen E-Mail-Link |
| `WhatsApp` | Klick auf einen WhatsApp-Link |
| `Formular gesendet` | erfolgreich abgeschicktes Formular, mit Formularname (z. B. `kontakt`, `termin`) |

### Domainwechsel (z. B. von `kunde.netlify.app` auf `kunde.de`)

1. In `src/lib/analytics.ts` den Code des Dashboards der neuen Domain eintragen und veröffentlichen.
2. Monatsbericht und Traffic-Warnung im Dashboard der neuen Domain neu einrichten (Schritte 8–9).
3. Altes Dashboard behalten (Zahlen bis zum Umzug) oder in Pirsch unter „Gefahrenzone“ löschen.

---

## 2. Stand pro Kunde

| Kunde | Pirsch-Dashboard (aktiv) | Monatsbericht an | Traffic-Warnung | Bemerkung |
|---|---|---|---|---|
| ZB Interieur | `zb-interieur.netlify.app` | info@my-digital-world.de (ab 01.11.2026) | 3 Tage | Dashboard `zb-interieur.de` ist angelegt und wird beim Umzug auf die echte Domain aktiv. Später zusätzlich an info@zb-interieur.de |
