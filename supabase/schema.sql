-- ============================================================
-- VIBE CHECK — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- 1. Profiles (extends auth.users)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  last_check_in DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- 2. Inventory Items
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('closet', 'fridge')) NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_user_category
  ON public.inventory_items(user_id, category);

-- RLS
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own inventory"
  ON public.inventory_items FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- 3. Daily Vibes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_vibes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  weather_condition TEXT,
  weather_temp INTEGER,
  outfit_pick TEXT NOT NULL,
  meal_pick TEXT NOT NULL,
  watch_pick TEXT NOT NULL,
  gpt_prompt_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate vibes on the same day
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_vibes_user_date
  ON public.daily_vibes(user_id, date DESC);

-- RLS
ALTER TABLE public.daily_vibes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own vibes"
  ON public.daily_vibes FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- 4. Community Vibes (Opt-in shared feed based on mood)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_vibes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  username TEXT DEFAULT 'Anonymous Vibe',
  avatar_emoji TEXT DEFAULT '⚡',
  mood TEXT NOT NULL,
  outfit_pick TEXT NOT NULL,
  meal_pick TEXT NOT NULL,
  watch_pick TEXT NOT NULL,
  vibe_note TEXT,
  likes_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_vibes_mood_created
  ON public.community_vibes(mood, created_at DESC);

-- RLS: Public read, open insert
ALTER TABLE public.community_vibes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read community vibes"
  ON public.community_vibes FOR SELECT USING (true);
CREATE POLICY "Anyone can share a vibe to community"
  ON public.community_vibes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update likes on community vibes"
  ON public.community_vibes FOR UPDATE USING (true);

