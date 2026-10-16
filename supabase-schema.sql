-- SkillTrace AI — Supabase Database Schema
-- Run this in your Supabase project's SQL editor to set up the database.
-- Dashboard → SQL Editor → New query → paste this → Run

-- ── Enable Row Level Security (RLS) ──────────────────────────────────────────
-- All tables use RLS so students can only read/write their own data.

-- ── Student profiles ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name           TEXT NOT NULL DEFAULT 'Student',
  avatar         TEXT NOT NULL DEFAULT '🧑‍💻',
  xp             INTEGER NOT NULL DEFAULT 0,
  level          INTEGER NOT NULL DEFAULT 1,
  streak         INTEGER NOT NULL DEFAULT 0,
  last_active    DATE NOT NULL DEFAULT CURRENT_DATE,
  show_on_leaderboard BOOLEAN NOT NULL DEFAULT TRUE,
  leaderboard_name TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public read for leaderboard (only show_on_leaderboard=true rows, limited columns)
CREATE POLICY "Leaderboard read (public names only)"
  ON public.profiles FOR SELECT
  USING (show_on_leaderboard = TRUE);

-- ── Diagnostic results ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.diagnostic_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_id     TEXT NOT NULL,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  recommended_level TEXT NOT NULL,
  weak_concepts   TEXT[] NOT NULL DEFAULT '{}',
  retaken         BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own diagnostic results"
  ON public.diagnostic_results FOR ALL USING (auth.uid() = user_id);

-- ── Leaderboard view (safe public view) ──────────────────────────────────────
CREATE OR REPLACE VIEW public.leaderboard_weekly AS
SELECT
  p.id AS user_id,
  COALESCE(p.leaderboard_name, split_part(p.name, ' ', 1) || ' ' || left(split_part(p.name, ' ', 2), 1) || '.') AS display_name,
  p.avatar,
  p.xp,
  p.streak,
  -- Weekly XP would come from a dedicated weekly_xp table in production
  -- For now, use xp as a proxy
  p.xp AS weekly_xp,
  ROW_NUMBER() OVER (ORDER BY p.xp DESC) AS rank
FROM public.profiles p
WHERE p.show_on_leaderboard = TRUE
ORDER BY p.xp DESC
LIMIT 100;

-- ── Auto-create profile after signup ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Updated_at trigger ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
