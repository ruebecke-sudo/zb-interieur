-- Image Manager Pro logical schema
-- NOT applied to any Supabase project yet.
-- Apply only after selecting/creating the production project.

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  primary_color text,
  plan text not null default 'starter',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
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
  created_at timestamptz not null default now(),
  unique (tenant_id, slot),
  unique (tenant_id, slug)
);

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

create index if not exists images_tenant_idx on public.images(tenant_id);
create index if not exists images_website_idx on public.images(website_id);
create index if not exists images_external_idx on public.images(website_id, external_id);

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

-- RLS is intentionally part of the production migration, not this foundation file.
-- Every tenant-scoped table must enforce tenant membership before production use.
