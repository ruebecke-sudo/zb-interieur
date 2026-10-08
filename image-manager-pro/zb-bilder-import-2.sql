-- ZB Interieur: 34 weitere Bilder aus "image manager pro - bilder" (Kolini, Nature Design).
-- Marke = Ordner, Name = Dateiname ohne Zahlen, Produktart und Bereich nach Bildinhalt.
-- Bilder liegen auf der ZB-Website unter /images/imp/. Überspringt bereits eingetragene Bilder. Mehrfach ausführbar.
insert into public.images (tenant_id, website_id, filename, name, text, note, category1, category2, category3, category4, url, format, width, height, file_size, status, sync_status, external_id, updated_at)
select
  (select id from public.tenants where slug = 'digitale-medien-319ef552'), null, p.filename, p.name, '', 'Preis auf Anfrage', p.brand, p.type, p.room, '', p.url, 'WEBP', p.width, p.height, p.size,
  'active', 'pending', p.key,
  now() - make_interval(secs => p.ord)
from (values
  (1000, 'zb-upload:/images/imp/kolini/luc.webp', 'Kolini', 'Sessel', 'Wohnzimmer', 'Luc', 'https://zb-interieur.netlify.app/images/imp/kolini/luc.webp', 'luc.webp', 1466, 1800, 325536),
  (1001, 'zb-upload:/images/imp/kolini/tavolo.webp', 'Kolini', 'Tisch', 'Esszimmer', 'Tavolo', 'https://zb-interieur.netlify.app/images/imp/kolini/tavolo.webp', 'tavolo.webp', 1754, 1240, 123968),
  (1002, 'zb-upload:/images/imp/kolini/cibo.webp', 'Kolini', 'Tisch', 'Esszimmer', 'Cibo', 'https://zb-interieur.netlify.app/images/imp/kolini/cibo.webp', 'cibo.webp', 1800, 1200, 116494),
  (1003, 'zb-upload:/images/imp/kolini/cube.webp', 'Kolini', 'Hocker', 'Wohnzimmer', 'Cube', 'https://zb-interieur.netlify.app/images/imp/kolini/cube.webp', 'cube.webp', 1714, 1282, 438588),
  (1004, 'zb-upload:/images/imp/kolini/kolini-composition.webp', 'Kolini', 'Tisch', 'Esszimmer', 'Kolini Composition', 'https://zb-interieur.netlify.app/images/imp/kolini/kolini-composition.webp', 'kolini-composition.webp', 1512, 1280, 137422),
  (1005, 'zb-upload:/images/imp/kolini/melow.webp', 'Kolini', 'Stuhl', 'Esszimmer', 'Melow', 'https://zb-interieur.netlify.app/images/imp/kolini/melow.webp', 'melow.webp', 1200, 1800, 185746),
  (1006, 'zb-upload:/images/imp/kolini/victor.webp', 'Kolini', 'Sofa', 'Wohnzimmer', 'Victor', 'https://zb-interieur.netlify.app/images/imp/kolini/victor.webp', 'victor.webp', 1800, 1264, 155258),
  (1007, 'zb-upload:/images/imp/nature-design/litha-bench.webp', 'Nature Design', 'Bank', 'Wohnzimmer', 'Litha Bench', 'https://zb-interieur.netlify.app/images/imp/nature-design/litha-bench.webp', 'litha-bench.webp', 1398, 1048, 140168),
  (1008, 'zb-upload:/images/imp/nature-design/litha-bench-2.webp', 'Nature Design', 'Bank', 'Wohnzimmer', 'Litha Bench', 'https://zb-interieur.netlify.app/images/imp/nature-design/litha-bench-2.webp', 'litha-bench-2.webp', 1800, 844, 20774),
  (1009, 'zb-upload:/images/imp/nature-design/lymph-big.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Lymph Big', 'https://zb-interieur.netlify.app/images/imp/nature-design/lymph-big.webp', 'lymph-big.webp', 1800, 1012, 47902),
  (1010, 'zb-upload:/images/imp/nature-design/manta.webp', 'Nature Design', 'Stuhl', 'Esszimmer', 'Manta', 'https://zb-interieur.netlify.app/images/imp/nature-design/manta.webp', 'manta.webp', 791, 988, 186954),
  (1011, 'zb-upload:/images/imp/nature-design/manta-2.webp', 'Nature Design', 'Stuhl', 'Esszimmer', 'Manta', 'https://zb-interieur.netlify.app/images/imp/nature-design/manta-2.webp', 'manta-2.webp', 1800, 1547, 16440),
  (1012, 'zb-upload:/images/imp/nature-design/pod.webp', 'Nature Design', 'Sideboard', 'Flur', 'Pod', 'https://zb-interieur.netlify.app/images/imp/nature-design/pod.webp', 'pod.webp', 978, 1400, 233020),
  (1013, 'zb-upload:/images/imp/nature-design/pod-2.webp', 'Nature Design', 'Sideboard', 'Wohnzimmer', 'Pod', 'https://zb-interieur.netlify.app/images/imp/nature-design/pod-2.webp', 'pod-2.webp', 1800, 844, 32580),
  (1014, 'zb-upload:/images/imp/nature-design/tide.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Tide', 'https://zb-interieur.netlify.app/images/imp/nature-design/tide.webp', 'tide.webp', 1680, 938, 33096),
  (1015, 'zb-upload:/images/imp/nature-design/tide-2.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Tide', 'https://zb-interieur.netlify.app/images/imp/nature-design/tide-2.webp', 'tide-2.webp', 1800, 900, 24202),
  (1016, 'zb-upload:/images/imp/nature-design/trine-armchair.webp', 'Nature Design', 'Sessel', 'Wohnzimmer', 'Trine Armchair', 'https://zb-interieur.netlify.app/images/imp/nature-design/trine-armchair.webp', 'trine-armchair.webp', 1428, 1800, 168174),
  (1017, 'zb-upload:/images/imp/nature-design/bloom.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Bloom', 'https://zb-interieur.netlify.app/images/imp/nature-design/bloom.webp', 'bloom.webp', 1450, 1800, 52332),
  (1018, 'zb-upload:/images/imp/nature-design/bloom-2.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Bloom', 'https://zb-interieur.netlify.app/images/imp/nature-design/bloom-2.webp', 'bloom-2.webp', 1800, 900, 18816),
  (1019, 'zb-upload:/images/imp/nature-design/blossom-armchair.webp', 'Nature Design', 'Sessel', 'Wohnzimmer', 'Blossom Armchair', 'https://zb-interieur.netlify.app/images/imp/nature-design/blossom-armchair.webp', 'blossom-armchair.webp', 1127, 1680, 35904),
  (1020, 'zb-upload:/images/imp/nature-design/blossom-armchair-2.webp', 'Nature Design', 'Sessel', 'Wohnzimmer', 'Blossom Armchair', 'https://zb-interieur.netlify.app/images/imp/nature-design/blossom-armchair-2.webp', 'blossom-armchair-2.webp', 1800, 1547, 23648),
  (1021, 'zb-upload:/images/imp/nature-design/blossom-lounge.webp', 'Nature Design', 'Sessel', 'Wohnzimmer', 'Blossom Lounge', 'https://zb-interieur.netlify.app/images/imp/nature-design/blossom-lounge.webp', 'blossom-lounge.webp', 1254, 1680, 31454),
  (1022, 'zb-upload:/images/imp/nature-design/blossom-lounge-2.webp', 'Nature Design', 'Sessel', 'Wohnzimmer', 'Blossom Lounge', 'https://zb-interieur.netlify.app/images/imp/nature-design/blossom-lounge-2.webp', 'blossom-lounge-2.webp', 737, 1032, 14798),
  (1023, 'zb-upload:/images/imp/nature-design/blur.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Blur', 'https://zb-interieur.netlify.app/images/imp/nature-design/blur.webp', 'blur.webp', 1600, 1800, 81402),
  (1024, 'zb-upload:/images/imp/nature-design/blur-2.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Blur', 'https://zb-interieur.netlify.app/images/imp/nature-design/blur-2.webp', 'blur-2.webp', 1800, 900, 43490),
  (1025, 'zb-upload:/images/imp/nature-design/blur-coffe-table.webp', 'Nature Design', 'Tisch', 'Wohnzimmer', 'Blur Coffe Table', 'https://zb-interieur.netlify.app/images/imp/nature-design/blur-coffe-table.webp', 'blur-coffe-table.webp', 791, 988, 99136),
  (1026, 'zb-upload:/images/imp/nature-design/blur-coffe-table-2.webp', 'Nature Design', 'Tisch', 'Wohnzimmer', 'Blur Coffe Table', 'https://zb-interieur.netlify.app/images/imp/nature-design/blur-coffe-table-2.webp', 'blur-coffe-table-2.webp', 1800, 1650, 53786),
  (1027, 'zb-upload:/images/imp/nature-design/cinamon.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Cinamon', 'https://zb-interieur.netlify.app/images/imp/nature-design/cinamon.webp', 'cinamon.webp', 1246, 1800, 86670),
  (1028, 'zb-upload:/images/imp/nature-design/cinamon-2.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Cinamon', 'https://zb-interieur.netlify.app/images/imp/nature-design/cinamon-2.webp', 'cinamon-2.webp', 791, 1087, 150098),
  (1029, 'zb-upload:/images/imp/nature-design/convivium.webp', 'Nature Design', 'Sofa', 'Wohnzimmer', 'Convivium', 'https://zb-interieur.netlify.app/images/imp/nature-design/convivium.webp', 'convivium.webp', 1680, 1196, 35570),
  (1030, 'zb-upload:/images/imp/nature-design/convivium-2.webp', 'Nature Design', 'Sofa', 'Wohnzimmer', 'Convivium', 'https://zb-interieur.netlify.app/images/imp/nature-design/convivium-2.webp', 'convivium-2.webp', 1800, 1547, 21582),
  (1031, 'zb-upload:/images/imp/nature-design/lymph.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Lymph', 'https://zb-interieur.netlify.app/images/imp/nature-design/lymph.webp', 'lymph.webp', 1800, 1012, 47902),
  (1032, 'zb-upload:/images/imp/nature-design/tavolo-balance.webp', 'Nature Design', 'Tisch', 'Esszimmer', 'Tavolo Balance', 'https://zb-interieur.netlify.app/images/imp/nature-design/tavolo-balance.webp', 'tavolo-balance.webp', 1450, 1800, 39858),
  (1033, 'zb-upload:/images/imp/nature-design/trine-armchair-2.webp', 'Nature Design', 'Sessel', 'Wohnzimmer', 'Trine Armchair', 'https://zb-interieur.netlify.app/images/imp/nature-design/trine-armchair-2.webp', 'trine-armchair-2.webp', 1800, 1547, 56974)
) as p(ord, key, brand, type, room, name, url, filename, width, height, size)
where not exists (
  select 1 from public.images i
  where i.tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and i.external_id = p.key
);

-- Neue Auswahlwerte für Produktart und Bereich (nur falls noch nicht vorhanden)
insert into public.categories (tenant_id, slot, name, slug, sort_order)
select (select id from public.tenants where slug = 'digitale-medien-319ef552'), v.slot, v.name, trim(both '-' from regexp_replace(lower(v.name), '[^a-z0-9]+', '-', 'g')) || '-' || v.slot, 20
from (values (2, 'Sessel'), (2, 'Tisch'), (2, 'Hocker'), (2, 'Stuhl'), (2, 'Sofa'), (2, 'Bank'), (2, 'Sideboard'), (3, 'Wohnzimmer'), (3, 'Esszimmer'), (3, 'Flur')) as v(slot, name)
where not exists (
  select 1 from public.categories c
  where c.tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and c.slot = v.slot and lower(trim(c.name)) = lower(v.name)
)
on conflict do nothing;

-- Kontrolle
select category1 as marke, count(*) as bilder from public.images
where tenant_id = (select id from public.tenants where slug = 'digitale-medien-319ef552') and external_id like 'zb-upload:%'
group by category1 order by category1;
