# Image Manager Pro — Foundation

This directory defines the generic SaaS architecture for the commercial white-label image manager.

## Product
- Multi-tenant image management
- Customer-specific category definitions
- Multiple websites/connectors per customer
- Image metadata: name, text/alt text, categories 1–4, dimensions, color space, format, file size, URL
- Website connector API
- User roles and audit trail
- White-label branding
- ZB Interieur is the first pilot connector

## MVP strategy
The existing ZB Interieur media library remains the first production connector. We do not duplicate its working upload/storage implementation. Image Manager Pro adds the tenant, user, website and connector layer around it.

### Connector model
A website connector exposes:
- GET /api/images
- GET /api/images/:id
- POST /api/images/upload
- PUT /api/images/:id
- DELETE /api/images/:id
- GET /api/images/categories
- PUT /api/images/categories

The central SaaS talks to the connector server-side. Website API secrets must never be exposed in browser code.

## Planned stack
- Frontend: React + TypeScript + Tailwind
- Auth/database: Supabase Auth + PostgreSQL
- Storage: connector-specific storage initially; central Supabase Storage for future native tenants
- Hosting: Netlify
- AI integration: ChatGPT plugin / API
- First connector: ZB Interieur Netlify API

## Plans
Starter: 19 €/month
Professional: 39 €/month
Business: 79 €/month
Agency: custom

These are initial commercial placeholders and can be changed before launch.


## SaaS-Auth Foundation

Der Branch enthält jetzt:
- Supabase Client über `VITE_SUPABASE_URL` und `VITE_SUPABASE_PUBLISHABLE_KEY`
- Login/Registrierung unter `/image-manager/login`
- Tenant-/Membership-/Website-/Kategorie-/Bild-Schema
- PostgreSQL Row Level Security (RLS) zur Mandantentrennung
- ZB Interieur bleibt der erste REST-Connector

### Noch vor dem Produktivstart

1. Ein dediziertes Supabase-Produktionsprojekt für Image Manager Pro auswählen/erstellen.
2. Migration `001_saas_tenant_rls.sql` dort anwenden.
3. Netlify Environment Variables setzen.
4. Onboarding-Funktion für den ersten Tenant/Owner ergänzen.
5. Website-Connector-Secrets ausschließlich serverseitig speichern.
