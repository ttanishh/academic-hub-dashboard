export type Status = "pending" | "in_progress" | "done" | "blocked" | "cancelled";

export type Meeting = {
  id: number;
  task_type: "fixed" | "variable" | string;
  date: string | null;
  meeting_with: string | null;
  purpose: string | null;
  key_points: string | null;
  action_required: string | null;
  follow_up_date: string | null;
  status: Status | string;
  remarks: string | null;
  responsible_id: number | null;
};

export type User = {
  id: number;
  name: string;
  role: string | null;
  email: string | null;
};

export type YearlyRow = {
  id: number;
  month: string | null;
  start_date: string | null;
  end_date: string | null;
  activity: string | null;
  category: string | null;
  responsible_id: number | null;
  responsible_name: string | null;
  status: string;
  remarks: string | null;
};

export type WeeklyRow = {
  id: number;
  week: string | null;
  day: string | null;
  date: string | null;
  focus_area: string | null;
  task: string | null;
  priority: string | null;
  assigned_to_id: number | null;
  assigned_to_name: string | null;
  status: string;
  notes: string | null;
};

export const STATUSES: Status[] = ["pending", "in_progress", "done", "blocked", "cancelled"];

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
  blocked: "Blocked",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  done: "bg-emerald-100 text-emerald-800 border-emerald-200",
  blocked: "bg-rose-100 text-rose-800 border-rose-200",
  cancelled: "bg-zinc-100 text-zinc-700 border-zinc-200",
};
