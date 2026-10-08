# Image Manager Pro – Betriebshandbuch

Stand: 08.10.2026 · Alles an einem Ort, was du für den Betrieb und für neue
Kunden brauchst. **Keine Schlüssel oder Passwörter in diese Datei schreiben** –
nur Namen und Fundorte.

---

## 1. Grundprinzip

Image Manager Pro ist **eine** gehostete Installation für alle Kunden. Ein
neuer Kunde bekommt keine Kopie, sondern registriert sich und erhält
automatisch einen eigenen, abgetrennten Arbeitsbereich (Bilder, Kategorien,
Logo, Farbe, Benutzer, Tarif). Für einen neuen Kunden musst du technisch
**nichts** einrichten.

| Was | Adresse |
|---|---|
| App für Kunden (neutral) | https://imagemanager.my-digital-world.de |
| Registrierung / Anmeldung | https://imagemanager.my-digital-world.de/image-manager/login |
| Landingpage (Verkauf) | https://www.my-digital-world.de/image-manager-pro |
| ZB-Variante (gleicher Code) | https://zb-interieur.netlify.app/image-manager/ |
| Öffentliche Galerie eines Kunden | `https://imagemanager.my-digital-world.de/g/<slug>` |
| Kontakt überall | info@my-digital-world.de |

---

## 2. Wo was eingestellt ist

| Dienst | Wofür | Wo |
|---|---|---|
| **GitHub** | Code | Repo `ruebecke-sudo/zb-interieur`, Branch `image-manager-pro-foundation` |
| **Netlify** | Hosting, Funktionen | Site `image-manager-pro` (neutral, `VITE_IMAGE_MANAGER_STANDALONE=true`) und Site `zb-interieur`. Beide bauen aus demselben Branch – ein Push aktualisiert beide |
| **Supabase** | Logins, Datenbank, Bildspeicher | Projekt `image-manager-pro` (Region eu-west-1). Bilder im Speicher-Bucket `image-manager-media` |
| **Stripe** | Abos, Dauerlizenz | Derzeit **Testmodus**. Webhook auf `/.netlify/functions/stripe-webhook` |
| **Resend** | Einladungs-Mails | Absender über `RESEND_FROM_EMAIL` |
| **Hetzner** | DNS für `imagemanager.my-digital-world.de` und Test-WordPress `test.my-digital-world.de` | Hetzner-Konsole |

Supabase Auth → URL Configuration: Site URL und Redirect-URLs müssen jede
Adresse enthalten, über die sich Kunden anmelden.

### Umgebungsvariablen (Netlify → Site → Environment variables)

Nur die **Namen** – Werte stehen ausschließlich bei Netlify. Netlify bricht
den Build ab, wenn ein Wert irgendwo im Repo auftaucht („Exposed secrets
detected“), auch bei harmlosen IDs.

| Variable | Bedeutung |
|---|---|
| `SUPABASE_URL`, `VITE_SUPABASE_URL` | Adresse des Supabase-Projekts |
| `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PUBLISHABLE_KEY` | öffentlicher Supabase-Schlüssel |
| `SUPABASE_SECRET_KEY` | geheimer Supabase-Schlüssel (nur Server) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe (nur Server) |
| `STRIPE_PRICE_STARTER`, `…_PROFESSIONAL`, `…_BUSINESS`, `…_LIFETIME` | Preis-IDs der Tarife |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | E-Mail-Versand |
| `IMAGE_MANAGER_API_KEY` | Schlüssel der ZB-Medien-API (Empfängerseite) |
| `ZB_IMAGE_MANAGER_API_KEY`, `ZB_SYNC_TENANT_ID` | Übergang für die ZB-Übertragung, entfällt in Phase 4 von `SAAS-PLAN.md` |
| `VITE_IMAGE_MANAGER_STANDALONE` | `true` nur auf der neutralen Site |

Vorlage ohne Werte: `.env.example`.

---

## 3. Tarife

| Tarif | Preis (brutto) | Bilder / Benutzer / Websites |
|---|---|---|
| Starter | 19 € / Monat | 500 / 2 / 1 |
| Professional | 39 € / Monat | 5.000 / 5 / 2 |
| Business | 79 € / Monat | 25.000 / 15 / 5 |
| Agentur | individuell (Anfrage per E-Mail) | bis 100.000 / 200 / 100 |
| Dauerlizenz | 499 € einmalig | 25.000 / 10 / 3 |

Abos sind monatlich kündbar. Grenzen stehen in der Datenbank-Tabelle
`plan_limits`.

---

## 4. Checkliste: neuer Kunde

**Der Kunde macht selbst (ohne Webdesigner):**

1. Registrieren unter `/image-manager/login` (E-Mail, Passwort, Firmenname) und
   die Bestätigungsmail anklicken.
2. Start-Assistent „In 3 Schritten“ folgen: Logo und Farbe, erste Bilder,
   Website verbinden.
3. Bilder hochladen – einzeln, mehrere auf einmal oder **ganze Ordner**
   (Ordnername = Marke/Kategorie 1, Dateiname = Produktname).
4. Unter „Galerie & Website“ die Galerie freigeben und den Einbinde-Assistenten
   nutzen (WordPress: Plugin als ZIP; Wix/Jimdo/andere: Einbettungscode;
   ohne Website: Galerie-Link `/g/<slug>` mit QR-Code).
5. Tarif wählen unter „Tarif“ (Stripe-Checkout).
6. Optional: Mitarbeiter einladen (Rollen Owner/Admin/Member/Viewer).

**Du machst:**

- [ ] Nichts Technisches. Optional: Begrüßungs-Mail, kurzer Anruf.
- [ ] Bei „Agentur“-Anfragen: Angebot schicken, Tarif danach von mir in der
      Datenbank setzen lassen.
- [ ] Bei Problemen: Arbeitsbereich in Supabase nachsehen (Tabelle `tenants`,
      per Name oder `slug` suchen).

---

## 5. Datenbank-Änderungen

- Seit 08.10.2026 ist Claude per **Supabase-Verbindung** angebunden: Prüfen und
  Nachzählen ohne Rückfrage, Änderungen nur nach deinem „ja“.
- Jede Änderung wird zusätzlich als SQL-Datei in `image-manager-pro/`
  abgelegt (nachvollziehbar, mehrfach ausführbar).
- Die Dateien `001`–`007` entsprechen **nicht** der Live-Datenbank; vor neuen
  Migrationen immer den Live-Zustand abfragen. `008`–`011` sind live.
- Arbeitsbereiche nie per ID in Dateien schreiben, sondern per `slug`
  nachschlagen (siehe Secret-Scan oben).

---

## 6. Noch offen bis zum Verkaufsstart

Kurzfassung aus `SAAS-PLAN.md` und `PRODUCTION-CHECKLIST.md`:

- Stripe vom Test- in den Live-Modus (danach gelben Testhinweis auf der
  Landingpage entfernen)
- Supabase auf bezahlten Tarif (Backups, keine Pause)
- Rechtstexte inkl. AVV, Umsatzsteuer EU
- Gesamttest mit einem zweiten, fremden Arbeitsbereich
- SSL für `test.my-digital-world.de`
- Wix/Jimdo/Shopify-Tests

---

## 7. Weitere Dokumente

| Datei | Inhalt |
|---|---|
| `SAAS-PLAN.md` | Fahrplan, Phasen, wer was macht |
| `PRODUCTION-CHECKLIST.md` | technische Abnahmeliste |
| `PAYMENTS.md` | Stripe im Detail |
| `EMAIL-TEMPLATES-DE.md` | deutsche Supabase-Mailvorlagen |
| `CONNECTOR-ZB.md` | Übertragung an die ZB-Website |
| `ONBOARDING.md` | technischer Ablauf der Registrierung |
