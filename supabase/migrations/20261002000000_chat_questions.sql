-- M6-T6: questions asked to the portfolio assistant (D7).
-- Stores the question only: no IP address, no answer. Kept for 30 days.

create table public.chat_questions (
  id uuid primary key,
  session_id uuid not null,
  question text not null check (char_length(question) <= 500),
  locale text not null check (locale in ('en', 'vi')),
  sources text[] not null default '{}',
  was_fallback boolean not null default false,
  rating smallint check (rating in (-1, 1)),
  created_at timestamptz not null default now()
);

create index chat_questions_created_at_idx on public.chat_questions (created_at);

-- RLS on with no policies: the anon and authenticated roles can do nothing.
-- Only the server, using the secret key, reads and writes this table.
alter table public.chat_questions enable row level security;

-- Daily retention job. pg_cron must be enabled for the project
-- (Dashboard → Database → Extensions, or the statement below).
create extension if not exists pg_cron;

select cron.schedule(
  'chat-questions-retention',
  '15 3 * * *',
  $$delete from public.chat_questions where created_at < now() - interval '30 days'$$
);
