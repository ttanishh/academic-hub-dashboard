import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useWeekly } from "@/lib/planner-hooks";
import { StatusBadge } from "@/components/meeting-detail";

export const Route = createFileRoute("/weekly")({
  head: () => ({ meta: [{ title: "Weekly Planner — Academic Planner" }] }),
  component: WeeklyPage,
});

function WeeklyPage() {
  const { data: rows = [], isLoading } = useWeekly();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Weekly Planner</h1>
        <p className="text-sm text-muted-foreground">Operational tasks by week and day.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week</TableHead><TableHead>Day</TableHead><TableHead>Date</TableHead>
                  <TableHead>Focus area</TableHead><TableHead>Task</TableHead><TableHead>Priority</TableHead>
                  <TableHead>Assigned to</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={9} className="text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>}
                {!isLoading && rows.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center text-sm text-muted-foreground">No data yet.</TableCell></TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.week ?? "—"}</TableCell>
                    <TableCell>{r.day ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.date ?? "—"}</TableCell>
                    <TableCell>{r.focus_area ?? "—"}</TableCell>
                    <TableCell className="max-w-md">{r.task ?? "—"}</TableCell>
                    <TableCell>{r.priority ?? "—"}</TableCell>
                    <TableCell>{r.assigned_to_name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="max-w-xs">{r.notes ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
