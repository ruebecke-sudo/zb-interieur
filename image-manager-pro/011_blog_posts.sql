-- 011: Blog posts per workspace (written in Image Manager Pro, shown on the website).
-- Self-contained: also (re)creates the role helper from 008 and sets the complete
-- column rights on tenants, because 008 was not fully applied on the live database.
-- Safe to run more than once (Supabase SQL Editor).

-- 1) Role helper (same as in 008)
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

-- 2) Browsers may only change these workspace fields (never plan or Stripe IDs).
--    Complete list from 008, 009 and 010.
revoke update on public.tenants from anon, authenticated;
grant update (
  name, brand_name, logo_url, primary_color,
  category_labels, embed_enabled,
  gallery_style, inquiry_mode, inquiry_label, inquiry_email, inquiry_url
) on public.tenants to authenticated;

-- 3) Blog posts
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  slug text not null,
  title text not null,
  excerpt text not null default '',
  category text not null default '',
  image_url text,
  image_alt text not null default '',
  -- Paragraphs separated by line breaks.
  body text not null default '',
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_status_check check (status in ('draft', 'published')),
  constraint blog_posts_slug_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint blog_posts_tenant_slug_unique unique (tenant_id, slug)
);

create index if not exists blog_posts_tenant_published_idx on public.blog_posts (tenant_id, status, published_at desc);

alter table public.blog_posts enable row level security;

drop policy if exists "tenant members can read blog posts" on public.blog_posts;
create policy "tenant members can read blog posts"
on public.blog_posts for select
using (public.has_tenant_role(blog_posts.tenant_id, array['owner','admin','member','viewer']));

drop policy if exists "tenant editors can write blog posts" on public.blog_posts;
create policy "tenant editors can write blog posts"
on public.blog_posts for all
using (public.has_tenant_role(blog_posts.tenant_id, array['owner','admin','member']))
with check (public.has_tenant_role(blog_posts.tenant_id, array['owner','admin','member']));

grant select, insert, update, delete on public.blog_posts to authenticated;
revoke all on public.blog_posts from anon;

-- 4) Check: should list the helper and the blog table
select 'has_tenant_role' as objekt, count(*) as vorhanden from pg_proc where proname = 'has_tenant_role'
union all
select 'blog_posts', count(*) from information_schema.tables where table_schema = 'public' and table_name = 'blog_posts';
