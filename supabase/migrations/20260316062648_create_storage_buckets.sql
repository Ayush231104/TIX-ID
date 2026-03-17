insert into storage.buckets (id, name, public)
values ('movies_imgs', 'movies_imgs', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('news_Image', 'news_Image', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('brands_logos', 'brands_logos', true)
on conflict (id) do nothing;

-- public read policies for storage
drop policy if exists "Movies images are viewable by everyone" on storage.objects;
create policy "Movies images are viewable by everyone"
  on storage.objects for select to public
  using (bucket_id = 'movies_imgs');

drop policy if exists "News images are viewable by everyone" on storage.objects;
create policy "News images are viewable by everyone"
  on storage.objects for select to public
  using (bucket_id = 'news_Image');

drop policy if exists "Brands logos are viewable by everyone" on storage.objects;
create policy "Brands logos are viewable by everyone"
  on storage.objects for select to public
  using (bucket_id = 'brands_logos');

-- drop all old broken policies
drop policy if exists "Allow authenticated uploads 1tnhfnw_0" on storage.objects;
drop policy if exists "Allow authenticated uploads 1tnhfnw_1" on storage.objects;
drop policy if exists "Allow authenticated uploads 1tnhfnw_2" on storage.objects;
drop policy if exists "Allow authenticated uploads 1tnhfnw_3" on storage.objects;
drop policy if exists "Allow authenticated uploads bnbwlr_0" on storage.objects;
drop policy if exists "Allow authenticated uploads bnbwlr_1" on storage.objects;
drop policy if exists "Only super_admin can upload movie images" on storage.objects;
drop policy if exists "Only super_admin can update movie images" on storage.objects;
drop policy if exists "Only super_admin can delete movie images" on storage.objects;
drop policy if exists "Only super_admin can upload news images" on storage.objects;
drop policy if exists "Only super_admin can update news images" on storage.objects;
drop policy if exists "Only super_admin can delete news images" on storage.objects;
drop policy if exists "Only super_admin can upload brand logos" on storage.objects;
drop policy if exists "Only super_admin can update brand logos" on storage.objects;
drop policy if exists "Only super_admin can delete brand logos" on storage.objects;