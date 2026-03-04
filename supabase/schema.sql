-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Questions table
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  source_key text unique not null,
  category text not null,
  topic text,
  difficulty int default 1,
  question_text text not null,
  explanation text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Choices table
create table if not exists choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  choice_text text not null,
  is_correct boolean not null,
  sort_order int default 0
);

-- Exams table
create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text,
  status text default 'started', -- 'started', 'completed'
  score int default 0,
  total_questions int default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- Exam Questions table (links questions to an exam instance)
create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  sort_order int default 0
);

-- Exam Answers table (stores user answers)
create table if not exists exam_answers (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references exams(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  choice_id uuid references choices(id), -- Nullable for text answers if needed, but we focus on choices
  text_answer text, -- For fill-in-the-blank if needed
  is_correct boolean default false,
  answered_at timestamptz default now()
);

-- User Question Stats (for tracking progress/failures)
create table if not exists user_question_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  times_seen int default 0,
  times_correct int default 0,
  times_incorrect int default 0,
  last_seen_at timestamptz default now(),
  unique(user_id, question_id)
);

-- RLS Policies

-- Enable RLS
alter table questions enable row level security;
alter table choices enable row level security;
alter table exams enable row level security;
alter table exam_questions enable row level security;
alter table exam_answers enable row level security;
alter table user_question_stats enable row level security;

-- Questions & Choices: Public Read (or Authenticated Read)
create policy "Public questions are viewable by everyone" on questions for select using (true);
create policy "Public choices are viewable by everyone" on choices for select using (true);

-- Exams: Owner only
create policy "Users can view own exams" on exams for select using (auth.uid() = user_id);
create policy "Users can insert own exams" on exams for insert with check (auth.uid() = user_id);
create policy "Users can update own exams" on exams for update using (auth.uid() = user_id);

-- Exam Questions: Owner only (via exam)
create policy "Users can view own exam questions" on exam_questions for select using (
  exists (select 1 from exams where exams.id = exam_questions.exam_id and exams.user_id = auth.uid())
);
create policy "Users can insert own exam questions" on exam_questions for insert with check (
  exists (select 1 from exams where exams.id = exam_id and exams.user_id = auth.uid())
);

-- Exam Answers: Owner only (via exam)
create policy "Users can view own exam answers" on exam_answers for select using (
  exists (select 1 from exams where exams.id = exam_answers.exam_id and exams.user_id = auth.uid())
);
create policy "Users can insert own exam answers" on exam_answers for insert with check (
  exists (select 1 from exams where exams.id = exam_id and exams.user_id = auth.uid())
);

-- User Question Stats: Owner only
create policy "Users can view own stats" on user_question_stats for select using (auth.uid() = user_id);
create policy "Users can insert own stats" on user_question_stats for insert with check (auth.uid() = user_id);
create policy "Users can update own stats" on user_question_stats for update using (auth.uid() = user_id);
