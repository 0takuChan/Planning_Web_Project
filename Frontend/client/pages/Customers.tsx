import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import { usePermissions } from "@/App";
import { toast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { Trash2 } from "lucide-react";
import { LoadingDialog } from "@/components/common/LoadingDialog";
import { useLoadingDialog } from "@/hooks/use-loading-dialog";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  orders: number;
}

type CustomerDraft = Omit<Customer, "id">;

export default function Customers() {
  const { canEdit } = usePermissions();
  const canEditPage = canEdit("/customers");
  const loadingDialog = useLoadingDialog({ message: "กำลังประมวลผล..." });

  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<CustomerDraft>({ 
    name: "", 
    phone: "", 
    email: "", 
    location: "", 
    orders: 0 
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Customer>({ 
    id: 0, 
    name: "", 
    phone: "", 
    email: "", 
    location: "", 
    orders: 0 
  });
  const [sort, setSort] = useState<{ key: keyof Customer; dir: 1 | -1 }>({ 
    key: "name", 
    dir: 1 
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Validation functions
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    // รองรับรูปแบบเบอร์ไทย: 08x-xxx-xxxx, 09x-xxx-xxxx, 06x-xxx-xxxx, 02-xxx-xxxx, +66x-xxxx-xxxx
    const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
    const cleanPhone = phone.replace(/[-\s]/g, ''); // ลบ - และ space
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 9 && cleanPhone.length <= 12;
  };

  const formatPhoneDisplay = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('66')) {
      return `+${clean.slice(0, 2)}-${clean.slice(2, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`;
    }
    if (clean.length === 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
    }
    if (clean.length === 9) {
      return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5)}`;
    }
    return phone;
  };

  // แยก fetchCustomers ออกมาเป็น function แยก
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("/customers");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      const customers: Customer[] = data.map((c: any) => ({
        id: c.customer_id,
        name: c.fullname || "",
        phone: c.phone || "",
        email: c.email || "",
        location: c.address_detail || "",
        orders: c._count?.jobs || 0  // ใช้ข้อมูลจาก API
      }));
      
      setRows(customers);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const isValidDraft = useMemo(() => {
    return (
      draft.name.trim() !== "" && 
      draft.email.trim() !== "" && 
      isValidEmail(draft.email.trim()) &&
      draft.phone.trim() !== "" &&
      isValidPhone(draft.phone.trim()) &&
      draft.location.trim() !== ""
    );
  }, [draft]);

  const handleAdd = async () => {
    if (!isValidDraft) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ถูกต้อง",
        description: "กรุณาตรวจสอบรูปแบบอีเมลและเบอร์โทรศัพท์",
      });
      return;
    }

    try {
      const payload = {
        fullname: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        address_detail: draft.location.trim()
      };

      const response = await loadingDialog.withLoading(
        apiFetch("/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        "กำลังเพิ่มลูกค้า..."
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const newCustomer = await response.json();
      
      // เพิ่มลูกค้าใหม่ในรายการ
      setRows((current) => [...current, {
        id: newCustomer.customer_id,
        name: newCustomer.fullname,
        phone: newCustomer.phone || "",
        email: newCustomer.email || "",
        location: newCustomer.address_detail || "",
        orders: newCustomer._count?.jobs || 0  // ใช้ข้อมูลจาก API
      }]);
      
      setOpen(false);
      setDraft({ name: "", phone: "", email: "", location: "", orders: 0 });
      
      toast({
        title: "เพิ่มลูกค้าเรียบร้อย",
        description: `เพิ่มลูกค้า "${newCustomer.fullname}" เข้าสู่ระบบแล้ว`,
      });
    } catch (error) {
      console.error("Failed to add customer:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มลูกค้าได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const handleEdit = async () => {
    if (editIndex === null) return;
    
    // Validate edit data
    if (!editDraft.name.trim() || !editDraft.email.trim() || !editDraft.phone.trim() || !editDraft.location.trim()) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
      return;
    }

    if (!isValidEmail(editDraft.email.trim())) {
      toast({
        variant: "destructive",
        title: "รูปแบบอีเมลไม่ถูกต้อง",
        description: "กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง เช่น example@gmail.com",
      });
      return;
    }

    if (!isValidPhone(editDraft.phone.trim())) {
      toast({
        variant: "destructive",
        title: "รูปแบบเบอร์โทรไม่ถูกต้อง",
        description: "กรุณากรอกเบอร์โทรในรูปแบบที่ถูกต้อง เช่น 081-234-5678",
      });
      return;
    }
    
    try {
      const response = await loadingDialog.withLoading(
        apiFetch(`/customers/${editDraft.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: editDraft.name.trim(),
            phone: editDraft.phone.trim(),
            email: editDraft.email.trim(),
            address_detail: editDraft.location.trim(),
          }),
        }),
        "กำลังบันทึกข้อมูล..."
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const updatedCustomer = await response.json();
      
      // ใช้ editDraft.id แทน editIndex เพื่อหา customer ที่ถูกต้อง
      setRows((current) =>
        current.map((row) =>
          row.id === editDraft.id
            ? {
                ...row,
                name: updatedCustomer.fullname || "",
                phone: updatedCustomer.phone || "",
                email: updatedCustomer.email || "",
                location: updatedCustomer.address_detail || "",
                orders: updatedCustomer._count?.jobs || row.orders,
              }
            : row
        )
      );
      
      setEditIndex(null);
      setEditDraft({ id: 0, name: "", phone: "", email: "", location: "", orders: 0 });
      
      toast({
        title: "แก้ไขข้อมูลเรียบร้อย",
        description: `อัปเดตข้อมูลลูกค้า "${updatedCustomer.fullname}" เรียบร้อยแล้ว`,
      });
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขข้อมูลลูกค้าได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const handleDelete = async (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      const response = await loadingDialog.withLoading(
        apiFetch(`/customers/${customerToDelete.id}`, {
          method: "DELETE",
        }),
        "กำลังลบลูกค้า..."
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          toast({
            variant: "destructive",
            title: "ไม่สามารถลบลูกค้าได้",
            description: errorData.details || errorData.message || "มีงานที่เชื่อมโยงกับลูกค้านี้อยู่",
          });
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      setRows((current) => current.filter((row) => row.id !== customerToDelete.id));
      setEditIndex(null);
      setEditDraft({ id: 0, name: "", phone: "", email: "", location: "", orders: 0 });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      
      toast({
        title: "ลบลูกค้าเรียบร้อย",
        description: "ข้อมูลลูกค้าถูกลบออกจากระบบแล้ว",
      });
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลลูกค้าได้ กรุณาลองใหม่อีกครั้ง",
      });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const sorted = useMemo(
    () => 
      rows
        .slice()
        .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir),
    [rows, sort]
  );

  const openEdit = (i: number) => { 
    setEditIndex(i); 
    const customer = sorted[i]; // เปลี่ยนจาก rows[i] เป็น sorted[i]
    setEditDraft({
      ...customer,
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      location: customer.location || ""
    }); 
  };
  
  const isEditValid = useMemo(() => {
    return (
      (editDraft.name || "").trim() !== "" &&
      (editDraft.phone || "").trim() !== "" &&
      (editDraft.email || "").trim() !== "" &&
      (editDraft.location || "").trim() !== "" &&
      isValidEmail((editDraft.email || "").trim()) &&
      isValidPhone((editDraft.phone || "").trim())
    );
  }, [editDraft]);

  const th = (k: keyof Customer, label: string) => (
    <th className="cursor-pointer" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1 }))}>{label} {sort.key === k ? (sort.dir === 1 ? "↑" : "↓") : ""}</th>
  );

  const getInputValidationClass = (value: string, type: 'email' | 'phone' | 'text') => {
    if (value.trim() === "") {
      return "border-red-500 focus:ring-2 focus:ring-red-500";
    }
    if (type === 'email' && !isValidEmail(value.trim())) {
      return "border-red-500 focus:ring-2 focus:ring-red-500";
    }
    if (type === 'phone' && !isValidPhone(value.trim())) {
      return "border-red-500 focus:ring-2 focus:ring-red-500";
    }
    return "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]";
  };

  return (
    <AppLayout>
      <LoadingDialog isOpen={loadingDialog.isOpen} message={loadingDialog.message} />
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow"><h1 className="text-2xl font-bold">Customers</h1></div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Customers • {rows.length} total</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button disabled={!canEditPage}>Add Customer</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <DialogHeader><DialogTitle className="text-xl">Add Customer Member</DialogTitle></DialogHeader>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <label className="text-xs text-slate-500">Name *</label>
                        <input 
                          className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(draft.name, 'text')}`}
                          placeholder="ชื่อ-นามสกุล" 
                          value={draft.name} 
                          onChange={(e)=>setDraft({ ...draft, name: e.target.value })} 
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Email *</label>
                        <input 
                          type="email"
                          className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(draft.email, 'email')}`}
                          placeholder="example@gmail.com" 
                          value={draft.email} 
                          onChange={(e)=>setDraft({ ...draft, email: e.target.value })} 
                        />
                        {draft.email.trim() !== "" && !isValidEmail(draft.email.trim()) && (
                          <p className="text-xs text-red-500 mt-1">รูปแบบอีเมลไม่ถูกต้อง</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Phone Number *</label>
                        <input 
                          className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(draft.phone, 'phone')}`}
                          placeholder="081-234-5678" 
                          value={draft.phone} 
                          onChange={(e)=>setDraft({ ...draft, phone: e.target.value })} 
                        />
                        {draft.phone.trim() !== "" && !isValidPhone(draft.phone.trim()) && (
                          <p className="text-xs text-red-500 mt-1">รูปแบบเบอร์โทรไม่ถูกต้อง</p>
                        )}
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Location *</label>
                        <input 
                          className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(draft.location, 'text')}`}
                          placeholder="ที่อยู่" 
                          value={draft.location} 
                          onChange={(e)=>setDraft({ ...draft, location: e.target.value })} 
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
                        <Button onClick={handleAdd} disabled={!isValidDraft}>Add Member</Button>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-8">
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="text-white/80 text-8xl">👤</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="text-slate-500">
                <tr>
                  {th("name", "Name")}
                  {th("phone", "Phone")}
                  {th("email", "Email")}
                  {th("location", "Location")}
                  {th("orders", "Orders")}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 font-medium text-slate-700">{r.name}</td>
                    <td>{formatPhoneDisplay(r.phone)}</td>
                    <td>{r.email}</td>
                    <td>{r.location}</td>
                    <td>{r.orders}</td>
                    <td className="text-right">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={editIndex !== null} onOpenChange={(v)=> !v ? setEditIndex(null) : null}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6">
              <DialogHeader><DialogTitle className="text-xl">Edit Customer Member</DialogTitle></DialogHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <label className="text-xs text-slate-500">Name *</label>
                  <input 
                    className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(editDraft.name, 'text')}`}
                    placeholder="ชื่อ-นามสกุล" 
                    value={editDraft.name} 
                    onChange={(e)=>setEditDraft({ ...editDraft, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Email *</label>
                  <input 
                    type="email"
                    className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(editDraft.email, 'email')}`}
                    placeholder="example@gmail.com" 
                    value={editDraft.email} 
                    onChange={(e)=>setEditDraft({ ...editDraft, email: e.target.value })} 
                  />
                  {editDraft.email.trim() !== "" && !isValidEmail(editDraft.email.trim()) && (
                    <p className="text-xs text-red-500 mt-1">รูปแบบอีเมลไม่ถูกต้อง</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500">Phone Number *</label>
                  <input 
                    className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(editDraft.phone, 'phone')}`}
                    placeholder="081-234-5678" 
                    value={editDraft.phone} 
                    onChange={(e)=>setEditDraft({ ...editDraft, phone: e.target.value })} 
                  />
                  {editDraft.phone.trim() !== "" && !isValidPhone(editDraft.phone.trim()) && (
                    <p className="text-xs text-red-500 mt-1">รูปแบบเบอร์โทรไม่ถูกต้อง</p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-slate-500">Location *</label>
                  <input 
                    className={`mt-1 w-full border rounded px-3 py-2 ${getInputValidationClass(editDraft.location, 'text')}`}
                    placeholder="ที่อยู่" 
                    value={editDraft.location} 
                    onChange={(e)=>setEditDraft({ ...editDraft, location: e.target.value })} 
                  />
                </div>
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(editDraft)}
                    disabled={!canEditPage}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setEditIndex(null)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEdit}
                      disabled={!canEditPage || !isEditValid}
                    >
                      Save changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-8">
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-white/80 text-8xl">👤</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Customer Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div>
                Are you sure you want to delete this customer? This action cannot be undone.
              </div>
              {customerToDelete && (
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <div className="text-sm font-medium text-gray-900">Customer Details:</div>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <div><strong>Name:</strong> {customerToDelete.name}</div>
                    <div><strong>Email:</strong> {customerToDelete.email}</div>
                    <div><strong>Phone:</strong> {formatPhoneDisplay(customerToDelete.phone)}</div>
                    <div><strong>Location:</strong> {customerToDelete.location}</div>
                    <div><strong>Orders:</strong> {customerToDelete.orders}</div>
                  </div>
                </div>
              )}
              <div className="text-red-600 text-sm font-medium">
                ⚠️ This will permanently remove the customer and may affect related jobs.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setCustomerToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
