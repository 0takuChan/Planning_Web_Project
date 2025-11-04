import AppLayout from "@/components/layout/Sidebar";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Trash2 } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { usePermissions } from "@/App";

// Interface สำหรับข้อมูล Step จาก API
interface Step {
  step_id: number;
  step_name: string;
}

// Interface สำหรับข้อมูล Job ที่ใช้ใน Frontend
interface JobRow {
  id?: number;
  customer: string;
  job: string;
  quantity: number;
  date: string;
  selectedSteps: number[]; // เปลี่ยนจาก boolean fields เป็น array ของ step_id
  fabric: string;
  customer_id?: number;
  employee_id?: number;
}

// Interface สำหรับข้อมูลลูกค้า
interface Customer {
  customer_id: number;
  name: string;
  fullname: string;
  address_detail: string;
}

function generateJobId(existing: string[]): string {
  const now = new Date();
  const year = now.getFullYear();
  let sequence = 1;
  
  // หาลำดับล่าสุด
  const currentYearJobs = existing.filter(id => id.startsWith(`JO-${year}-`));
  if (currentYearJobs.length > 0) {
    const sequences = currentYearJobs
      .map(id => parseInt(id.split('-')[2]))
      .filter(num => !isNaN(num));
    if (sequences.length > 0) {
      sequence = Math.max(...sequences) + 1;
    }
  }
  
  return `JO-${year}-${sequence.toString().padStart(4, "0")}`;
}

// ฟังก์ชันแปลง yyyy-mm-dd เป็น dd/mm/yyyy
function formatDateDMY(date: string) {
  if (!date) return "";
  // ถ้าเป็น ISO format (มี T) ให้ split เอาแค่ส่วนวันที่
  const dateOnly = date.includes('T') ? date.split('T')[0] : date;
  const [y, m, d] = dateOnly.split("-");
  return `${d}/${m}/${y}`;
}

// ฟังก์ชันแปลง dd/mm/yyyy เป็น yyyy-mm-dd
function formatDateYMD(date: string) {
  if (!date) return "";
  
  // ถ้าเป็น yyyy-mm-dd อยู่แล้ว return เลย
  if (date.includes('-') && date.length === 10) {
    return date;
  }
  
  // ถ้าเป็น dd/mm/yyyy ให้แปลง
  if (date.includes('/')) {
    const [d, m, y] = date.split("/");
    if (d && m && y) {
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
  }
  
  return date; // fallback
}

export default function Jobs() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/jobs");
  
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<JobRow>({
    customer: "",
    job: "",
    quantity: 0,
    date: "",
    selectedSteps: [],
    fabric: "",
  });
  
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<JobRow>({
    customer: "",
    job: "",
    quantity: 0,
    date: "",
    selectedSteps: [],
    fabric: "",
  });
  
  const [sort, setSort] = useState<{ key: keyof JobRow; dir: 1 | -1 }>({
    key: "customer",
    dir: 1,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // Fetch current user's employee_id จาก localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log("Current user:", user); // Debug log
        if (user.id) {
          setCurrentEmployeeId(user.id); // user.id คือ employee_id
        }
      } catch (e) {
        console.error("Failed to parse user:", e);
        setError("Failed to get user information");
      }
    }
  }, []);

  // Fetch customers, jobs และ steps เมื่อ component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch ข้อมูลทั้งหมดแบบ parallel
        const [customersRes, stepsRes, jobsRes, jobStepsRes] = await Promise.all([
          fetch("http://localhost:4000/api/customers"),
          fetch("http://localhost:4000/api/steps"),
          fetch("http://localhost:4000/api/jobs"),
          fetch("http://localhost:4000/api/jobsteps")
        ]);

        // ตรวจสอบ response status
        if (!customersRes.ok) throw new Error(`Customers API: ${customersRes.status}`);
        if (!stepsRes.ok) throw new Error(`Steps API: ${stepsRes.status}`);
        if (!jobsRes.ok) throw new Error(`Jobs API: ${jobsRes.status}`);
        if (!jobStepsRes.ok) throw new Error(`JobSteps API: ${jobStepsRes.status}`);

        const [customersData, stepsData, jobsData, jobStepsData] = await Promise.all([
          customersRes.json(),
          stepsRes.json(),
          jobsRes.json(),
          jobStepsRes.json()
        ]);

        console.log("Fetched data:", { customersData, stepsData, jobsData, jobStepsData });

        setCustomers(customersData);
        setSteps(stepsData);

        // Map jobs data พร้อมกับ JobSteps
        const jobsWithSteps = jobsData.map((job: any) => {
          // หา JobSteps ที่เป็นของ job นี้
          const relatedJobSteps = jobStepsData.filter((js: any) => js.job_id === job.job_id);
          const selectedSteps = relatedJobSteps.map((js: any) => js.step_id);
          
          return {
            id: job.job_id,
            customer: job.customer?.fullname || job.customer?.name || "Unknown Customer",
            job: job.job_number,
            quantity: job.total_quantity || 0,
            date: job.end_date ? formatDateDMY(job.end_date.split('T')[0]) : "",
            selectedSteps: selectedSteps,
            fabric: job.type_of_fabric || "",
            customer_id: job.customer_id,
            employee_id: job.employee_id,
          };
        });
          
        setJobs(jobsWithSteps);
        
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
      jobs
        .slice()
        .sort((a, b) => {
          const aVal = a[sort.key];
          const bVal = b[sort.key];
          
          // Handle different data types
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return aVal.localeCompare(bVal) * sort.dir;
          }
          
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return (aVal - bVal) * sort.dir;
          }
          
          // Fallback
          return (aVal > bVal ? 1 : -1) * sort.dir;
        }),
    [jobs, sort]
  );

  const th = (k: keyof JobRow, label: string) => (
    <th
      className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
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

  const handleAdd = async () => {
    if (!isAddValid) return;

    // ตรวจสอบว่ามี employee_id หรือไม่
    if (!currentEmployeeId) {
      setError("Employee ID not found. Please login again.");
      return;
    }

    try {
      const selectedCustomer = customers.find(c => 
        c.fullname === draft.customer || c.name === draft.customer
      );

      if (!selectedCustomer) {
        setError("Please select a valid customer");
        return;
      }

      const payload = {
        created_date: new Date().toISOString().split('T')[0],
        end_date: formatDateYMD(draft.date),
        customer_id: selectedCustomer.customer_id,
        total_quantity: Number(draft.quantity),
        clothing_type: "Standard",
        type_of_fabric: draft.fabric,
        employee_id: currentEmployeeId,
        delivery_location: selectedCustomer.address_detail || "No address provided",
      };

      console.log("Creating job with payload:", payload);

      const response = await fetch("http://localhost:4000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to create job: ${errorText}`);
      }

      const newJob = await response.json();
      console.log("Job created:", newJob);
      
      // สร้าง JobStep สำหรับ steps ที่เลือก
      const jobStepPromises = draft.selectedSteps.map(stepId =>
        fetch("http://localhost:4000/api/jobsteps", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_id: newJob.job_id,
            step_id: stepId,
          }),
        })
      );

      // รอให้ JobSteps สร้างเสร็จทั้งหมด
      const jobStepResults = await Promise.allSettled(jobStepPromises);
      
      // Check for failures
      const failedJobSteps = jobStepResults.filter(result => result.status === 'rejected');
      if (failedJobSteps.length > 0) {
        console.warn("Some job steps failed to create:", failedJobSteps);
      }
      
      // แปลงเมื่อแสดงใน UI
      const mappedJob: JobRow = {
        id: newJob.job_id,
        customer: draft.customer,
        job: newJob.job_number,
        quantity: newJob.total_quantity,
        date: formatDateDMY(newJob.end_date),
        selectedSteps: draft.selectedSteps,
        fabric: newJob.type_of_fabric,
        customer_id: newJob.customer_id,
        employee_id: newJob.employee_id,
      };

      setJobs(prev => [...prev, mappedJob]);
      
      // Reset form
      setDraft({
        customer: "",
        job: "",
        quantity: 0,
        date: "",
        selectedSteps: [],
        fabric: "",
      });
      setOpen(false);
      setError(null);
      
    } catch (error) {
      console.error("Failed to add job:", error);
      setError(error instanceof Error ? error.message : "Failed to create job");
    }
  };

  const openEdit = (i: number) => {
    const job = sorted[i];
    const originalIndex = jobs.findIndex(j => j.id === job.id);
    setEditIndex(originalIndex);
    setEditDraft({...job});
  };

  const handleSaveEdit = async () => {
    if (editIndex === null) return;

    try {
      const jobId = jobs[editIndex].id;
      if (!jobId) return;

      const selectedCustomer = customers.find(c => 
        c.fullname === editDraft.customer || c.name === editDraft.customer
      );

      if (!selectedCustomer) {
        setError("Please select a valid customer");
        return;
      }

      const payload = {
        job_number: editDraft.job,
        created_date: new Date().toISOString().split('T')[0],
        end_date: formatDateYMD(editDraft.date),
        customer_id: selectedCustomer.customer_id,
        total_quantity: Number(editDraft.quantity),
        clothing_type: "Standard",
        type_of_fabric: editDraft.fabric,
        employee_id: editDraft.employee_id || currentEmployeeId,
        delivery_location: selectedCustomer.address_detail || "No address provided",
      };

      console.log("Updating job with payload:", payload);

      const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to update job: ${errorText}`);
      }

      const updatedJob = await response.json();
      console.log("Job updated:", updatedJob);

      // อัปเดต JobSteps
      // ลบ JobSteps เก่าทั้งหมดก่อน
      try {
        const existingJobStepsRes = await fetch("http://localhost:4000/api/jobsteps");
        if (existingJobStepsRes.ok) {
          const allJobSteps = await existingJobStepsRes.json();
          const jobStepsToDelete = allJobSteps.filter((js: any) => js.job_id === jobId);
          
          // ลบ JobSteps เก่า
          await Promise.all(
            jobStepsToDelete.map((js: any) =>
              fetch(`http://localhost:4000/api/jobsteps/${js.job_step_id}`, {
                method: "DELETE"
              })
            )
          );
          
          // สร้าง JobSteps ใหม่
          await Promise.all(
            editDraft.selectedSteps.map(stepId =>
              fetch("http://localhost:4000/api/jobsteps", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  job_id: jobId,
                  step_id: stepId,
                }),
              })
            )
          );
        }
      } catch (jsError) {
        console.warn("Failed to update job steps:", jsError);
      }

      // Update local state
      setJobs(prev => prev.map((job, idx) => 
        idx === editIndex ? editDraft : job
      ));
      
      setEditIndex(null);
      setEditDraft({
        customer: "",
        job: "",
        quantity: 0,
        date: "",
        selectedSteps: [],
        fabric: "",
      });
      setError(null);
      
    } catch (error) {
      console.error("Failed to update job:", error);
      setError(error instanceof Error ? error.message : "Failed to update job");
    }
  };

  const handleDelete = async () => {
    if (editIndex === null) return;

    try {
      const jobId = jobs[editIndex].id;
      if (!jobId) return;

      const response = await fetch(`http://localhost:4000/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to delete job: ${errorText}`);
      }

      // Remove from local state
      setJobs(prev => prev.filter((_, idx) => idx !== editIndex));
      setEditIndex(null);
      setDeleteDialogOpen(false);
      setError(null);
      
    } catch (error) {
      console.error("Failed to delete job:", error);
      setError(error instanceof Error ? error.message : "Failed to delete job");
      setDeleteDialogOpen(false);
    }
  };

  const isEditChanged = editIndex !== null && (() => {
    const original = jobs[editIndex];
    return (
      original.customer !== editDraft.customer ||
      original.job !== editDraft.job ||
      original.quantity !== editDraft.quantity ||
      original.date !== editDraft.date ||
      JSON.stringify(original.selectedSteps.sort()) !== JSON.stringify(editDraft.selectedSteps.sort()) ||
      original.fabric !== editDraft.fabric
    );
  })();

  const handleCustomerChange = (value: string) => {
    const existingIds = jobs.map((r) => r.job);
    const newId = generateJobId(existingIds);
    setDraft((prev) => ({
      ...prev,
      customer: value,
      job: newId,
    }));
  };

  // Helper function สำหรับ toggle step selection
  const toggleStepSelection = (stepId: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditDraft(prev => ({
        ...prev,
        selectedSteps: prev.selectedSteps.includes(stepId)
          ? prev.selectedSteps.filter(id => id !== stepId)
          : [...prev.selectedSteps, stepId]
      }));
    } else {
      setDraft(prev => ({
        ...prev,
        selectedSteps: prev.selectedSteps.includes(stepId)
          ? prev.selectedSteps.filter(id => id !== stepId)
          : [...prev.selectedSteps, stepId]
      }));
    }
  };

  // ปรับ validation
  const isAddValid =
    draft.customer.trim() !== "" &&
    draft.job.trim() !== "" &&
    draft.quantity > 0 &&
    draft.date.trim() !== "" &&
    draft.fabric.trim() !== "" &&
    customers.some(c => c.fullname === draft.customer || c.name === draft.customer) &&
    currentEmployeeId !== null &&
    draft.selectedSteps.length > 0;

  // เพิ่มฟังก์ชันสำหรับ get วันที่ปัจจุบันในรูปแบบ yyyy-mm-dd
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading jobs data...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Job Management</h1>
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
              Jobs • {jobs.length} total
              {currentEmployeeId && (
                <span className="text-xs text-slate-400 ml-2">
                  (Employee ID: {currentEmployeeId})
                </span>
              )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={!canEditPage || !currentEmployeeId}>
                  Add Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Add New Job</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4 text-sm">
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Customer *</label>
                        <select
                          className="mt-1 w-full border rounded px-3 py-2 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          value={draft.customer}
                          onChange={(e) => handleCustomerChange(e.target.value)}
                        >
                          <option value="">Select Customer</option>
                          {customers.map((c) => (
                            <option key={c.customer_id} value={c.fullname}>
                              {c.fullname}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Job Number</label>
                        <div className="mt-1 w-full border rounded px-3 py-2 bg-gray-50 text-slate-700">
                          {draft.job || "Auto-generated"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Quantity *</label>
                        <input
                          className="mt-1 w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter quantity"
                          type="number"
                          min="1"
                          value={draft.quantity || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              quantity: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Due Date *</label>
                        <input
                          className="mt-1 w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          type="date"
                          value={formatDateYMD(draft.date)}
                          min={getTodayDate()}
                          onChange={(e) =>
                            setDraft({ ...draft, date: formatDateDMY(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-medium">Fabric Type *</label>
                        <Select
                          value={draft.fabric}
                          onValueChange={(value) =>
                            setDraft({ ...draft, fabric: value })
                          }
                        >
                          <SelectTrigger className="mt-1 w-full border rounded px-3 py-2 bg-white">
                            <SelectValue placeholder="Select Fabric Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="polyester">Polyester</SelectItem>
                            <SelectItem value="silk">Silk</SelectItem>
                            <SelectItem value="wool">Wool</SelectItem>
                            <SelectItem value="linen">Linen</SelectItem>
                            <SelectItem value="denim">Denim</SelectItem>
                            <SelectItem value="lycra">Lycra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAdd}
                          disabled={!canEditPage || !isAddValid}
                          className={!isAddValid ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          Create Job
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 md:bg-gradient-to-br md:from-[hsl(var(--brand-start))] md:to-[hsl(var(--brand-end))]">
                    <div className="rounded-lg border bg-white/90 backdrop-blur p-4 shadow">
                      <div className="font-medium mb-2">Production Steps *</div>
                      <div className="text-xs text-slate-500 mb-3">
                        Select the steps required for this job. At least one step must be selected.
                      </div>
                      <div className="space-y-2 text-sm max-h-80 overflow-y-auto">
                        {steps.map((step) => (
                          <label
                            key={step.step_id}
                            className="flex items-center justify-between rounded border px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            <span className="capitalize">{step.step_name}</span>
                            <input
                              type="checkbox"
                              checked={draft.selectedSteps.includes(step.step_id)}
                              onChange={() => toggleStepSelection(step.step_id, false)}
                              className="rounded"
                            />
                          </label>
                        ))}
                      </div>
                      {draft.selectedSteps.length === 0 && (
                        <div className="text-xs text-red-500 mt-2">
                          Please select at least one step
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm">
              <thead className="text-slate-500 bg-gray-50">
                <tr>
                  {th("customer", "Customer")}
                  {th("job", "Job Number")}
                  {th("quantity", "Quantity")}
                  {th("date", "Due Date")}
                  <th className="px-2 py-2">Production Steps</th>
                  {th("fabric", "Fabric Type")}
                  <th className="text-right px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No jobs found. Click "Add Job" to create your first job.
                    </td>
                  </tr>
                ) : (
                  sorted.map((r, i) => (
                    <tr key={r.id || i} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-slate-700">{r.customer}</td>
                      <td className="py-3 px-2 font-mono text-sm">{r.job}</td>
                      <td className="py-3 px-2">{r.quantity}</td>
                      <td className="py-3 px-2">{r.date}</td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {r.selectedSteps.length > 0 ? (
                            r.selectedSteps.map(stepId => {
                              const step = steps.find(s => s.step_id === stepId);
                              return step ? (
                                <span
                                  key={stepId}
                                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {step.step_name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-slate-400 italic text-xs">No steps assigned</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 capitalize">{r.fabric}</td>
                      <td className="py-3 px-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(i)}
                          disabled={!canEditPage}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={editIndex !== null} onOpenChange={(o) => { if (!o) setEditIndex(null); }}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6">
              <DialogHeader>
                <DialogTitle className="text-xl">Edit Job</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <label className="text-xs text-slate-500 font-medium">Customer</label>
                  <select
                    className="mt-1 w-full border rounded px-3 py-2 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={editDraft.customer}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, customer: e.target.value })
                    }
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.customer_id} value={c.fullname}>
                        {c.fullname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Job Number</label>
                  <div className="mt-1 w-full border rounded px-3 py-2 bg-gray-50 text-slate-700 font-mono text-sm">
                    {editDraft.job || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Fabric Type</label>
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
                      <SelectItem value="silk">Silk</SelectItem>
                      <SelectItem value="wool">Wool</SelectItem>
                      <SelectItem value="linen">Linen</SelectItem>
                      <SelectItem value="denim">Denim</SelectItem>
                      <SelectItem value="lycra">Lycra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Quantity</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter quantity"
                    type="number"
                    min="1"
                    value={editDraft.quantity || ""}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Due Date</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    type="date"
                    value={formatDateYMD(editDraft.date)}
                    min={getTodayDate()}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, date: formatDateDMY(e.target.value) })
                    }
                  />
                </div>
                <div className="mt-6 flex justify-between gap-3">
                  <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={!canEditPage}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <Trash2 className="h-5 w-5 text-red-500" />
                          Delete Job Confirmation
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <div>
                            Are you sure you want to delete this job? This action cannot be undone.
                          </div>
                          {editIndex !== null && (
                            <div className="bg-gray-50 p-3 rounded-lg border">
                              <div className="text-sm font-medium text-gray-900">Job Details:</div>
                              <div className="text-sm text-gray-600 mt-1 space-y-1">
                                <div><strong>Job Number:</strong> {jobs[editIndex]?.job}</div>
                                <div><strong>Customer:</strong> {jobs[editIndex]?.customer}</div>
                                <div><strong>Quantity:</strong> {jobs[editIndex]?.quantity}</div>
                                <div><strong>Due Date:</strong> {jobs[editIndex]?.date}</div>
                              </div>
                            </div>
                          )}
                          <div className="text-red-600 text-sm font-medium">
                            ⚠️ This will permanently remove the job and all associated production steps.
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          Delete Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setEditIndex(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={!canEditPage || !isEditChanged}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 md:bg-gradient-to-br md:from-[hsl(var(--brand-start))] md:to-[hsl(var(--brand-end))]">
              <div className="rounded-lg border bg-white/90 backdrop-blur p-4 shadow">
                <div className="font-medium mb-2">Production Steps</div>
                <div className="text-xs text-slate-500 mb-3">
                  Modify the steps required for this job.
                </div>
                <div className="space-y-2 text-sm max-h-80 overflow-y-auto">
                  {steps.map((step) => (
                    <label
                      key={step.step_id}
                      className="flex items-center justify-between rounded border px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="capitalize">{step.step_name}</span>
                      <input
                        type="checkbox"
                        checked={editDraft.selectedSteps.includes(step.step_id)}
                        onChange={() => toggleStepSelection(step.step_id, true)}
                        className="rounded"
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
