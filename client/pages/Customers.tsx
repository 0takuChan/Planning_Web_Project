import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Customer { name: string; phone: string; email: string; location: string; orders: number }

const initial: Customer[] = [
  { name: "Michael Johnson", phone: "098-999-5689", email: "michael@gmail.com", location: "New York, USA", orders: 2 },
  { name: "Emily Davis", phone: "098-2266-554", email: "emily@gmail.com", location: "London, UK", orders: 1 },
];

export default function Customers() {
  const [rows, setRows] = useState<Customer[]>(initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Customer>({ name: "", phone: "", email: "", location: "", orders: 0 });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Customer>({ name: "", phone: "", email: "", location: "", orders: 0 });
  const [sort, setSort] = useState<{ key: keyof Customer; dir: 1 | -1 }>({ key: "name", dir: 1 });

  const sorted = useMemo(() => rows.slice().sort((a,b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir), [rows, sort]);

  const addRow = () => { setRows((r) => r.concat(draft)); setDraft({ name: "", phone: "", email: "", location: "", orders: 0 }); setOpen(false); };

  const openEdit = (i: number) => { setEditIndex(i); setEditDraft(rows[i]); };
  const saveEdit = () => { if (editIndex === null) return; setRows((r)=> r.map((row, idx)=> idx===editIndex ? editDraft : row)); setEditIndex(null); };
  const deleteRow = () => { if (editIndex === null) return; setRows((r)=> r.filter((_, idx)=> idx!==editIndex)); setEditIndex(null); };

  const th = (k: keyof Customer, label: string) => (
    <th className="cursor-pointer" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1 }))}>{label} {sort.key === k ? (sort.dir === 1 ? "↑" : "↓") : ""}</th>
  );

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow"><h1 className="text-2xl font-bold">Customers</h1></div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">Customers • {rows.length} total</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button>Add Customer</Button></DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <DialogHeader><DialogTitle className="text-xl">Add Customer Member</DialogTitle></DialogHeader>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <label className="text-xs text-slate-500">Name</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Name" value={draft.name} onChange={(e)=>setDraft({ ...draft, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Email</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Email" value={draft.email} onChange={(e)=>setDraft({ ...draft, email: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Phone Number</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Phone Number" value={draft.phone} onChange={(e)=>setDraft({ ...draft, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Location</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Location" value={draft.location} onChange={(e)=>setDraft({ ...draft, location: e.target.value })} />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
                        <Button onClick={addRow}>Add Member</Button>
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
            <table className="min-w-[600px] w-full text-sm">
              <thead className="text-slate-500">
                <tr>
                  {th("name","Customer")}
                  {th("phone","Phone")}
                  {th("email","Email")}
                  {th("location","Location")}
                  {th("orders","Order quantity")}
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r, i) => (
                  <tr className="border-t" key={i}>
                    <td className="py-2 font-medium text-slate-700">{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.email}</td>
                    <td>{r.location}</td>
                    <td>{r.orders}</td>
                    <td className="text-right">
                      <Button size="sm" variant="outline" onClick={()=>openEdit(rows.indexOf(r))}>Edit</Button>
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
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Name" value={editDraft.name} onChange={(e)=>setEditDraft({ ...editDraft, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Email</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Email" value={editDraft.email} onChange={(e)=>setEditDraft({ ...editDraft, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Phone Number</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Phone Number" value={editDraft.phone} onChange={(e)=>setEditDraft({ ...editDraft, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Location</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Location" value={editDraft.location} onChange={(e)=>setEditDraft({ ...editDraft, location: e.target.value })} />
                </div>
                <div className="flex justify-between gap-2 pt-2">
                  <Button variant="destructive" onClick={deleteRow}>Delete</Button>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={()=>setEditIndex(null)}>Cancel</Button>
                    <Button onClick={saveEdit}>Update</Button>
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
