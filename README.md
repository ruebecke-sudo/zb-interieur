# ZB Interieur – Website (Netlify)

Statische Neuauflage der Website [zb-interieur.de](https://zb-interieur.de/) für den Betrieb auf **Netlify**: Startseite, Planung, Beratung, Outdoor, Service, Kontakt (Netlify Forms) sowie Impressum, Datenschutz und AGB.

Blog und Galerie-Kategorien entfallen bewusst – Fokus auf Beratung, Planung und Terminbuchung.

## Live auf Netlify

Aktueller Deploy (anonym / Drop – bitte innerhalb von 60 Min. in dein Netlify-Konto übernehmen):

- **URL:** https://cheerful-zabaione-af0f27.netlify.app  
- **Zugangspasswort (Drop):** `My-Drop-Site`  
- **Site beanspruchen:** [Claim-Link](https://app.netlify.com/drop/cheerful-zabaione-af0f27) (im Agent-Chat bzw. CLI-Ausgabe)

Nach dem Claim kannst du die Domain `zb-interieur.de` unter Domain management zuweisen und das Drop-Passwort entfernen.

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

### Variante A – Git verbinden (empfohlen)

1. Repository bei GitHub/GitLab/Bitbucket anlegen bzw. dieses Repo verbinden.
2. Unter [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Build-Einstellungen (stehen auch in `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node:** 22
4. Deploy starten. Domain optional unter **Domain management** zuweisen (z. B. `zb-interieur.de` nach DNS-Umstellung).

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
