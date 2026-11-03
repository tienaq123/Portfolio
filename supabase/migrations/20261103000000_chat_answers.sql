-- The owner reviews conversations in /admin: keep the assistant's answer next
-- to each question (same 30-day retention). Answers are generated text from
-- public portfolio content, not visitor data.
alter table public.chat_questions
  add column answer text check (answer is null or char_length(answer) <= 8000);
