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

interface Step {
  step_id: number;
  step_name: string;
}

export default function Steps() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/steps");

  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [stepName, setStepName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch steps from API
  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      setLoading(true);
      // ใช้ port 4000 ตาม backend
      const response = await fetch('http://localhost:4000/api/steps');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched steps:', data);
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
    if (!stepName.trim()) {
      toast({
        title: "Error",
        description: "Please enter step name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:4000/api/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step_name: stepName.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const newStep = await response.json();
      setSteps([...steps, newStep]);
      setStepName("");
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
    if (!editingStep || !stepName.trim()) {
      toast({
        title: "Error",
        description: "Please enter step name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:4000/api/steps/${editingStep.step_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step_name: stepName.trim() }),
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
      const response = await fetch(`http://localhost:4000/api/steps/${step.step_id}`, {
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
    setIsEditDialogOpen(true);
  };

  const resetAddDialog = () => {
    setStepName("");
    setIsAddDialogOpen(false);
  };

  const resetEditDialog = () => {
    setStepName("");
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
              <h1 className="text-2xl font-bold">Step Management</h1>
              <p className="text-white/80 mt-1">
                Manage production processes
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
            <h2 className="text-lg font-semibold">Steps List</h2>
            <p className="text-sm text-gray-600">{steps.length} items</p>
          </div>
          
          {canEditPage && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Step
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Step</DialogTitle>
                  <DialogDescription>
                    Enter information for new step
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="step-name" className="text-right">
                      Step Name
                    </Label>
                    <Input
                      id="step-name"
                      value={stepName}
                      onChange={(e) => setStepName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. Cutting, Sewing"
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
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddStep}
                    disabled={isSubmitting || !stepName.trim()}
                  >
                    {isSubmitting ? "Adding..." : "Add"}
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
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Step Name</TableHead>
                  <TableHead>Step ID</TableHead>
                  {canEditPage && (
                    <TableHead className="text-right w-32">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {steps.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={canEditPage ? 4 : 3} 
                      className="text-center py-8 text-gray-500"
                    >
                      No steps found
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
                                  <DialogTitle>Edit Step</DialogTitle>
                                  <DialogDescription>
                                    Edit step information: {editingStep?.step_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-step-name" className="text-right">
                                      Step Name
                                    </Label>
                                    <Input
                                      id="edit-step-name"
                                      value={stepName}
                                      onChange={(e) => setStepName(e.target.value)}
                                      className="col-span-3"
                                      placeholder="e.g. Cutting, Sewing"
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
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={handleEditStep}
                                    disabled={isSubmitting || !stepName.trim()}
                                  >
                                    {isSubmitting ? "Saving..." : "Save"}
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
                                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete step "{step.step_name}"? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteStep(step)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
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