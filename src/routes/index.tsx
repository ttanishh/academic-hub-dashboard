import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { useMeetings, useUsers } from "@/lib/planner-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarCheck, Clock, ListTodo, Users as UsersIcon } from "lucide-react";
import type { Meeting } from "@/lib/planner-types";
import { STATUS_LABELS } from "@/lib/planner-types";
import { MeetingDetail, StatusBadge } from "@/components/meeting-detail";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — Academic Planner" }] }),
  component: Index,
});

const CHART_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function groupBy<T>(arr: T[], keyFn: (x: T) => string) {
  const m = new Map<string, T[]>();
  for (const x of arr) {
    const k = keyFn(x) || "—";
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(x);
  }
  return m;
}

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function Index() {
  const { data: meetings = [], isLoading } = useMeetings();
  const { data: users = [] } = useUsers();
  const [drill, setDrill] = useState<{ title: string; rows: Meeting[] } | null>(null);
  const [selected, setSelected] = useState<Meeting | null>(null);

  const byTaskType = useMemo(() => {
    const g = groupBy(meetings, (m) => m.task_type || "—");
    return Array.from(g, ([name, rows]) => ({ name, value: rows.length, rows }));
  }, [meetings]);

  const byStatus = useMemo(() => {
    const g = groupBy(meetings, (m) => m.status || "pending");
    return Array.from(g, ([name, rows]) => ({ name: STATUS_LABELS[name] ?? name, key: name, value: rows.length, rows }));
  }, [meetings]);

  const byMonth = useMemo(() => {
    const counts = new Array(12).fill(0).map((_, i) => ({ name: MONTHS[i], value: 0, rows: [] as Meeting[] }));
    for (const m of meetings) {
      if (!m.date) continue;
      const d = new Date(m.date);
      if (Number.isNaN(d.getTime())) continue;
      counts[d.getMonth()].value += 1;
      counts[d.getMonth()].rows.push(m);
    }
    return counts;
  }, [meetings]);

  const byMeetingWith = useMemo(() => {
    const g = groupBy(meetings, (m) => m.meeting_with || "—");
    return Array.from(g, ([name, rows]) => ({ name, value: rows.length, rows }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [meetings]);

  const byResponsible = useMemo(() => {
    const g = groupBy(meetings, (m) => {
      const u = users.find((x) => x.id === m.responsible_id);
      return u?.name ?? "Unassigned";
    });
    return Array.from(g, ([name, rows]) => ({ name, value: rows.length, rows }));
  }, [meetings, users]);

  const fillStats = useMemo(() => {
    const fields: (keyof Meeting)[] = ["purpose","key_points","action_required","remarks","follow_up_date"];
    return fields.map((f) => {
      const filled = meetings.filter((m) => m[f] !== null && m[f] !== "" && m[f] !== undefined);
      const empty = meetings.filter((m) => m[f] === null || m[f] === "" || m[f] === undefined);
      return {
        name: String(f).replace("_", " "),
        Filled: filled.length,
        Empty: empty.length,
        filledRows: filled, emptyRows: empty,
      };
    });
  }, [meetings]);

  const total = meetings.length;
  const pending = meetings.filter((m) => m.status === "pending").length;
  const inProgress = meetings.filter((m) => m.status === "in_progress").length;
  const done = meetings.filter((m) => m.status === "done").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of meetings, status, and workload.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={ListTodo} label="Total meetings" value={total} />
        <StatCard icon={Clock} label="Pending" value={pending} />
        <StatCard icon={CalendarCheck} label="In progress" value={inProgress} />
        <StatCard icon={UsersIcon} label="Done" value={done} />
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {!isLoading && total === 0 && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No meetings yet. Add one in <a className="text-primary underline" href="/manage">Manage Data</a> or seed via the Excel import.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Meetings by task type</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byTaskType} dataKey="value" nameKey="name" outerRadius={80} label
                  onClick={(p: any) => setDrill({ title: `Task type: ${p.name}`, rows: p.rows })}>
                  {byTaskType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} cursor="pointer" />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Meetings by status</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" cursor="pointer"
                  onClick={(p: any) => setDrill({ title: `Status: ${p.name}`, rows: p.rows })}>
                  {byStatus.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Meetings by month</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <LineChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /><YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2}
                  dot={{ cursor: "pointer", onClick: (_e: any, payload: any) => {
                    const row = byMonth[payload?.index];
                    if (row) setDrill({ title: `Month: ${row.name}`, rows: row.rows });
                  }}} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Top 'meeting with'</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={byMeetingWith} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" cursor="pointer"
                  onClick={(p: any) => setDrill({ title: `Meeting with: ${p.name}`, rows: p.rows })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">By responsible user</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={byResponsible}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" cursor="pointer"
                  onClick={(p: any) => setDrill({ title: `Responsible: ${p.name}`, rows: p.rows })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Field completeness</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer>
              <BarChart data={fillStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /><YAxis allowDecimals={false} />
                <Tooltip /><Legend />
                <Bar dataKey="Filled" stackId="a" fill="#10b981" cursor="pointer"
                  onClick={(p: any) => setDrill({ title: `${p.name} — filled`, rows: p.filledRows })} />
                <Bar dataKey="Empty" stackId="a" fill="#e5e7eb" cursor="pointer"
                  onClick={(p: any) => setDrill({ title: `${p.name} — empty`, rows: p.emptyRows })} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Drill-down */}
      <Dialog open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{drill?.title}</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {drill?.rows.length === 0 && <div className="text-sm text-muted-foreground">No matching meetings.</div>}
            {drill?.rows.map((m) => (
              <button key={m.id} onClick={() => setSelected(m)}
                className="w-full rounded-md border bg-card p-3 text-left text-sm transition-colors hover:bg-accent">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{m.meeting_with ?? "Untitled"}</div>
                  <StatusBadge status={m.status} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{m.date ?? "—"} · {m.purpose ?? "No purpose"}</div>
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

