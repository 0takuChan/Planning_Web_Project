import { useState } from "react";
import AppLayout from "@/components/layout/Sidebar";
import {
  addWeeks,
  addDays,
  differenceInCalendarWeeks,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import StepWeekGrid, { StepEvent } from "@/components/planning/StepWeekGrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "@/styles/planning.css";
import { init as jobRows } from "../shared/Api_Jobs";
import { planningApi, PlanningRecord } from "../shared/Api_Planning";
import { usePermissions } from "@/App";

interface JobItem {
  id: string;
  quantity: number;
  due: string;
}

const initialJobs: JobItem[] = jobRows.map((job) => ({
  id: job.job,
  quantity: job.quantity,
  due: (() => {
    const [m, d, y] = job.date.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  })(),
}));

const stepPalette = [
  { key: "Cutting", color: "#86efac" },
  { key: "Heating", color: "#fca5a5" },
  { key: "Embroidering", color: "#fde68a" },
  { key: "Sewing", color: "#a5b4fc" },
  { key: "QC", color: "#67e8f9" },
  { key: "Pack", color: "#f0abfc" },
];

export default function Planning() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/planning");

  const [events, setEvents] = useState<StepEvent[]>([]);
  const [selected, setSelected] = useState<JobItem | null>(null);
  const [qtyPopup, setQtyPopup] = useState<null | {
    step: string;
    day: number;
    jobId: string;
    date: string;
    left: number;
    top: number;
    containerLeft: number;
    containerRight: number;
  }>(null);
  const [qtyDraft, setQtyDraft] = useState<number>(0);
  const [deletePopup, setDeletePopup] = useState<null | {
    id: string;
    left: number;
    top: number;
  }>(null);
  const [hiddenJobs, setHiddenJobs] = useState<Set<string>>(new Set());

  const calcRemaining = (jobId: string) => {
    const job = initialJobs.find((j) => j.id === jobId);
    if (!job) return 0;
    const used = events
      .filter((e) => e.jobId === jobId)
      .reduce((sum, e) => sum + (e.qty || 0), 0);
    return Math.max(0, job.quantity - used);
  };

  const calcRemainingStep = (jobId: string, step: string) => {
    const job = initialJobs.find((j) => j.id === jobId);
    if (!job) return 0;
    const used = events
      .filter((e) => e.jobId === jobId && e.step === step)
      .reduce((sum, e) => sum + (e.qty || 0), 0);
    return Math.max(0, job.quantity - used);
  };

  const isJobComplete = (jobId: string, evs: StepEvent[] = events) => {
    const job = initialJobs.find((j) => j.id === jobId);
    if (!job) return false;
    return stepPalette.every((s) => {
      const used = evs
        .filter((e) => e.jobId === jobId && e.step === s.key)
        .reduce((sum, e) => sum + (e.qty || 0), 0);
      return used >= job.quantity;
    });
  };

  // Modify askQuantity to check permission
  const askQuantity = (
    info: { step: string; day: number; jobId: string; date: string },
    anchor: {
      left: number;
      top: number;
      containerLeft: number;
      containerRight: number;
    },
  ) => {
    if (!canEditPage) return; // ถ้าไม่มีสิทธิ์ไม่ให้เปิด popup
    
    const remainingStep = calcRemainingStep(info.jobId, info.step);
    if (remainingStep <= 0) return;
    setQtyDraft(remainingStep);
    const popupWidth = 192; // w-48
    const margin = 8;
    let left = anchor.left;
    if (left + popupWidth + margin > anchor.containerRight) {
      left = Math.max(
        anchor.containerLeft + margin,
        anchor.containerRight - popupWidth - margin,
      );
    }
    setQtyPopup({
      ...info,
      left: anchor.left,
      top: anchor.top,
      containerLeft: anchor.containerLeft,
      containerRight: anchor.containerRight,
    });
  };

  const confirmQty = () => {
    if (!canEditPage || !qtyPopup) return;   // ปิดการยืนยัน
    if (!qtyPopup) return;
    const remainingStep = calcRemainingStep(qtyPopup.jobId, qtyPopup.step);
    const qty = Math.min(Math.max(1, qtyDraft), remainingStep);
    const color = stepPalette.find((s) => s.key === qtyPopup.step)?.color;
    setEvents((prev) =>
      prev.concat({
        id: `${qtyPopup.jobId}-${qtyPopup.step}-${qtyPopup.date}-${prev.length}`,
        step: qtyPopup.step,
        day: qtyPopup.day,
        jobId: qtyPopup.jobId,
        qty,
        color,
        date: qtyPopup.date,
      }),
    );
    // เพิ่มบันทึกลง planningApi พร้อม step
    planningApi.push({
      jobId: qtyPopup.jobId,
      date: qtyPopup.date,
      qty,
      step: qtyPopup.step, // เพิ่ม step
    });
    setQtyPopup(null);
  };

  const removeEvent = (id: string) => {
    if (!canEditPage) return;                // ปิดการลบ event
    setEvents((prev) => {
      const ev = prev.find((e) => e.id === id);
      const next = prev.filter((e) => e.id !== id);
      if (ev) {
        if (!isJobComplete(ev.jobId, next)) {
          setHiddenJobs((set) => {
            const n = new Set(set);
            n.delete(ev.jobId);
            return n;
          });
        }
      }
      return next;
    });
  };

  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(parseISO("2025-09-01"), { weekStartsOn: 0 }),
  );
  const weekOfMonthStart = startOfWeek(startOfMonth(weekStart), {
    weekStartsOn: 0,
  });
  const weekIndex =
    differenceInCalendarWeeks(weekStart, weekOfMonthStart, {
      weekStartsOn: 0,
    }) + 1;

  return (
    <AppLayout>
      <div className="space-y-4 relative">
        {(selected || deletePopup) && (
          <div className="fixed inset-0 bg-black/30 z-20 pointer-events-none" />
        )}
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Planning</h1>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 rounded-lg border bg-white p-4 relative z-30">
            <div className="mb-3 font-semibold flex items-center justify-between">
              <div>
                Week {weekIndex} • {format(weekStart, "MMMM yyyy")}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => setWeekStart((d) => addWeeks(d, -1))}
                >
                  {"<"}
                </button>
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => setWeekStart((d) => addWeeks(d, 1))}
                >
                  {">"}
                </button>
              </div>
            </div>
            <div className="relative">
              <StepWeekGrid
                startDate={weekStart}
                steps={stepPalette}
                events={events}
                onAskQuantity={askQuantity}
                onRemoveEvent={removeEvent}
                onAskDelete={(ev, anchor) =>
                  setDeletePopup({
                    id: ev.id,
                    left: anchor.left,
                    top: anchor.top,
                  })
                }
              />
              {qtyPopup && (
                <div
                  className="fixed z-[100]"
                  style={{ left: qtyPopup.left, top: qtyPopup.top + 4 }}
                >
                  <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur p-3 shadow-2xl w-56 ring-1 ring-black/5">
                    <div className="flex items-start justify-between">
                      <div className="text-[12px] font-medium text-slate-700">
                        {qtyPopup.jobId} • {qtyPopup.step} •{" "}
                        {format(
                          addDays(weekStart, qtyPopup.day - 1),
                          "yyyy-MM-dd",
                        )}
                      </div>
                      <button
                        className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
                        onClick={() => setQtyPopup(null)}
                        aria-label="Close"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      <label className="text-[11px] text-slate-500">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="h-8 w-full border border-slate-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-end))] focus:border-[hsl(var(--brand-end))]"
                        value={qtyDraft}
                        onChange={(e) =>
                          setQtyDraft(parseInt(e.target.value || "0", 10) || 0)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") confirmQty();
                          if (e.key === "Escape") setQtyPopup(null);
                        }}
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setQtyPopup(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={confirmQty}
                        disabled={!canEditPage || qtyDraft <= 0}
                        className="w-full"
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {deletePopup && (
                <div
                  className="fixed z-[100]"
                  style={{ left: deletePopup.left, top: deletePopup.top }}
                >
                  <div className="rounded-lg border bg-white p-2 shadow-xl">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        removeEvent(deletePopup.id);
                        setDeletePopup(null);
                      }}
                      disabled={!canEditPage}                        // ปิดการลบ
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletePopup(null)}
                      className="ml-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4 relative">
            <div className="font-semibold mb-3">Job list</div>
            <div className="space-y-2">
              {initialJobs
                .filter((j) => !hiddenJobs.has(j.id))
                .map((job) => (
                  <div key={job.id}>
                    <button
                      onClick={() => setSelected(job)}
                      className="w-full rounded-lg border px-3 py-2 text-left hover:bg-slate-50 relative z-30"
                    >
                      <div className="font-medium">{job.id}</div>
                      <div className="text-xs text-slate-500">
                        {job.quantity} pcs • Due {job.due}
                      </div>
                    </button>
                    {selected?.id === job.id && (
                      <div className="relative z-30 mt-2 rounded-lg border bg-white p-3 shadow-lg">
                        <div className="font-semibold mb-2">Job Detail</div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-slate-500">Job ID</div>
                            <div className="font-medium">{selected.id}</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Quantity</div>
                            <div className="font-medium">
                              {selected.quantity}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500">Due Date</div>
                            <div className="font-medium">{selected.due}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-slate-500 mb-2">
                            Steps (ลากไปวางที่ Day 1-7 ในแถวขั้นตอน)
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stepPalette
                              .filter(
                                (s) =>
                                  // เฉพาะ step ที่ job นี้มีจริง
                                  (jobRows.find((j) => j.job === selected.id)?.[s.key.toLowerCase()] === true) &&
                                  calcRemainingStep(selected.id, s.key) > 0
                              )
                              .map((s) => (
                                <div
                                  key={s.key}
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData("text/step", s.key);
                                    e.dataTransfer.setData("text/job", selected.id);
                                  }}
                                  className="cursor-move rounded px-2 py-1 text-xs text-white"
                                  style={{ backgroundColor: s.color }}
                                >
                                  {s.key}
                                </div>
                              ))}
                            {stepPalette.filter(
                              (s) =>
                                (jobRows.find((j) => j.job === selected.id)?.[s.key.toLowerCase()] === true) &&
                                calcRemainingStep(selected.id, s.key) > 0
                            ).length === 0 && (
                              <div className="text-xs text-emerald-600">
                                จัดครบแล้ว
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              const allDone = stepPalette.every(
                                (s) =>
                                  calcRemainingStep(selected.id, s.key) === 0,
                              );
                              if (allDone)
                                setHiddenJobs((prev) =>
                                  new Set(prev).add(selected.id),
                                );
                              setSelected(null);
                            }}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-lg border bg-white p-4">
          <div className="font-semibold mb-2">Planning Records</div>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-2 py-1 border">Job ID</th>
                <th className="px-2 py-1 border">Step</th>
                <th className="px-2 py-1 border">Date</th>
                <th className="px-2 py-1 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {planningApi.map((rec, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 border">{rec.jobId}</td>
                  <td className="px-2 py-1 border">{rec.step}</td>
                  <td className="px-2 py-1 border">{rec.date}</td>
                  <td className="px-2 py-1 border">{rec.qty}</td>
                </tr>
              ))}
              {planningApi.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-slate-400 py-2">
                    No planning records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
