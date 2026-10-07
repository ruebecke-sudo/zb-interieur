-- 011: Blog posts per workspace (written in Image Manager Pro, shown on the website).
-- Requires 008 (has_tenant_role). Safe to run more than once (Supabase SQL Editor).

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
