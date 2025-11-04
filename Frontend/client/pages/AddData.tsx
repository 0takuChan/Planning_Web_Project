import { useMemo, useState, useEffect } from "react";
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
import { usePermissions } from "@/App";

// Interfaces สำหรับ API data
interface Job {
  job_id: number;
  job_number: string;
  end_date: string;
  customer?: {
    fullname: string;
    name: string;
  };
}

interface JobStep {
  job_step_id: number;
  job_id: number;
  step_id: number;
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
  job?: Job;
  jobStep?: JobStep;
  employee?: {
    employee_id: number;
    fullname: string;
  };
}

interface Employee {
  employee_id: number;
  fullname: string;
  username: string;
}

// Interface สำหรับ form data
interface ProductionLogForm {
  job_step_id: number | null;
  log_date: string;
  quantity: number;
  job_display?: string; // สำหรับแสดงใน UI
  step_display?: string; // สำหรับแสดงใน UI
}

type DataField = "job_step_id" | "log_date" | "quantity";

type FormFieldsProps = {
  values: ProductionLogForm;
  onChange: (field: keyof ProductionLogForm, value: string | number) => void;
  invalid?: Partial<Record<DataField, boolean>>;
  mode?: "add" | "edit";
  jobs: Job[];
  jobSteps: JobStep[];
  employees: Employee[];
};

const emptyDraft = (): ProductionLogForm => ({
  job_step_id: null,
  log_date: "",
  quantity: 0,
  job_display: "",
  step_display: "",
});

// ฟังก์ชันแปลงวันที่
function formatDateDMY(date: string) {
  if (!date) return "";
  const dateOnly = date.includes('T') ? date.split('T')[0] : date;
  const [y, m, d] = dateOnly.split("-");
  return `${d}/${m}/${y}`;
}

function formatDateYMD(date: string) {
  if (!date) return "";
  
  if (date.includes('-') && date.length === 10) {
    return date;
  }
  
  if (date.includes('/')) {
    const [d, m, y] = date.split("/");
    if (d && m && y) {
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }
  
  return date;
}

const FormFields = ({
  values,
  onChange,
  invalid,
  mode = "add",
  jobs,
  jobSteps,
}: FormFieldsProps) => {
  const base =
    "rounded-lg border px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:outline-none ";
  const ok =
    "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))] focus:border-transparent";
  const bad = "border-red-500 focus:ring-2 focus:ring-red-500";

  // Group job steps by job
  const jobStepsByJob = useMemo(() => {
    const groups: Record<number, JobStep[]> = {};
    jobSteps.forEach(js => {
      if (!groups[js.job_id]) {
        groups[js.job_id] = [];
      }
      groups[js.job_id].push(js);
    });
    return groups;
  }, [jobSteps]);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const availableSteps = selectedJobId ? (jobStepsByJob[selectedJobId] || []) : [];

  // เมื่อเปลี่ยน job ให้ reset step
  const handleJobChange = (jobId: number | null) => {
    setSelectedJobId(jobId);
    onChange("job_step_id", null);
    
    if (jobId) {
      const job = jobs.find(j => j.job_id === jobId);
      onChange("job_display", job?.job_number || "");
    } else {
      onChange("job_display", "");
    }
    onChange("step_display", "");
  };

  const handleStepChange = (jobStepId: number | null) => {
    onChange("job_step_id", jobStepId);
    
    if (jobStepId) {
      const jobStep = jobSteps.find(js => js.job_step_id === jobStepId);
      onChange("step_display", jobStep?.step.step_name || "");
    } else {
      onChange("step_display", "");
    }
  };

  // สำหรับ edit mode ให้ set selected job จาก existing data
  useEffect(() => {
    if (mode === "edit" && values.job_step_id) {
      const jobStep = jobSteps.find(js => js.job_step_id === values.job_step_id);
      if (jobStep) {
        setSelectedJobId(jobStep.job_id);
      }
    }
  }, [mode, values.job_step_id, jobSteps]);

  return (
    <div className="mt-6 space-y-4 text-sm">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Job
        {mode === "edit" ? (
          <div className="rounded-lg border px-3 py-2 text-sm text-slate-700 bg-gray-50">
            {values.job_display || "-"}
          </div>
        ) : (
          <select
            className={`${base} ${invalid?.job_step_id ? bad : ok}`}
            value={selectedJobId || ""}
            onChange={(e) => handleJobChange(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.job_id} value={job.job_id}>
                {job.job_number} - {job.customer?.fullname || job.customer?.name || "Unknown Customer"}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Step
        {mode === "edit" ? (
          <div className="rounded-lg border px-3 py-2 text-sm text-slate-700 bg-gray-50">
            {values.step_display || "-"}
          </div>
        ) : (
          <select
            className={`${base} ${invalid?.job_step_id ? bad : ok}`}
            value={values.job_step_id || ""}
            onChange={(e) => handleStepChange(e.target.value ? Number(e.target.value) : null)}
            disabled={!selectedJobId}
          >
            <option value="">Select Step</option>
            {availableSteps.map((jobStep) => (
              <option key={jobStep.job_step_id} value={jobStep.job_step_id}>
                {jobStep.step.step_name}
              </option>
            ))}
          </select>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Quantity
        <input
          type="number"
          className={`${base} ${invalid?.quantity ? bad : ok}`}
          placeholder="Quantity"
          min="1"
          value={values.quantity || ""}
          onChange={(e) => onChange("quantity", Number(e.target.value))}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Recording date
        <input
          type="date"
          className={`${base} ${invalid?.log_date ? bad : ok}`}
          value={formatDateYMD(values.log_date)}
          onChange={(e) => onChange("log_date", formatDateDMY(e.target.value))}
        />
      </label>
    </div>
  );
};

export default function AddData() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/add-data");

  // State สำหรับข้อมูล
  const [productionLogs, setProductionLogs] = useState<ProductionLog[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);

  // State สำหรับ form
  const [openAdd, setOpenAdd] = useState(false);
  const [draft, setDraft] = useState<ProductionLogForm>(emptyDraft());

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<ProductionLogForm>(emptyDraft());

  const [sort, setSort] = useState<{ key: keyof ProductionLog; dir: 1 | -1 }>({
    key: "log_date",
    dir: -1, // ใหม่ที่สุดก่อน
  });

  // Fetch current user
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) {
          setCurrentEmployeeId(user.id);
        }
      } catch (e) {
        console.error("Failed to parse user:", e);
        setError("Failed to get user information");
      }
    }
  }, []);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [jobsRes, jobStepsRes, productionLogsRes, employeesRes] = await Promise.all([
          fetch("http://localhost:4000/api/jobs"),
          fetch("http://localhost:4000/api/jobsteps"),
          fetch("http://localhost:4000/api/productionlogs"),
          fetch("http://localhost:4000/api/employee")
        ]);

        if (!jobsRes.ok) throw new Error(`Jobs API: ${jobsRes.status}`);
        if (!jobStepsRes.ok) throw new Error(`JobSteps API: ${jobStepsRes.status}`);
        if (!productionLogsRes.ok) throw new Error(`ProductionLogs API: ${productionLogsRes.status}`);
        if (!employeesRes.ok) throw new Error(`Employees API: ${employeesRes.status}`);

        const [jobsData, jobStepsData, productionLogsData, employeesData] = await Promise.all([
          jobsRes.json(),
          jobStepsRes.json(),
          productionLogsRes.json(),
          employeesRes.json()
        ]);

        console.log("Fetched data:", { jobsData, jobStepsData, productionLogsData, employeesData });

        setJobs(jobsData);
        setJobSteps(jobStepsData);
        setProductionLogs(productionLogsData);
        setEmployees(employeesData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sorted = useMemo(
    () =>
      productionLogs
        .slice()
        .sort((a, b) => {
          const aVal = a[sort.key];
          const bVal = b[sort.key];
          
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * sort.dir;
          }
          
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * sort.dir;
          }
          
          return (aVal > bVal ? 1 : -1) * sort.dir;
        }),
    [productionLogs, sort],
  );

  const th = (k: keyof ProductionLog, label: string) => (
    <th
      className="cursor-pointer select-none hover:bg-gray-50 px-2 py-1 rounded"
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
    draft.job_step_id !== null &&
    draft.log_date.trim() !== "" &&
    Number(draft.quantity) > 0 &&
    currentEmployeeId !== null;

  const isEditValid =
    editDraft.job_step_id !== null &&
    editDraft.log_date.trim() !== "" &&
    Number(editDraft.quantity) > 0;

  const add = async () => {
    if (!isAddValid || !currentEmployeeId) return;

    try {
      const payload = {
        job_step_id: draft.job_step_id!,
        log_date: formatDateYMD(draft.log_date),
        quantity: Number(draft.quantity),
        employee_id: currentEmployeeId,
      };

      console.log("Creating production log:", payload);

      const response = await fetch("http://localhost:4000/api/productionlogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to create production log: ${errorText}`);
      }

      const newLog = await response.json();
      console.log("Production log created:", newLog);

      // เพิ่มใน local state (ต้อง fetch ใหม่เพื่อให้ได้ข้อมูล include)
      // หรือ refresh data
      window.location.reload(); // ง่ายที่สุด หรือ fetch ใหม่
      
      setDraft(emptyDraft());
      setOpenAdd(false);
      setError(null);
      
    } catch (error) {
      console.error("Failed to add production log:", error);
      setError(error instanceof Error ? error.message : "Failed to create production log");
    }
  };

  const openEdit = (index: number) => {
    const log = sorted[index];
    const originalIndex = productionLogs.findIndex(l => l.log_id === log.log_id);
    setEditIdx(originalIndex);
    
    // Map ข้อมูลไปยัง form
    const jobStep = jobSteps.find(js => js.job_step_id === log.job_step_id);
    const job = jobs.find(j => j.job_id === log.job_id);
    
    setEditDraft({
      job_step_id: log.job_step_id,
      log_date: formatDateDMY(log.log_date),
      quantity: log.quantity,
      job_display: job?.job_number || "",
      step_display: jobStep?.step.step_name || "",
    });
  };

  const update = async () => {
    if (editIdx === null || !isEditValid) return;

    try {
      const logId = productionLogs[editIdx].log_id;
      
      const payload = {
        job_step_id: editDraft.job_step_id!,
        log_date: formatDateYMD(editDraft.log_date),
        quantity: Number(editDraft.quantity),
        employee_id: productionLogs[editIdx].employee_id, // เก็บ employee เดิม
      };

      console.log("Updating production log:", payload);

      const response = await fetch(`http://localhost:4000/api/productionlogs/${logId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to update production log: ${errorText}`);
      }

      // Refresh data
      window.location.reload();
      
    } catch (error) {
      console.error("Failed to update production log:", error);
      setError(error instanceof Error ? error.message : "Failed to update production log");
    }
  };

  const remove = async () => {
    if (editIdx === null) return;
    
    if (!window.confirm("Are you sure you want to delete this production log?")) {
      return;
    }

    try {
      const logId = productionLogs[editIdx].log_id;

      const response = await fetch(`http://localhost:4000/api/productionlogs/${logId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to delete production log: ${errorText}`);
      }

      // Remove from local state
      setProductionLogs(prev => prev.filter((_, idx) => idx !== editIdx));
      setEditIdx(null);
      setEditDraft(emptyDraft());
      setError(null);
      
    } catch (error) {
      console.error("Failed to delete production log:", error);
      setError(error instanceof Error ? error.message : "Failed to delete production log");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading production data...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Production Data</h1>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="text-red-800 text-sm">{error}</div>
            <button 
              onClick={() => setError(null)}
              className="text-red-600 text-xs underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">
              Production Logs • {productionLogs.length} total
              {currentEmployeeId && (
                <span className="text-xs text-slate-400 ml-2">
                  (Employee ID: {currentEmployeeId})
                </span>
              )}
            </div>

            <Dialog
              open={openAdd}
              onOpenChange={(open) => {
                setOpenAdd(open);
                if (!open) setDraft(emptyDraft());
              }}
            >
              <DialogTrigger asChild>
                <Button disabled={!canEditPage || !currentEmployeeId}>+ Add Data</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl overflow-hidden border-0 p-0 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">
                  <div className="p-8">
                    <DialogHeader className="space-y-4 text-left">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white shadow-lg">
                        <LayoutGrid className="h-6 w-6" strokeWidth={1.8} />
                      </div>
                      <DialogTitle className="text-2xl font-semibold text-slate-900">
                        Add Production Data
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-500">
                        Enter the details below to record actual production data.
                      </DialogDescription>
                    </DialogHeader>

                    <FormFields
                      mode="add"
                      values={draft}
                      invalid={{
                        job_step_id: draft.job_step_id === null,
                        quantity: Number(draft.quantity) <= 0,
                        log_date: draft.log_date.trim() === "",
                      }}
                      onChange={(field, value) =>
                        setDraft((d) => ({ ...d, [field]: value }))
                      }
                      jobs={jobs}
                      jobSteps={jobSteps}
                      employees={employees}
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
              <thead className="text-slate-500 bg-gray-50">
                <tr>
                  {th("job_id", "Job")}
                  {th("job_step_id", "Step")}
                  {th("quantity", "Quantity")}
                  {th("log_date", "Recording date")}
                  <th className="text-right px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No production logs found. Click "Add Data" to create your first log.
                    </td>
                  </tr>
                ) : (
                  sorted.map((log, i) => {
                    const job = jobs.find(j => j.job_id === log.job_id);
                    const jobStep = jobSteps.find(js => js.job_step_id === log.job_step_id);
                    
                    return (
                      <tr key={log.log_id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-2 font-medium text-slate-700">
                          {job?.job_number || `Job ${log.job_id}`}
                        </td>
                        <td className="py-3 px-2">
                          {jobStep?.step.step_name || "Unknown Step"}
                        </td>
                        <td className="py-3 px-2">{log.quantity}</td>
                        <td className="py-3 px-2">{formatDateDMY(log.log_date)}</td>
                        <td className="py-3 px-2 text-right">
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
                    );
                  })
                )}
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
                  Edit Production Data
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  Update the details below to modify production records.
                </DialogDescription>
              </DialogHeader>

              <FormFields
                mode="edit"
                values={editDraft}
                invalid={{
                  job_step_id: editDraft.job_step_id === null,
                  quantity: Number(editDraft.quantity) <= 0,
                  log_date: editDraft.log_date.trim() === "",
                }}
                onChange={(field, value) =>
                  setEditDraft((d) => ({ ...d, [field]: value }))
                }
                jobs={jobs}
                jobSteps={jobSteps}
                employees={employees}
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
