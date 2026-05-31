-- Add demographic columns to profiles for department-wise analytics
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS college text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS phone text;

-- Update the new-user trigger to capture department/college/state/phone metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, username, role, register_number, department, college, state, phone, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
        NEW.raw_user_meta_data->>'register_number',
        NEW.raw_user_meta_data->>'department',
        NEW.raw_user_meta_data->>'college',
        NEW.raw_user_meta_data->>'state',
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$function$;

-- ============ FACULTY ANNOUNCEMENTS ============
CREATE TABLE public.faculty_announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  category text NOT NULL DEFAULT 'general',
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.faculty_announcements TO authenticated;
GRANT ALL ON public.faculty_announcements TO service_role;

ALTER TABLE public.faculty_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view announcements"
  ON public.faculty_announcements FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Faculty can create announcements"
  ON public.faculty_announcements FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = faculty_id AND EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'faculty'::user_role));

CREATE POLICY "Faculty can update own announcements"
  ON public.faculty_announcements FOR UPDATE TO authenticated
  USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can delete own announcements"
  ON public.faculty_announcements FOR DELETE TO authenticated
  USING (auth.uid() = faculty_id);

CREATE TRIGGER update_faculty_announcements_updated_at
  BEFORE UPDATE ON public.faculty_announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PLACEMENT DRIVES ============
CREATE TABLE public.placement_drives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id uuid NOT NULL,
  company text NOT NULL,
  role_title text,
  package_lpa numeric,
  drive_date timestamptz,
  eligibility_cgpa numeric,
  min_readiness integer DEFAULT 0,
  status text NOT NULL DEFAULT 'upcoming',
  description text,
  shortlisted_ids uuid[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.placement_drives TO authenticated;
GRANT ALL ON public.placement_drives TO service_role;

ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view drives"
  ON public.placement_drives FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Faculty can create drives"
  ON public.placement_drives FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = faculty_id AND EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'faculty'::user_role));

CREATE POLICY "Faculty can update own drives"
  ON public.placement_drives FOR UPDATE TO authenticated
  USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can delete own drives"
  ON public.placement_drives FOR DELETE TO authenticated
  USING (auth.uid() = faculty_id);

CREATE TRIGGER update_placement_drives_updated_at
  BEFORE UPDATE ON public.placement_drives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();