
-- Table for faculty to assign questions/topics to students
CREATE TABLE public.question_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject_id TEXT NOT NULL,
  topic_id TEXT,
  company_focus TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  assign_to TEXT NOT NULL DEFAULT 'all',
  assigned_student_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.question_assignments ENABLE ROW LEVEL SECURITY;

-- Faculty can manage their own assignments
CREATE POLICY "Faculty can create assignments"
  ON public.question_assignments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = faculty_id);

CREATE POLICY "Faculty can view own assignments"
  ON public.question_assignments FOR SELECT TO authenticated
  USING (
    auth.uid() = faculty_id 
    OR assign_to = 'all' 
    OR auth.uid() = ANY(assigned_student_ids)
  );

CREATE POLICY "Faculty can update own assignments"
  ON public.question_assignments FOR UPDATE TO authenticated
  USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can delete own assignments"
  ON public.question_assignments FOR DELETE TO authenticated
  USING (auth.uid() = faculty_id);

-- Table to track student learning progress
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  quiz_score INTEGER,
  quiz_total INTEGER,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id, topic_id)
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Students can manage their own progress
CREATE POLICY "Users can insert own progress"
  ON public.student_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.student_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress"
  ON public.student_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Faculty can view all student progress
CREATE POLICY "Faculty can view all progress"
  ON public.student_progress FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'faculty'
    )
  );
