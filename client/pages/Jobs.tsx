import AppLayout from "@/components/layout/AppLayout";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Row { customer: string; job: string; quantity: number; date: string; cutting: boolean; heating: boolean; embroidering: boolean; sewing: boolean; qc: boolean; pack: boolean }

const init: Row[] = [
  { customer: "Michael Johnson", job: "JO-2025-0001", quantity: 500, date: "9/20/2025", cutting: true, heating: true, embroidering: true, sewing: true, qc: true, pack: true },
  { customer: "Sophia Brown", job: "JO-2025-0012", quantity: 300, date: "9/21/2025", cutting: true, heating: true, embroidering: false, sewing: false, qc: false, pack: false },
];

export default function Jobs() {
  const [rows, setRows] = useState<Row[]>(init);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Row>({ customer: "", job: "", quantity: 0, date: "", cutting: false, heating: false, embroidering: false, sewing: false, qc: false, pack: false });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Row>({ customer: "", job: "", quantity: 0, date: "", cutting: false, heating: false, embroidering: false, sewing: false, qc: false, pack: false });
  const [sort, setSort] = useState<{ key: keyof Row; dir: 1 | -1 }>({ key: "customer", dir: 1 });

  const sorted = useMemo(() => rows.slice().sort((a,b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir), [rows, sort]);
  const th = (k: keyof Row, label: string) => (<th className="cursor-pointer" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1 }))}>{label} {sort.key === k ? (sort.dir === 1 ? "↑" : "↓") : ""}</th>);

  const add = () => { setRows((r) => r.concat(draft)); setDraft({ customer: "", job: "", quantity: 0, date: "", cutting: false, heating: false, embroidering: false, sewing: false, qc: false, pack: false }); setOpen(false); };
  const openEdit = (i: number) => { setEditIndex(i); setEditDraft(rows[i]); };
  const saveEdit = () => { if (editIndex === null) return; setRows((r)=> r.map((row, idx)=> idx===editIndex ? editDraft : row)); setEditIndex(null); };
  const deleteRow = () => { if (editIndex === null) return; setRows((r)=> r.filter((_, idx)=> idx!==editIndex)); setEditIndex(null); };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow"><h1 className="text-2xl font-bold">Job</h1></div>
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between"><div className="text-slate-600">Job • {rows.length} total</div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button>Add Job</Button></DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6">
                    <DialogHeader><DialogTitle className="text-xl">Add Job</DialogTitle></DialogHeader>
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <label className="text-xs text-slate-500">Customer</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Select Customer" value={draft.customer} onChange={(e)=>setDraft({ ...draft, customer: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Job</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Job" value={draft.job} onChange={(e)=>setDraft({ ...draft, job: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Quantity</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Quantity" type="number" value={draft.quantity} onChange={(e)=>setDraft({ ...draft, quantity: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Date</label>
                        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Date" value={draft.date} onChange={(e)=>setDraft({ ...draft, date: e.target.value })} />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={()=>setOpen(false)}>Cancel</Button>
                        <Button onClick={add}>Add</Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 md:bg-gradient-to-br md:from-[hsl(var(--brand-start))] md:to-[hsl(var(--brand-end))]">
                    <div className="rounded-lg border bg-white/90 backdrop-blur p-4 shadow">
                      <div className="font-medium mb-2">Step</div>
                      <div className="text-xs text-slate-500 mb-3">Follow the steps below to complete the sewing process.</div>
                      <div className="space-y-2 text-sm">
                        {["cutting","heating","embroidering","sewing","qc","pack"].map((k)=> (
                          <label key={k} className="flex items-center justify-between rounded border px-3 py-2">
                            <span className="capitalize">{k}</span>
                            <input type="checkbox" checked={(draft as any)[k]} onChange={(e)=>setDraft({ ...(draft as any), [k]: e.target.checked } as Row)} />
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
                  {th("customer","Customer")}
                  {th("job","Job")}
                  {th("quantity","Quantity")}
                  {th("date","Date")}
                  <th>Cutting</th><th>Heating</th><th>Embroidering</th><th>Sewing</th><th>QC</th><th>Pack</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r,i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 font-medium text-slate-700">{r.customer}</td>
                    <td>{r.job}</td>
                    <td>{r.quantity}</td>
                    <td>{r.date}</td>
                    {([r.cutting,r.heating,r.embroidering,r.sewing,r.qc,r.pack] as boolean[]).map((b,idx)=> (<td key={idx}>{b ? "✔️" : "❌"}</td>))}
                    <td className="text-right"><Button size="sm" variant="outline" onClick={()=>openEdit(rows.indexOf(r))}>Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={editIndex !== null} onOpenChange={(o)=>{ if(!o) setEditIndex(null); }}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6">
              <DialogHeader><DialogTitle className="text-xl">Edit Job</DialogTitle></DialogHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <label className="text-xs text-slate-500">Customer</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Customer" value={editDraft.customer} onChange={(e)=>setEditDraft({ ...editDraft, customer: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Job</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Job" value={editDraft.job} onChange={(e)=>setEditDraft({ ...editDraft, job: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Quantity</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Quantity" type="number" value={editDraft.quantity} onChange={(e)=>setEditDraft({ ...editDraft, quantity: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Date</label>
                  <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Date" value={editDraft.date} onChange={(e)=>setEditDraft({ ...editDraft, date: e.target.value })} />
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
            <div className="p-6 bg-slate-50 md:bg-gradient-to-br md:from-[hsl(var(--brand-start))] md:to-[hsl(var(--brand-end))]">
              <div className="rounded-lg border bg-white/90 backdrop-blur p-4 shadow">
                <div className="font-medium mb-2">Step</div>
                <div className="text-xs text-slate-500 mb-3">Follow the steps below to complete the sewing process.</div>
                <div className="space-y-2 text-sm">
                  {["cutting","heating","embroidering","sewing","qc","pack"].map((k)=> (
                    <label key={k} className="flex items-center justify-between rounded border px-3 py-2">
                      <span className="capitalize">{k}</span>
                      <input type="checkbox" checked={(editDraft as any)[k]} onChange={(e)=>setEditDraft({ ...(editDraft as any), [k]: e.target.checked } as Row)} />
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
