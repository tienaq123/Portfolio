-- M7: portfolio content. Columns mirror lib/content/schema.ts (camelCase there,
-- snake_case here); the app validates every row with those Zod schemas on read.
-- Localized text is jsonb {"en": "...", "vi": "..."}. Ids are the stable text
-- ids of the seed data ("prep4u", "protean"…), so seeds are deterministic.

-- ── Helpers ─────────────────────────────────────────────────────────────────

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- {"en": non-empty string, "vi": non-empty string}
create function public.is_localized(value jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_typeof(value) = 'object'
    and jsonb_typeof(value -> 'en') = 'string'
    and jsonb_typeof(value -> 'vi') = 'string'
    and length(trim(value ->> 'en')) > 0
    and length(trim(value ->> 'vi')) > 0;
$$;

-- ── Admins (used by M8) ─────────────────────────────────────────────────────

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ── Content tables ──────────────────────────────────────────────────────────

create table public.site_profile (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  alternate_name text not null,
  role jsonb not null check (public.is_localized(role)),
  availability jsonb check (availability is null or public.is_localized(availability)),
  headline jsonb not null check (public.is_localized(headline)),
  headline_accent jsonb check (headline_accent is null or public.is_localized(headline_accent)),
  summary jsonb not null check (public.is_localized(summary)),
  location jsonb not null check (public.is_localized(location)),
  links jsonb not null check (jsonb_typeof(links) = 'object'),
  photo jsonb check (photo is null or jsonb_typeof(photo) = 'object'),
  cv jsonb not null check (jsonb_typeof(cv) = 'object'),
  hero jsonb not null check (jsonb_typeof(hero) = 'object'),
  updated_at timestamptz not null default now()
);

create table public.metrics (
  id text primary key,
  value text not null check (length(value) > 0),
  label jsonb not null check (public.is_localized(label)),
  description jsonb check (description is null or public.is_localized(description)),
  icon_key text not null check (icon_key in ('calendar', 'users', 'code', 'box')),
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.strengths (
  id text primary key,
  title jsonb not null check (public.is_localized(title)),
  description jsonb not null check (public.is_localized(description)),
  icon_key text not null check (icon_key in ('layers', 'code', 'brain', 'cloud')),
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skill_categories (
  key text primary key,
  label jsonb not null check (public.is_localized(label)),
  sort_order int not null default 0
);

create table public.skills (
  name text primary key,
  category_key text not null references public.skill_categories (key) on update cascade,
  sort_order int not null default 0,
  published boolean not null default false
);

create table public.experiences (
  id text primary key,
  type text not null check (type in ('work', 'education')),
  organization jsonb not null check (public.is_localized(organization)),
  role jsonb not null check (public.is_localized(role)),
  start_date text not null check (start_date ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  end_date text check (end_date ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  highlights jsonb not null default '[]' check (jsonb_typeof(highlights) = 'array'),
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id text primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  experience_id text references public.experiences (id) on delete set null,
  title text not null check (length(title) > 0),
  tags jsonb not null default '[]' check (jsonb_typeof(tags) = 'array'),
  summary jsonb not null check (public.is_localized(summary)),
  highlights jsonb not null default '[]' check (jsonb_typeof(highlights) = 'array'),
  tech_stack text[] not null check (cardinality(tech_stack) > 0),
  role jsonb not null check (public.is_localized(role)),
  team_size text not null,
  timeline jsonb not null check (public.is_localized(timeline)),
  status text check (status in ('production', 'internal', 'archived')),
  live_url text check (live_url ~ '^https?://'),
  thumbnail jsonb check (thumbnail is null or jsonb_typeof(thumbnail) = 'object'),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  impact_statement jsonb check (impact_statement is null or public.is_localized(impact_statement)),
  key_metrics jsonb not null default '[]' check (jsonb_typeof(key_metrics) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id text not null references public.projects (id) on delete cascade,
  type text not null check (type in (
    'context', 'problem', 'responsibility', 'constraints', 'architecture',
    'decisions', 'tradeoffs', 'implementation', 'results', 'learnings', 'gallery'
  )),
  title jsonb check (title is null or public.is_localized(title)),
  body jsonb not null check (public.is_localized(body)),
  media jsonb not null default '[]' check (jsonb_typeof(media) = 'array'),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, type)
);

-- Assistant-only facts, English (D11). Only public_ai entries are readable.
create table public.knowledge_entries (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  title jsonb not null check (public.is_localized(title)),
  summary text not null check (length(trim(summary)) > 0),
  facts text[] not null check (cardinality(facts) > 0),
  visibility text not null check (visibility in ('public_ai', 'private')),
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Indexes ─────────────────────────────────────────────────────────────────

create index metrics_order_idx on public.metrics (published, sort_order);
create index strengths_order_idx on public.strengths (published, sort_order);
create index skills_category_idx on public.skills (category_key, sort_order);
create index experiences_order_idx on public.experiences (published, sort_order);
create index projects_order_idx on public.projects (published, sort_order);
create index projects_experience_idx on public.projects (experience_id);
create index project_sections_project_idx on public.project_sections (project_id, sort_order);

-- ── updated_at triggers ─────────────────────────────────────────────────────

create trigger site_profile_updated_at before update on public.site_profile
  for each row execute function public.set_updated_at();
create trigger metrics_updated_at before update on public.metrics
  for each row execute function public.set_updated_at();
create trigger strengths_updated_at before update on public.strengths
  for each row execute function public.set_updated_at();
create trigger experiences_updated_at before update on public.experiences
  for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();
create trigger project_sections_updated_at before update on public.project_sections
  for each row execute function public.set_updated_at();
create trigger knowledge_entries_updated_at before update on public.knowledge_entries
  for each row execute function public.set_updated_at();

-- ── Privileges ──────────────────────────────────────────────────────────────
-- Explicit, rather than relying on the project's default grants: visitors
-- (anon) may only read; signed-in users may write, and RLS narrows that to
-- admins. RLS below decides which rows.

revoke all on
  public.site_profile, public.metrics, public.strengths, public.skill_categories,
  public.skills, public.experiences, public.projects, public.project_sections,
  public.knowledge_entries, public.admin_users
from anon, authenticated;

grant select on
  public.site_profile, public.metrics, public.strengths, public.skill_categories,
  public.skills, public.experiences, public.projects, public.project_sections,
  public.knowledge_entries
to anon, authenticated;

grant insert, update, delete on
  public.site_profile, public.metrics, public.strengths, public.skill_categories,
  public.skills, public.experiences, public.projects, public.project_sections,
  public.knowledge_entries
to authenticated;

grant select on public.admin_users to authenticated;

-- ── Row level security ──────────────────────────────────────────────────────

alter table public.site_profile enable row level security;
alter table public.metrics enable row level security;
alter table public.strengths enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.projects enable row level security;
alter table public.project_sections enable row level security;
alter table public.knowledge_entries enable row level security;
alter table public.admin_users enable row level security;

-- Always readable.
create policy "site profile is public" on public.site_profile
  for select to anon, authenticated using (true);
create policy "skill categories are public" on public.skill_categories
  for select to anon, authenticated using (true);

-- Readable once published.
create policy "published metrics are public" on public.metrics
  for select to anon, authenticated using (published);
create policy "published strengths are public" on public.strengths
  for select to anon, authenticated using (published);
create policy "published skills are public" on public.skills
  for select to anon, authenticated using (published);
create policy "published experiences are public" on public.experiences
  for select to anon, authenticated using (published);
create policy "published projects are public" on public.projects
  for select to anon, authenticated using (published);
create policy "sections of published projects are public" on public.project_sections
  for select to anon, authenticated using (
    exists (
      select 1 from public.projects
      where projects.id = project_sections.project_id and projects.published
    )
  );
create policy "public knowledge is readable" on public.knowledge_entries
  for select to anon, authenticated using (published and visibility = 'public_ai');

-- Admins manage everything (M8).
create policy "admins manage site profile" on public.site_profile
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage metrics" on public.metrics
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage strengths" on public.strengths
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage skill categories" on public.skill_categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage skills" on public.skills
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage experiences" on public.experiences
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage projects" on public.projects
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage project sections" on public.project_sections
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins manage knowledge" on public.knowledge_entries
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admins see admins" on public.admin_users
  for select to authenticated using ((select public.is_admin()));

-- Stored chat questions (M6) become readable to admins (M8); still no public
-- access. Only the server writes them, with the secret key.
revoke all on public.chat_questions from anon, authenticated;
grant select on public.chat_questions to authenticated;
create policy "admins read chat questions" on public.chat_questions
  for select to authenticated using ((select public.is_admin()));
