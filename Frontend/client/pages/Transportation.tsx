import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/Sidebar";
import { Plus, AlertCircle, Check, List, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import NewShipmentBadge from "@/components/transportation/NewShipmentBadge";
import { apiFetch } from "@/lib/api";

const API_BASE_URL = "http://localhost:4000/api";

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
  total_quantity: number;
  clothing_type: string;
  type_of_fabric: string;
  customer?: {
    customer_id: number;
    fullname: string;
  };
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

interface JobStep {
  job_step_id: number;
  job_id: number;
  step_id: number;
  step?: {
    step_id: number;
    step_name: string;
  };
}

interface Shipment {
  shipment_id: number;
  shipment_numbar: string;
  created_at?: string | null;
  customer_id: number;
  job_id: number;
  transport_type_id: number;
  status_id: number;
  departure_date: string;
  arrival_date: string;
  total_quantity: number;
  actual_delivery_date?: string | null;
  note?: string | null;
  transportType?: TransportType;
  status?: ShipmentStatus;
  customer?: Customer;
  job?: Job;
  shipmentItems?: ShipmentItem[];
}

export default function Transportation() {
  const [open, setOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [transportTypes, setTransportTypes] = useState<TransportType[]>([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<ShipmentStatus[]>([]);
  const [jobSteps, setJobSteps] = useState<JobStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCustomerSearchFocused, setIsCustomerSearchFocused] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [shipQuantity, setShipQuantity] = useState("");
  const [transportTypeId, setTransportTypeId] = useState<number | null>(null);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [note, setNote] = useState("");
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [compactList, setCompactList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [
          shipmentsRes,
          customersRes,
          jobsRes,
          transportTypesRes,
          shipmentStatusesRes,
          jobStepsRes,
        ] = await Promise.all([
          apiFetch(`${API_BASE_URL}/shipments`),
          apiFetch(`${API_BASE_URL}/customers`),
          apiFetch(`${API_BASE_URL}/jobs`),
          apiFetch(`${API_BASE_URL}/transport-types`),
          apiFetch(`${API_BASE_URL}/shipment-statuses`),
          apiFetch(`${API_BASE_URL}/jobsteps`),
        ]);

        if (
          !shipmentsRes.ok ||
          !customersRes.ok ||
          !jobsRes.ok ||
          !transportTypesRes.ok ||
          !shipmentStatusesRes.ok ||
          !jobStepsRes.ok
        ) {
          throw new Error("Failed to load transportation data");
        }

        const [
          shipmentsData,
          customersData,
          jobsData,
          transportTypesData,
          shipmentStatusesData,
          jobStepsData,
        ] = await Promise.all([
          shipmentsRes.json(),
          customersRes.json(),
          jobsRes.json(),
          transportTypesRes.json(),
          shipmentStatusesRes.json(),
          jobStepsRes.json(),
        ]);

        setShipments(shipmentsData);
        setCustomers(customersData);
        setJobs(jobsData);
        setTransportTypes(transportTypesData);
        setShipmentStatuses(shipmentStatusesData);
        setJobSteps(jobStepsData);
      } catch (error) {
        console.error("Error loading transportation data:", error);
        setErrorMessage("ไม่สามารถโหลดข้อมูลการจัดส่งได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshShipments = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/shipments`);
      if (!response.ok) {
        throw new Error("Failed to reload shipments");
      }
      const data = await response.json();
      setShipments(data);
    } catch (error) {
      console.error("Error reloading shipments:", error);
    }
  };

  const customerMap = useMemo(() => {
    return new Map(customers.map((customer) => [customer.customer_id, customer]));
  }, [customers]);

  const jobsForCustomer = useMemo(() => {
    if (!selectedCustomerId) return [];
    return jobs.filter((job) => job.customer_id === selectedCustomerId);
  }, [jobs, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = customerSearch.trim().toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) => {
      const searchValues = [
        customer.customer_code,
        customer.fullname,
        customer.email,
        customer.phone,
        customer.address_detail,
      ].map((value) => value.toLowerCase());

      return searchValues.some((value) => value.includes(normalizedQuery));
    });
  }, [customerSearch, customers]);

  const showCustomerSuggestions =
    isCustomerSearchFocused && customerSearch.trim() !== "" && filteredCustomers.length > 0;

  const resolveCustomerFromSearch = (value: string) => {
    const normalizedValue = value.trim().toLowerCase();

    if (!normalizedValue) {
      setSelectedCustomerId(null);
      setSelectedJobId(null);
      return;
    }

    const exactMatch = customers.find((customer) => {
      const combinedLabel = `${customer.customer_code} - ${customer.fullname}`.toLowerCase();

      return (
        customer.customer_code.toLowerCase() === normalizedValue ||
        customer.fullname.toLowerCase() === normalizedValue ||
        combinedLabel === normalizedValue
      );
    });

    if (exactMatch) {
      setSelectedCustomerId(exactMatch.customer_id);
      setSelectedJobId(null);
      setCustomerSearch(`${exactMatch.customer_code} - ${exactMatch.fullname}`);
      return;
    }

    const matchedCustomers = customers.filter((customer) => {
      const searchValues = [
        customer.customer_code,
        customer.fullname,
        customer.email,
        customer.phone,
        customer.address_detail,
      ].map((entry) => entry.toLowerCase());

      return searchValues.some((entry) => entry.includes(normalizedValue));
    });

    if (matchedCustomers.length === 1) {
      setSelectedCustomerId(matchedCustomers[0].customer_id);
      setSelectedJobId(null);
      setCustomerSearch(`${matchedCustomers[0].customer_code} - ${matchedCustomers[0].fullname}`);
      return;
    }

    setSelectedCustomerId(null);
    setSelectedJobId(null);
  };

  const jobStepsForJob = useMemo(() => {
    if (!selectedJobId) return [];
    return jobSteps.filter((jobStep) => jobStep.job_id === selectedJobId);
  }, [jobSteps, selectedJobId]);

  const selectedJob = useMemo(() => {
    if (!selectedJobId) {
      return null;
    }

    return jobs.find((job) => job.job_id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  const shippedQuantityForSelectedJob = useMemo(() => {
    if (!selectedJobId) {
      return 0;
    }

    return shipments
      .filter((shipment) => shipment.job_id === selectedJobId)
      .reduce((sum, shipment) => sum + (shipment.total_quantity || 0), 0);
  }, [selectedJobId, shipments]);

  const remainingQuantityForSelectedJob = useMemo(() => {
    if (!selectedJob) {
      return null;
    }

    return Math.max(selectedJob.total_quantity - shippedQuantityForSelectedJob, 0);
  }, [selectedJob, shippedQuantityForSelectedJob]);

  useEffect(() => {
    if (!statusId && shipmentStatuses.length > 0) {
      setStatusId(shipmentStatuses[0].status_id);
    }
  }, [statusId, shipmentStatuses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedJobId ||
      !shipQuantity ||
      !transportTypeId ||
      !statusId ||
      !departureDate ||
      !arrivalDate
    ) {
      return;
    }

    const parsedQuantity = Number(shipQuantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setErrorMessage("จำนวนที่จะส่งต้องมากกว่า 0");
      return;
    }

    if (remainingQuantityForSelectedJob !== null && parsedQuantity > remainingQuantityForSelectedJob) {
      setErrorMessage(`จำนวนที่จะส่งเกินจำนวนคงเหลือของงาน เหลือส่งได้อีก ${remainingQuantityForSelectedJob} ชิ้น`);
      return;
    }

    const createShipment = async () => {
      try {
        setIsSubmitting(true);
        const response = await apiFetch(`${API_BASE_URL}/shipments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: selectedCustomerId,
            job_id: selectedJobId,
            transport_type_id: transportTypeId,
            status_id: statusId,
            departure_date: departureDate,
            arrival_date: arrivalDate,
            actual_delivery_date: null,
            note: note.trim() || null,
            total_quantity: parsedQuantity,
          }),
        });

        if (!response.ok) {
          let message = "Failed to create shipment";

          try {
            const errorData = await response.json();
            message = errorData.error || message;
          } catch {
            // Ignore JSON parse errors and keep fallback message.
          }

          throw new Error(message);
        }

        await refreshShipments();
        setSelectedCustomerId(null);
        setSelectedJobId(null);
        setShipQuantity("");
        setTransportTypeId(null);
        setStatusId(null);
        setCustomerSearch("");
        setDepartureDate("");
        setArrivalDate("");
        setNote("");
        setErrorMessage(null);
        setOpen(false);
      } catch (error) {
        console.error("Error creating shipment:", error);
        setErrorMessage(error instanceof Error ? error.message : "ไม่สามารถเพิ่มข้อมูลการจัดส่งได้");
      } finally {
        setIsSubmitting(false);
      }
    };

    createShipment();
  };

  const selectedShipment = useMemo(() => {
    if (!selectedShipmentId) return null;
    return shipments.find((s) => s.shipment_id === selectedShipmentId) || null;
  }, [selectedShipmentId, shipments]);

  const filteredShipments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = shipments.filter((shipment) => {
      const customer = shipment.customer || customerMap.get(shipment.customer_id);
      const values = [
        shipment.shipment_numbar,
        shipment.status?.status_name,
        shipment.note,
        shipment.departure_date,
        shipment.arrival_date,
        customer?.fullname,
        customer?.customer_code,
        customer?.address_detail,
        shipment.job?.job_number,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      if (!normalizedQuery) {
        return true;
      }

      return values.some((value) => value.includes(normalizedQuery));
    });

    return filtered.sort((left, right) => {
      const leftDate = new Date(left.departure_date).getTime();
      const rightDate = new Date(right.departure_date).getTime();

      if (leftDate === rightDate) {
        return sortDirection === "asc"
          ? left.shipment_numbar.localeCompare(right.shipment_numbar)
          : right.shipment_numbar.localeCompare(left.shipment_numbar);
      }

      return sortDirection === "asc" ? leftDate - rightDate : rightDate - leftDate;
    });
  }, [customerMap, searchQuery, shipments, sortDirection]);

  const getStatusStep = (statusName: string | undefined): number => {
    if (!statusName) return 0;
    const lowerStatus = statusName.toLowerCase();
    if (lowerStatus.includes("เตรียม") || lowerStatus.includes("prepare")) return 1;
    if (lowerStatus.includes("กำลัง") || lowerStatus.includes("in transit") || lowerStatus.includes("shipping")) return 2;
    if (lowerStatus.includes("ส่งแล้ว") || lowerStatus.includes("delivered") || lowerStatus.includes("completed")) return 3;
    return 1; // default to preparing
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">การจัดส่ง</h1>
              <p className="text-white/80 mt-1">
                จัดการตารางการขนส่งและการส่งมอบสินค้า
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                    <Plus className="h-4 w-4 mr-2" />
                    เพิ่มการจัดส่ง
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>เพิ่มข้อมูลการจัดส่ง</DialogTitle>
                    <DialogDescription>
                      กรอกข้อมูลการจัดส่งสินค้าไปยังลูกค้า
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Customer Selection */}
                    <div className="relative space-y-2">
                      <Label htmlFor="customer">อ้างอิง ออเดอร์ลูกค้า *</Label>
                      <Input
                        id="customer"
                        value={customerSearch}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setCustomerSearch(nextValue);
                          resolveCustomerFromSearch(nextValue);
                        }}
                        onFocus={() => setIsCustomerSearchFocused(true)}
                        onBlur={() => {
                          resolveCustomerFromSearch(customerSearch);
                          window.setTimeout(() => setIsCustomerSearchFocused(false), 0);
                        }}
                        placeholder="ค้นหารหัสลูกค้า ชื่อลูกค้า เบอร์โทร หรือที่อยู่"
                      />
                      {showCustomerSuggestions && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-md border bg-white shadow-lg">
                          {filteredCustomers.slice(0, 8).map((customer) => {
                            const isSelected = selectedCustomerId === customer.customer_id;

                            return (
                              <button
                                key={customer.customer_id}
                                type="button"
                                className={`w-full border-b px-3 py-3 text-left last:border-b-0 ${
                                  isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                                }`}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSelectedCustomerId(customer.customer_id);
                                  setSelectedJobId(null);
                                  setCustomerSearch(`${customer.customer_code} - ${customer.fullname}`);
                                  setIsCustomerSearchFocused(false);
                                }}
                              >
                                <div className="font-medium text-gray-900">
                                  {customer.customer_code} - {customer.fullname}
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                  {customer.phone} | {customer.email}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        พิมพ์ค้นหาแล้วกดเลือกลูกค้าจากรายการแนะนำก่อน จึงจะกรอกข้อมูลการจัดส่งส่วนถัดไปได้
                      </p>
                    </div>

                    {/* Customer Address Display */}
                    {selectedCustomerId && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Label className="text-sm font-semibold text-blue-900">ที่อยู่ลูกค้า</Label>
                        <div className="mt-2 space-y-1 text-sm text-gray-700">
                          {(() => {
                            const customer = customerMap.get(selectedCustomerId);
                            if (!customer) return null;
                            return (
                              <>
                                <p><strong>ชื่อ:</strong> {customer.fullname}</p>
                                <p><strong>โทร:</strong> {customer.phone}</p>
                                <p><strong>อีเมล:</strong> {customer.email}</p>
                                <p><strong>ที่อยู่:</strong> {customer.address_detail}</p>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Job Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="job">รายการงานลูกค้า *</Label>
                      <Select
                        value={selectedJobId?.toString()}
                        onValueChange={(value) => {
                          setSelectedJobId(parseInt(value, 10));
                        }}
                        disabled={!selectedCustomerId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกออเดอร์งาน" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobsForCustomer.map((job) => (
                            <SelectItem
                              key={job.job_id}
                              value={job.job_id.toString()}
                            >
                              {job.job_number} - {job.clothing_type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedCustomerId && jobsForCustomer.length === 0 && (
                        <p className="text-xs text-gray-500">ยังไม่มีออเดอร์ของลูกค้านี้</p>
                      )}
                      {selectedJob && remainingQuantityForSelectedJob !== null && (
                        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                          <p>จำนวนในงานทั้งหมด: {selectedJob.total_quantity.toLocaleString()} ชิ้น</p>
                          <p>จัดส่งไปแล้ว: {shippedQuantityForSelectedJob.toLocaleString()} ชิ้น</p>
                          <p className="font-medium">คงเหลือส่งได้อีก: {remainingQuantityForSelectedJob.toLocaleString()} ชิ้น</p>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <Label htmlFor="ship-quantity">จำนวนที่จะส่ง *</Label>
                      <Input
                        id="ship-quantity"
                        type="number"
                        min="1"
                        max={remainingQuantityForSelectedJob ?? undefined}
                        value={shipQuantity}
                        onChange={(e) => setShipQuantity(e.target.value)}
                        placeholder="ระบุจำนวน"
                        disabled={!selectedCustomerId}
                        required
                      />
                      {selectedJob && remainingQuantityForSelectedJob !== null && (
                        <p className="text-xs text-gray-500">
                          ระบุได้ไม่เกิน {remainingQuantityForSelectedJob.toLocaleString()} ชิ้นสำหรับงานนี้
                        </p>
                      )}
                    </div>

                    {/* Transport Type */}
                    <div className="space-y-2">
                      <Label htmlFor="transportation">ประเภทการส่ง *</Label>
                      <Select
                        value={transportTypeId?.toString()}
                        onValueChange={(value) => setTransportTypeId(parseInt(value, 10))}
                        disabled={!selectedCustomerId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกประเภทการส่ง" />
                        </SelectTrigger>
                        <SelectContent>
                          {transportTypes.map((type) => (
                            <SelectItem
                              key={type.transport_type_id}
                              value={type.transport_type_id.toString()}
                            >
                              {type.transport_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {transportTypes.length === 0 && (
                        <p className="text-xs text-gray-500">ยังไม่มีข้อมูลประเภทการส่งในระบบ</p>
                      )}
                    </div>


                    {/* Departure Date */}
                    <div className="space-y-2">
                      <Label htmlFor="departure-date">วันที่ออกเดินทาง *</Label>
                      <Input
                        id="departure-date"
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        disabled={!selectedCustomerId}
                        required
                      />
                    </div>

                    {/* Arrival Date */}
                    <div className="space-y-2">
                      <Label htmlFor="arrival-date">วันที่คาดว่าจะถึง *</Label>
                      <Input
                        id="arrival-date"
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        min={departureDate}
                        disabled={!selectedCustomerId}
                        required
                      />
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                      <Label htmlFor="note">หมายเหตุ</Label>
                      <Input
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="เช่น ระบุข้อกำหนดพิเศษ"
                        disabled={!selectedCustomerId}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !selectedCustomerId ||
                          !selectedJobId ||
                          !shipQuantity ||
                          !transportTypeId ||
                          !statusId ||
                          !departureDate ||
                          !arrivalDate ||
                          isSubmitting
                        }
                      >
                        {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Alert for errors */}
        {errorMessage && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Status Tracker */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">
            {selectedShipment ? `สถานะการจัดส่ง: ${selectedShipment.shipment_numbar}` : "สถานะการจัดส่ง"}
          </h2>
          {!selectedShipment && (
            <p className="text-sm text-gray-500 mb-4">กรุณาเลือกรายการจัดส่งด้านล่างเพื่อดูสถานะ</p>
          )}
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
            {/* Step 1: เตรียมส่ง */}
            <div className="flex flex-col items-center flex-1">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ease-in-out ${
                selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 1
                  ? "bg-green-500 border-green-500 scale-110 shadow-lg shadow-green-200"
                  : "bg-gray-200 border-gray-300 hover:scale-105"
              }`}>
                {selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 1 ? (
                  <Check className="w-8 h-8 text-white animate-in fade-in zoom-in duration-300" />
                ) : (
                  <span className="text-2xl text-gray-400 transition-colors duration-300">1</span>
                )}
                {selectedShipment && getStatusStep(selectedShipment.status?.status_name) === 1 && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
                )}
              </div>
              <p className={`mt-3 text-sm font-medium transition-all duration-300 ${
                selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 1
                  ? "text-green-600 scale-105"
                  : "text-gray-400"
              }`}>
                เตรียมส่ง
              </p>
            </div>

            {/* Connector Line 1 */}
            <div className="flex-1 h-1 -mt-8 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out rounded-full ${
                  selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 2
                    ? "bg-green-500 w-full"
                    : "bg-gray-300 w-0"
                }`}
                style={{
                  boxShadow: selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 2 
                    ? '0 0 10px rgba(34, 197, 94, 0.5)' 
                    : 'none'
                }}
              />
            </div>

            {/* Step 2: กำลังจัดส่ง */}
            <div className="flex flex-col items-center flex-1">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ease-in-out ${
                selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 2
                  ? "bg-green-500 border-green-500 scale-110 shadow-lg shadow-green-200"
                  : "bg-gray-200 border-gray-300 hover:scale-105"
              }`}>
                {selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 2 ? (
                  <Check className="w-8 h-8 text-white animate-in fade-in zoom-in duration-300" />
                ) : (
                  <span className="text-2xl text-gray-400 transition-colors duration-300">2</span>
                )}
                {selectedShipment && getStatusStep(selectedShipment.status?.status_name) === 2 && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
                )}
              </div>
              <p className={`mt-3 text-sm font-medium transition-all duration-300 ${
                selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 2
                  ? "text-green-600 scale-105"
                  : "text-gray-400"
              }`}>
                กำลังจัดส่ง
              </p>
            </div>

            {/* Connector Line 2 */}
            <div className="flex-1 h-1 -mt-8 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out rounded-full ${
                  selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 3
                    ? "bg-green-500 w-full"
                    : "bg-gray-300 w-0"
                }`}
                style={{
                  boxShadow: selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 3 
                    ? '0 0 10px rgba(34, 197, 94, 0.5)' 
                    : 'none'
                }}
              />
            </div>

            {/* Step 3: ส่งแล้ว */}
            <div className="flex flex-col items-center flex-1">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ease-in-out ${
                selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 3
                  ? "bg-green-500 border-green-500 scale-110 shadow-lg shadow-green-200"
                  : "bg-gray-200 border-gray-300 hover:scale-105"
              }`}>
                {selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 3 ? (
                  <Check className="w-8 h-8 text-white animate-in fade-in zoom-in duration-300" />
                ) : (
                  <span className="text-2xl text-gray-400 transition-colors duration-300">3</span>
                )}
                {selectedShipment && getStatusStep(selectedShipment.status?.status_name) === 3 && (
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
                )}
              </div>
              <p className={`mt-3 text-sm font-medium transition-all duration-300 ${
                selectedShipment && getStatusStep(selectedShipment.status?.status_name) >= 3
                  ? "text-green-600 scale-105"
                  : "text-gray-400"
              }`}>
                ส่งแล้ว
              </p>
            </div>
          </div>
        </div>

        {/* Shipments List */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">รายการจัดส่ง</h2>
          </div>

          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเลขพัสดุ ลูกค้า สถานะ หรือที่อยู่"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={compactList ? "default" : "outline"}
                onClick={() => setCompactList((current) => !current)}
              >
                <List className="mr-2 h-4 w-4" />
                {compactList ? "Detailed List" : "List"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
                }
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort List {sortDirection === "asc" ? "Oldest" : "Newest"}
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-12">กำลังโหลดข้อมูล...</p>
          ) : filteredShipments.length === 0 ? (
            <p className="text-gray-500 text-center py-12">ยังไม่มีข้อมูลการจัดส่ง</p>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => {
                const customer = shipment.customer || customerMap.get(shipment.customer_id);

                return (
                  <div
                    key={shipment.shipment_id}
                    className={`border rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                      selectedShipmentId === shipment.shipment_id
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100 scale-[1.01]"
                        : "hover:shadow-md hover:border-gray-300"
                    } ${compactList ? "p-3" : "p-4"}`}
                    onClick={() => setSelectedShipmentId(shipment.shipment_id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-gray-600">เลขพัสดุ</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className={`font-semibold ${compactList ? "text-base" : "text-lg"}`}>
                                {shipment.shipment_numbar}
                              </p>
                              <NewShipmentBadge
                                shipmentNumber={shipment.shipment_numbar}
                                createdAt={shipment.created_at}
                              />
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {customer?.fullname || "ไม่ระบุลูกค้า"}
                            </p>
                            {!compactList && (
                              <>
                                <p className="text-sm text-gray-600 mt-1">
                                  {customer?.address_detail || "-"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ออกเดินทาง: {shipment.departure_date || "-"} | ถึงปลายทาง: {shipment.arrival_date || "-"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  ส่งสำเร็จจริง: {shipment.actual_delivery_date || "-"}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {shipment.status?.status_name || "ไม่ระบุ"}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to={`/transportation/${shipment.shipment_id}`}
                            state={{ shipment }}
                          >
                            ดูรายละเอียด
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
