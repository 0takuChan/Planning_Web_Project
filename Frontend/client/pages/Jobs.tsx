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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
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
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  let id = "";
  let tries = 0;
  do {
    const time = Date.now().toString();
    id = `JO-${year}-${month}${day}${time}`;
    tries++;
    if (tries > 10) break;
  } while (existing.includes(id));
  return id;
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
      }
    }
  }, []);

  // Fetch customers, jobs และ steps เมื่อ component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch customers
        const customersRes = await fetch("http://localhost:4000/api/customers");
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData);
        }

        // Fetch steps
        const stepsRes = await fetch("http://localhost:4000/api/steps");
        if (stepsRes.ok) {
          const stepsData = await stepsRes.json();
          setSteps(stepsData);
          console.log("Steps loaded:", stepsData); // Debug log
        }

        // Fetch jobs
        const jobsRes = await fetch("http://localhost:4000/api/jobs");
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          
          // แปลงข้อมูลจาก API format เป็น frontend format
          const mappedJobs: JobRow[] = jobsData.map((job: any) => ({
            id: job.job_id,
            customer: job.customer?.fullname || job.customer?.name || "",
            job: job.job_number,
            quantity: job.total_quantity || 0,
            date: job.end_date ? formatDateDMY(job.end_date.split('T')[0]) : "",
            selectedSteps: [], // TODO: ดึงจาก JobStep table
            fabric: job.type_of_fabric || "",
            customer_id: job.customer_id,
            employee_id: job.employee_id,
          }));
          
          setJobs(mappedJobs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
        .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir),
    [jobs, sort]
  );

  const th = (k: keyof JobRow, label: string) => (
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

  const handleAdd = async () => {
    if (!isAddValid) return;

    // ตรวจสอบว่ามี employee_id หรือไม่
    if (!currentEmployeeId) {
      alert("Employee ID not found. Please login again.");
      return;
    }

    try {
      const selectedCustomer = customers.find(c => 
        c.fullname === draft.customer || c.name === draft.customer
      );

      if (!selectedCustomer) {
        console.error("Customer not found");
        alert("Please select a valid customer");
        return;
      }

      const payload = {
        created_date: new Date().toISOString().split('T')[0],
        end_date: draft.date,
        customer_id: selectedCustomer.customer_id,
        total_quantity: Number(draft.quantity),
        clothing_type: "Standard",
        type_of_fabric: draft.fabric,
        employee_id: currentEmployeeId,
        delivery_location: selectedCustomer.address_detail || "No address provided",
      };

      console.log("Sending payload:", payload); // Debug log

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
        
        if (errorText.includes("Foreign key constraint")) {
          alert("Employee ID not found in database. Please contact administrator.");
        } else {
          alert(`Failed to create job: ${errorText}`);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const newJob = await response.json();
      console.log("API Response:", newJob); // Debug log
      
      // สร้าง JobStep สำหรับ steps ที่เลือก
      if (draft.selectedSteps.length > 0) {
        for (const stepId of draft.selectedSteps) {
          try {
            await fetch("http://localhost:4000/api/jobsteps", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                job_id: newJob.job_id,
                step_id: stepId,
              }),
            });
          } catch (error) {
            console.error("Failed to create job step:", error);
          }
        }
      }
      
      // แปลงเมื่อแสดงใน UI เท่านั้น
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
      
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  };

  const openEdit = (i: number) => {
    const job = sorted[i];
    setEditIndex(jobs.findIndex(j => j.id === job.id));
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
        console.error("Customer not found");
        alert("Please select a valid customer");
        return;
      }

      // แก้ไข payload ให้ใช้ current employee_id หรือเก็บ original
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

      console.log("Update payload:", payload); // Debug log

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
        
        if (errorText.includes("Foreign key constraint")) {
          alert("Employee ID not found. Please check the data.");
        } else {
          alert(`Failed to update job: ${errorText}`);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const updatedJob = await response.json();
      console.log("Update response:", updatedJob); // Debug log

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
      
    } catch (error) {
      console.error("Failed to update job:", error);
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
        alert(`Failed to delete job: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Remove from local state
      setJobs(prev => prev.filter((_, idx) => idx !== editIndex));
      setEditIndex(null);
      
    } catch (error) {
      console.error("Failed to delete job:", error);
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

  // ปรับ validation ให้รอ employee_id
  const isAddValid =
    draft.customer.trim() !== "" &&
    draft.job.trim() !== "" &&
    draft.quantity > 0 &&
    draft.date.trim() !== "" &&
    draft.fabric.trim() !== "" &&
    customers.some(c => c.fullname === draft.customer || c.name === draft.customer) &&
    currentEmployeeId !== null &&
    draft.selectedSteps.length > 0; // เปลี่ยนจาก boolean check เป็น array length

  // เพิ่มฟังก์ชันสำหรับ get วันที่ปัจจุบันในรูปแบบ yyyy-mm-dd
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <h1 className="text-2xl font-bold">Job</h1>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Job • {jobs.length} total</div>
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
                        <label className="text-xs text-slate-500">Customer</label>
                        <select
                          className="mt-1 w-full border rounded px-3 py-2 bg-white"
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
                        <label className="text-xs text-slate-500">Job</label>
                        <div className="mt-1 w-full border rounded px-3 py-2 bg-gray-50 text-slate-700">
                          {draft.job || "-"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Quantity</label>
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
                        <label className="text-xs text-slate-500">Date</label>
                        <div className="relative">
                          <input
                            className="mt-1 w-full border rounded px-3 py-2 pr-10"
                            type="date"
                            value={formatDateYMD(draft.date)}
                            min={getTodayDate()}
                            onChange={(e) =>
                              setDraft({ ...draft, date: formatDateDMY(e.target.value) })
                            }
                            id="job-date-input"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Fabric Type</label>
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
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAdd}
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
                        {steps.map((step) => (
                          <label
                            key={step.step_id}
                            className="flex items-center justify-between rounded border px-3 py-2"
                          >
                            <span className="capitalize">{step.step_name}</span>
                            <input
                              type="checkbox"
                              checked={draft.selectedSteps.includes(step.step_id)}
                              onChange={() => toggleStepSelection(step.step_id, false)}
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
                  <tr key={r.id || i} className="border-t">
                    <td className="py-2 font-medium text-slate-700">{r.customer}</td>
                    <td>{r.job}</td>
                    <td>{r.quantity}</td>
                    <td>{r.date}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {r.selectedSteps.map(stepId => {
                          const step = steps.find(s => s.step_id === stepId);
                          return step ? (
                            <span
                              key={stepId}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                            >
                              {step.step_name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="capitalize">{r.fabric}</td>
                    <td className="text-right">
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
                    {customers.map((c) => (
                      <option key={c.customer_id} value={c.fullname}>
                        {c.fullname}
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
                      <SelectItem value="silk">Silk</SelectItem>
                      <SelectItem value="wool">Wool</SelectItem>
                      <SelectItem value="linen">Linen</SelectItem>
                      <SelectItem value="denim">Denim</SelectItem>
                      <SelectItem value="lycra">Lycra</SelectItem>
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
                      value={formatDateYMD(editDraft.date)}
                      min={getTodayDate()}
                      onChange={(e) =>
                        setEditDraft({ ...editDraft, date: formatDateDMY(e.target.value) })
                      }
                      id="job-edit-date-input"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={!canEditPage}
                  >
                    Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setEditIndex(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
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
                  {steps.map((step) => (
                    <label
                      key={step.step_id}
                      className="flex items-center justify-between rounded border px-3 py-2"
                    >
                      <span className="capitalize">{step.step_name}</span>
                      <input
                        type="checkbox"
                        checked={editDraft.selectedSteps.includes(step.step_id)}
                        onChange={() => toggleStepSelection(step.step_id, true)}
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
