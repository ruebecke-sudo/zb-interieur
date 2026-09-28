# ZB Interieur – Website (Netlify)

Statische Neuauflage der Website [zb-interieur.de](https://zb-interieur.de/) für den Betrieb auf **Netlify**: Startseite, Planung, Markenwelt, Beratung, Outdoor, Service, Kontakt (Netlify Forms) sowie Impressum, Datenschutz und AGB.

Blog und Galerie-Kategorien entfallen bewusst – Fokus auf Beratung, Planung, kuratierte Marken und Terminbuchung.

Die Seite **Marken** (`/marken`) zeigt Logos, Produktheadlines und Produktbilder der Designermarken aus dem [STILPUNKTE-Eintrag](https://www.stilpunkte.de/saarland/eintraege/zb-interieur/) (ohne Lambert und Sifas). Produktbilder öffnen per Klick in Originalgröße.

## Live auf Netlify

Letzter anonymer Drop (Passwort-geschützt, zeitlich begrenzt):

- **URL:** https://cosmic-baklava-37cb28.netlify.app  
- **Zugangspasswort (Drop):** `My-Drop-Site`  

Für den dauerhaften Betrieb bitte **Variante A** nutzen (GitHub → Netlify). Drop-Deploys sind nur Zwischenstände. Claim innerhalb von 60 Min.: [Claim-Link](https://app.netlify.com/drop/cosmic-baklava-37cb28)

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
