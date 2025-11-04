import { useMemo, useState, useEffect } from "react";
import AppLayout from "@/components/layout/Sidebar";
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
  isToday,
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

interface Step {
  step_id: number;
  step_name: string;
}

interface JobStep {
  job_step_id: number;
  job_id: number;
  step_id: number;
  job: {
    job_id: number;
    job_number: string;
  };
  step: {
    step_id: number;
    step_name: string;
  };
}

interface JobRow {
  id: string;
  job_number: string;
  customer_name: string;
  quantity: number;
  date: string; 
  end_date: string;
  steps: {
    step_name: string;
    isCompleted: boolean;
  }[];
  state: "Done" | "In Progress" | "Delay";
  job_id: number;
}

// API Job interface จาก backend
interface APIJob {
  job_id: number;
  job_number: string;
  created_date: string;
  end_date: string;
  customer_id: number;
  total_quantity: number;
  clothing_type: string;
  type_of_fabric: string;
  employee_id: number;
  delivery_location: string;
  customer?: {
    fullname: string;
    name: string;
  };
}

function formatDateDMY(date: string) {
  if (!date) return "";
  const dateOnly = date.includes('T') ? date.split('T')[0] : date;
  const [y, m, d] = dateOnly.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateYMD(date: string) {
  if (!date) return "";
  const dateOnly = date.includes('T') ? date.split('T')[0] : date;
  return dateOnly;
}

function apiJobToJobRow(apiJob: APIJob, allSteps: Step[], jobSteps: JobStep[]): JobRow {
  // หา steps ที่เกี่ยวข้องกับ job นี้
  const jobRelatedSteps = jobSteps.filter(js => js.job_id === apiJob.job_id);
  
  // สร้าง mapping ของ steps พร้อม status
  const steps = allSteps.map(step => ({
    step_name: step.step_name,
    isCompleted: jobRelatedSteps.some(js => js.step_id === step.step_id)
  }));

  // คำนวณสถานะ
  let state: JobRow["state"] = "In Progress";
  
  // ถ้างานเสร็จครบทุก step ที่มีใน job
  const totalJobSteps = jobRelatedSteps.length;
  const completedSteps = steps.filter(s => s.isCompleted).length;
  
  if (totalJobSteps > 0 && completedSteps === totalJobSteps) {
    state = "Done";
  } else {
    // ตรวจสอบว่าเลยกำหนดส่งหรือยัง
    const dueDate = endOfDay(parseISO(formatDateYMD(apiJob.end_date)));
    const now = new Date();
    
    if (isBefore(dueDate, now)) {
      state = "Delay";
    } else {
      state = "In Progress";
    }
  }

  return {
    id: apiJob.job_number,
    job_number: apiJob.job_number,
    customer_name: apiJob.customer?.fullname || apiJob.customer?.name || "Unknown",
    quantity: apiJob.total_quantity,
    date: formatDateDMY(apiJob.end_date),
    end_date: formatDateYMD(apiJob.end_date),
    steps,
    state,
    job_id: apiJob.job_id,
  };
}

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
  const [month, setMonth] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<JobRow["state"] | "All">("All");
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [jobsResponse, stepsResponse, jobStepsResponse] = await Promise.all([
          fetch("http://localhost:4000/api/jobs"),
          fetch("http://localhost:4000/api/steps"),
          fetch("http://localhost:4000/api/jobsteps")
        ]);

        if (!jobsResponse.ok) throw new Error(`Jobs API: HTTP ${jobsResponse.status}`);
        if (!stepsResponse.ok) throw new Error(`Steps API: HTTP ${stepsResponse.status}`);
        if (!jobStepsResponse.ok) throw new Error(`JobSteps API: HTTP ${jobStepsResponse.status}`);
        
        const [apiJobs, apiSteps, apiJobSteps]: [APIJob[], Step[], JobStep[]] = await Promise.all([
          jobsResponse.json(),
          stepsResponse.json(),
          jobStepsResponse.json()
        ]);

        console.log("API Data:", { apiJobs, apiSteps, apiJobSteps }); // Debug log
        
        // Set steps and jobSteps first
        setSteps(apiSteps);
        setJobSteps(apiJobSteps);
        
        // Map jobs with steps data
        const mappedJobs = apiJobs.map(job => apiJobToJobRow(job, apiSteps, apiJobSteps));
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getState = (j: JobRow): JobRow["state"] => {
    // ใช้ state ที่คำนวณไว้แล้วใน apiJobToJobRow
    return j.state;
  };

  const events: CalendarEvent[] = useMemo(
    () =>
      jobs.map((j) => {
        const s = getState(j);
        const jobDate = parseISO(j.end_date);
        const today = new Date();
        
        // ตรวจสอบว่าเป็นวันนี้หรือไม่
        const isJobToday = isSameDay(jobDate, today);
        
        let color = "#3b82f6"; // default blue for In Progress
        
        if (s === "Done") {
          color = "#10b981"; // green
        } else if (s === "Delay") {
          color = "#ef4444"; // red
        } else if (isJobToday) {
          color = "#f59e0b"; // yellow/amber สำหรับงานที่ครบกำหนดวันนี้
        }
        
        return {
          id: j.id,
          date: jobDate,
          label: j.job_number,
          color: color,
        };
      }),
    [jobs],
  );

  const rows = jobs.filter((j) => {
    const dateMatch = selectedDate
      ? isSameDay(parseISO(j.end_date), selectedDate)
      : true;
    const statusMatch =
      statusFilter === "All" ? true : getState(j) === statusFilter;
    return dateMatch && statusMatch;
  });

  const counts = {
    done: jobs.filter((j) => getState(j) === "Done").length,
    inprogress: jobs.filter((j) => getState(j) === "In Progress").length,
    delay: jobs.filter((j) => getState(j) === "Delay").length,
  };

  const dueDates = useMemo(() => {
    const map = new Map<string, { date: Date; count: number }>();
    for (const j of jobs) {
      const d = parseISO(j.end_date);
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
  }, [month.getTime(), jobs]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading...</div>
        </div>
      </AppLayout>
    );
  }

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
              subtitle="Jobs"
              onClick={() => setStatusFilter("Done")}
              colorClass="text-emerald-600"
              icon={<CheckCircle2 className="h-5 w-5" />}
            />
            <StatusCard
              title="In Progress"
              value={`${counts.inprogress}`}
              subtitle="Jobs"
              onClick={() => setStatusFilter("In Progress")}
              colorClass="text-blue-600"
              icon={<Hourglass className="h-5 w-5" />}
            />
            <StatusCard
              title="Delay"
              value={`${counts.delay}`}
              subtitle="Jobs"
              onClick={() => setStatusFilter("Delay")}
              colorClass="text-rose-600"
              icon={<AlertCircle className="h-5 w-5" />}
            />
            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm text-slate-500">Due date</div>
              <div className="mt-2 text-slate-700 text-sm space-y-1">
                {dueDates.length > 0 ? (
                  dueDates.map((d) => (
                    <div key={d.date.toISOString()}>
                      {format(d.date, "dd/MM/yyyy")}{" "}
                      <span className="text-slate-400">
                        {d.count} {d.count === 1 ? "Job" : "Jobs"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400">No jobs this month</div>
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
                    <th>Customer</th>
                    <th>Quantity</th>
                    <th>Due Date</th>
                    <th>Steps</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    // หา steps ที่ job นี้มี (ไม่ว่าจะเสร็จหรือยัง)
                    const jobStepsForThisJob = jobSteps.filter(js => js.job_id === r.job_id);
                    const jobStepNames = jobStepsForThisJob.map(js => js.step.step_name);
                    
                    return (
                      <tr key={r.job_id} className="border-t">
                        <td className="py-2 font-medium text-slate-700">
                          {r.job_number}
                        </td>
                        <td>{r.customer_name}</td>
                        <td>{r.quantity}</td>
                        <td>{r.date}</td>
                        <td className="text-slate-700">
                          {jobStepNames.length > 0 
                            ? jobStepNames.join(", ")
                            : <span className="text-slate-400">No steps assigned</span>
                          }
                        </td>
                        <td>
                          <span className={cnStatus(getState(r))}>
                            {getState(r)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
