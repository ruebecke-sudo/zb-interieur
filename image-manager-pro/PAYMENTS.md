# Image Manager Pro – Payment Flow

## Ziel
Checkout für monatliche Tarife und die einmalige Lifetime-Lizenz.

## Ablauf
1. Kunde wählt Tarif im Dashboard.
2. Frontend ruft einen serverseitigen Checkout-Endpunkt auf.
3. Server erstellt eine Stripe Checkout Session.
4. Stripe verarbeitet die Zahlung.
5. Stripe Webhook bestätigt die Zahlung serverseitig.
6. Webhook setzt den Workspace-Tarif bzw. die Lifetime-Lizenz.
7. Dashboard liest den Status aus Supabase.

## Lifetime
Produkt: Image Manager Pro Lifetime
Preis: 499 EUR einmalig.
Entitlement: tenants.plan = lifetime.
Zusätzlich werden lifetime_purchased_at und lifetime_order_id gespeichert.

## Sicherheit
Stripe Secret Key und Webhook Secret dürfen niemals im Browser oder in VITE_* Variablen liegen.
Die Freischaltung erfolgt ausschließlich nach verifiziertem Webhook.

## Benötigte Secrets
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_LIFETIME
- STRIPE_PRICE_STARTER
- STRIPE_PRICE_PROFESSIONAL
- STRIPE_PRICE_BUSINESS

## Noch offen
Die echten Stripe Price IDs und ein Stripe-Konto müssen hinterlegt werden. Erst danach kann der Checkout produktiv geschaltet werden.