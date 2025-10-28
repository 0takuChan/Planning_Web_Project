import { useEffect, useState, useMemo } from "react";
import AppLayout from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePermissions } from "@/App";

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

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/customers");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        const customers: Customer[] = data.map((c: any) => ({
          id: c.customer_id,
          name: c.name,
          phone: c.phone || "",
          email: c.email || "",
          location: c.location || "",
          orders: c.orders || 0
        }));
        
        setRows(customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const isValidDraft = useMemo(() => 
    draft.name.trim() !== "" && 
    draft.email.trim() !== "" && 
    draft.phone.trim() !== "",
    [draft]
  );

  const handleAdd = async () => {
    if (!isValidDraft) return;

    try {
      const payload = {
        customer_code: generateCustomerCode(),
        fullname: draft.name.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        address_detail: draft.location.trim()
      };
      
      console.log('Sending payload:', payload); // Debug log

      const response = await fetch("http://localhost:4000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const newCustomer = await response.json();
      console.log('API Response:', newCustomer); // Debug log
      
      setRows((current) => [...current, {
        id: newCustomer.customer_id, // เปลี่ยนจาก customer_id
        name: newCustomer.fullname,  // เปลี่ยนจาก name เป็น fullname
        phone: newCustomer.phone || "",
        email: newCustomer.email || "",
        location: newCustomer.address_detail || "", // เปลี่ยนจาก location เป็น address_detail
        orders: 0
      }]);
      
      setOpen(false);
      setDraft({ name: "", phone: "", email: "", location: "", orders: 0 });
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

  const handleEdit = async () => {
    if (editIndex === null) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/customers/${editDraft.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editDraft.name.trim(),
          phone: editDraft.phone.trim(),
          email: editDraft.email.trim(),
          location: editDraft.location.trim(),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const updatedCustomer = await response.json();
      
      setRows((current) =>
        current.map((row) =>
          row.id === editDraft.id
            ? {
                ...row,
                name: updatedCustomer.name,
                phone: updatedCustomer.phone || "",
                email: updatedCustomer.email || "",
                location: updatedCustomer.location || "",
              }
            : row
        )
      );
      
      setEditIndex(null);
      setEditDraft({ id: 0, name: "", phone: "", email: "", location: "", orders: 0 });
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      setRows((current) => current.filter((row) => row.id !== id));
      setEditIndex(null);
      setEditDraft({ id: 0, name: "", phone: "", email: "", location: "", orders: 0 });
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const sorted = useMemo(
    () => 
      rows
        .slice()
        .sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir),
    [rows, sort]
  );

  const isAddValid =
    draft.name.trim() !== "" &&
    draft.phone.trim() !== "" &&
    draft.email.trim() !== "" &&
    draft.location.trim() !== "";

  const addRow = () => {
    if (!isAddValid) return;
    const generateUniqueId = (existingIds: Set<number>): number => {
      let id = 1;
      while (existingIds.has(id)) {
        id++;
      }
      return id;
    };

    const id = generateUniqueId(new Set(rows.map((r) => r.id)));
    const newRow: Customer = { id, ...draft };
    setRows((r) => r.concat(newRow));
    setDraft({ name: "", phone: "", email: "", location: "", orders: 0 });
    setOpen(false);
  };

  const openEdit = (i: number) => { setEditIndex(i); setEditDraft(rows[i]); };
  const isEditValid =
    editDraft.name.trim() !== "" &&
    editDraft.phone.trim() !== "" &&
    editDraft.email.trim() !== "" &&
    editDraft.location.trim() !== "";

  const saveEdit = () => {
    if (editIndex === null || !isEditValid) return;
    setRows((r)=> r.map((row, idx)=> idx===editIndex ? { ...editDraft, id: row.id } : row));
    setEditIndex(null);
  };
  const deleteRow = () => { if (editIndex === null) return; setRows((r)=> r.filter((_, idx)=> idx!==editIndex)); setEditIndex(null); };

  const th = (k: keyof Customer, label: string) => (
    <th className="cursor-pointer" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1 }))}>{label} {sort.key === k ? (sort.dir === 1 ? "↑" : "↓") : ""}</th>
  );

  const generateCustomerCode = () => {
    const prefix = "CUS";
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  return (
    <AppLayout>
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
                        <label className="text-xs text-slate-500">Name</label>
                        <input className={`mt-1 w-full border rounded px-3 py-2 ${draft.name.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Name" value={draft.name} onChange={(e)=>setDraft({ ...draft, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Email</label>
                        <input className={`mt-1 w-full border rounded px-3 py-2 ${draft.email.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Email" value={draft.email} onChange={(e)=>setDraft({ ...draft, email: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Phone Number</label>
                        <input className={`mt-1 w-full border rounded px-3 py-2 ${draft.phone.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Phone Number" value={draft.phone} onChange={(e)=>setDraft({ ...draft, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Location</label>
                        <input className={`mt-1 w-full border rounded px-3 py-2 ${draft.location.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Location" value={draft.location} onChange={(e)=>setDraft({ ...draft, location: e.target.value })} />
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
                    <td>{r.phone}</td>
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
                  <label className="text-xs text-slate-500">Name</label>
                  <input className={`mt-1 w-full border rounded px-3 py-2 ${editDraft.name.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Name" value={editDraft.name} onChange={(e)=>setEditDraft({ ...editDraft, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Email</label>
                  <input className={`mt-1 w-full border rounded px-3 py-2 ${editDraft.email.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Email" value={editDraft.email} onChange={(e)=>setEditDraft({ ...editDraft, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Phone Number</label>
                  <input className={`mt-1 w-full border rounded px-3 py-2 ${editDraft.phone.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Phone Number" value={editDraft.phone} onChange={(e)=>setEditDraft({ ...editDraft, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Location</label>
                  <input className={`mt-1 w-full border rounded px-3 py-2 ${editDraft.location.trim() === "" ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))]"}`} placeholder="Location" value={editDraft.location} onChange={(e)=>setEditDraft({ ...editDraft, location: e.target.value })} />
                </div>
                <div className="mt-6 flex justify-between gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(editDraft.id)}
                    disabled={!canEditPage}
                  >
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
    </AppLayout>
  );
}
