import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePermissions } from "@/App";
import { apiFetch } from "@/lib/api";

interface Step {
  step_id: number;
  step_name: string;
  standard_time: number;
  priority: number;
}

const DAILY_CAPACITY_LABEL = "เวลาปฏิบัติงานสูงสุด/วัน";
const DAILY_CAPACITY_PLACEHOLDER = "เช่น 480 นาที/วัน";
const STEP_PRIORITY_LABEL = "ลำดับก่อน-หลัง";
const STEP_PRIORITY_PLACEHOLDER = "1 = ทำก่อน";

export default function Steps() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/steps");

  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [stepName, setStepName] = useState("");
  const [dailyCapacity, setDailyCapacity] = useState("");
  const [stepPriority, setStepPriority] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch steps from API
  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      setLoading(true);
      // ใช้ port 4000 ตาม backend
      const response = await apiFetch('/steps');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSteps(data);
    } catch (error) {
      console.error("Error fetching steps:", error);
      toast({
        title: "Error",
        description: `Failed to fetch steps: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = async () => {
    if (!stepName.trim() || !dailyCapacity.trim()) {
      toast({
        title: "Error",
        description: "Please enter step name and maximum daily capacity",
        variant: "destructive",
      });
      return;
    }

    const parsedDailyCapacity = Number(dailyCapacity);
    if (!Number.isFinite(parsedDailyCapacity) || parsedDailyCapacity <= 0) {
      toast({
        title: "Error",
        description: "Maximum daily capacity must be a positive number",
        variant: "destructive",
      });
      return;
    }

    const parsedPriority = Number(stepPriority);
    if (!Number.isInteger(parsedPriority) || parsedPriority <= 0) {
      toast({
        title: "Error",
        description: "Step priority must be a positive integer",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch('/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step_name: stepName.trim(),
          standard_time: parsedDailyCapacity,
          priority: parsedPriority,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const newStep = await response.json();
      setSteps([...steps, newStep]);
      setStepName("");
      setDailyCapacity("");
      setStepPriority("1");
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Step added successfully",
      });
    } catch (error) {
      console.error("Error adding step:", error);
      toast({
        title: "Error",
        description: `Failed to add step: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStep = async () => {
    if (!editingStep || !stepName.trim() || !dailyCapacity.trim()) {
      toast({
        title: "Error",
        description: "Please enter step name and maximum daily capacity",
        variant: "destructive",
      });
      return;
    }

    const parsedDailyCapacity = Number(dailyCapacity);
    if (!Number.isFinite(parsedDailyCapacity) || parsedDailyCapacity <= 0) {
      toast({
        title: "Error",
        description: "Maximum daily capacity must be a positive number",
        variant: "destructive",
      });
      return;
    }

    const parsedPriority = Number(stepPriority);
    if (!Number.isInteger(parsedPriority) || parsedPriority <= 0) {
      toast({
        title: "Error",
        description: "Step priority must be a positive integer",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiFetch(`/steps/${editingStep.step_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step_name: stepName.trim(),
          standard_time: parsedDailyCapacity,
          priority: parsedPriority,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const updatedStep = await response.json();
      setSteps(steps.map(step => 
        step.step_id === editingStep.step_id ? updatedStep : step
      ));
      setStepName("");
      setDailyCapacity("");
      setStepPriority("1");
      setEditingStep(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Step updated successfully",
      });
    } catch (error) {
      console.error("Error updating step:", error);
      toast({
        title: "Error",
        description: `Failed to update step: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStep = async (step: Step) => {
    try {
      const response = await apiFetch(`/steps/${step.step_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // ตรวจสอบว่าเป็น error เกี่ยวกับ relationship หรือไม่
        if (response.status === 400 && errorData.error) {
          // แสดง toast พิเศษสำหรับกรณีที่มี relationship
          toast({
            title: "Cannot Delete Step",
            description: errorData.error,
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSteps(steps.filter(s => s.step_id !== step.step_id));
      toast({
        title: "Success",
        description: result.message || "Step deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting step:", error);
      
      // ตรวจสอบ error message เพื่อแสดง toast ที่เหมาะสม
      let errorMessage = "Failed to delete step";
      
      if (error.message.includes("referenced by other records") || 
          error.message.includes("being used in the following jobs")) {
        errorMessage = `Step "${step.step_name}" is currently being used in jobs and cannot be deleted. Please remove it from all jobs first.`;
      } else if (error.message.includes("Foreign key constraint")) {
        errorMessage = `Step "${step.step_name}" has related data and cannot be deleted. Please check for dependencies.`;
      } else {
        errorMessage = error.message || "Failed to delete step";
      }
      
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (step: Step) => {
    setEditingStep(step);
    setStepName(step.step_name);
    setDailyCapacity(String(step.standard_time ?? ""));
    setStepPriority(String(step.priority ?? 1));
    setIsEditDialogOpen(true);
  };

  const resetAddDialog = () => {
    setStepName("");
    setDailyCapacity("");
    setStepPriority("1");
    setIsAddDialogOpen(false);
  };

  const resetEditDialog = () => {
    setStepName("");
    setDailyCapacity("");
    setStepPriority("1");
    setEditingStep(null);
    setIsEditDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Production Step Management</h1>
              <p className="text-white/80 mt-1">
                View and manage production line steps
              </p>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <Settings className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Stats - moved to top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Steps</p>
                <p className="text-2xl font-bold text-gray-900">{steps.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Step Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">รายการขั้นตอนผลิต</h2>
            <p className="text-sm text-gray-600">ทั้งหมด {steps.length} รายการ</p>
          </div>
          
          {canEditPage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> เพิ่มขั้นตอน
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>เพิ่มขั้นตอนการผลิต</DialogTitle>
                  <DialogDescription>
                    ระบุข้อมูลขั้นตอนในสายการผลิต
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="step-name" className="text-right">
                      ชื่อขั้นตอน
                    </Label>
                    <Input
                      id="step-name"
                      value={stepName}
                      onChange={(e) => setStepName(e.target.value)}
                      className="col-span-3"
                      placeholder="เช่น ตัดผ้า, เย็บประกอบ"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSubmitting) {
                          handleAddStep();
                        }
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="step-priority" className="text-right">
                      {STEP_PRIORITY_LABEL}
                    </Label>
                    <Input
                      id="step-priority"
                      type="number"
                      min="1"
                      step="1"
                      value={stepPriority}
                      onChange={(e) => setStepPriority(e.target.value)}
                      className="col-span-3"
                      placeholder={STEP_PRIORITY_PLACEHOLDER}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="standard-time" className="text-right">
                      {DAILY_CAPACITY_LABEL}
                    </Label>
                    <Input
                      id="standard-time"
                      type="number"
                      min="1"
                      step="1"
                      value={dailyCapacity}
                      onChange={(e) => setDailyCapacity(e.target.value)}
                      className="col-span-3"
                      placeholder={DAILY_CAPACITY_PLACEHOLDER}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSubmitting) {
                          handleAddStep();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={resetAddDialog}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    onClick={handleAddStep}
                    disabled={isSubmitting || !stepName.trim() || !dailyCapacity.trim() || !stepPriority.trim()}
                  >
                    {isSubmitting ? "กำลังเพิ่ม..." : "บันทึก"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Steps Table */}
        <div className="bg-white rounded-lg border shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--brand-end))]"></div>
              <p className="mt-4 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ลำดับ</TableHead>
                  <TableHead>ขั้นตอน</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>เวลาปฏิบัติงานสูงสุด/วัน</TableHead>
                  <TableHead>รหัสขั้นตอน</TableHead>
                  {canEditPage && (
                    <TableHead className="text-right w-32">จัดการ</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={canEditPage ? 6 : 5} 
                      className="text-center py-8 text-gray-500"
                    >
                      ยังไม่มีรายการขั้นตอนผลิต
                    </TableCell>
                  </TableRow>
                ) : (
                  steps.map((step, index) => (
                    <TableRow key={step.step_id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {step.step_name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {step.priority}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {step.standard_time.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {step.step_id}
                      </TableCell>
                      {canEditPage && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {/* Edit Button */}
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog(step)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>แก้ไขขั้นตอนการผลิต</DialogTitle>
                                  <DialogDescription>
                                    ปรับข้อมูลขั้นตอน: {editingStep?.step_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-step-name" className="text-right">
                                      ชื่อขั้นตอน
                                    </Label>
                                    <Input
                                      id="edit-step-name"
                                      value={stepName}
                                      onChange={(e) => setStepName(e.target.value)}
                                      className="col-span-3"
                                      placeholder="เช่น ตัดผ้า, เย็บประกอบ"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isSubmitting) {
                                          handleEditStep();
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-step-priority" className="text-right">
                                      {STEP_PRIORITY_LABEL}
                                    </Label>
                                    <Input
                                      id="edit-step-priority"
                                      type="number"
                                      min="1"
                                      step="1"
                                      value={stepPriority}
                                      onChange={(e) => setStepPriority(e.target.value)}
                                      className="col-span-3"
                                      placeholder={STEP_PRIORITY_PLACEHOLDER}
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-standard-time" className="text-right">
                                      {DAILY_CAPACITY_LABEL}
                                    </Label>
                                    <Input
                                      id="edit-standard-time"
                                      type="number"
                                      min="1"
                                      step="1"
                                      value={dailyCapacity}
                                      onChange={(e) => setDailyCapacity(e.target.value)}
                                      className="col-span-3"
                                      placeholder={DAILY_CAPACITY_PLACEHOLDER}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !isSubmitting) {
                                          handleEditStep();
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    variant="outline" 
                                    onClick={resetEditDialog}
                                    disabled={isSubmitting}
                                  >
                                    ยกเลิก
                                  </Button>
                                  <Button 
                                    onClick={handleEditStep}
                                    disabled={isSubmitting || !stepName.trim() || !dailyCapacity.trim() || !stepPriority.trim()}
                                  >
                                    {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* Delete Button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>ยืนยันการลบขั้นตอน</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ต้องการลบขั้นตอน "{step.step_name}" ใช่หรือไม่?
                                    การลบนี้ไม่สามารถกู้คืนได้
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteStep(step)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    ลบขั้นตอน
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}