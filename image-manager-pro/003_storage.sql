-- Image Manager Pro central media storage
insert into storage.buckets (id, name, public)
values ('image-manager-media', 'image-manager-media', true)
on conflict (id) do update set public = true;

drop policy if exists "image manager media insert" on storage.objects;
create policy "image manager media insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'image-manager-media'
  and (storage.foldername(name))[1] in (
    select tenant_id::text from public.memberships where user_id = auth.uid()
  )
);

drop policy if exists "image manager media update" on storage.objects;
create policy "image manager media update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'image-manager-media'
  and (storage.foldername(name))[1] in (
    select tenant_id::text from public.memberships where user_id = auth.uid()
  )
)
with check (
  bucket_id = 'image-manager-media'
  and (storage.foldername(name))[1] in (
    select tenant_id::text from public.memberships where user_id = auth.uid()
  )
);

drop policy if exists "image manager media delete" on storage.objects;
create policy "image manager media delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'image-manager-media'
  and (storage.foldername(name))[1] in (
    select tenant_id::text from public.memberships where user_id = auth.uid()
  )
);
