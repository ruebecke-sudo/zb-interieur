-- ZB Interieur: 26 weitere Bilder aus "image manager pro - bilder" (form exclusiv).
-- Marke = Ordner, Name = Dateiname ohne Zahlen, Produktart und Bereich nach Bildinhalt.
-- Bilder liegen auf der ZB-Website unter /images/imp/. Überspringt bereits eingetragene Bilder. Mehrfach ausführbar.
insert into public.images (tenant_id, website_id, filename, name, text, note, category1, category2, category3, category4, url, format, width, height, file_size, status, sync_status, external_id, updated_at)
select
  (select id from public.tenants where slug = 'digitale-medien-319ef552'), null, p.filename, p.name, '', 'Preis auf Anfrage', p.brand, p.type, p.room, '', p.url, 'WEBP', p.width, p.height, p.size,
  'active', 'pending', p.key,
  now() - make_interval(secs => p.ord)
from (values
  (2000, 'zb-upload:/images/imp/form-exclusiv/alva-tisch.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Alva Tisch', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/alva-tisch.webp', 'alva-tisch.webp', 1400, 1800, 68022),
  (2001, 'zb-upload:/images/imp/form-exclusiv/anrichte-chelsea.webp', 'Form exclusiv', 'Sideboard', 'Wohnzimmer', 'Anrichte Chelsea', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/anrichte-chelsea.webp', 'anrichte-chelsea.webp', 1800, 1350, 113878),
  (2002, 'zb-upload:/images/imp/form-exclusiv/diamant-tisch.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Diamant Tisch', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/diamant-tisch.webp', 'diamant-tisch.webp', 1400, 1800, 178972),
  (2003, 'zb-upload:/images/imp/form-exclusiv/esstisch-avignon.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Esstisch Avignon', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/esstisch-avignon.webp', 'esstisch-avignon.webp', 1800, 1000, 99510),
  (2004, 'zb-upload:/images/imp/form-exclusiv/esstisch-avignon-rund.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Esstisch Avignon rund', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/esstisch-avignon-rund.webp', 'esstisch-avignon-rund.webp', 1800, 1000, 119594),
  (2005, 'zb-upload:/images/imp/form-exclusiv/funktionatiach-bordeaux.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Funktionstisch Bordeaux', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/funktionatiach-bordeaux.webp', 'funktionatiach-bordeaux.webp', 400, 506, 32550),
  (2006, 'zb-upload:/images/imp/form-exclusiv/funktionatiach-bordeaux-2.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Funktionstisch Bordeaux', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/funktionatiach-bordeaux-2.webp', 'funktionatiach-bordeaux-2.webp', 800, 538, 47722),
  (2007, 'zb-upload:/images/imp/form-exclusiv/hochanrichte-avignon-tuerig-kirschbaum.webp', 'Form exclusiv', 'Sideboard', 'Esszimmer', 'Hochanrichte Avignon 4-türig Kirschbaum', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/hochanrichte-avignon-tuerig-kirschbaum.webp', 'hochanrichte-avignon-tuerig-kirschbaum.webp', 1800, 1200, 93178),
  (2008, 'zb-upload:/images/imp/form-exclusiv/hocher-tisch-und-anrichte-kuub.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Hocker, Tisch und Anrichte Kuub', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/hocher-tisch-und-anrichte-kuub.webp', 'hocher-tisch-und-anrichte-kuub.webp', 1800, 1200, 168298),
  (2009, 'zb-upload:/images/imp/form-exclusiv/kuub-anrichten.webp', 'Form exclusiv', 'Sideboard', 'Wohnzimmer', 'Kuub Anrichten', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/kuub-anrichten.webp', 'kuub-anrichten.webp', 1800, 844, 106646),
  (2010, 'zb-upload:/images/imp/form-exclusiv/konferenztisch-cara.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Konferenztisch Cara', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/konferenztisch-cara.webp', 'konferenztisch-cara.webp', 1800, 1200, 80430),
  (2011, 'zb-upload:/images/imp/form-exclusiv/konferenztisch-rund.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Konferenztisch rund', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/konferenztisch-rund.webp', 'konferenztisch-rund.webp', 1800, 1200, 141022),
  (2012, 'zb-upload:/images/imp/form-exclusiv/loft-tisch-sideboard.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Loft Tisch Sideboard', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/loft-tisch-sideboard.webp', 'loft-tisch-sideboard.webp', 1800, 1200, 333994),
  (2013, 'zb-upload:/images/imp/form-exclusiv/madison-schachbrettmustertisch.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Madison Schachbrettmustertisch', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/madison-schachbrettmustertisch.webp', 'madison-schachbrettmustertisch.webp', 1800, 1200, 125788),
  (2014, 'zb-upload:/images/imp/form-exclusiv/pisa-marmor-esstisch.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Pisa Marmor Esstisch', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/pisa-marmor-esstisch.webp', 'pisa-marmor-esstisch.webp', 1200, 1800, 61744),
  (2015, 'zb-upload:/images/imp/form-exclusiv/rondo.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Rondo', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/rondo.webp', 'rondo.webp', 600, 334, 21340),
  (2016, 'zb-upload:/images/imp/form-exclusiv/schrank-mayfair.webp', 'Form exclusiv', 'Schrank', 'Wohnzimmer', 'Schrank Mayfair', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/schrank-mayfair.webp', 'schrank-mayfair.webp', 1800, 1350, 139816),
  (2017, 'zb-upload:/images/imp/form-exclusiv/schrank-brooklyn.webp', 'Form exclusiv', 'Schrank', 'Wohnzimmer', 'Schrank Brooklyn', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/schrank-brooklyn.webp', 'schrank-brooklyn.webp', 1800, 1350, 181822),
  (2018, 'zb-upload:/images/imp/form-exclusiv/turin-esstisch.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Turin Esstisch', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/turin-esstisch.webp', 'turin-esstisch.webp', 1800, 1200, 106072),
  (2019, 'zb-upload:/images/imp/form-exclusiv/vitrinenschrank-hampton.webp', 'Form exclusiv', 'Schrank', 'Wohnzimmer', 'Vitrinenschrank Hampton', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/vitrinenschrank-hampton.webp', 'vitrinenschrank-hampton.webp', 800, 600, 20556),
  (2020, 'zb-upload:/images/imp/form-exclusiv/bordeaux-vitrine.webp', 'Form exclusiv', 'Regal', 'Wohnzimmer', 'Bordeaux Vitrine', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/bordeaux-vitrine.webp', 'bordeaux-vitrine.webp', 350, 525, 12164),
  (2021, 'zb-upload:/images/imp/form-exclusiv/hochzeitschrank.webp', 'Form exclusiv', 'Schrank', 'Wohnzimmer', 'Hochzeitschrank', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/hochzeitschrank.webp', 'hochzeitschrank.webp', 1000, 1199, 30026),
  (2022, 'zb-upload:/images/imp/form-exclusiv/mammut-gerauchert.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Mammut geräuchert', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/mammut-gerauchert.webp', 'mammut-gerauchert.webp', 1200, 1800, 183678),
  (2023, 'zb-upload:/images/imp/form-exclusiv/monou-esstisch.webp', 'Form exclusiv', 'Tisch', 'Esszimmer', 'Monou Esstisch', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/monou-esstisch.webp', 'monou-esstisch.webp', 1200, 1800, 151994),
  (2024, 'zb-upload:/images/imp/form-exclusiv/schrank-nizza.webp', 'Form exclusiv', 'Schrank', 'Wohnzimmer', 'Schrank Nizza', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/schrank-nizza.webp', 'schrank-nizza.webp', 452, 542, 9476),
  (2025, 'zb-upload:/images/imp/form-exclusiv/wohnzimmer-trennwand.webp', 'Form exclusiv', 'Sideboard', 'Wohnzimmer', 'Wohnzimmer-Trennwand', 'https://zb-interieur.netlify.app/images/imp/form-exclusiv/wohnzimmer-trennwand.webp', 'wohnzimmer-trennwand.webp', 1800, 1200, 90878)
) as p(ord, key, brand, type, room, name, url, filename, width, height, size)
where not exists (
  select 1 from public.images i
  where i.tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and i.external_id = p.key
);

-- Neue Auswahlwerte für Produktart und Bereich (nur falls noch nicht vorhanden)
insert into public.categories (tenant_id, slot, name, slug, sort_order)
select (select id from public.tenants where slug = 'digitale-medien-319ef552'), v.slot, v.name, trim(both '-' from regexp_replace(lower(v.name), '[^a-z0-9]+', '-', 'g')) || '-' || v.slot, 20
from (values (2, 'Tisch'), (2, 'Sideboard'), (2, 'Schrank'), (2, 'Regal'), (3, 'Esszimmer'), (3, 'Wohnzimmer')) as v(slot, name)
where not exists (
  select 1 from public.categories c
  where c.tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and c.slot = v.slot and lower(trim(c.name)) = lower(v.name)
)
on conflict do nothing;

-- Kontrolle
select category1 as marke, count(*) as bilder from public.images
where tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and external_id like 'zb-upload:%'
group by category1 order by category1;
