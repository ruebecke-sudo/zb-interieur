-- 010: Catalog display, optional note per image, inquiry button per workspace.
-- Only adds columns and column rights; existing policies stay untouched.
-- Safe to run more than once (Supabase SQL Editor). Requires 008 and 009.

-- Optional free text per image, e.g. "ab 1.290 €", "Ausstellungsstück", "Neu".
-- Shown only when filled.
alter table public.images add column if not exists note text;

-- Workspace settings for the public gallery / catalog.
alter table public.tenants add column if not exists gallery_style text not null default 'grid';
alter table public.tenants add column if not exists inquiry_mode text not null default 'off';
alter table public.tenants add column if not exists inquiry_label text not null default 'Jetzt anfragen';
alter table public.tenants add column if not exists inquiry_email text;
alter table public.tenants add column if not exists inquiry_url text;

alter table public.tenants drop constraint if exists tenants_gallery_style_check;
alter table public.tenants add constraint tenants_gallery_style_check
  check (gallery_style in ('grid', 'catalog'));

alter table public.tenants drop constraint if exists tenants_inquiry_mode_check;
alter table public.tenants add constraint tenants_inquiry_mode_check
  check (inquiry_mode in ('off', 'email', 'link'));

alter table public.tenants drop constraint if exists tenants_inquiry_url_check;
alter table public.tenants add constraint tenants_inquiry_url_check
  check (inquiry_url is null or inquiry_url ~* '^https?://');

-- 008 limits browser updates on tenants to explicitly granted columns.
grant update (gallery_style, inquiry_mode, inquiry_label, inquiry_email, inquiry_url) on public.tenants to authenticated;
