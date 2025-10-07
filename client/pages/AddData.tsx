import AppLayout from "@/components/layout/AppLayout";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Row {
  job: string;
  quantity: number;
  step: string;
  recordedDate: string;
  dueDate: string;
  recorder: string;
}

const init: Row[] = [
  {
    job: "JO-2025-0001",
    quantity: 150,
    step: "Cutting",
    recordedDate: "08/05/2025",
    dueDate: "09/18/2025",
    recorder: "tester 007",
  },
  {
    job: "JO-2025-0012",
    quantity: 250,
    step: "QC",
    recordedDate: "08/13/2025",
    dueDate: "09/20/2025",
    recorder: "tester 002",
  },
];

export default function AddData() {
  const [rows, setRows] = useState<Row[]>(init);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>({
    job: "",
    quantity: 0,
    step: "Cutting",
    recordedDate: "",
    dueDate: "",
    recorder: "",
  });
  const [sort, setSort] = useState<{ key: keyof Row; dir: 1 | -1 }>({
    key: "job",
    dir: 1,
  });
  const sorted = useMemo(
    () =>
      rows
        .slice()
        .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir),
    [rows, sort],
  );

  const th = (k: keyof Row, label: string) => (
    <th
      className="cursor-pointer"
      onClick={() =>
        setSort((s) => ({
          key: k,
          dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1,
        }))
      }
    >
      {label} {sort.key === k ? (sort.dir === 1 ? "↑" : "↓") : ""}
    </th>
  );
  const add = () => {
    setRows((r) => r.concat(draft));
    setDraft({
      job: "",
      quantity: 0,
      step: "Cutting",
      recordedDate: "",
      dueDate: "",
      recorder: "",
    });
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Add Data</h1>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Table Customer</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>+ Add Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Data</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Job"
                    value={draft.job}
                    onChange={(e) =>
                      setDraft({ ...draft, job: e.target.value })
                    }
                  />
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Quantity"
                    type="number"
                    value={draft.quantity}
                    onChange={(e) =>
                      setDraft({ ...draft, quantity: Number(e.target.value) })
                    }
                  />
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Step"
                    value={draft.step}
                    onChange={(e) =>
                      setDraft({ ...draft, step: e.target.value })
                    }
                  />
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Recording Date"
                    value={draft.recordedDate}
                    onChange={(e) =>
                      setDraft({ ...draft, recordedDate: e.target.value })
                    }
                  />
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Due Date"
                    value={draft.dueDate}
                    onChange={(e) =>
                      setDraft({ ...draft, dueDate: e.target.value })
                    }
                  />
                  <input
                    className="border rounded px-2 py-1"
                    placeholder="Recorder"
                    value={draft.recorder}
                    onChange={(e) =>
                      setDraft({ ...draft, recorder: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={add}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="text-slate-500">
                <tr>
                  {th("job", "Job")}
                  {th("quantity", "Quantity")}
                  {th("step", "Step")}
                  {th("recordedDate", "Recording Date")}
                  {th("dueDate", "Due Date")}
                  {th("recorder", "Recorded By")}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 font-medium text-slate-700">{r.job}</td>
                    <td>{r.quantity}</td>
                    <td>{r.step}</td>
                    <td>{r.recordedDate}</td>
                    <td>{r.dueDate}</td>
                    <td>{r.recorder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
