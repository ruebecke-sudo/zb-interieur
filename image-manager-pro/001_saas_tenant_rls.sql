-- Image Manager Pro SaaS production migration
-- Tenant isolation is enforced at the database layer.

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  primary_color text,
  plan text not null default 'starter' check (plan in ('starter','professional','business','agency')),
  status text not null default 'active' check (status in ('active','suspended','trial')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table if not exists public.websites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  base_url text not null,
  connector_type text not null default 'rest',
  status text not null default 'active',
  sync_status text not null default 'synced' check (sync_status in ('synced','pending','error')),
  sync_error text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slot smallint not null check (slot between 1 and 4),
  name text not null,
  slug text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists categories_tenant_slot_name_idx on public.categories(tenant_id, slot, name);
create unique index if not exists categories_tenant_slug_idx on public.categories(tenant_id, slug);

create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  website_id uuid references public.websites(id) on delete set null,
  external_id text,
  filename text,
  name text,
  text text,
  category1 text,
  category2 text,
  category3 text,
  category4 text,
  width integer,
  height integer,
  color_space text,
  format text,
  file_size bigint,
  url text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists memberships_user_idx on public.memberships(user_id);
create index if not exists websites_tenant_idx on public.websites(tenant_id);
create index if not exists images_tenant_idx on public.images(tenant_id);
create index if not exists images_website_idx on public.images(website_id);
create unique index if not exists images_website_external_idx on public.images(website_id, external_id) where external_id is not null;
create index if not exists audit_tenant_idx on public.audit_logs(tenant_id);

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships
    where tenant_id = target_tenant
      and user_id = auth.uid()
  );
$$;

alter table public.tenants enable row level security;
alter table public.memberships enable row level security;
alter table public.websites enable row level security;
alter table public.categories enable row level security;
alter table public.images enable row level security;
alter table public.audit_logs enable row level security;

create policy "tenant members can read tenant"
on public.tenants for select
using (public.is_tenant_member(id));

create policy "users can read own memberships"
on public.memberships for select
using (user_id = auth.uid());

create policy "tenant admins can manage memberships"
on public.memberships for update
using (
  exists (select 1 from public.memberships actor where actor.tenant_id = memberships.tenant_id and actor.user_id = auth.uid() and actor.role in ('owner','admin'))
)
with check (
  exists (select 1 from public.memberships actor where actor.tenant_id = memberships.tenant_id and actor.user_id = auth.uid() and actor.role in ('owner','admin'))
);

create policy "tenant admins can add memberships"
on public.memberships for insert
with check (
  exists (select 1 from public.memberships actor where actor.tenant_id = memberships.tenant_id and actor.user_id = auth.uid() and actor.role in ('owner','admin'))
);

create policy "tenant members can read websites"
on public.websites for select
using (public.is_tenant_member(tenant_id));

create policy "tenant admins can manage websites"
on public.websites for all
using (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
)
with check (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);

create policy "tenant members can read categories"
on public.categories for select
using (public.is_tenant_member(tenant_id));

create policy "tenant admins can manage categories"
on public.categories for all
using (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
)
with check (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);

create policy "tenant members can read images"
on public.images for select
using (public.is_tenant_member(tenant_id));

create policy "tenant editors can create images"
on public.images for insert
with check (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin','member'))
);

create policy "tenant editors can update images"
on public.images for update
using (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin','member'))
)
with check (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin','member'))
);

create policy "tenant editors can delete images"
on public.images for delete
using (
  exists (select 1 from public.memberships m where m.tenant_id = tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin','member'))
);

create policy "tenant members can read audit logs"
on public.audit_logs for select
using (public.is_tenant_member(tenant_id));

-- New users can be assigned to a tenant by a trusted onboarding flow.
-- Do not expose service-role credentials in the browser.
