-- Create petition_settings table
create table public.petition_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  daily_mass text not null default '',
  sunday_mass text not null default '',
  wedding text not null default '',
  funeral text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraint on user_id to ensure one settings record per user
alter table public.petition_settings add constraint petition_settings_user_id_unique unique (user_id);

-- Enable RLS
alter table public.petition_settings enable row level security;

-- Create RLS policies
create policy "Users can view their own petition settings" on public.petition_settings
  for select using (auth.uid() = user_id);

create policy "Users can insert their own petition settings" on public.petition_settings
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own petition settings" on public.petition_settings
  for update using (auth.uid() = user_id);

create policy "Users can delete their own petition settings" on public.petition_settings
  for delete using (auth.uid() = user_id);