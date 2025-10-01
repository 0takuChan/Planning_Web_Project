import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Member { name: string; email: string; phone: string; role: "admin" | "planner" | "orderer" | "recorder" }

const initialMembers: Member[] = [
  { name: "Admin 01", email: "admin01@example.com", phone: "081-000-0001", role: "admin" },
  { name: "Tester 01", email: "tester01@example.com", phone: "081-000-0002", role: "planner" },
  { name: "Tester 02", email: "tester02@example.com", phone: "081-000-0003", role: "planner" },
  { name: "Tester 03", email: "tester03@example.com", phone: "081-000-0004", role: "recorder" },
];

export default function Admin() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const roles: Member["role"][] = ["admin", "planner", "orderer", "recorder"];
  const [selectedRole, setSelectedRole] = useState<Member["role"]>("planner");

  const counts = useMemo(() =>
    roles.reduce((acc, r) => ({ ...acc, [r]: members.filter((m) => m.role === r).length }), {} as Record<Member["role"], number>),
  [members]);

  const [roleName, setRoleName] = useState("Planner");
  const [permission, setPermission] = useState("Read");

  const [openAdd, setOpenAdd] = useState(false);
  const [draft, setDraft] = useState<Member>({ name: "", email: "", phone: "", role: selectedRole });

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Member>({ name: "", email: "", phone: "", role: selectedRole });

  const openEdit = (i: number) => { setEditIdx(i); setEditDraft(filtered[i]); };
  const saveEdit = () => { if (editIdx === null) return; setMembers((ms)=> ms.map((m,i)=> i===members.indexOf(filtered[editIdx]) ? editDraft : m)); setEditIdx(null); };
  const deleteMember = () => { if (editIdx === null) return; const globalIdx = members.indexOf(filtered[editIdx]); setMembers((ms)=> ms.filter((_,i)=> i!==globalIdx)); setEditIdx(null); };

  const filtered = members.filter((m)=> m.role === selectedRole);

  const resetRoleForm = () => { setRoleName(selectedRole.charAt(0).toUpperCase()+selectedRole.slice(1)); setPermission("Read"); };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white p-6 shadow"><h1 className="text-2xl font-bold">Admin</h1></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border bg-white p-4">
            <div className="font-semibold mb-2">Group</div>
            <div className="space-y-2 text-sm">
              {roles.map((r)=> (
                <button key={r} onClick={()=>{ setSelectedRole(r); setDraft((d)=>({ ...d, role: r })); resetRoleForm(); }} className="w-full rounded border px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between">
                  <span className={selectedRole===r?"font-semibold":""}>{r.charAt(0).toUpperCase()+r.slice(1)}</span>
                  <span className="text-slate-400">• {counts[r] ?? 0} {counts[r]===1?"Member":"Members"}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 rounded-lg border bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Edit Roles</div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={resetRoleForm}>Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <input className="border rounded px-2 py-1" placeholder="Role Name" value={roleName} onChange={(e)=>setRoleName(e.target.value)} />
              <select className="border rounded px-2 py-1" value={permission} onChange={(e)=>setPermission(e.target.value)}>
                <option>Read</option><option>Write</option><option>Manage</option>
              </select>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {filtered.map((m, i) => (
                <div key={i} className="rounded border p-2 flex items-center justify-between">
                  <div>{m.name} <span className="text-slate-400">• {m.email}</span></div>
                  <button className="text-primary" onClick={()=>openEdit(i)}>Edit</button>
                </div>
              ))}
              <Dialog open={openAdd} onOpenChange={(o)=>{ setOpenAdd(o); if(!o) setDraft({ name: "", email: "", phone: "", role: selectedRole }); }}>
                <DialogTrigger asChild>
                  <Button className="mt-2">+ Add Member</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6">
                      <DialogHeader><DialogTitle className="text-xl">Add New Member</DialogTitle></DialogHeader>
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
                        <div className="flex justify-end gap-2 pt-2">
                          <Button variant="secondary" onClick={()=>setOpenAdd(false)}>Cancel</Button>
                          <Button onClick={()=>{ setMembers((ms)=> ms.concat(draft)); setOpenAdd(false); setDraft({ name: "", email: "", phone: "", role: selectedRole }); }}>Add Member</Button>
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

              <Dialog open={editIdx !== null} onOpenChange={(o)=> { if(!o) setEditIdx(null); }}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-6">
                      <DialogHeader><DialogTitle className="text-xl">Edit Member</DialogTitle></DialogHeader>
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
                        <div className="flex justify-between gap-2 pt-2">
                          <Button variant="destructive" onClick={deleteMember}>Delete</Button>
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={()=>setEditIdx(null)}>Cancel</Button>
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
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
