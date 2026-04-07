BEGIN;

-- 1. Create the junction table for likes
CREATE TABLE IF NOT EXISTS public.news_likes (
  user_id uuid references auth.users(id) on delete cascade not null,
  news_id uuid references public.news(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, news_id)
);

-- 2. Turn on Row Level Security (Crucial!)
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can see the likes (Public SELECT)
CREATE POLICY "Anyone can view likes"
  ON public.news_likes
  FOR SELECT
  TO public
  USING (true);

-- 4. Policy: Users can only add a like for themselves
CREATE POLICY "Users can insert their own likes"
  ON public.news_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Users can only remove their own likes (Needed for the toggle!)
CREATE POLICY "Users can delete their own likes"
  ON public.news_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Policy: Users can update their own likes (Added per your request, though rarely used for likes)
CREATE POLICY "Users can update their own likes"
  ON public.news_likes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;