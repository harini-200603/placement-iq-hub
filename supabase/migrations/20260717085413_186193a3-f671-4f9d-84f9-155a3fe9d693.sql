
-- Helper: updated_at trigger already exists as public.update_updated_at_column()

-- Faculty role check helper (based on profiles.role)
CREATE OR REPLACE FUNCTION public.is_faculty(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND role = 'faculty'
  )
$$;

-- =========================================================
-- 1. AI CHAT HISTORY
-- =========================================================
CREATE TABLE public.ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id uuid NOT NULL DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  context text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_chat_user_thread ON public.ai_chat_history(user_id, thread_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_chat_history TO authenticated;
GRANT ALL ON public.ai_chat_history TO service_role;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_ai_chat" ON public.ai_chat_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- 2. MISTAKE NOTEBOOK
-- =========================================================
CREATE TABLE public.mistake_notebook (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text,
  question text NOT NULL,
  user_answer text,
  correct_answer text,
  explanation text,
  difficulty text,
  reviewed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_mistake_user ON public.mistake_notebook(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mistake_notebook TO authenticated;
GRANT ALL ON public.mistake_notebook TO service_role;
ALTER TABLE public.mistake_notebook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_mistakes" ON public.mistake_notebook
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "faculty_read_mistakes" ON public.mistake_notebook
  FOR SELECT USING (public.is_faculty(auth.uid()));
CREATE TRIGGER trg_mistake_updated BEFORE UPDATE ON public.mistake_notebook
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 3. ATTENDANCE
-- =========================================================
CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'present' CHECK (status IN ('present','absent','late')),
  marked_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);
CREATE INDEX idx_attendance_user_date ON public.attendance(user_id, date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_attendance_read" ON public.attendance
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "faculty_manage_attendance" ON public.attendance
  FOR ALL USING (public.is_faculty(auth.uid())) WITH CHECK (public.is_faculty(auth.uid()));

-- =========================================================
-- 4. STUDY SESSIONS
-- =========================================================
CREATE TABLE public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text,
  duration_minutes integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_study_user_started ON public.study_sessions(user_id, started_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_sessions TO authenticated;
GRANT ALL ON public.study_sessions TO service_role;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_study" ON public.study_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "faculty_read_study" ON public.study_sessions
  FOR SELECT USING (public.is_faculty(auth.uid()));

-- =========================================================
-- 5. COMPANY READINESS
-- =========================================================
CREATE TABLE public.company_readiness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company text NOT NULL,
  readiness_score integer NOT NULL DEFAULT 0 CHECK (readiness_score BETWEEN 0 AND 100),
  strengths jsonb DEFAULT '[]'::jsonb,
  gaps jsonb DEFAULT '[]'::jsonb,
  last_evaluated_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, company)
);
CREATE INDEX idx_readiness_user ON public.company_readiness(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_readiness TO authenticated;
GRANT ALL ON public.company_readiness TO service_role;
ALTER TABLE public.company_readiness ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_readiness" ON public.company_readiness
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "faculty_read_readiness" ON public.company_readiness
  FOR SELECT USING (public.is_faculty(auth.uid()));
CREATE TRIGGER trg_readiness_updated BEFORE UPDATE ON public.company_readiness
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 6. BADGES + USER BADGES
-- =========================================================
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  icon text,
  criteria jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.badges TO authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "faculty_write_badges" ON public.badges
  FOR ALL USING (public.is_faculty(auth.uid())) WITH CHECK (public.is_faculty(auth.uid()));

CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
GRANT SELECT, INSERT ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_user_badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id OR public.is_faculty(auth.uid()));
CREATE POLICY "insert_own_user_badges" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_faculty(auth.uid()));

-- =========================================================
-- 7. STREAKS
-- =========================================================
CREATE TABLE public.streaks (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_active_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.streaks TO authenticated;
GRANT ALL ON public.streaks TO service_role;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_streak" ON public.streaks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "faculty_read_streak" ON public.streaks
  FOR SELECT USING (public.is_faculty(auth.uid()));
CREATE TRIGGER trg_streaks_updated BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- 8. NOTIFICATIONS
-- =========================================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'info',
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "faculty_send_notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.is_faculty(auth.uid()));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- =========================================================
-- Seed a few default badges
-- =========================================================
INSERT INTO public.badges (code, name, description, icon) VALUES
  ('first_test', 'First Test', 'Completed your first mock test', 'trophy'),
  ('week_streak', '7-Day Streak', 'Studied 7 days in a row', 'flame'),
  ('mistake_master', 'Mistake Master', 'Reviewed 50 mistakes', 'brain'),
  ('company_ready', 'Company Ready', 'Reached 80% readiness for a company', 'briefcase')
ON CONFLICT (code) DO NOTHING;
