import AppLayout from "@/components/layout/Sidebar";
import { useMemo, useState } from "react";
import { init, Row } from "../shared/Api_Jobs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { initialCustomers } from "../shared/Api_Customer";
import { Calendar } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { usePermissions } from "@/App";


function generateJobId(existing: string[]): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  let id = "";
  let tries = 0;
  do {
    const time = Date.now().toString(); // milliseconds timestamp
    id = `JO-${year}-${month}${day}${time}`;
    tries++;
    if (tries > 10) break; // ป้องกัน loop infinity (โอกาสซ้ำต่ำมาก)
  } while (existing.includes(id));
  return id;
}

// ฟังก์ชันแปลง yyyy-mm-dd เป็น dd/mm/yyyy
function formatDateDMY(date: string) {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export default function Jobs() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/jobs");
  const [rows, setRows] = useState<Row[]>(init);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>({
    customer: "",
    job: "",
    quantity: 0,
    date: "",
    cutting: false,
    heating: false,
    embroidering: false,
    sewing: false,
    qc: false,
    pack: false,
    fabric: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Row>({
    customer: "",
    job: "",
    quantity: 0,
    date: "",
    cutting: false,
    heating: false,
    embroidering: false,
    sewing: false,
    qc: false,
    pack: false,
    fabric: "",
  });
  const [sort, setSort] = useState<{ key: keyof Row; dir: 1 | -1 }>({
    key: "customer",
    dir: 1,
  });

  const sorted = useMemo(
    () =>
      rows
        .slice()
        .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir),
    [rows, sort]
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
    setRows((r) =>
      r.concat({
        ...draft,
        date: formatDateDMY(draft.date), // แปลงวันที่ก่อนบันทึก
      })
    );
    setDraft({
      customer: "",
      job: "",
      quantity: 0,
      date: "",
      cutting: false,
      heating: false,
      embroidering: false,
      sewing: false,
      qc: false,
      pack: false,
      fabric: "",
    });
    setOpen(false);
  };
  const openEdit = (i: number) => {
    setEditIndex(i);
    setEditDraft(rows[i]);
  };
  const saveEdit = () => {
    if (editIndex === null) return;
    setRows((r) => r.map((row, idx) => (idx === editIndex ? editDraft : row)));
    setEditIndex(null);
  };
  const deleteRow = () => {
    if (editIndex === null) return;
    setRows((r) => r.filter((_, idx) => idx !== editIndex));
    setEditIndex(null);
  };

  // Check if editDraft is different from the original row
  const isEditChanged =
    editIndex !== null &&
    (() => {
      const original = rows[editIndex];
      return (
        original.customer !== editDraft.customer ||
        original.job !== editDraft.job ||
        original.quantity !== editDraft.quantity ||
        original.date !== editDraft.date ||
        original.cutting !== editDraft.cutting ||
        original.heating !== editDraft.heating ||
        original.embroidering !== editDraft.embroidering ||
        original.sewing !== editDraft.sewing ||
        original.qc !== editDraft.qc ||
        original.pack !== editDraft.pack ||
        original.fabric !== editDraft.fabric
      );
    })();

  // สุ่ม job id อัตโนมัติหลังเลือก customer
  const handleCustomerChange = (value: string) => {
    const existingIds = rows.map((r) => r.job);
    const newId = generateJobId(existingIds);
    setDraft((prev) => ({
      ...prev,
      customer: value,
      job: newId,
    }));
  };

  // ตรวจสอบว่าข้อมูลครบหรือไม่ (รวม step ต้องเลือกอย่างน้อย 1 อัน)
  const isAddValid =
    draft.customer.trim() !== "" &&
    draft.job.trim() !== "" &&
    draft.quantity > 0 &&
    draft.date.trim() !== "" &&
    draft.fabric.trim() !== "" &&
    (
      draft.cutting ||
      draft.heating ||
      draft.embroidering ||
      draft.sewing ||
      draft.qc ||
      draft.pack
    );

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Job</h1>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Job • {rows.length} total</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={!canEditPage}>Add Job</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Add Job</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <label className="text-xs text-slate-500">
                          Customer
                        </label>
                        <select
                          className="mt-1 w-full border rounded px-3 py-2 bg-white"
                          value={draft.customer}
                          onChange={(e) => handleCustomerChange(e.target.value)}
                        >
                          <option value="">Select Customer</option>
                          {initialCustomers.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} ({c.location})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Job</label>
                        <div className="mt-1 w-full border rounded px-3 py-2 bg-gray-50 text-slate-700 select-none">
                          {draft.job || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">
                          Quantity
                        </label>
                        <input
                          className="mt-1 w-full border rounded px-3 py-2"
                          placeholder="Quantity"
                          type="number"
                          value={draft.quantity}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-500">Fabric Type</label>
                        <select
                          className="mt-1 w-full border rounded px-3 py-2 bg-white"
                          value={draft.fabric || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, fabric: e.target.value })
                          }
                        >
                          <option value="" disabled>
                            Select Fabric Type
                          </option>
                          <option value="cotton">Cotton</option>
                          <option value="polyester">Polyester</option>
                          <option value="denim">Denim</option>
                          <option value="silk">Silk</option>
                          <option value="linen">Linen</option>
                          <option value="wool">Wool</option>
                          <option value="spandex">Spandex</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-500">Date</label>
                        <div className="relative">
                          <input
                            className="mt-1 w-full border rounded px-3 py-2 pr-10"
                            type="date"
                            value={draft.date}
                            onChange={(e) =>
                              setDraft({ ...draft, date: e.target.value })
                            }
                            id="job-date-input"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            tabIndex={-1}
                            onClick={() => {
                              // focus input เมื่อคลิก icon
                              const input = document.getElementById("job-date-input");
                              if (input) input.focus();
                            }}
                            aria-label="Pick date"
                          >
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="secondary"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={add}
                          disabled={!canEditPage || !isAddValid}
                          className={!isAddValid ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 md:bg-gradient-to-br md:from-[hsl(var(--brand-start))] md:to-[hsl(var(--brand-end))]">
                    <div className="rounded-lg border bg-white/90 backdrop-blur p-4 shadow">
                      <div className="font-medium mb-2">Step</div>
                      <div className="text-xs text-slate-500 mb-3">
                        Follow the steps below to complete the sewing process.
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          "cutting",
                          "heating",
                          "embroidering",
                          "sewing",
                          "qc",
                          "pack",
                        ].map((k) => (
                          <label
                            key={k}
                            className="flex items-center justify-between rounded border px-3 py-2"
                          >
                            <span className="capitalize">{k}</span>
                            <input
                              type="checkbox"
                              checked={(draft as any)[k]}
                              onChange={(e) =>
                                setDraft({
                                  ...(draft as any),
                                  [k]: e.target.checked,
                                } as Row)
                              }
                            />
                          </label>
                        ))}
                      </div>
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
                  {th("customer", "Customer")}
                  {th("job", "Job")}
                  {th("quantity", "Quantity")}
                  {th("date", "Date")}
                  <th>Step</th>
                  {th("fabric", "Fabric")}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 font-medium text-slate-700">{r.customer}</td>
                    <td>{r.job}</td>
                    <td>{r.quantity}</td>
                    <td>{r.date}</td>
                    <td>
                      {Object.entries({
                        "Cutting": r.cutting,
                        "Heating": r.heating,
                        "Embroidering": r.embroidering,
                        "Sewing": r.sewing,
                        "QC": r.qc,
                        "Pack": r.pack,
                      })
                        .filter(([_, done]) => done)
                        .map(([name]) => name)
                        .join(", ")}
                    </td>
                    <td className="capitalize">{r.fabric}</td>
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

      <Dialog open={editIndex !== null} onOpenChange={(o) => { if (!o) setEditIndex(null); }}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Job</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <label className="text-xs text-slate-500">Customer</label>
                  <select
                    className="mt-1 w-full border rounded px-3 py-2 bg-white"
                    value={editDraft.customer}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, customer: e.target.value })
                    }
                  >
                    <option value="">Select Customer</option>
                    {initialCustomers.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.location})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Job</label>
                  <div className="mt-1 w-full border rounded px-3 py-2 bg-gray-50 text-slate-700">
                    {editDraft.job || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Fabric Type</label>
                  <Select
                    value={editDraft.fabric}
                    onValueChange={(value) =>
                      setEditDraft({ ...editDraft, fabric: value })
                    }
                  >
                    <SelectTrigger className="mt-1 w-full border rounded px-3 py-2 bg-white">
                      <SelectValue placeholder="Select Fabric Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="polyester">Polyester</SelectItem>
                      <SelectItem value="denim">Denim</SelectItem>
                      <SelectItem value="silk">Silk</SelectItem>
                      <SelectItem value="linen">Linen</SelectItem>
                      <SelectItem value="wool">Wool</SelectItem>
                      <SelectItem value="spandex">Spandex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Quantity</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="Quantity"
                    type="number"
                    value={editDraft.quantity}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Date</label>
                  <div className="relative">
                    <input
                      className="mt-1 w-full border rounded px-3 py-2 pr-10"
                      type="date"
                      value={editDraft.date}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, date: e.target.value })
                      }
                      id="job-date-input"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      tabIndex={-1}
                      onClick={() => {
                        const input = document.getElementById("job-date-input");
                        if (input) input.focus();
                      }}
                      aria-label="Pick date"
                    >
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="destructive"
                    onClick={deleteRow}
                    disabled={!canEditPage}
                  >
                    Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setEditIndex(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={saveEdit}
                      disabled={!canEditPage || !isEditChanged}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 md:bg-gradient-to-br md:from-[hsl(var(--brand-start))] md:to-[hsl(var(--brand-end))]">
              <div className="rounded-lg border bg-white/90 backdrop-blur p-4 shadow">
                <div className="font-medium mb-2">Step</div>
                <div className="text-xs text-slate-500 mb-3">
                  Follow the steps below to complete the sewing process.
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    "cutting",
                    "heating",
                    "embroidering",
                    "sewing",
                    "qc",
                    "pack",
                  ].map((k) => (
                    <label
                      key={k}
                      className="flex items-center justify-between rounded border px-3 py-2"
                    >
                      <span className="capitalize">{k}</span>
                      <input
                        type="checkbox"
                        checked={(editDraft as any)[k]}
                        onChange={(e) =>
                          setEditDraft({
                            ...(editDraft as any),
                            [k]: e.target.checked,
                          } as Row)
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
