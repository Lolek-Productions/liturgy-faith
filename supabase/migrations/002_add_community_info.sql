-- Add community_info column to petition_contexts table
alter table public.petition_contexts 
add column community_info text;