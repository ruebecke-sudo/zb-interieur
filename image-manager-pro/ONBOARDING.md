# Image Manager Pro – Customer Onboarding

## Registration
A new customer registers with email, password and company name.

## Automatic provisioning
The database trigger creates:
- a new tenant/workspace
- owner membership
- starter/trial plan
- audit log

## Application flow
Public sales page: /image-manager
Authentication: /image-manager/login
Customer app: /image-manager/app

The customer is never placed directly into the ZB Interieur workspace.

## Production requirement
The SQL onboarding migration must be applied to the dedicated production Supabase project before public registration is enabled.
