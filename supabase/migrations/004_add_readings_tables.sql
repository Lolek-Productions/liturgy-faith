-- Create reading_collections table (for grouping readings by occasion)
create table public.reading_collections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  occasion_type text not null, -- 'wedding', 'funeral', 'baptism', 'confirmation', 'mass', 'other'
  is_template boolean default false, -- true for pre-made templates, false for user collections
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create individual_readings table (store actual reading content)
create table public.individual_readings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  pericope text not null, -- e.g., "Genesis 1:26-28, 31a", "Psalm 23:1-3, 4, 5, 6"
  title text not null, -- e.g., "The Creation Account", "The Lord is My Shepherd"
  category text not null, -- 'marriage-1', 'marriage-psalm', 'funeral-gospel', etc.
  translation_id integer default 1, -- 1=NABRE, 2=RSV, etc.
  sort_order integer default 1, -- ordering within category
  introduction text, -- liturgical introduction text
  reading_text text not null, -- actual text of the reading
  conclusion text, -- liturgical conclusion/response
  is_template boolean default false, -- true for pre-loaded readings, false for user additions
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reading_collection_items table (many-to-many relationship)
create table public.reading_collection_items (
  id uuid default uuid_generate_v4() primary key,
  collection_id uuid references public.reading_collections(id) on delete cascade not null,
  reading_id uuid references public.individual_readings(id) on delete cascade not null,
  position integer not null default 1, -- order within the collection
  lector_name text, -- assigned lector for this reading
  do_not_print boolean default false, -- exclude from printed programs
  notes text, -- specific notes for this reading in this collection
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(collection_id, reading_id)
);

-- Enable Row Level Security
alter table public.reading_collections enable row level security;
alter table public.individual_readings enable row level security;
alter table public.reading_collection_items enable row level security;

-- Create RLS policies for reading_collections
create policy "Users can view their own reading collections" on public.reading_collections
  for select using (auth.uid() = user_id OR is_template = true);

create policy "Users can insert their own reading collections" on public.reading_collections
  for insert with check (auth.uid() = user_id OR (is_template = true AND user_id IS NULL));

create policy "Users can update their own reading collections" on public.reading_collections
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reading collections" on public.reading_collections
  for delete using (auth.uid() = user_id);

-- Create RLS policies for individual_readings
create policy "Users can view their own readings and templates" on public.individual_readings
  for select using (auth.uid() = user_id OR is_template = true);

create policy "Users can insert their own readings" on public.individual_readings
  for insert with check (auth.uid() = user_id OR (is_template = true AND user_id IS NULL));

create policy "Users can update their own readings" on public.individual_readings
  for update using (auth.uid() = user_id);

create policy "Users can delete their own readings" on public.individual_readings
  for delete using (auth.uid() = user_id);

-- Create RLS policies for reading_collection_items
create policy "Users can view items in collections they can see" on public.reading_collection_items
  for select using (
    exists (
      select 1 from public.reading_collections rc
      where rc.id = collection_id
      and (rc.user_id = auth.uid() OR rc.is_template = true)
    )
  );

create policy "Users can insert items in their own collections" on public.reading_collection_items
  for insert with check (
    exists (
      select 1 from public.reading_collections rc
      where rc.id = collection_id
      and rc.user_id = auth.uid()
    )
  );

create policy "Users can update items in their own collections" on public.reading_collection_items
  for update using (
    exists (
      select 1 from public.reading_collections rc
      where rc.id = collection_id
      and rc.user_id = auth.uid()
    )
  );

create policy "Users can delete items in their own collections" on public.reading_collection_items
  for delete using (
    exists (
      select 1 from public.reading_collections rc
      where rc.id = collection_id
      and rc.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index idx_reading_collections_user_id on public.reading_collections(user_id);
create index idx_reading_collections_occasion_type on public.reading_collections(occasion_type);
create index idx_individual_readings_user_id on public.individual_readings(user_id);
create index idx_individual_readings_category on public.individual_readings(category);
create index idx_individual_readings_translation on public.individual_readings(translation_id);
create index idx_individual_readings_pericope on public.individual_readings(pericope);
create index idx_individual_readings_sort_order on public.individual_readings(sort_order);
create index idx_reading_collection_items_collection_id on public.reading_collection_items(collection_id);
create index idx_reading_collection_items_reading_id on public.reading_collection_items(reading_id);
create index idx_reading_collection_items_position on public.reading_collection_items(position);

-- Insert some template reading collections and individual readings
INSERT INTO public.reading_collections (id, user_id, name, description, occasion_type, is_template, created_at, updated_at) 
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', NULL, 'Traditional Wedding Readings', 'Classic biblical readings suitable for Catholic wedding ceremonies', 'wedding', true, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440002', NULL, 'Funeral Mass Readings', 'Comforting readings for funeral liturgies', 'funeral', true, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440003', NULL, 'Baptism Readings', 'Readings celebrating new life in Christ', 'baptism', true, now(), now());

-- Insert some template individual readings following liturgical patterns
INSERT INTO public.individual_readings (id, user_id, pericope, title, category, translation_id, sort_order, introduction, reading_text, conclusion, is_template, created_at, updated_at)
VALUES 
  -- Marriage First Readings
  ('660e8400-e29b-41d4-a716-446655440001', NULL, 'Genesis 1:26-28, 31a', 'The Creation of Man and Woman', 'marriage-1', 1, 1, 'A reading from the Book of Genesis.', 'Then God said: Let us make human beings in our image, after our likeness. Let them have dominion over the fish of the sea, the birds of the air, the tame animals, all the wild animals, and all the creatures that crawl on the earth. God created mankind in his image; in the image of God he created them; male and female he created them. God blessed them and God said to them: Be fertile and multiply; fill the earth and subdue it. God looked at everything he had made, and found it very good.', 'The word of the Lord.', true, now(), now()),
  
  -- Marriage Second Readings
  ('660e8400-e29b-41d4-a716-446655440002', NULL, '1 Corinthians 13:4-8a', 'Love is Patient and Kind', 'marriage-2', 1, 1, 'A reading from the first Letter of Saint Paul to the Corinthians.', 'Love is patient, love is kind. It is not jealous, it is not pompous, it is not inflated, it is not rude, it does not seek its own interests, it is not quick-tempered, it does not brood over injury, it does not rejoice over wrongdoing but rejoices with the truth. It bears all things, believes all things, hopes all things, endures all things. Love never fails.', 'The word of the Lord.', true, now(), now()),
  
  -- Marriage Psalms
  ('660e8400-e29b-41d4-a716-446655440003', NULL, 'Psalm 128:1-2, 3, 4-5ac and 6a', 'Blessed are Those Who Fear the Lord', 'marriage-psalm', 1, 1, NULL, 'R. Blessed are those who fear the Lord and walk in his ways.\n\nBlessed is everyone who fears the LORD,\n    who walks in his ways!\nFor you shall eat the fruit of your handiwork;\n    blessed shall you be, and favored. R.\n\nYour wife shall be like a fruitful vine\n    in the recesses of your home;\nYour children like olive plants\n    around your table. R.\n\nBehold, thus is the man blessed\n    who fears the LORD.\nThe LORD bless you from Zion:\n    may you see the prosperity of Jerusalem\n    all the days of your life\nMay you see your children''s children. R.', NULL, true, now(), now()),
  
  -- Marriage Gospel
  ('660e8400-e29b-41d4-a716-446655440004', NULL, 'Matthew 19:3-6', 'What God Has Joined', 'marriage-gospel', 1, 1, 'A reading from the holy Gospel according to Matthew.', 'Some Pharisees approached Jesus, and tested him, saying, "Is it lawful for a man to divorce his wife for any cause whatever?" He said in reply, "Have you not read that from the beginning the Creator made them male and female and said, For this reason a man shall leave his father and mother and be joined to his wife, and the two shall become one flesh? So they are no longer two, but one flesh. Therefore, what God has joined together, man must not separate."', 'The Gospel of the Lord.', true, now(), now()),
  
  -- Funeral Gospel
  ('660e8400-e29b-41d4-a716-446655440005', NULL, 'John 14:1-6', 'In My Father''s House Are Many Dwelling Places', 'funeral-gospel', 1, 1, 'A reading from the holy Gospel according to John.', 'Jesus said to his disciples: "Do not let your hearts be troubled. You have faith in God; have faith also in me. In my Father''s house there are many dwelling places. If there were not, would I have told you that I am going to prepare a place for you? And if I go and prepare a place for you, I will come back again and take you to myself, so that where I am you also may be. Where I am going you know the way." Thomas said to him, "Master, we do not know where you are going; how can we know the way?" Jesus said to him, "I am the way and the truth and the life. No one comes to the Father except through me."', 'The Gospel of the Lord.', true, now(), now());

-- Link template readings to collections
INSERT INTO public.reading_collection_items (collection_id, reading_id, position, lector_name, notes)
VALUES 
  -- Traditional Wedding Readings collection
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1, NULL, 'First Reading: The Creation of Man and Woman'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 2, NULL, 'Responsorial Psalm: Blessed are Those Who Fear the Lord'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 3, NULL, 'Second Reading: Love is Patient and Kind'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 4, NULL, 'Gospel: What God Has Joined'),
  
  -- Funeral Mass Readings collection
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', 1, NULL, 'Gospel: In My Father''s House Are Many Dwelling Places');