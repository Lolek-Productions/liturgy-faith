-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create petitions table
create table public.petitions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  date date not null,
  language text not null default 'english',
  generated_content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create petition_contexts table
create table public.petition_contexts (
  id uuid default uuid_generate_v4() primary key,
  petition_id uuid references public.petitions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  sacraments_received jsonb default '[]'::jsonb,
  deaths_this_week jsonb default '[]'::jsonb,
  sick_members jsonb default '[]'::jsonb,
  special_petitions jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.petitions enable row level security;
alter table public.petition_contexts enable row level security;

-- Create RLS policies for petitions
create policy "Users can view their own petitions" on public.petitions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own petitions" on public.petitions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own petitions" on public.petitions
  for update using (auth.uid() = user_id);

create policy "Users can delete their own petitions" on public.petitions
  for delete using (auth.uid() = user_id);

-- Create RLS policies for petition_contexts
create policy "Users can view their own petition contexts" on public.petition_contexts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own petition contexts" on public.petition_contexts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own petition contexts" on public.petition_contexts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own petition contexts" on public.petition_contexts
  for delete using (auth.uid() = user_id);

-- Create indexes for better performance
create index idx_petitions_user_id on public.petitions(user_id);
create index idx_petitions_date on public.petitions(date);
create index idx_petition_contexts_petition_id on public.petition_contexts(petition_id);
create index idx_petition_contexts_user_id on public.petition_contexts(user_id);