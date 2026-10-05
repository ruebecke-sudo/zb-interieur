-- Enforce plan limits at database level.
alter table public.plan_limits drop constraint if exists plan_limits_plan_check;
alter table public.plan_limits add constraint plan_limits_plan_check
  check (plan in ('starter','professional','business','agency','lifetime'));

create or replace function public.enforce_tenant_plan_limits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  tenant_plan text;
  limit_value integer;
  current_count bigint;
begin
  if tg_table_name = 'images' then
    select t.plan, p.max_images into tenant_plan, limit_value
    from public.tenants t join public.plan_limits p on p.plan = t.plan
    where t.id = new.tenant_id;
    select count(*) into current_count from public.images where tenant_id = new.tenant_id;
  elsif tg_table_name = 'memberships' then
    select t.plan, p.max_members into tenant_plan, limit_value
    from public.tenants t join public.plan_limits p on p.plan = t.plan
    where t.id = new.tenant_id;
    select count(*) into current_count from public.memberships where tenant_id = new.tenant_id;
  elsif tg_table_name = 'websites' then
    select t.plan, p.max_websites into tenant_plan, limit_value
    from public.tenants t join public.plan_limits p on p.plan = t.plan
    where t.id = new.tenant_id;
    select count(*) into current_count from public.websites where tenant_id = new.tenant_id;
  end if;

  if limit_value is null then
    raise exception 'Kein gültiges Tariflimit für Workspace.';
  end if;

  if current_count >= limit_value then
    raise exception 'Tariflimit erreicht: % (%).', tg_table_name, limit_value;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_image_plan_limit on public.images;
create trigger enforce_image_plan_limit
before insert on public.images
for each row execute function public.enforce_tenant_plan_limits();

drop trigger if exists enforce_membership_plan_limit on public.memberships;
create trigger enforce_membership_plan_limit
before insert on public.memberships
for each row execute function public.enforce_tenant_plan_limits();

drop trigger if exists enforce_website_plan_limit on public.websites;
create trigger enforce_website_plan_limit
before insert on public.websites
for each row execute function public.enforce_tenant_plan_limits();
