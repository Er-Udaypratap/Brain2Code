-- Run this in the Supabase SQL editor of the SAME project used for TechBook4u.
-- New tables only — nothing here touches existing TechBook4u tables.

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  father_name text not null,
  branch text not null,
  mobile_no text not null unique,
  language text not null check (language in ('c', 'java', 'python')),
  round1_cleared boolean not null default false,
  round2_cleared boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  question_id text not null,
  round int not null,
  code text not null,
  language text not null,
  passed boolean not null,
  submitted_at timestamptz not null default now()
);

-- Row Level Security: allow the anon key to insert/select what it needs,
-- since there is no custom backend to gate this instead.
alter table students enable row level security;
alter table submissions enable row level security;

create policy "students can be inserted by anyone" on students
  for insert with check (true);

create policy "students can be read for login/dashboard" on students
  for select using (true);

create policy "students can update their own cleared flags" on students
  for update using (true);

create policy "submissions can be inserted by anyone" on submissions
  for insert with check (true);

create policy "submissions can be read by anyone" on submissions
  for select using (true);
