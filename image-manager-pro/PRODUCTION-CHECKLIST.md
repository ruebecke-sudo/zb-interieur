# Image Manager Pro – Production Checklist

## Implemented
- Supabase Auth with automatic tenant/workspace onboarding
- Tenant-isolated PostgreSQL/RLS model
- Supabase Storage media bucket
- Pre-upload image previews with individual removal
- Multi-image upload
- Image metadata and four category slots
- Search, category filters and list/grid media library
- Bulk category assignment and bulk deletion
- User roles: Owner, Admin, Member, Viewer
- Invitation flow with pending-invitation onboarding
- Website connectors: REST, WordPress, Shopify, Custom
- Server-side ZB Interieur synchronization
- URL-based image transfer to avoid Netlify binary payload limits
- Tenant white-label name, logo and primary color
- Starter / Professional / Business / Agency / Lifetime plan model
- Stripe Lifetime checkout
- Stripe recurring subscription checkout
- Stripe webhook handling for checkout and cancellation
- Stripe customer billing portal
- Production schema tracking for subscription/customer IDs
- HTTPS validation for outbound connectors
- Source-host allowlist for URL imports

## Required external configuration before commercial launch
1. Netlify Production/Functions environment:
   - SUPABASE_URL
   - SUPABASE_SECRET_KEY
   - SUPABASE_PUBLISHABLE_KEY
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
   - ZB_IMAGE_MANAGER_API_KEY
   - ZB_SYNC_TENANT_ID (the only workspace allowed to push images to ZB Interieur)
   - optional: ZB_SYNC_ALLOWED_HOSTS (sync target hosts, default `zb-interieur.netlify.app`)
   - STRIPE_SECRET_KEY
   - STRIPE_PRICE_LIFETIME
   - STRIPE_PRICE_STARTER
   - STRIPE_PRICE_PROFESSIONAL
   - STRIPE_PRICE_BUSINESS
   - STRIPE_WEBHOOK_SECRET
   - RESEND_API_KEY
   - RESEND_FROM_EMAIL
   - IMAGE_MANAGER_API_KEY (media API key; without it the code falls back to the public default `zb-interieur-dev-key`)
   - recommended: IMAGE_MANAGER_PASSWORD (UI login; defaults to IMAGE_MANAGER_API_KEY)
   - recommended: PUBLIC_SITE_URL (fallback for checkout/portal return URLs and the plugin/OpenAPI manifest)
2. ZB Interieur Netlify:
   - keep the connector API key configured
   - optionally set IMAGE_MANAGER_ALLOWED_SOURCE_HOSTS to the exact trusted storage host(s)
3. Stripe:
   - create recurring prices for Starter, Professional and Business
   - create the Lifetime one-time price
   - configure webhook endpoint /.netlify/functions/stripe-webhook
   - enable Checkout and Customer Portal
   - subscribe the webhook to at least `checkout.session.completed`,
     `customer.subscription.updated`, and `customer.subscription.deleted`
4. Supabase Auth:
   - enable leaked-password protection / compromised-password checks
   - configure production email sender and redirect URLs
5. Test:
   - new tenant signup
   - invitation acceptance
   - role restrictions
   - upload + preview + remove-before-send
   - multi-upload
   - ZB synchronization
   - bulk operations
   - plan checkout
   - cancellation / downgrade
   - tenant isolation
   - mobile layout

## Pilot
Use the ZB Interieur Netlify deployment as the connector target. Do not use the public ZB domain for development/testing.
