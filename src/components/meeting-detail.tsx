import { Badge } from "@/components/ui/badge";
import type { Meeting, User } from "@/lib/planner-types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/planner-types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        STATUS_COLORS[status] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b py-2 text-sm last:border-0">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2 break-words">{value || <span className="text-muted-foreground/60">—</span>}</div>
    </div>
  );
}

export function MeetingDetail({ m, users }: { m: Meeting; users?: User[] }) {
  const responsible = users?.find((u) => u.id === m.responsible_id)?.name ?? null;
  return (
    <div className="space-y-1">
      <div className="mb-2 flex items-center gap-2">
        <Badge variant="outline" className="capitalize">{m.task_type}</Badge>
        <StatusBadge status={m.status} />
      </div>
      <Field label="Date" value={m.date} />
      <Field label="Meeting with" value={m.meeting_with} />
      <Field label="Purpose" value={m.purpose} />
      <Field label="Key points" value={m.key_points} />
      <Field label="Action required" value={m.action_required} />
      <Field label="Follow-up" value={m.follow_up_date} />
      <Field label="Responsible" value={responsible} />
      <Field label="Remarks" value={m.remarks} />
    </div>
  );
}
