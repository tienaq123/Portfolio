-- M7-T7 fix: the webhooks no longer depend on supabase_functions.http_request,
-- which hosted projects only have after enabling "Database Webhooks" in the
-- dashboard (local stacks always have it). The trigger calls pg_net directly,
-- and the URL and secret live in Supabase Vault instead of trigger arguments,
-- so the secret never appears in trigger definitions or error messages.
--
-- Install (or move, or rotate) once per database:
--   select private.configure_content_webhooks(
--     'https://<site>/api/revalidate', '<REVALIDATE_SECRET>');
-- Remove:
--   select private.configure_content_webhooks(null, null);

create function private.revalidate_site()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_url text;
  secret text;
begin
  select decrypted_secret into target_url
    from vault.decrypted_secrets where name = 'revalidate_url';
  select decrypted_secret into secret
    from vault.decrypted_secrets where name = 'revalidate_secret';
  if target_url is null or secret is null then
    return null;
  end if;

  -- Asynchronous: the write never waits for (or fails because of) the site.
  perform net.http_post(
    url := target_url,
    body := jsonb_build_object('table', tg_table_name, 'type', tg_op),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || secret
    ),
    timeout_milliseconds := 5000
  );
  return null;
end;
$$;

revoke all on function private.revalidate_site() from public, anon, authenticated;

create or replace function private.configure_content_webhooks(target_url text, secret text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  content_table text;
begin
  if (target_url is null) <> (secret is null) then
    raise exception 'pass both the URL and the secret, or neither';
  end if;

  delete from vault.secrets where name in ('revalidate_url', 'revalidate_secret');
  if target_url is not null then
    perform vault.create_secret(target_url, 'revalidate_url', 'Site endpoint for content webhooks (M7)');
    perform vault.create_secret(secret, 'revalidate_secret', 'Bearer secret for /api/revalidate (M7)');
  end if;

  foreach content_table in array array[
    'site_profile', 'metrics', 'strengths', 'skill_categories', 'skills',
    'experiences', 'projects', 'project_sections', 'knowledge_entries'
  ] loop
    execute format('drop trigger if exists revalidate_site on public.%I', content_table);
    if target_url is not null then
      -- Statement level: a bulk edit sends one request, not one per row.
      execute format(
        'create trigger revalidate_site after insert or update or delete on public.%I
           for each statement execute function private.revalidate_site()',
        content_table
      );
    end if;
  end loop;
end;
$$;

revoke all on function private.configure_content_webhooks(text, text)
  from public, anon, authenticated;
