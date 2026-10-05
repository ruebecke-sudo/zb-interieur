-- Automatic tenant onboarding for new Supabase Auth users.
-- Runs server-side and does not expose service-role credentials.

create or replace function public.handle_new_image_manager_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  display_name text;
  base_slug text;
begin
  display_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'company_name'), ''), split_part(new.email, '@', 1), 'Neuer Kunde');
  base_slug := lower(regexp_replace(display_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then base_slug := 'kunde'; end if;

  insert into public.tenants (name, slug, plan, status)
  values (display_name, base_slug || '-' || substr(replace(new.id::text, '-', ''), 1, 8), 'starter', 'trial')
  returning id into new_tenant_id;

  insert into public.memberships (tenant_id, user_id, role)
  values (new_tenant_id, new.id, 'owner');

  insert into public.audit_logs (tenant_id, user_id, action, entity_type, metadata)
  values (new_tenant_id, new.id, 'tenant.created', 'tenant', jsonb_build_object('source', 'signup'));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_image_manager on auth.users;

create trigger on_auth_user_created_image_manager
after insert on auth.users
for each row
execute function public.handle_new_image_manager_user();
