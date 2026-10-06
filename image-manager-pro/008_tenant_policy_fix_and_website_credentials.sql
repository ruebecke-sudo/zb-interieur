-- 008: Lock tenant billing fields + per-website connector credentials.
-- Written against the live database (checked 06.10.2026): RLS is enabled on all
-- tables and the existing policies compare against the row's own tenant correctly.
-- Safe to run more than once (Supabase SQL Editor).

-- ---------------------------------------------------------------------------
-- 1) Browsers may only change branding fields of a workspace
-- ---------------------------------------------------------------------------
-- The policy "tenant admins can update tenant branding" allows owners/admins to
-- UPDATE the tenants row, and RLS cannot restrict columns. Without this, an owner
-- could set plan = 'lifetime' or another stripe_customer_id via the REST API.
-- Plan and Stripe fields are only written by server functions (service role).
revoke update on public.tenants from anon, authenticated;
grant update (name, brand_name, logo_url, primary_color) on public.tenants to authenticated;

-- ---------------------------------------------------------------------------
-- 2) Tenant role helper (used by the functions below)
-- ---------------------------------------------------------------------------
create or replace function public.has_tenant_role(target_tenant uuid, allowed_roles text[])
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
      and role = any(allowed_roles)
  );
$$;

-- An image may only reference a website of the same workspace.
create or replace function public.check_image_website_tenant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.website_id is not null and not exists (
    select 1 from public.websites w where w.id = new.website_id and w.tenant_id = new.tenant_id
  ) then
    raise exception 'Website gehört nicht zu diesem Arbeitsbereich.';
  end if;
  return new;
end;
$$;

drop trigger if exists images_website_tenant_check on public.images;
create trigger images_website_tenant_check
before insert or update of website_id, tenant_id on public.images
for each row execute function public.check_image_website_tenant();

-- ---------------------------------------------------------------------------
-- 3) Per-website connector credentials
-- ---------------------------------------------------------------------------
-- RLS without any policy: browsers can neither read nor write this table
-- directly. Owners/admins store a key only through set_website_credential();
-- only server functions (service role) read it to authenticate.
create table if not exists public.website_credentials (
  website_id uuid primary key references public.websites(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  api_key text not null check (length(api_key) >= 16),
  updated_at timestamptz not null default now()
);

alter table public.website_credentials enable row level security;

create or replace function public.set_website_credential(target_website uuid, new_api_key text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  website_tenant uuid;
begin
  select tenant_id into website_tenant from public.websites where id = target_website;
  if website_tenant is null or not public.has_tenant_role(website_tenant, array['owner','admin']) then
    raise exception 'Keine Berechtigung für diese Website.';
  end if;
  if new_api_key is null or length(trim(new_api_key)) = 0 then
    delete from public.website_credentials where website_id = target_website;
    return;
  end if;
  if length(trim(new_api_key)) < 16 then
    raise exception 'Der API-Schlüssel muss mindestens 16 Zeichen lang sein.';
  end if;
  insert into public.website_credentials (website_id, tenant_id, api_key, updated_at)
  values (target_website, website_tenant, trim(new_api_key), now())
  on conflict (website_id) do update set api_key = excluded.api_key, updated_at = now();
end;
$$;

revoke all on function public.set_website_credential(uuid, text) from public, anon;
grant execute on function public.set_website_credential(uuid, text) to authenticated;

-- Lets the UI show "key stored: yes/no" without exposing the key itself.
create or replace function public.get_website_credential_status(target_tenant uuid)
returns table(website_id uuid, has_key boolean, updated_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select w.id, c.website_id is not null, c.updated_at
  from public.websites w
  left join public.website_credentials c on c.website_id = w.id
  where w.tenant_id = target_tenant
    and public.has_tenant_role(target_tenant, array['owner','admin','member','viewer']);
$$;

revoke all on function public.get_website_credential_status(uuid) from public, anon;
grant execute on function public.get_website_credential_status(uuid) to authenticated;
