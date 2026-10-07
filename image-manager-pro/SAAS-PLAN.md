# Image Manager Pro – Plan zur eigenständigen SaaS

Stand: 06.10.2026

## Entscheidung

Image Manager Pro wird als **gehostete SaaS** verkauft: eine Installation,
die du betreibst, viele Kunden als getrennte Arbeitsbereiche (Mandanten).
Kunden registrieren sich, bezahlen über Stripe, laden ihr Logo hoch und
verbinden ihre Website. Supabase, Netlify oder Stripe richten sie **nicht**
selbst ein.

ZB Interieur ist dann ein ganz normaler Kunde.

## Zielbild

```
imagemanager-pro.de  (eigenes Repo, eigene Netlify-Site, neutral)
  ├─ Landingpage, Registrierung, Bildverwaltung, Tarife
  ├─ Supabase: Daten, Logins, Bildspeicher aller Kunden
  ├─ Stripe: Abos und Dauerlizenz (du kassierst)
  └─ überträgt Bilder per Website-Verbindung an die Kunden-Websites
          │
          ▼
zb-interieur.de / zb-interieur.netlify.app  (bleibt die ZB-Website)
  └─ eigene Medien-API /api/images (Netlify Blobs) als Empfänger,
     Markenseite liest daraus – absichtlich öffentlich lesbar
```

Heute steckt beides noch in einem Projekt (`ruebecke-sudo/zb-interieur`,
Branch `image-manager-pro-foundation`).

---

## Phase 0 – Erledigt (06.10.2026)

- Stripe vollständig konfiguriert, Testkäufe inkl. Dauerlizenz funktionieren
- Tarif sichtbar in Kopfzeile und Übersicht, Dauerlizenz-Button, Logo-Upload,
  Klick-Feedback, mobiles Menü
- Image Manager ohne ZB-Website-Rahmen, Platzhalter entfernt
- Sicherheitslücke geschlossen: Übertragung zur ZB-Website nur noch für den
  Arbeitsbereich in `ZB_SYNC_TENANT_ID` und nur an `zb-interieur.netlify.app`
- Bestätigungsmail führt auf die Live-Seite, Link erneut anforderbar
- Geklärt: `/api/images` ist der öffentliche ZB-Website-Bestand, kein Leck

## Phase 1 – Entscheidungen und Konten (du)

| # | Aufgabe | Hinweis |
|---|---|---|
| 1.1 | Produktname und Domain festlegen und registrieren | z. B. `imagemanager-pro.de` – vorher Markenrecht prüfen |
| 1.2 | Preise durchrechnen, vor allem die Dauerlizenz | 499 € einmalig bei bis zu 100.000 Bildern und 100 Websites, Kosten laufen dauerhaft weiter |
| 1.3 | Supabase auf einen bezahlten Tarif umstellen | Free pausiert nach Inaktivität und hat keine Backups |
| 1.4 | E-Mail-Versand über eigene Domain (Resend) für Supabase-Logins einrichten | Der eingebaute Supabase-Versand ist nur für Tests gedacht und stark begrenzt |
| 1.5 | Rechtstexte: Impressum, AGB, Datenschutzerklärung, **AVV** | Anwalt bzw. Generator; AVV ist Pflicht, weil du Kundendaten speicherst |
| 1.6 | Umsatzsteuer für EU-Kunden klären | Steuerberater; Stripe Tax kann helfen |

## Phase 2 – Technik aufräumen (ich, im heutigen Projekt)

| # | Aufgabe | Status |
|---|---|---|
| 2.0 | **Tarif-Felder gesperrt:** Browser dürfen beim Arbeitsbereich nur noch Name, Logo, Farbe (später Kategorienamen, Galerie-Freigabe) ändern, nicht `plan` oder Stripe-IDs. (Die zuerst vermutete RLS-Lücke gibt es live nicht – die SQL-Dateien 001–007 weichen von der Live-Datenbank ab.) | `008_…sql` in Supabase ausführen |
| 2.1 | Eigener API-Schlüssel pro Website (Tabelle `website_credentials`, im Browser nicht lesbar), Eingabe unter Websites | Code fertig – braucht `008_…sql` |
| 2.2 | Neutrale Übertragungsfunktion `push-image-to-website` (alter Name bleibt als Weiterleitung), Schutz vor internen Zieladressen | fertig |
| 2.3 | ZB-Texte in der Oberfläche entfernt | fertig |
| 2.4 | Tarif „Agentur“: „Kontakt aufnehmen“ per E-Mail; Dauerlizenz-Inhaber können kein Abo mehr wählen | fertig |
| 2.5 | Datenbank-Skripte 001–008 zu einem Setup-Skript für neue Umgebungen zusammenführen | offen, erst für Phase 3 nötig |
| 2.6 | Deutsche E-Mail-Vorlagen in Supabase einfügen (Authentication → Email Templates) | **du** – Vorlagen in `EMAIL-TEMPLATES-DE.md` |
| 2.7 | Rechtstexte und Datenschutzhinweis in die App einbauen | wartet auf 1.5 |
| 2.8 | Echte Übertragung für WordPress (Plugin), später Shopify | offen – heute nur REST/Individuell; in der Auswahl als „nur Import“ gekennzeichnet |
| 2.9 | Kategorien frei benennbar (`tenants.category_labels`), Werte löschbar | Code fertig – braucht `009_…sql` |
| 2.10 | Tarif-Grenzen neu: Starter 500/2/1, Professional 5.000/5/2, Business 25.000/15/5, Agentur nach Absprache, Dauerlizenz 25.000/10/3 (Bilder/Benutzer/Websites) | Code fertig – braucht `009_…sql` |
| 2.12 | **Einbinde-Assistent**: System wählen (WordPress, Wix, Jimdo, Shopify, Anderes) oder „Weiß ich nicht“ → Website-Adresse eingeben, System wird automatisch erkannt (`detect-website-platform`) → drei passende Schritte; WordPress: persönliches Plugin als ZIP-Download (Galerie-ID schon drin, Shortcode `[image_manager_galerie]`). Grundsatz: Kunde schafft alles selbst, ohne Webdesigner | lokal fertig, wartet auf Freigabe |
| 2.13 | Fertige Galerie-Seite `/g/<slug>` mit Link, QR-Code, WhatsApp/E-Mail; Start-Assistent „In 3 Schritten“; Menü mit Symbolen; Schnittstellen unter „Für Fortgeschrittene“ | fertig |
| 2.14 | **ZB angebunden:** Marken „Kuratierte Stücke“ (Kategorie 1 = Marke) und Startseite „Inspiration nach Raum“ (Bereich bzw. Produktart) lesen direkt aus Image Manager Pro (`src/lib/imageManagerFeed.ts`); alter Katalog und alte Bibliothek bleiben als Grundstock | fertig |
| 2.15 | Katalog-Darstellung (Karten mit Name, Kategorie, Beschreibung) zusätzlich zur Galerie; Filter-Knöpfe auch im Einbettungscode | offen |
| 2.16 | Pro Bild freiwilliger „Hinweis“ (z. B. „ab 1.290 €“, bei ZB leer) und Anfrage-Knopf pro Arbeitsbereich (E-Mail oder Link, Beschriftung frei) | offen, braucht Skript 010 |
| 2.17 | Einbau für Baukästen (Wix, Jimdo): Schrift und Farben der Seite übernehmen | offen |
| 2.18 | WordPress-Plugin Stufe 2: Bilder in die WordPress-Mediathek und eigene Galerien (Design der Seite) | offen |
| 2.11 | **Einbettungscode für jede Website**: Freigabe pro Arbeitsbereich, Generator unter Websites, Skript `/image-manager-embed.js`, Daten über `public-gallery` | Code fertig – braucht `009_…sql` |

Neutrale SaaS-Site: Netlify-Projekt `image-manager-pro`, gleiches Repo und
gleicher Branch, `VITE_IMAGE_MANAGER_STANDALONE=true`, Domain
`imagemanager.my-digital-world.de` (DNS bei Hetzner). Landingpage:
`my-digital-world.de/image-manager-pro` (Repo `my-digital-world-ger`).

## Phase 3 – Herauslösen (gemeinsam)

| # | Aufgabe | Wer |
|---|---|---|
| 3.1 | Neues GitHub-Repo `image-manager-pro` anlegen | du (ich sage dir genau, wie) |
| 3.2 | Image-Manager-Code dorthin übertragen, ohne ZB-Website | ich |
| 3.3 | Neue Netlify-Site anlegen, Domain verbinden, Variablen übertragen | du, mit Anleitung |
| 3.4 | Supabase-Projekt **weiterverwenden** (Daten sind schon drin); Site-URL und Redirect-URLs um die neue Domain ergänzen | du |
| 3.5 | Stripe: Webhook-Adresse und Rücksprung-Adressen auf die neue Domain umstellen | du, ich prüfe danach |
| 3.6 | Im ZB-Projekt den Image-Manager-Code entfernen; nur die Medien-API als Empfänger bleibt | ich |
| 3.7 | Branch-Frage klären: Production-Branch der ZB-Site ist heute `image-manager-pro-foundation`, nicht `main` | gemeinsam |

## Phase 4 – ZB Interieur als Kunde

| # | Aufgabe |
|---|---|
| 4.1 | Eigenen Arbeitsbereich „ZB Interieur“ anlegen (heute pflegt „Digitale Medien“ die ZB-Website) |
| 4.2 | Website-Verbindung mit eigenem Schlüssel aus 2.1 einrichten (Wert = `IMAGE_MANAGER_API_KEY` der ZB-Site), Bilder übernehmen |
| 4.3 | ZB-Mitarbeiter einladen, Rollen vergeben |
| 4.4 | Übergangslösung entfernen: Variablen `ZB_IMAGE_MANAGER_API_KEY`, `ZB_SYNC_TENANT_ID`, `ZB_SYNC_ALLOWED_HOSTS`, den Fallback in `push-image-to-website.ts` und die Weiterleitung `sync-image-to-zb.ts` |

## Phase 5 – Verkaufsfertig

| # | Aufgabe |
|---|---|
| 5.1 | Landingpage mit Preisen, Funktionen, FAQ, Rechtstexten |
| 5.2 | Stripe vom Test- in den Live-Modus umstellen (neue Preise, neuer Webhook, neue Schlüssel) |
| 5.3 | Gesamttest laut `PRODUCTION-CHECKLIST.md` (Registrierung, Einladung, Rollen, Upload, Übertragung, Tarifwechsel, Kündigung, Mandantentrennung, Handy) |
| 5.4 | Test mit einem zweiten, fremden Arbeitsbereich: darf nichts vom ersten sehen oder verändern |
| 5.5 | Backups und Fehler-Benachrichtigung prüfen |
| 5.6 | Erste Pilotkunden |

---

## Offene Entscheidungen

- Produktname und Domain (1.1)
- Preise, insbesondere Dauerlizenz (1.2)
- Soll es später zusätzlich eine Agentur-Variante mit eigener Installation geben? Vorschlag: erst nach dem Start entscheiden
- Wann wird `image-manager-pro-foundation` in `main` gemergt bzw. ersetzt (3.7)?

## Reihenfolge-Empfehlung

Phase 1 (deine Konten und Rechtstexte) läuft **parallel** zu Phase 2 (mein
Aufräumen). Phase 3 beginnt, sobald die Domain (1.1) feststeht und
`008_…sql` in Supabase ausgeführt ist.

Hinweis: `plan_limits` erlaubt `lifetime` bereits seit `004_plan_limits.sql` –
eine frühere Vermutung, dass das fehlt, war falsch.
