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
  isValid,
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

interface ProductionLog {
  log_id: number;
  job_id: number;
  job_step_id: number;
  log_date: string;
  quantity: number;
  employee_id: number;
  dateline_date: string;
}

interface Customer {
  customer_id: number;
  fullname?: string;
  name?: string;
}

interface Employee {
  employee_id: number;
  fullname: string;
  username: string;
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
  customer?: Customer;
  employee?: Employee;
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
    completed_quantity: number;
    total_quantity: number;
    progress_percentage: number;
    isCompleted: boolean;
  }[];
  state: "Done" | "In Progress" | "Delay";
  job_id: number;
  clothing_type: string;
  type_of_fabric: string;
  delivery_location: string;
}

function formatDateDMY(date: string) {
  if (!date) return "";
  try {
    const dateOnly = date.includes('T') ? date.split('T')[0] : date;
    const parsedDate = parseISO(dateOnly);
    if (!isValid(parsedDate)) return "";
    return format(parsedDate, "dd/MM/yyyy");
  } catch {
    return "";
  }
}

function formatDateYMD(date: string) {
  if (!date) return "";
  try {
    const dateOnly = date.includes('T') ? date.split('T')[0] : date;
    const parsedDate = parseISO(dateOnly);
    if (!isValid(parsedDate)) return "";
    return format(parsedDate, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

function safeParseDateISO(dateStr: string): Date | null {
  if (!dateStr) return null;
  try {
    const dateOnly = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const parsed = parseISO(dateOnly);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function apiJobToJobRow(
  apiJob: APIJob, 
  allSteps: Step[], 
  jobSteps: JobStep[], 
  productionLogs: ProductionLog[]
): JobRow {
  // หา steps ที่เกี่ยวข้องกับ job นี้
  const jobRelatedSteps = jobSteps.filter(js => js.job_id === apiJob.job_id);
  
  // สร้าง mapping ของ steps พร้อม progress
  const steps = jobRelatedSteps.map(js => {
    // หา production logs สำหรับ job step นี้
    const logsForThisStep = productionLogs.filter(log => log.job_step_id === js.job_step_id);
    
    // คำนวณ total completed quantity สำหรับ step นี้
    const completedQuantity = logsForThisStep.reduce((sum, log) => sum + log.quantity, 0);
    
    // คำนวณ progress percentage
    const progressPercentage = apiJob.total_quantity > 0 
      ? Math.min(100, Math.round((completedQuantity / apiJob.total_quantity) * 100))
      : 0;
    
    const isCompleted = completedQuantity >= apiJob.total_quantity;
    
    return {
      step_name: js.step.step_name,
      completed_quantity: completedQuantity,
      total_quantity: apiJob.total_quantity,
      progress_percentage: progressPercentage,
      isCompleted: isCompleted,
    };
  });

  // คำนวณสถานะ overall job
  let state: JobRow["state"] = "In Progress";
  
  // ตรวจสอบว่าทุก step เสร็จแล้วหรือยัง
  const allStepsCompleted = steps.length > 0 && steps.every(step => step.isCompleted);
  
  if (allStepsCompleted) {
    state = "Done";
  } else {
    // ตรวจสอบวันที่
    const dueDate = safeParseDateISO(apiJob.end_date);
    if (dueDate) {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const dueDateStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      
      if (dueDateStart < todayStart) {
        state = "Delay";
      }
    }
  }

  return {
    id: apiJob.job_number,
    job_number: apiJob.job_number,
    customer_name: apiJob.customer?.fullname || apiJob.customer?.name || "Unknown Customer",
    quantity: apiJob.total_quantity,
    date: formatDateDMY(apiJob.end_date),
    end_date: formatDateYMD(apiJob.end_date),
    steps,
    state,
    job_id: apiJob.job_id,
    clothing_type: apiJob.clothing_type,
    type_of_fabric: apiJob.type_of_fabric,
    delivery_location: apiJob.delivery_location,
  };
}

// Component สำหรับแสดง progress bar
function StepProgressBar({ 
  stepName, 
  completedQuantity, 
  totalQuantity, 
  progressPercentage, 
  isCompleted 
}: {
  stepName: string;
  completedQuantity: number;
  totalQuantity: number;
  progressPercentage: number;
  isCompleted: boolean;
}) {
  const getProgressColor = () => {
    if (isCompleted) return "bg-green-500";
    if (progressPercentage >= 50) return "bg-blue-500";
    if (progressPercentage >= 25) return "bg-yellow-500";
    return "bg-gray-300";
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
        {stepName}
      </span>
      
      {/* หลอดแนวตั้งสั้นๆ เติมจากล่างขึ้นบน */}
      <div className="w-2 h-6 bg-gray-200 rounded-full overflow-hidden flex items-end">
        <div 
          className={`w-full transition-all duration-300 ${getProgressColor()} rounded-full`}
          style={{ height: `${progressPercentage}%` }}
        />
      </div>
      
      <span className="text-xs text-slate-500 whitespace-nowrap">
        {completedQuantity}/{totalQuantity}
      </span>
      
      {isCompleted && (
        <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
      )}
    </div>
  );
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
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching data from APIs...");
        
        // Fetch all data in parallel
        const [jobsResponse, stepsResponse, jobStepsResponse, productionLogsResponse] = await Promise.all([
          fetch("http://localhost:4000/api/jobs"),
          fetch("http://localhost:4000/api/steps"),
          fetch("http://localhost:4000/api/jobsteps"),
          fetch("http://localhost:4000/api/productionlogs")
        ]);

        // Check responses
        if (!jobsResponse.ok) {
          throw new Error(`Jobs API error: ${jobsResponse.status} ${jobsResponse.statusText}`);
        }
        if (!stepsResponse.ok) {
          throw new Error(`Steps API error: ${stepsResponse.status} ${stepsResponse.statusText}`);
        }
        if (!jobStepsResponse.ok) {
          throw new Error(`JobSteps API error: ${jobStepsResponse.status} ${jobStepsResponse.statusText}`);
        }
        if (!productionLogsResponse.ok) {
          throw new Error(`ProductionLogs API error: ${productionLogsResponse.status} ${productionLogsResponse.statusText}`);
        }
        
        const [apiJobs, apiSteps, apiJobSteps, apiProductionLogs]: [APIJob[], Step[], JobStep[], ProductionLog[]] = await Promise.all([
          jobsResponse.json(),
          stepsResponse.json(),
          jobStepsResponse.json(),
          productionLogsResponse.json()
        ]);

        console.log("API Response - Jobs:", apiJobs.length, "items");
        console.log("API Response - Steps:", apiSteps.length, "items");
        console.log("API Response - JobSteps:", apiJobSteps.length, "items");
        console.log("API Response - ProductionLogs:", apiProductionLogs.length, "items");
        
        // Set steps, jobSteps และ productionLogs first
        setSteps(apiSteps);
        setJobSteps(apiJobSteps);
        setProductionLogs(apiProductionLogs);
        
        // Map jobs with steps data และ production progress
        const mappedJobs = apiJobs.map(job => apiJobToJobRow(job, apiSteps, apiJobSteps, apiProductionLogs));
        console.log("Mapped Jobs with Progress:", mappedJobs);
        
        setJobs(mappedJobs);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch data");
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

  const events: CalendarEvent[] = useMemo(() => {
    const validEvents = jobs
      .map((j) => {
        const jobDate = safeParseDateISO(j.end_date);
        if (!jobDate) return null;

        const s = getState(j);
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
        } as CalendarEvent;
      })
      .filter((event): event is CalendarEvent => event !== null);

    console.log("Calendar Events generated:", validEvents.length);
    return validEvents;
  }, [jobs]);

  const rows = jobs.filter((j) => {
    const dateMatch = selectedDate && j.end_date
      ? (() => {
          const jobDate = safeParseDateISO(j.end_date);
          return jobDate ? isSameDay(jobDate, selectedDate) : false;
        })()
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
      const jobDate = safeParseDateISO(j.end_date);
      if (!jobDate || !isSameMonth(jobDate, month)) continue;
      
      const key = format(jobDate, "yyyy-MM-dd");
      const prev = map.get(key);
      if (prev) {
        prev.count += 1;
      } else {
        map.set(key, { date: jobDate, count: 1 });
      }
    }
    
    const result = Array.from(map.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    
    console.log("Due Dates for month:", format(month, "MMMM yyyy"), "->", result.length, "dates");
    return result;
  }, [month.getTime(), jobs]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading dashboard data...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error: {error}</div>
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
                className="px-2 py-1 rounded border hover:bg-gray-50"
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
                className="px-2 py-1 rounded border hover:bg-gray-50"
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
                {selectedDate && (
                  <span className="text-sm text-slate-500">
                    Filtered by: {format(selectedDate, "dd/MM/yyyy")}
                  </span>
                )}
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
              <table className="min-w-[900px] w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 w-24">Job Number</th>
                    <th className="w-32">Customer</th>
                    <th className="w-20">Quantity</th>
                    <th className="w-24">Due Date</th>
                    <th className="w-80">Production Steps Progress</th>
                    <th className="w-20">State</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {selectedDate 
                          ? `No jobs found for ${format(selectedDate, "dd/MM/yyyy")}`
                          : statusFilter !== "All" 
                          ? `No jobs with status "${statusFilter}"`
                          : "No jobs found"
                        }
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => {
                      return (
                        <tr key={r.job_id} className="border-t hover:bg-gray-50">
                          <td className="py-3 font-medium text-slate-700">
                            {r.job_number}
                          </td>
                          <td className="text-slate-600">{r.customer_name}</td>
                          <td className="text-slate-600">{r.quantity}</td>
                          <td className="text-slate-600">{r.date}</td>
                          <td className="py-3">
                            {r.steps.length > 0 ? (
                              <div className="flex flex-wrap items-center gap-3">
                                {r.steps.map((step, stepIndex) => (
                                  <StepProgressBar
                                    key={stepIndex}
                                    stepName={step.step_name}
                                    completedQuantity={step.completed_quantity}
                                    totalQuantity={step.total_quantity}
                                    progressPercentage={step.progress_percentage}
                                    isCompleted={step.isCompleted}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-xs">No steps assigned</span>
                            )}
                          </td>
                          <td>
                            <span className={cnStatus(getState(r))}>
                              {getState(r)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
      className="rounded-lg border bg-white p-4 text-left hover:shadow-md transition-shadow"
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
    return "inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs font-medium";
  if (state === "Delay")
    return "inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-xs font-medium";
  return "inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium";
}
