-- HEARTH INITIAL DATABASE MIGRATION



-- PROFILES
create table if not exists public.profiles (
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

-- ATTRIBUTES
create table if not exists public.attributes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    level integer not null default 1,
    xp integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(user_id, name)
);

-- TASKS
create table if not exists public.tasks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
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

-- TASK COMPLETION HISTORY
create table if not exists public.task_completions (
    id uuid primary key default gen_random_uuid(),
    task_id uuid not null references public.tasks(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    xp_earned integer not null default 0,
    coins_earned integer not null default 0,
    completed_at timestamptz not null default now()
);

-- WICK
create table if not exists public.wick (
    id uuid primary key default gen_random_uuid(),
    user_id uuid unique not null references public.profiles(id) on delete cascade,
    stage text not null default 'Spark',
    mood text not null default 'neutral',
    energy integer not null default 100,
    bond integer not null default 0,
    last_interaction_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- WICK MEMORIES
create table if not exists public.wick_memories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    memory text not null,
    importance integer not null default 1,
    created_at timestamptz not null default now()
);

-- INDEXES
create index if not exists idx_attributes_user_id
    on public.attributes(user_id);

create index if not exists idx_tasks_user_id
    on public.tasks(user_id);

create index if not exists idx_tasks_due_date
    on public.tasks(due_date);

create index if not exists idx_completions_user_id
    on public.task_completions(user_id);

create index if not exists idx_completions_task_id
    on public.task_completions(task_id);

create index if not exists idx_wick_memories_user_id
    on public.wick_memories(user_id);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.attributes enable row level security;
alter table public.tasks enable row level security;
alter table public.task_completions enable row level security;
alter table public.wick enable row level security;
alter table public.wick_memories enable row level security;

-- PROFILE POLICIES
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- ATTRIBUTE POLICIES
create policy "Users can view their own attributes"
on public.attributes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can manage their own attributes"
on public.attributes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- TASK POLICIES
create policy "Users can view their own tasks"
on public.tasks
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can manage their own tasks"
on public.tasks
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- COMPLETION POLICIES
create policy "Users can view their own completions"
on public.task_completions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own completions"
on public.task_completions
for insert
to authenticated
with check (auth.uid() = user_id);

-- WICK POLICIES
create policy "Users can view their own Wick"
on public.wick
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can manage their own Wick"
on public.wick
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- WICK MEMORY POLICIES
create policy "Users can view their own Wick memories"
on public.wick_memories
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can manage their own Wick memories"
on public.wick_memories
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
