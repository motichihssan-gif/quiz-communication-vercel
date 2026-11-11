-- À exécuter une seule fois dans Supabase > SQL Editor.
create table if not exists public.quiz_answers (
  id bigint generated always as identity primary key,
  student_id text not null,
  student_name text not null,
  question_id integer not null check (question_id between 1 and 10),
  choice integer not null check (choice between -1 and 3),
  is_correct boolean not null,
  elapsed_ms integer not null,
  answered_at timestamptz not null default now(),
  unique(student_id, question_id)
);

create table if not exists public.quiz_bonus_winners (
  question_id integer primary key check (question_id between 1 and 10),
  student_id text not null,
  student_name text not null,
  won_at timestamptz not null default now()
);

-- L'insertion du gagnant est atomique : un seul étudiant peut gagner chaque bonus.
create or replace function public.submit_quiz_answer(
  p_student_id text,
  p_student_name text,
  p_question_id integer,
  p_choice integer,
  p_is_correct boolean,
  p_elapsed_ms integer
) returns table(bonus_awarded boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
  did_win boolean := false;
begin
  insert into public.quiz_answers(student_id,student_name,question_id,choice,is_correct,elapsed_ms)
  values(p_student_id,p_student_name,p_question_id,p_choice,p_is_correct,p_elapsed_ms)
  on conflict(student_id,question_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then
    raise exception 'Réponse déjà enregistrée pour cette question.';
  end if;
  if p_is_correct then
    insert into public.quiz_bonus_winners(question_id,student_id,student_name)
    values(p_question_id,p_student_id,p_student_name)
    on conflict(question_id) do nothing;
    get diagnostics inserted_count = row_count;
    did_win := inserted_count = 1;
  end if;
  return query select did_win;
end;
$$;

create or replace view public.quiz_leaderboard as
with answer_scores as (
  select student_id, max(student_name) as student_name,
         count(*) filter (where is_correct)::integer as correct_count
  from public.quiz_answers
  group by student_id
),
bonus_scores as (
  select student_id, count(*)::integer as bonus_count
  from public.quiz_bonus_winners
  group by student_id
)
select a.student_id, a.student_name, a.correct_count,
       coalesce(b.bonus_count, 0)::integer as bonus_count,
       (a.correct_count + coalesce(b.bonus_count, 0))::integer as total_score
from answer_scores a
left join bonus_scores b on b.student_id = a.student_id;

-- Les tables ne sont jamais accessibles directement depuis le navigateur.
alter table public.quiz_answers enable row level security;
alter table public.quiz_bonus_winners enable row level security;
