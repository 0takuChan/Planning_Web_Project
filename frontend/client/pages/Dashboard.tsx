import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import CalendarMonth, {
  CalendarEvent,
} from "@/components/calendar/CalendarMonth";
import {
  format,
  parseISO,
  isSameDay,
  isSameMonth,
  endOfDay,
  isBefore,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Hourglass,
  AlertCircle,
  Calendar as Cal,
  Star,
} from "lucide-react";
import "@/styles/dashboard.css";
import { init, Row } from "../shared/Api_Jobs";

interface JobRow {
  id: string;
  quantity: number;
  date: string; 
  cutting: number;
  heating: number;
  embroidering: number;
  sewing: number;
  qc: number;
  packing: number;
  state: "Done" | "In Progress" | "Delay";
}

function formatDate(date: string) {
  const [m, d, y] = date.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function rowToJob(row: Row): JobRow {
  let state: JobRow["state"] = "In Progress";
  if (
    row.cutting &&
    row.heating &&
    row.embroidering &&
    row.sewing &&
    row.qc &&
    row.pack
  ) {
    state = "Done";
  } else if (
    !row.cutting &&
    !row.heating &&
    !row.embroidering &&
    !row.sewing &&
    !row.qc &&
    !row.pack
  ) {
    state = "Delay";
  }
  return {
    id: row.job,
    quantity: row.quantity,
    date: formatDate(row.date),
    cutting: row.cutting ? row.quantity : 0,
    heating: row.heating ? row.quantity : 0,
    embroidering: row.embroidering ? row.quantity : 0,
    sewing: row.sewing ? row.quantity : 0,
    qc: row.qc ? row.quantity : 0,
    packing: row.pack ? row.quantity : 0,
    state,
  };
}

const sampleJobs: JobRow[] = init.map(rowToJob);

const statusStyles: Record<
  JobRow["state"],
  { color: string; bg: string; icon: JSX.Element; key: string }
> = {
  Done: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    key: "done",
  },
  "In Progress": {
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: <Hourglass className="h-5 w-5 text-blue-600" />,
    key: "inprogress",
  },
  Delay: {
    color: "text-rose-600",
    bg: "bg-rose-50",
    icon: <AlertCircle className="h-5 w-5 text-rose-600" />,
    key: "delay",
  },
};

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date>(parseISO("2025-09-01"));
  const [statusFilter, setStatusFilter] = useState<JobRow["state"] | "All">(
    "All",
  );

  const getState = (j: JobRow): JobRow["state"] => {
    if (j.state === "In Progress") {
      const due = endOfDay(parseISO(j.date));
      if (isBefore(due, new Date())) return "Delay";
    }
    return j.state;
  };

  const events: CalendarEvent[] = useMemo(
    () =>
      sampleJobs.map((j) => {
        const s = getState(j);
        return {
          id: j.id,
          date: parseISO(j.date),
          label: j.id,
          color:
            s === "Done" ? "#10b981" : s === "Delay" ? "#ef4444" : "#3b82f6",
        };
      }),
    [],
  );

  const rows = sampleJobs.filter((j) => {
    const dateMatch = selectedDate
      ? isSameDay(parseISO(j.date), selectedDate)
      : true;
    const statusMatch =
      statusFilter === "All" ? true : getState(j) === statusFilter;
    return dateMatch && statusMatch;
  });

  const counts = {
    done: sampleJobs.filter((j) => getState(j) === "Done").length,
    inprogress: sampleJobs.filter((j) => getState(j) === "In Progress").length,
    delay: sampleJobs.filter((j) => getState(j) === "Delay").length,
  };

  const dueDates = useMemo(() => {
    const map = new Map<string, { date: Date; count: number }>();
    for (const j of sampleJobs) {
      const d = parseISO(j.date);
      if (!isSameMonth(d, month)) continue;
      const key = format(d, "yyyy-MM-dd");
      const prev = map.get(key);
      if (prev) {
        prev.count += 1;
      } else {
        map.set(key, { date: d, count: 1 });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [month.getTime()]);

  return (
    <AppLayout>
      <div className="space-y-4 dashboard">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow flex flex-col">
          <h1 className="text-2xl font-bold text-center mx-auto">Dashboard</h1>
        </div>
        <div className="rounded-lg border bg-white p-4 w-full kpi-container">
          <div className="kpi-grid items-stretch">
            <StatusCard
              title="Done"
              value={`${counts.done}`}
              subtitle="Left"
              onClick={() => setStatusFilter("Done")}
              colorClass="text-emerald-600"
              icon={<Star className="h-5 w-5" />}
            />
            <StatusCard
              title="In Progress"
              value={`${counts.inprogress}`}
              subtitle="Left"
              onClick={() => setStatusFilter("In Progress")}
              colorClass="text-blue-600"
              icon={<Hourglass className="h-5 w-5" />}
            />
            <StatusCard
              title="Delay"
              value={`${counts.delay}`}
              subtitle="Left"
              onClick={() => setStatusFilter("Delay")}
              colorClass="text-rose-600"
              icon={<Cal className="h-5 w-5" />}
            />
            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm text-slate-500">Due date</div>
              <div className="mt-2 text-slate-700 text-sm space-y-1">
                {dueDates.length > 0 ? (
                  dueDates.map((d) => (
                    <div key={d.date.toISOString()}>
                      {format(d.date, "dd/MM/yyyy")}{" "}
                      <span className="text-slate-400">
                        {d.count} {d.count === 1 ? "Order" : "Orders"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400">No orders this month</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-white p-4 w-full">
            <div className="flex items-center justify-between mb-2">
              <button
                className="px-2 py-1 rounded border"
                onClick={() =>
                  setMonth(
                    (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1),
                  )
                }
              >
                {"<"}
              </button>
              <h3 className="font-semibold">{format(month, "MMMM yyyy")}</h3>
              <button
                className="px-2 py-1 rounded border"
                onClick={() =>
                  setMonth(
                    (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1),
                  )
                }
              >
                {">"}
              </button>
            </div>
            <CalendarMonth
              month={month}
              events={events}
              onDayClick={(d) => setSelectedDate(d)}
            />
          </div>
          <div className="xl:col-span-2 rounded-lg border bg-white p-4 overflow-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Work Table</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("All");
                    setSelectedDate(null);
                  }}
                >
                  Clear filter
                </Button>
              </div>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2">Job</th>
                    <th>Quantity</th>
                    <th>Date</th>
                    <th>Cutting</th>
                    <th>Heating</th>
                    <th>Embroidering</th>
                    <th>Sewing</th>
                    <th>QC</th>
                    <th>Packing</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="py-2 font-medium text-slate-700">
                        {r.id}
                      </td>
                      <td>{r.quantity}</td>
                      <td>{format(parseISO(r.date), "dd/MM/yyyy")}</td>
                      <td className="text-emerald-600">{r.cutting}</td>
                      <td className="text-emerald-600">{r.heating}</td>
                      <td className="text-emerald-600">{r.embroidering}</td>
                      <td className="text-emerald-600">{r.sewing}</td>
                      <td className="text-emerald-600">{r.qc}</td>
                      <td className="text-emerald-600">{r.packing}</td>
                      <td>
                        <span className={cnStatus(getState(r))}>
                          {getState(r)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatusCard({
  title,
  value,
  subtitle,
  onClick,
  colorClass,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  onClick: () => void;
  colorClass: string;
  icon: JSX.Element;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border bg-white p-4 text-left hover:shadow transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="text-slate-500 text-sm">{title}</div>
        <div className={colorClass}>{icon}</div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="text-slate-400 text-sm">{subtitle}</div>
    </button>
  );
}

function cnStatus(state: JobRow["state"]) {
  if (state === "Done")
    return "inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5";
  if (state === "Delay")
    return "inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5";
  return "inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5";
}
