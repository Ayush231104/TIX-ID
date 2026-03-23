-- Add latitude and longitude to theater table
alter table public.theater
  add column if not exists latitude  float8,
  add column if not exists longitude float8;