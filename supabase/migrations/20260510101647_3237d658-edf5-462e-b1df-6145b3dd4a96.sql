
-- Users
CREATE TABLE public.users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Meeting tasks
CREATE TABLE public.meeting_tasks (
  id INTEGER PRIMARY KEY,
  task_type TEXT NOT NULL DEFAULT 'fixed',
  date TEXT,
  meeting_with TEXT,
  purpose TEXT,
  key_points TEXT,
  action_required TEXT,
  follow_up_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  remarks TEXT,
  responsible_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Yearly calendar
CREATE TABLE public.yearly_calendar (
  id INTEGER PRIMARY KEY,
  month TEXT,
  start_date TEXT,
  end_date TEXT,
  activity TEXT,
  category TEXT,
  responsible_id INTEGER,
  responsible_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly planner
CREATE TABLE public.weekly_planner (
  id INTEGER PRIMARY KEY,
  week TEXT,
  day TEXT,
  date TEXT,
  focus_area TEXT,
  task TEXT,
  priority TEXT,
  assigned_to_id INTEGER,
  assigned_to_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at trigger for meeting_tasks
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER meeting_tasks_set_updated_at
BEFORE UPDATE ON public.meeting_tasks
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS, allow all (internal admin tool)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yearly_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_planner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public all" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.meeting_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.yearly_calendar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public all" ON public.weekly_planner FOR ALL USING (true) WITH CHECK (true);

-- Seed default admin user
INSERT INTO public.users (id, name, role, email) VALUES (1, 'Admin User', 'admin', NULL);
