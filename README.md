# ZB Interieur – Website (Netlify)

Statische Neuauflage der Website [zb-interieur.de](https://zb-interieur.de/) für den Betrieb auf **Netlify**: Startseite, Planung, Markenwelt, Beratung, Outdoor, Service, Kontakt (Netlify Forms) sowie Impressum, Datenschutz und AGB.

Blog und Galerie-Kategorien entfallen bewusst – Fokus auf Beratung, Planung, kuratierte Marken und Terminbuchung.

Die Seite **Marken** (`/marken`) zeigt Logos, Produktheadlines und Produktbilder der Designermarken aus dem [STILPUNKTE-Eintrag](https://www.stilpunkte.de/saarland/eintraege/zb-interieur/) (ohne Lambert und Sifas). Produktbilder öffnen per Klick in Originalgröße.

Über **Produktverwaltung** (`/verwaltung/produkte`) können neue Produktbilder hochgeladen werden: Produktname und Marke werden aus dem Dateinamen abgeleitet (z. B. `FINE_Aria_Sofa_3-Sitzer.jpg` → „FINE Aria Sofa 3-Sitzer“ / Marke Fine), vor dem Speichern kontrolliert und lokal (IndexedDB + localStorage) an die Produktauswahl angehängt. Bestehende Katalogprodukte bleiben unverändert.

## Bildverwaltung (Media Library)

Zentrale Bildverwaltung unter [`/verwaltung/bilder`](http://127.0.0.1:43127/verwaltung/bilder):

- Mehrfach-Upload mit Vorschau
- Automatische Metadaten: Bildname (aus Dateiname), Auflösung, Farbraum, Format, Dateigröße, URL, Upload-Datum
- Kategorien 1–4 (Marke, Produktart, Bereich, Stil) – erweiterbar
- Suche + Mehrfachfilter, Thumbnails, Bearbeiten/Löschen
- Metadaten und Bilddatei getrennt änderbar
- API für das ChatGPT-Plugin „Web Image Manager“

### Lokal starten

```bash
npm install
cp .env.example .env   # optional
npm run dev            # Vite :43127 + Media-API :43128
```

API-Schlüssel (Standard): `zb-interieur-dev-key`  
UI-Login: denselben Schlüssel unter `/verwaltung/bilder` eintragen.

### API-Endpunkte

| Methode | Pfad | Beschreibung |
|--------|------|--------------|
| `POST` | `/api/images/upload` | Multipart-Upload (`file`, optional `name`, `text`, `category1–4`) |
| `GET` | `/api/images` | Liste/Suche (`q`, `category1–4`) |
| `GET` | `/api/images/:id` | Einzelbild |
| `PUT` | `/api/images/:id` | Metadaten (JSON) oder Datei ersetzen (multipart) |
| `DELETE` | `/api/images/:id` | Löschen |
| `GET` | `/api/images/categories` | Kategorien |
| `PUT` | `/api/images/categories` | Kategorien erweitern |
| `GET` | `/api/health` | Healthcheck |
| `GET` | `/api/images/openapi.json` | OpenAPI für ChatGPT-Plugin |

Auth: `Authorization: Bearer <IMAGE_MANAGER_API_KEY>` oder Header `X-Api-Key`.

### Speicher

- **Lokal:** Dateien in `public/media/library/`, Metadaten in `data/media-library/index.json`
- **Netlify:** Netlify Blobs Store `zb-media-library` (wenn `NETLIFY` gesetzt)

### ChatGPT-Plugin

1. Site-URL als Plugin-Server hinterlegen  
2. OpenAPI: `https://<host>/api/images/openapi.json`  
3. Manifest: `https://<host>/.well-known/ai-plugin.json`  
4. Bearer-Token = `IMAGE_MANAGER_API_KEY` (in Netlify Environment Variables setzen)

### Test-Upload (curl)

```bash
curl -X POST http://127.0.0.1:43127/api/images/upload \
  -H "Authorization: Bearer zb-interieur-dev-key" \
  -F "file=@./public/images/fine/auswahl-01.jpg" \
  -F "name=FINE Daybed" \
  -F "category1=Fine" \
  -F "category2=Bett" \
  -F "category3=Schlafzimmer" \
  -F "category4=Modern"
```

## Live auf Netlify

Letzter anonymer Drop (Passwort-geschützt, zeitlich begrenzt):

- **URL:** https://wonderful-biscochitos-ede8b9.netlify.app  
- **Zugangspasswort (Drop):** `My-Drop-Site`  

Für den dauerhaften Betrieb bitte **Variante A** nutzen (GitHub → Netlify). Drop-Deploys sind nur Zwischenstände. Claim innerhalb von 60 Min.: [Claim-Link](https://app.netlify.com/drop/wonderful-biscochitos-ede8b9)

## Lokal starten


```bash
npm install
npm run dev
```

App: [http://127.0.0.1:43127](http://127.0.0.1:43127)

Produktion build:

```bash
npm run build
npm run preview
```

## Auf Netlify installieren / deployen

### Variante A – GitHub verbinden (empfohlen, dauerhaft)

Ziel-Repo: [github.com/ruebecke-sudo/zb-interieur](https://github.com/ruebecke-sudo/zb-interieur)

1. Aktuellen Code nach `main` pushen (Agent braucht Secret `GITHUB_TOKEN` mit `repo`-Recht, oder manuell pushen).
2. Unter [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project** → GitHub → Repo wählen.
3. Build-Einstellungen (stehen auch in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node:** 22
4. Deploy starten.
5. Unter **Domain management** `zb-interieur.de` hinzufügen und DNS umstellen.
6. Site-Passwort / Drop-Schutz entfernen.
7. Unter **Forms** Benachrichtigungen für das Kontaktformular aktivieren.

### Variante B – Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Kontaktformular

Das Formular `kontakt` ist für **Netlify Forms** vorbereitet (`data-netlify` + Hidden-Form in `index.html`). Nach dem ersten Produktiv-Deploy unter **Forms** in Netlify die Benachrichtigungen (E-Mail an `info@zb-interieur.de`) aktivieren.

## Inhalt & Assets

Bilder, Logo, PDFs und Showroom-Video stammen von der bestehenden öffentlichen Website / CDN und liegen unter `public/`. Texte und Firmendaten entsprechen der Originalseite.

## Tech-Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- React Router
- Netlify (Hosting, SPA-Redirects, Forms)
