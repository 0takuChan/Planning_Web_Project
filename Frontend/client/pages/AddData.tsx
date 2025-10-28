import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutGrid } from "lucide-react";
import { init as jobRows } from "../shared/Api_Jobs";
import { init, Row } from "../shared/Api_Recroded";
import { usePermissions } from "@/App";

type DataField = "job" | "step" | "quantity" | "recordedDate";

type FormFieldsProps = {
  values: Pick<Row, DataField>;
  onChange: (field: DataField, value: string | number) => void;
  invalid?: Partial<Record<DataField, boolean>>;
  mode?: "add" | "edit";
};

const emptyDraft = (): Row => ({
  job: "",
  quantity: 0,
  step: "",
  recordedDate: "",
  dueDate: "",
  recorder: "",
});

// Utility: แปลง job object เป็น array ของ step ที่มีจริง
const getStepsForJob = (job: typeof jobRows[number]) => {
  const stepMap: Record<string, keyof typeof job> = {
    Cutting: "cutting",
    Heating: "heating",
    Embroidering: "embroidering",
    Sewing: "sewing",
    QC: "qc",
    Pack: "pack",
  };
  return Object.entries(stepMap)
    .filter(([_, key]) => job[key])
    .map(([label]) => label);
};

const FormFields = ({
  values,
  onChange,
  invalid,
  mode = "add",
}: FormFieldsProps) => {
  const base =
    "rounded-lg border px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:outline-none ";
  const ok =
    "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))] focus:border-transparent";
  const bad = "border-red-500 focus:ring-2 focus:ring-red-500";

  // หา steps ของ job ที่เลือก
  const selectedJob = jobRows.find((job) => job.job === values.job);
  const steps: string[] = selectedJob ? getStepsForJob(selectedJob) : [];

  return (
    <div className="mt-6 space-y-4 text-sm">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Job
        {mode === "edit" ? (
          <div className="rounded-lg border px-3 py-2 text-sm text-slate-700 bg-gray-50">
            {values.job || "-"}
          </div>
        ) : (
          <select
            className={`${base} ${invalid?.job ? bad : ok}`}
            value={values.job}
            onChange={(e) => onChange("job", e.target.value)}
          >
            <option value="">Select Job</option>
            {jobRows.map((job) => (
              <option key={job.job} value={job.job}>
                {job.job} {job.customer ? `- ${job.customer}` : ""}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Step
        {mode === "edit" || !steps.length ? (
          <input
            type="text"
            className={`${base} ${invalid?.step ? bad : ok}`}
            placeholder="Select Step"
            value={values.step}
            onChange={(e) => onChange("step", e.target.value)}
            disabled={mode === "edit"}
          />
        ) : (
          <select
            className={`${base} ${invalid?.step ? bad : ok}`}
            value={values.step}
            onChange={(e) => onChange("step", e.target.value)}
            disabled={!values.job}
          >
            <option value="">Select Step</option>
            {steps.map((step) => (
              <option key={step} value={step}>
                {step}
              </option>
            ))}
          </select>
        )}
      </label>

      {/* Quantity, Recording date */}
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Quantity
        <input
          type="number"
          className={`${base} ${invalid?.quantity ? bad : ok}`}
          placeholder="Quantity"
          value={values.quantity}
          onChange={(e) => onChange("quantity", Number(e.target.value))}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Recording date
        <input
          type="text"
          className={`${base} ${invalid?.recordedDate ? bad : ok}`}
          placeholder="DD/MM/YYYY"
          value={values.recordedDate}
          onChange={(e) => onChange("recordedDate", e.target.value)}
        />
      </label>
    </div>
  );
};

export default function AddData() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/add-data");

  const [rows, setRows] = useState<Row[]>(init);

  const [openAdd, setOpenAdd] = useState(false);
  const [draft, setDraft] = useState<Row>(emptyDraft());

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Row>(emptyDraft());

  const [sort, setSort] = useState<{ key: keyof Row; dir: 1 | -1 }>({
    key: "job",
    dir: 1,
  });

  const sorted = useMemo(
    () =>
      rows
        .slice()
        .sort((a, b) => (a[sort.key] > (b as any)[sort.key] ? 1 : -1) * sort.dir),
    [rows, sort],
  );

  const th = (k: keyof Row, label: string) => (
    <th
      className="cursor-pointer select-none"
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

  const isAddValid =
    draft.job.trim() !== "" &&
    draft.step.trim() !== "" &&
    draft.recordedDate.trim() !== "" &&
    Number(draft.quantity) > 0;

  const isEditValid =
    editDraft.job.trim() !== "" &&
    editDraft.step.trim() !== "" &&
    editDraft.recordedDate.trim() !== "" &&
    Number(editDraft.quantity) > 0;

  const add = () => {
    if (!isAddValid) return;
    const normalized: Row = {
      ...draft,
      job: draft.job.trim(),
      step: draft.step.trim(),
      recordedDate: draft.recordedDate.trim(),
      quantity: Number(draft.quantity),
    };
    setRows((r) => r.concat(normalized));
    setDraft(emptyDraft());
    setOpenAdd(false);
  };

  const openEdit = (index: number) => {
    const current = sorted[index];
    const foundIndex = rows.indexOf(current);
    if (foundIndex === -1) return;
    setEditIdx(foundIndex);
    setEditDraft({ ...rows[foundIndex] });
  };

  const update = () => {
    if (editIdx === null || !isEditValid) return;
    const normalized: Row = {
      ...editDraft,
      job: editDraft.job.trim(),
      step: editDraft.step.trim(),
      recordedDate: editDraft.recordedDate.trim(),
      quantity: Number(editDraft.quantity),
    };
    setRows((list) => list.map((r, i) => (i === editIdx ? normalized : r)));
    setEditIdx(null);
    setEditDraft(emptyDraft());
  };

  const remove = () => {
    if (editIdx === null) return;
    setRows((list) => list.filter((_, i) => i !== editIdx));
    setEditIdx(null);
    setEditDraft(emptyDraft());
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

            <Dialog
              open={openAdd}
              onOpenChange={(open) => {
                setOpenAdd(open);
                if (!open) setDraft(emptyDraft());
              }}
            >
              <DialogTrigger asChild>
                <Button disabled={!canEditPage}>+ Add Data</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl overflow-hidden border-0 p-0 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">
                  <div className="p-8">
                    <DialogHeader className="space-y-4 text-left">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white shadow-lg">
                        <LayoutGrid className="h-6 w-6" strokeWidth={1.8} />
                      </div>
                      <DialogTitle className="text-2xl font-semibold text-slate-900">
                        Add Data
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-500">
                        Enter the details below to record actual production data.
                      </DialogDescription>
                    </DialogHeader>

                    <FormFields
                      mode="add"
                      values={{
                        job: draft.job,
                        step: draft.step,
                        quantity: draft.quantity,
                        recordedDate: draft.recordedDate,
                      }}
                      invalid={{
                        job: draft.job.trim() === "",
                        step: draft.step.trim() === "",
                        quantity: Number(draft.quantity) <= 0,
                        recordedDate: draft.recordedDate.trim() === "",
                      }}
                      onChange={(field, value) =>
                        setDraft((d) => ({ ...d, [field]: value }))
                      }
                    />

                    <div className="mt-8 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setOpenAdd(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={add}
                        disabled={!canEditPage || !isAddValid}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="hidden items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-8 md:flex">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                      <LayoutGrid className="h-16 w-16 text-white" strokeWidth={1.4} />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="text-slate-500">
                <tr>
                  {th("job", "Job")}
                  {th("step", "Step")}
                  {th("quantity", "Quantity")}
                  {th("recordedDate", "Recording date")}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{r.job}</td>
                    <td>{r.step}</td>
                    <td>{r.quantity}</td>
                    <td>{r.recordedDate}</td>
                    <td className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(i)}
                        disabled={!canEditPage}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        open={editIdx !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditIdx(null);
            setEditDraft(emptyDraft());
          }
        }}
      >
        <DialogContent className="max-w-3xl overflow-hidden border-0 p-0 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">
            <div className="p-8">
              <DialogHeader className="space-y-4 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white shadow-lg">
                  <LayoutGrid className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <DialogTitle className="text-2xl font-semibold text-slate-900">
                  Edit Data
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Update the details below to modify actual production records.
                </DialogDescription>
              </DialogHeader>

              <FormFields
                mode="edit"
                values={{
                  job: editDraft.job,
                  step: editDraft.step,
                  quantity: editDraft.quantity,
                  recordedDate: editDraft.recordedDate,
                }}
                invalid={{
                  job: editDraft.job.trim() === "",
                  step: editDraft.step.trim() === "",
                  quantity: Number(editDraft.quantity) <= 0,
                  recordedDate: editDraft.recordedDate.trim() === "",
                }}
                onChange={(field, value) =>
                  setEditDraft((d) => ({ ...d, [field]: value }))
                }
              />

              <div className="mt-8 flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center">
                <Button
                  variant="destructive"
                  onClick={remove}
                  disabled={!canEditPage}
                >
                  Delete
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditIdx(null);
                      setEditDraft(emptyDraft());
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={update}
                    disabled={!canEditPage || !isEditValid}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-8 md:flex">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                <LayoutGrid className="h-16 w-16 text-white" strokeWidth={1.4} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
