-- Create ministers table
create table public.ministers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  role text not null,
  availability jsonb default '{}'::jsonb,
  notes text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create liturgy_plans table
create table public.liturgy_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  date date not null,
  liturgy_type text not null default 'mass', -- mass, baptism, wedding, funeral, etc.
  prayers jsonb default '[]'::jsonb,
  preface text,
  readings jsonb default '[]'::jsonb,
  special_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create liturgical_calendar table
create table public.liturgical_calendar (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  date date not null,
  liturgical_season text, -- advent, christmas, lent, easter, ordinary
  liturgical_rank text, -- solemnity, feast, memorial, optional_memorial, weekday
  color text, -- white, red, green, purple, rose, black
  readings jsonb default '[]'::jsonb,
  special_prayers jsonb default '[]'::jsonb,
  notes text,
  is_custom boolean default true, -- false for universal calendar entries
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.ministers enable row level security;
alter table public.liturgy_plans enable row level security;
alter table public.liturgical_calendar enable row level security;

-- Create RLS policies for ministers
create policy "Users can view their own ministers" on public.ministers
  for select using (auth.uid() = user_id);

create policy "Users can insert their own ministers" on public.ministers
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own ministers" on public.ministers
  for update using (auth.uid() = user_id);

create policy "Users can delete their own ministers" on public.ministers
  for delete using (auth.uid() = user_id);

-- Create RLS policies for liturgy_plans
create policy "Users can view their own liturgy plans" on public.liturgy_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert their own liturgy plans" on public.liturgy_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own liturgy plans" on public.liturgy_plans
  for update using (auth.uid() = user_id);

create policy "Users can delete their own liturgy plans" on public.liturgy_plans
  for delete using (auth.uid() = user_id);

-- Create RLS policies for liturgical_calendar
create policy "Users can view their own calendar entries" on public.liturgical_calendar
  for select using (auth.uid() = user_id);

create policy "Users can insert their own calendar entries" on public.liturgical_calendar
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own calendar entries" on public.liturgical_calendar
  for update using (auth.uid() = user_id);

create policy "Users can delete their own calendar entries" on public.liturgical_calendar
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_ministers_user_id on public.ministers(user_id);
create index idx_ministers_role on public.ministers(role);
create index idx_liturgy_plans_user_id on public.liturgy_plans(user_id);
create index idx_liturgy_plans_date on public.liturgy_plans(date);
create index idx_liturgical_calendar_user_id on public.liturgical_calendar(user_id);
create index idx_liturgical_calendar_date on public.liturgical_calendar(date);