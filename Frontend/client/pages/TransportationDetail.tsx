import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Truck, Edit2, Trash2, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { usePermissions } from "@/App";

interface Customer {
  customer_id: number;
  customer_code: string;
  fullname: string;
  email: string;
  phone: string;
  address_detail: string;
}

interface Job {
  job_id: number;
  job_number: string;
  customer_id: number;
  clothing_type: string;
  type_of_fabric: string;
  total_quantity?: number;
  jobSteps?: Array<{
    job_step_id: number;
    step_id: number;
    step?: {
      step_id: number;
      step_name: string;
    };
  }>;
}

interface TransportType {
  transport_type_id: number;
  transport_name: string;
}

interface ShipmentStatus {
  status_id: number;
  status_name: string;
}

interface ShipmentItem {
  shipment_item_id: number;
  shipment_id: number;
  job_step_id: number;
  quantity: number;
}

interface Shipment {
  shipment_id: number;
  shipment_numbar: string;
  customer_id: number;
  job_id: number;
  transport_type_id: number;
  status_id: number;
  departure_date: string;
  arrival_date: string;
  actual_delivery_date?: string | null;
  total_quantity: number;
  note?: string | null;
  transportType?: TransportType;
  status?: ShipmentStatus;
  job?: Job;
  shipmentItems?: ShipmentItem[];
}

export default function TransportationDetail() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/transportation");
  const [currentEmployeeId, setCurrentEmployeeId] = useState<number | null>(null);
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateShipment = (location.state as { shipment?: Shipment } | null)?.shipment;

  const [shipment, setShipment] = useState<Shipment | null>(stateShipment || null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerJobs, setCustomerJobs] = useState<Job[]>([]);
  const [jobSteps, setJobSteps] = useState<Array<{ step_id: number; step_name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDepartureDate, setEditDepartureDate] = useState("");
  const [editArrivalDate, setEditArrivalDate] = useState("");
  const [editActualDeliveryDate, setEditActualDeliveryDate] = useState("");
  const [actualDeliveryInput, setActualDeliveryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!shipmentId) {
        setErrorMessage("ไม่พบรหัสการจัดส่ง");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage(null);

        const shipmentRes = await apiFetch(`/shipments/${shipmentId}`);

        if (!shipmentRes.ok) {
          throw new Error("Shipment not found");
        }

        const shipmentData = await shipmentRes.json();

        const [customerRes, customerJobsRes] = await Promise.all([
          apiFetch(`/customers/${shipmentData.customer_id}`),
          apiFetch(`/customers/${shipmentData.customer_id}/jobs`),
        ]);

        const customerData = customerRes.ok ? await customerRes.json() : null;
        const customerJobsData = customerJobsRes.ok
          ? await customerJobsRes.json()
          : [];

        setShipment(shipmentData);
        setCustomer(customerData);
        setCustomerJobs(customerJobsData);

        // Initialize edit form with shipment dates
        const depDate = new Date(shipmentData.departure_date);
        const arrDate = new Date(shipmentData.arrival_date);
        setEditDepartureDate(depDate.toISOString().split('T')[0]);
        setEditArrivalDate(arrDate.toISOString().split('T')[0]);
        setEditActualDeliveryDate(
          shipmentData.actual_delivery_date
            ? new Date(shipmentData.actual_delivery_date).toISOString().split('T')[0]
            : ""
        );
        setActualDeliveryInput(
          shipmentData.actual_delivery_date
            ? new Date(shipmentData.actual_delivery_date).toISOString().split('T')[0]
            : ""
        );
      } catch (error) {
        console.error("Error loading shipment detail:", error);
        setErrorMessage("ไม่สามารถโหลดรายละเอียดการจัดส่งได้");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [shipmentId]);

  // Fetch job steps when job_id changes
  useEffect(() => {
    if (shipment?.job_id) {
      const fetchJobSteps = async () => {
        try {
          const response = await apiFetch('/jobsteps');
          if (response.ok) {
            const allSteps = await response.json();
            const filteredSteps = allSteps
              .filter((step: any) => step.job_id === shipment.job_id)
              .map((step: any) => ({
                step_id: step.step?.step_id || step.step_id,
                step_name: step.step?.step_name || `Step ${step.step_id}`,
              }));
            setJobSteps(filteredSteps);
          }
        } catch (error) {
          console.error("Error fetching job steps:", error);
        }
      };
      fetchJobSteps();
    }
  }, [shipment?.job_id]);

  const handleStartEdit = () => {
    if (shipment) {
      const depDate = new Date(shipment.departure_date);
      const arrDate = new Date(shipment.arrival_date);
      setEditDepartureDate(depDate.toISOString().split('T')[0]);
      setEditArrivalDate(arrDate.toISOString().split('T')[0]);
      setEditActualDeliveryDate(
        shipment.actual_delivery_date
          ? new Date(shipment.actual_delivery_date).toISOString().split('T')[0]
          : ""
      );
      setIsEditMode(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setErrorMessage(null);
  };

  const handleSaveActualDeliveryDate = async () => {
    if (!shipment) {
      return;
    }

    if (actualDeliveryInput && new Date(actualDeliveryInput) < new Date(editDepartureDate || shipment.departure_date)) {
      setErrorMessage("วันที่จัดส่งสำเร็จจริง ต้องมากกว่าหรือเท่ากับวันที่ออกเดินทาง");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await apiFetch(`/shipments/${shipment.shipment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actual_delivery_date: actualDeliveryInput || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update actual delivery date");
      }

      const updatedShipment = await response.json();
      setShipment(updatedShipment);
      setEditActualDeliveryDate(
        updatedShipment.actual_delivery_date
          ? new Date(updatedShipment.actual_delivery_date).toISOString().split('T')[0]
          : ""
      );
      setActualDeliveryInput(
        updatedShipment.actual_delivery_date
          ? new Date(updatedShipment.actual_delivery_date).toISOString().split('T')[0]
          : ""
      );
    } catch (error) {
      console.error("Error updating actual delivery date:", error);
      setErrorMessage("ไม่สามารถบันทึกวันที่ส่งถึงจริงได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!shipment || !editDepartureDate || !editArrivalDate) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // Validate dates
    if (new Date(editArrivalDate) < new Date(editDepartureDate)) {
      setErrorMessage("วันที่คาดว่าจะถึง ต้องมากกว่าหรือเท่ากับวันที่ออกเดินทาง");
      return;
    }

    if (editActualDeliveryDate && new Date(editActualDeliveryDate) < new Date(editDepartureDate)) {
      setErrorMessage("วันที่จัดส่งสำเร็จจริง ต้องมากกว่าหรือเท่ากับวันที่ออกเดินทาง");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await apiFetch(`/shipments/${shipment.shipment_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          departure_date: editDepartureDate,
          arrival_date: editArrivalDate,
          actual_delivery_date: editActualDeliveryDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update shipment");
      }

      const updatedShipment = await response.json();
      setShipment(updatedShipment);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating shipment:", error);
      setErrorMessage("ไม่สามารถแก้ไขข้อมูลการจัดส่งได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!shipment) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await apiFetch(`/shipments/${shipment.shipment_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete shipment";
        try {
          const errorData = await response.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Ignore JSON parse errors and use fallback message.
        }
        setErrorMessage(errorMessage);
        return;
      }

      setShowDeleteDialog(false);
      navigate("/transportation");
    } catch (error) {
      console.error("Error deleting shipment:", error);
      setErrorMessage("ไม่สามารถลบข้อมูลการจัดส่งได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const shippedQuantity = shipment?.total_quantity || 0;

  if (loading) {
    return (
      <AppLayout>
        <p className="text-gray-500 text-center py-12">กำลังโหลดข้อมูล...</p>
      </AppLayout>
    );
  }

  if (!shipment) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <div className="rounded-xl bg-white border p-6">
            <h1 className="text-2xl font-bold">ไม่พบรายการจัดส่ง</h1>
            <p className="text-sm text-gray-600 mt-1">
              {errorMessage || "ไม่พบรายการที่คุณต้องการ"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/transportation")}>
            กลับไปหน้าการจัดส่ง
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">รายละเอียดการจัดส่ง</h1>
              <p className="text-white/80 mt-1">เลขพัสดุ: {shipment.shipment_numbar}</p>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <Truck className="h-6 w-6" />
            </div>
          </div>
        </div>

        {errorMessage && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">ข้อมูลการจัดส่ง</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">เลขพัสดุ</span>
                <span className="font-medium">{shipment.shipment_numbar}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ลูกค้า</span>
                <span className="font-medium">
                  {customer?.fullname || shipment.customer_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ประเภทการส่ง</span>
                <span className="font-medium">
                  {shipment.transportType?.transport_name || shipment.transport_type_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">สถานะ</span>
                <span className="font-medium">
                  {shipment.status?.status_name || shipment.status_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">จำนวนที่จัดส่ง</span>
                <span className="font-medium">{shippedQuantity}</span>
              </div>

              {isEditMode ? (
                <>
                  <div className="space-y-2 pt-2 border-t">
                    <div>
                      <Label htmlFor="edit-departure">วันที่ออกเดินทาง</Label>
                      <Input
                        id="edit-departure"
                        type="date"
                        value={editDepartureDate}
                        onChange={(e) => setEditDepartureDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-arrival">วันที่คาดว่าจะถึง</Label>
                      <Input
                        id="edit-arrival"
                        type="date"
                        value={editArrivalDate}
                        onChange={(e) => setEditArrivalDate(e.target.value)}
                        min={editDepartureDate}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-actual-delivery">วันที่จัดส่งสำเร็จจริง</Label>
                      <Input
                        id="edit-actual-delivery"
                        type="date"
                        value={editActualDeliveryDate}
                        onChange={(e) => setEditActualDeliveryDate(e.target.value)}
                        min={editDepartureDate}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">วันที่ออกเดินทาง</span>
                    <span className="font-medium">
                      {new Date(shipment.departure_date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">วันที่คาดว่าจะถึง</span>
                    <span className="font-medium">
                      {new Date(shipment.arrival_date).toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">วันที่จัดส่งสำเร็จจริง</span>
                    <span className="font-medium">
                      {shipment.actual_delivery_date
                        ? new Date(shipment.actual_delivery_date).toLocaleDateString("th-TH")
                        : "-"}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-600">หมายเหตุ</span>
                <span className="font-medium text-right">
                  {shipment.note || "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-600">ข้อมูลออเดอร์งาน</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">เลขที่งาน</span>
                <span className="font-medium">{shipment.job?.job_number || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ประเภทผ้า</span>
                <span className="font-medium">{shipment.job?.type_of_fabric || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">จำนวนรวม</span>
                <span className="font-medium">{shipment.job ? (shipment.job as any).total_quantity : "-"}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-gray-600">ขั้นตอนการผลิต</span>
                <span className="font-medium text-right">
                  {jobSteps.length > 0
                    ? jobSteps.map((step) => step.step_name).join(", ")
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          {customer && (
            <div className="bg-white rounded-lg border p-4 md:col-span-2">
              <p className="text-sm text-gray-600">ที่อยู่ลูกค้า</p>
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>{customer.address_detail}</p>
                <p>โทร: {customer.phone}</p>
                <p>อีเมล: {customer.email}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border p-4 md:col-span-2">
            <p className="text-sm text-gray-600">บันทึกการขนส่งถึงจริง</p>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <Label htmlFor="actual-delivery-date-detail">วันที่ขนส่งถึงจริง</Label>
                <Input
                  id="actual-delivery-date-detail"
                  type="date"
                  value={actualDeliveryInput}
                  onChange={(e) => setActualDeliveryInput(e.target.value)}
                  min={new Date(shipment.departure_date).toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleSaveActualDeliveryDate}
                disabled={!canEditPage || !currentEmployeeId || isSubmitting}
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกวันถึงจริง"}
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ใช้บันทึกวันที่ที่สินค้าถึงปลายทางจริง เพื่อยืนยันว่าการจัดส่งเสร็จสมบูรณ์แล้ว
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditMode ? (
            <>
              <Button variant="outline" onClick={() => navigate("/transportation")}>
                กลับไปหน้าการจัดส่ง
              </Button>
              <Button
                onClick={handleStartEdit}
                className="gap-2"
                disabled={!canEditPage || !currentEmployeeId || isSubmitting}
              >
                <Edit2 className="h-4 w-4" />
                แก้ไขวันที่
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2"
                disabled={!canEditPage || !currentEmployeeId || isSubmitting}
              >
                <Trash2 className="h-4 w-4" />
                ลบ
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="gap-2"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
                ยกเลิก
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSubmitting || !editDepartureDate || !editArrivalDate}
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณแน่ใจว่าต้องการลบการจัดส่งเลขพัสดุ {shipment?.shipment_numbar} นี้?
              การกระทำนี้ไม่สามารถยกเลิกได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังลบ..." : "ลบ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
