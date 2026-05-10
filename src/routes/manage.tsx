import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteMeeting, useMeetings, useUpdateMeetingStatus, useUpsertMeeting, useUsers } from "@/lib/planner-hooks";
import type { Meeting } from "@/lib/planner-types";
import { STATUSES, STATUS_LABELS } from "@/lib/planner-types";

export const Route = createFileRoute("/manage")({
  head: () => ({ meta: [{ title: "Manage Data — Academic Planner" }] }),
  component: ManagePage,
});

const EMPTY: Partial<Meeting> = {
  task_type: "fixed", date: null, meeting_with: null, purpose: null,
  key_points: null, action_required: null, follow_up_date: null,
  status: "pending", remarks: null, responsible_id: null,
};

function ManagePage() {
  const { data: meetings = [] } = useMeetings();
  const { data: users = [] } = useUsers();
  const upsert = useUpsertMeeting();
  const remove = useDeleteMeeting();
  const updStatus = useUpdateMeetingStatus();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Meeting>>(EMPTY);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const openNew = () => { setForm(EMPTY); setOpen(true); };
  const openEdit = (m: Meeting) => { setForm(m); setOpen(true); };

  const save = async () => {
    try {
      await upsert.mutateAsync(form as Meeting);
      toast.success(form.id ? "Meeting updated" : "Meeting created");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    }
  };

  const handleDelete = async () => {
    if (confirmId == null) return;
    try {
      await remove.mutateAsync(confirmId);
      toast.success("Deleted");
    } catch (e: any) { toast.error(e.message ?? "Failed"); }
    setConfirmId(null);
  };

  const set = <K extends keyof Meeting>(k: K, v: Meeting[K] | null) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Data</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and delete meetings.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-1 h-4 w-4" /> New meeting</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Meeting with</TableHead>
                  <TableHead>Purpose</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetings.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground">No meetings yet.</TableCell></TableRow>
                )}
                {meetings.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="whitespace-nowrap">{m.date ?? "—"}</TableCell>
                    <TableCell className="capitalize">{m.task_type}</TableCell>
                    <TableCell>{m.meeting_with ?? "—"}</TableCell>
                    <TableCell className="max-w-md truncate">{m.purpose ?? "—"}</TableCell>
                    <TableCell>
                      <Select value={m.status} onValueChange={(v) => updStatus.mutate({ id: m.id, status: v })}>
                        <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmId(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit / Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{form.id ? "Edit meeting" : "New meeting"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <Label>Task type</Label>
              <Select value={(form.task_type as string) ?? "fixed"} onValueChange={(v) => set("task_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={(form.status as string) ?? "pending"} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date ?? ""} onChange={(e) => set("date", e.target.value || null)} />
            </div>
            <div>
              <Label>Follow-up date</Label>
              <Input type="date" value={form.follow_up_date ?? ""} onChange={(e) => set("follow_up_date", e.target.value || null)} />
            </div>
            <div className="md:col-span-2">
              <Label>Meeting with</Label>
              <Input value={form.meeting_with ?? ""} onChange={(e) => set("meeting_with", e.target.value || null)} />
            </div>
            <div className="md:col-span-2">
              <Label>Purpose</Label>
              <Textarea value={form.purpose ?? ""} onChange={(e) => set("purpose", e.target.value || null)} />
            </div>
            <div className="md:col-span-2">
              <Label>Key points</Label>
              <Textarea value={form.key_points ?? ""} onChange={(e) => set("key_points", e.target.value || null)} />
            </div>
            <div className="md:col-span-2">
              <Label>Action required</Label>
              <Textarea value={form.action_required ?? ""} onChange={(e) => set("action_required", e.target.value || null)} />
            </div>
            <div>
              <Label>Responsible</Label>
              <Select value={form.responsible_id ? String(form.responsible_id) : "none"}
                onValueChange={(v) => set("responsible_id", v === "none" ? null : Number(v))}>
                <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {users.map((u) => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Remarks</Label>
              <Textarea value={form.remarks ?? ""} onChange={(e) => set("remarks", e.target.value || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={upsert.isPending}>{form.id ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmId != null} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this meeting?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
