-- HEARTH DATABASE SCHEMA

create extension if not exists "uuid-ossp";

-- User profiles
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique not null,
    display_name text,
    total_xp integer not null default 0,
    coins integer not null default 0,
    current_streak integer not null default 0,
    longest_streak integer not null default 0,
    last_active_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Life attributes
create table if not exists attributes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references profiles(id) on delete cascade,
    name text not null,
    level integer not null default 1,
    xp integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, name)
);

-- Tasks
create table if not exists tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references profiles(id) on delete cascade,
    title text not null,
    description text,
    category text,
    attribute_name text,
    xp_reward integer not null default 10,
    coin_reward integer not null default 0,
    completed boolean not null default false,
    due_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Task completion history
create table if not exists task_completions (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid not null references tasks(id) on delete cascade,
    user_id uuid not null references profiles(id) on delete cascade,
    xp_earned integer not null default 0,
    coins_earned integer not null default 0,
    completed_at timestamptz not null default now()
);

-- Wick companion
create table if not exists wick (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid unique not null references profiles(id) on delete cascade,
    stage text not null default 'Spark',
    mood text not null default 'neutral',
    energy integer not null default 100,
    bond integer not null default 0,
    last_interaction_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Wick memory
create table if not exists wick_memories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references profiles(id) on delete cascade,
    memory text not null,
    importance integer not null default 1,
    created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_tasks_user_id
on tasks(user_id);

create index if not exists idx_tasks_due_date
on tasks(due_date);

create index if not exists idx_completions_user_id
on task_completions(user_id);

create index if not exists idx_completions_task_id
on task_completions(task_id);

create index if not exists idx_wick_memories_user_id
on wick_memories(user_id);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table attributes enable row level security;
alter table tasks enable row level security;
alter table task_completions enable row level security;
alter table wick enable row level security;
alter table wick_memories enable row level security;

-- Profiles policies
create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- Attributes policies
create policy "Users can view own attributes"
on attributes for select
using (auth.uid() = user_id);

create policy "Users can manage own attributes"
on attributes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Tasks policies
create policy "Users can manage own tasks"
on tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Completion policies
create policy "Users can view own completions"
on task_completions for select
using (auth.uid() = user_id);

create policy "Users can create own completions"
on task_completions for insert
with check (auth.uid() = user_id);

-- Wick policies
create policy "Users can manage own Wick"
on wick for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Wick memory policies
create policy "Users can manage own Wick memories"
on wick_memories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
