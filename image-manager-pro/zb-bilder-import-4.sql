-- ZB Interieur: 16 weitere Bilder aus "image manager pro - bilder" (Mogg).
-- Marke = Ordner, Name = Dateiname ohne Zahlen, Produktart und Bereich nach Bildinhalt.
-- Bilder liegen auf der ZB-Website unter /images/imp/. Überspringt bereits eingetragene Bilder. Mehrfach ausführbar.
insert into public.images (tenant_id, website_id, filename, name, text, note, category1, category2, category3, category4, url, format, width, height, file_size, status, sync_status, external_id, updated_at)
select
  (select id from public.tenants where slug = 'digitale-medien-319ef552'), null, p.filename, p.name, '', 'Preis auf Anfrage', p.brand, p.type, p.room, '', p.url, 'WEBP', p.width, p.height, p.size,
  'active', 'pending', p.key,
  now() - make_interval(secs => p.ord)
from (values
  (3000, 'zb-upload:/images/imp/mogg/constantin.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Constantin', 'https://zb-interieur.netlify.app/images/imp/mogg/constantin.webp', 'constantin.webp', 1024, 724, 122810),
  (3001, 'zb-upload:/images/imp/mogg/santos.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Santos', 'https://zb-interieur.netlify.app/images/imp/mogg/santos.webp', 'santos.webp', 640, 493, 41986),
  (3002, 'zb-upload:/images/imp/mogg/mogg-bed-alba.webp', 'Mogg', 'Bett', 'Schlafzimmer', 'Bett Alba', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-bed-alba.webp', 'mogg-bed-alba.webp', 1280, 1280, 36470),
  (3003, 'zb-upload:/images/imp/mogg/mogg-bed-flirt.webp', 'Mogg', 'Bett', 'Schlafzimmer', 'Bett Flirt', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-bed-flirt.webp', 'mogg-bed-flirt.webp', 1280, 1280, 53130),
  (3004, 'zb-upload:/images/imp/mogg/mogg-bed-flirt-2.webp', 'Mogg', 'Bett', 'Schlafzimmer', 'Bett Flirt', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-bed-flirt-2.webp', 'mogg-bed-flirt-2.webp', 1280, 1280, 129320),
  (3005, 'zb-upload:/images/imp/mogg/mogg-lamp-era.webp', 'Mogg', 'Leuchte', '', 'Leuchte Era', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-lamp-era.webp', 'mogg-lamp-era.webp', 1280, 1280, 61282),
  (3006, 'zb-upload:/images/imp/mogg/mogg-seat-nora.webp', 'Mogg', 'Sessel', 'Wohnzimmer', 'Sessel Nora', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-seat-nora.webp', 'mogg-seat-nora.webp', 1800, 1200, 315428),
  (3007, 'zb-upload:/images/imp/mogg/mogg-seat-uccio.webp', 'Mogg', 'Hocker', 'Esszimmer', 'Hocker Uccio', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-seat-uccio.webp', 'mogg-seat-uccio.webp', 1800, 1200, 76340),
  (3008, 'zb-upload:/images/imp/mogg/mogg-storage-fractal.webp', 'Mogg', 'Sideboard', 'Wohnzimmer', 'Sideboard Fractal', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-storage-fractal.webp', 'mogg-storage-fractal.webp', 1800, 1200, 290950),
  (3009, 'zb-upload:/images/imp/mogg/mogg-storage-la-dori.webp', 'Mogg', 'Schrank', 'Wohnzimmer', 'Schrank La Dori', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-storage-la-dori.webp', 'mogg-storage-la-dori.webp', 1800, 1200, 90146),
  (3010, 'zb-upload:/images/imp/mogg/mogg-table-dune.webp', 'Mogg', 'Tisch', 'Wohnzimmer', 'Couchtisch Dune', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-table-dune.webp', 'mogg-table-dune.webp', 1800, 1200, 196666),
  (3011, 'zb-upload:/images/imp/mogg/mogg-table-medusa.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Tisch Medusa', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-table-medusa.webp', 'mogg-table-medusa.webp', 1280, 1280, 152616),
  (3012, 'zb-upload:/images/imp/mogg/mogg-table-medusa-2.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Tisch Medusa', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-table-medusa-2.webp', 'mogg-table-medusa-2.webp', 1280, 1280, 17558),
  (3013, 'zb-upload:/images/imp/mogg/mogg-table-medusa-3.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Tisch Medusa', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-table-medusa-3.webp', 'mogg-table-medusa-3.webp', 1800, 1200, 232372),
  (3014, 'zb-upload:/images/imp/mogg/mogg-table-medusa-4.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Tisch Medusa', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-table-medusa-4.webp', 'mogg-table-medusa-4.webp', 1280, 1280, 225656),
  (3015, 'zb-upload:/images/imp/mogg/mogg-table-shap.webp', 'Mogg', 'Tisch', 'Esszimmer', 'Tisch Shap', 'https://zb-interieur.netlify.app/images/imp/mogg/mogg-table-shap.webp', 'mogg-table-shap.webp', 1800, 1201, 176344)
) as p(ord, key, brand, type, room, name, url, filename, width, height, size)
where not exists (
  select 1 from public.images i
  where i.tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and i.external_id = p.key
);

-- Neue Auswahlwerte für Produktart und Bereich (nur falls noch nicht vorhanden)
insert into public.categories (tenant_id, slot, name, slug, sort_order)
select (select id from public.tenants where slug = 'digitale-medien-319ef552'), v.slot, v.name, trim(both '-' from regexp_replace(lower(v.name), '[^a-z0-9]+', '-', 'g')) || '-' || v.slot, 20
from (values (2, 'Tisch'), (2, 'Bett'), (2, 'Leuchte'), (2, 'Sessel'), (2, 'Hocker'), (2, 'Sideboard'), (2, 'Schrank'), (3, 'Esszimmer'), (3, 'Schlafzimmer'), (3, 'Wohnzimmer')) as v(slot, name)
where not exists (
  select 1 from public.categories c
  where c.tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and c.slot = v.slot and lower(trim(c.name)) = lower(v.name)
)
on conflict do nothing;

-- Kontrolle
select category1 as marke, count(*) as bilder from public.images
where tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and external_id like 'zb-upload:%'
group by category1 order by category1;
