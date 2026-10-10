-- Partnerprogramm: Welche Image-Manager-Kunden hat welcher Partner gebracht?
-- Nur lesen, ändert nichts. Im Supabase SQL Editor ausführen oder Claude fragen.
-- Der Partnercode wird bei der Registrierung in den Kontodaten gespeichert
-- (Feld partner_code, auch über den Link …/image-manager/login?partner=CODE).
--
-- Für die monatliche Abrechnung: Zahlungen je stripe_customer_id im Stripe-Dashboard
-- (Kunden → Zahlungen) für den Vormonat nachsehen.
-- Provision: 30 % auf Abo-Zahlungen, 24 Monate ab Registrierung; 30 % auf die Dauerlizenz.

select
  upper(u.raw_user_meta_data ->> 'partner_code') as partnercode,
  t.name                                         as kunde,
  u.email                                        as kunden_email,
  t.plan                                         as tarif,
  t.stripe_customer_id,
  t.lifetime_purchased_at                        as dauerlizenz_gekauft,
  t.created_at::date                             as registriert_am,
  (t.created_at + interval '24 months')::date    as provision_bis
from public.memberships m
join auth.users u    on u.id = m.user_id
join public.tenants t on t.id = m.tenant_id
where m.role = 'owner'
  and coalesce(u.raw_user_meta_data ->> 'partner_code', '') <> ''
order by partnercode, t.created_at;
