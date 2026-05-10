import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useMeetings, useUsers } from "@/lib/planner-hooks";
import { MeetingDetail, StatusBadge } from "@/components/meeting-detail";
import type { Meeting } from "@/lib/planner-types";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meetings — Academic Planner" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const { data: meetings = [], isLoading } = useMeetings();
  const { data: users = [] } = useUsers();
  const [selected, setSelected] = useState<Meeting | null>(null);

  const groups = useMemo(() => {
    const g = new Map<string, Meeting[]>();
    for (const m of [...meetings].sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""))) {
      const key = m.date ?? "No date";
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(m);
    }
    return Array.from(g.entries());
  }, [meetings]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meetings</h1>
        <p className="text-sm text-muted-foreground">Timeline of all meetings grouped by date.</p>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}

      <div className="space-y-6">
        {groups.map(([date, list]) => (
          <div key={date} className="space-y-2">
            <div className="sticky top-14 z-10 -mx-4 bg-background/95 px-4 py-1 text-sm font-medium text-muted-foreground backdrop-blur md:top-0 md:mx-0 md:px-0">
              {date}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {list.map((m) => (
                <Card key={m.id} className="cursor-pointer transition-colors hover:bg-accent" onClick={() => setSelected(m)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{m.task_type}</Badge>
                          <StatusBadge status={m.status} />
                        </div>
                        <div className="mt-2 truncate font-medium">{m.meeting_with ?? "Untitled"}</div>
                        <div className="text-sm text-muted-foreground">{m.purpose ?? "—"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {!isLoading && groups.length === 0 && (
          <Card><CardContent className="p-6 text-sm text-muted-foreground">No meetings yet.</CardContent></Card>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
          <DialogHeader><DialogTitle>Meeting detail</DialogTitle></DialogHeader>
          {selected && <MeetingDetail m={selected} users={users} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
