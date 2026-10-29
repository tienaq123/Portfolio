-- M7-T7: every change to a content table calls the site's /api/revalidate
-- (Supabase Database Webhooks), so edits made in Supabase Studio — and later
-- the CMS — reach the site without a redeploy.
--
-- URL and secret differ per environment, so they are not part of the
-- migration. Install (or move) the webhooks once per database:
--   select private.configure_content_webhooks(
--     'https://<site>/api/revalidate', '<REVALIDATE_SECRET>');
-- Remove them:
--   select private.configure_content_webhooks(null, null);

create extension if not exists pg_net with schema extensions;

-- Not exposed through the Data API (only `public` is).
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create function private.configure_content_webhooks(target_url text, secret text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  content_table text;
begin
  foreach content_table in array array[
    'site_profile', 'metrics', 'strengths', 'skill_categories', 'skills',
    'experiences', 'projects', 'project_sections', 'knowledge_entries'
  ] loop
    execute format(
      'drop trigger if exists revalidate_site on public.%I', content_table
    );
    if target_url is not null then
      -- Statement level: a bulk edit sends one request, not one per row.
      execute format(
        'create trigger revalidate_site after insert or update or delete on public.%I
           for each statement execute function supabase_functions.http_request(%L, %L, %L, %L, %L)',
        content_table,
        target_url,
        'POST',
        json_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || secret
        )::text,
        '{}',
        '5000'
      );
    end if;
  end loop;
end;
$$;

revoke all on function private.configure_content_webhooks(text, text)
  from public, anon, authenticated;
