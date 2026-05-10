import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Meeting, User, YearlyRow, WeeklyRow } from "./planner-types";

export function useMeetings() {
  return useQuery<Meeting[]>({
    queryKey: ["meetings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("meeting_tasks").select("*").order("date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Meeting[];
    },
  });
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("users").select("*").order("id");
      if (error) throw error;
      return (data ?? []) as User[];
    },
  });
}

export function useYearly() {
  return useQuery<YearlyRow[]>({
    queryKey: ["yearly"],
    queryFn: async () => {
      const { data, error } = await supabase.from("yearly_calendar").select("*").order("start_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as YearlyRow[];
    },
  });
}

export function useWeekly() {
  return useQuery<WeeklyRow[]>({
    queryKey: ["weekly"],
    queryFn: async () => {
      const { data, error } = await supabase.from("weekly_planner").select("*").order("id", { ascending: true });
      if (error) throw error;
      return (data ?? []) as WeeklyRow[];
    },
  });
}

export function useUpsertMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (m: Partial<Meeting> & { id?: number }) => {
      if (m.id) {
        const { id, ...rest } = m;
        const { error } = await supabase.from("meeting_tasks").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        // generate next id
        const { data: maxRow } = await supabase
          .from("meeting_tasks")
          .select("id")
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();
        const nextId = (maxRow?.id ?? 0) + 1;
        const { error } = await supabase.from("meeting_tasks").insert({ ...m, id: nextId } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });
}

export function useDeleteMeeting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("meeting_tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });
}

export function useUpdateMeetingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { error } = await supabase.from("meeting_tasks").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["meetings"] }),
  });
}
