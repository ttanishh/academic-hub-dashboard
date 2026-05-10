import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useYearly } from "@/lib/planner-hooks";
import { StatusBadge } from "@/components/meeting-detail";

export const Route = createFileRoute("/yearly")({
  head: () => ({ meta: [{ title: "Yearly Calendar — Academic Planner" }] }),
  component: YearlyPage,
});

function YearlyPage() {
  const { data: rows = [], isLoading } = useYearly();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Yearly Calendar</h1>
        <p className="text-sm text-muted-foreground">Academic year activities and milestones.</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>}
                {!isLoading && rows.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center text-sm text-muted-foreground">No data yet.</TableCell></TableRow>
                )}
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.month ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.start_date ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap">{r.end_date ?? "—"}</TableCell>
                    <TableCell className="max-w-md">{r.activity ?? "—"}</TableCell>
                    <TableCell>{r.category ?? "—"}</TableCell>
                    <TableCell>{r.responsible_name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="max-w-xs">{r.remarks ?? "—"}</TableCell>
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
