-- 009: Own category names per workspace, revised plan limits, public gallery embed.
-- Requires 008. Safe to run more than once (Supabase SQL Editor).

-- ---------------------------------------------------------------------------
-- 1) Four category names per workspace (used everywhere in the app)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'tenants' and column_name = 'category_labels'
  ) then
    alter table public.tenants
      add column category_labels text[] not null default array['Marke','Typ','Bereich','Stil'];
    -- Existing workspaces keep the names they have been working with so far.
    update public.tenants set category_labels = array['Marke','Produktart','Bereich','Stil'];
  end if;
end $$;

alter table public.tenants drop constraint if exists tenants_category_labels_check;
alter table public.tenants add constraint tenants_category_labels_check
  check (array_length(category_labels, 1) = 4);

-- ---------------------------------------------------------------------------
-- 2) Revised plan limits (images, members, websites)
-- ---------------------------------------------------------------------------
insert into public.plan_limits (plan, max_images, max_members, max_websites) values
  ('starter',        500,   2,   1),
  ('professional',  5000,   5,   2),
  ('business',     25000,  15,   5),
  ('agency',      100000, 200, 100),
  ('lifetime',     25000,  10,   3)
on conflict (plan) do update
  set max_images = excluded.max_images,
      max_members = excluded.max_members,
      max_websites = excluded.max_websites;

-- ---------------------------------------------------------------------------
-- 3) Public gallery embed (opt-in per workspace)
-- ---------------------------------------------------------------------------
-- embed_id is a public, non-secret identifier used in the embed code.
-- Images are only served when the workspace switched embed_enabled on.
alter table public.tenants add column if not exists embed_id uuid not null default gen_random_uuid();
alter table public.tenants add column if not exists embed_enabled boolean not null default false;
create unique index if not exists tenants_embed_id_idx on public.tenants(embed_id);
