-- Create diaries table
CREATE TABLE IF NOT EXISTS public.diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_color TEXT DEFAULT 'purple',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create entries table
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diary_id UUID NOT NULL REFERENCES public.diaries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for diaries
CREATE POLICY "Users can view their own diaries" ON public.diaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diaries" ON public.diaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diaries" ON public.diaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diaries" ON public.diaries
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for entries
CREATE POLICY "Users can view their own entries" ON public.entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" ON public.entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON public.entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON public.entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diaries_user_id ON public.diaries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_diary_id ON public.entries(diary_id);
CREATE INDEX IF NOT EXISTS idx_entries_user_id ON public.entries(user_id);
