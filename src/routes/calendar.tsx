import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMeetings, useUsers } from "@/lib/planner-hooks";
import { MeetingDetail, StatusBadge } from "@/components/meeting-detail";
import type { Meeting } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Academic Planner" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date());
  const [dayOpen, setDayOpen] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const { data: meetings = [] } = useMeetings();
  const { data: users = [] } = useUsers();

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    days.push(new Date(d));
  }

  const byDate = useMemo(() => {
    const m = new Map<string, Meeting[]>();
    for (const x of meetings) {
      if (!x.date) continue;
      const key = x.date.slice(0, 10);
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(x);
    }
    return m;
  }, [meetings]);

  const dayMeetings = dayOpen ? byDate.get(format(dayOpen, "yyyy-MM-dd")) ?? [] : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">Meetings by date.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, -1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3">
          <div className="mb-2 text-center text-sm font-medium">{format(cursor, "MMMM yyyy")}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {days.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const list = byDate.get(key) ?? [];
              const inMonth = isSameMonth(d, cursor);
              const today = isSameDay(d, new Date());
              return (
                <button key={key} onClick={() => setDayOpen(d)}
                  className={cn(
                    "flex min-h-[80px] flex-col rounded-md border p-1 text-left text-xs transition-colors hover:bg-accent",
                    inMonth ? "bg-card" : "bg-muted/40 text-muted-foreground",
                    today && "ring-2 ring-primary",
                  )}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{format(d, "d")}</span>
                    {list.length > 0 && (
                      <span className="rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">{list.length}</span>
                    )}
                  </div>
                  <div className="mt-1 space-y-0.5 overflow-hidden">
                    {list.slice(0, 2).map((m) => (
                      <div key={m.id} className="truncate rounded bg-primary/10 px-1 py-0.5 text-[10px] text-primary">
                        {m.meeting_with ?? m.purpose ?? "Meeting"}
                      </div>
                    ))}
                    {list.length > 2 && <div className="text-[10px] text-muted-foreground">+{list.length - 2} more</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!dayOpen} onOpenChange={(o) => !o && setDayOpen(null)}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
          <DialogHeader><DialogTitle>{dayOpen && format(dayOpen, "PPPP")}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {dayMeetings.length === 0 && <div className="text-sm text-muted-foreground">No meetings on this day.</div>}
            {dayMeetings.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)}
                className="w-full rounded-md border bg-card p-3 text-left text-sm hover:bg-accent">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{m.meeting_with ?? "Untitled"}</div>
                  <StatusBadge status={m.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.purpose ?? "—"}</div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
          <DialogHeader><DialogTitle>Meeting detail</DialogTitle></DialogHeader>
          {selected && <MeetingDetail m={selected} users={users} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
