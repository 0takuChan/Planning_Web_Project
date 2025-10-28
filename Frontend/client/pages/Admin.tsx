import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "@/components/Admin/RoleSelector";
import { MemberListItem } from "@/components/Admin/MemberListItem";
import { AddMemberDialog } from "@/components/Admin/AddMemberDialog";
import { EditMemberDialog } from "@/components/Admin/EditMemberDialog";
import { DeleteConfirmDialog } from "@/components/Admin/DeleteConfirmDialog";
import { getCurrentUserRole } from "@/lib/auth";
import { validateEmail, validatePhone, validatePassword, validateUsername } from "@/lib/validation";

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: RoleKey;
}

type RoleKey = "admin" | "planner" | "orderer" | "recorder";

interface RoleSettings {
  label: string;
}

interface RoleApi {
  role_id: number;
  role_name: string;
}

type RoleSettingsMap = Record<RoleKey, RoleSettings>;

type MemberFormValues = {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const ROLE_OPTIONS: RoleKey[] = ["admin", "planner", "orderer", "recorder"];

const ROLE_DEFAULT_LABELS: Record<RoleKey, string> = {
  admin: "Admin",
  planner: "Planner",
  orderer: "Orderer",
  recorder: "Recorder",
};

const getDefaultRoleSettings = (): RoleSettingsMap =>
  ROLE_OPTIONS.reduce((accumulator, role) => {
    accumulator[role] = {
      label: ROLE_DEFAULT_LABELS[role],
    };
    return accumulator;
  }, {} as RoleSettingsMap);

const createEmptyMemberFormValues = (): MemberFormValues => ({
  username: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const cloneMembers = (members: Member[]): Member[] =>
  members.map((member) => ({ ...member }));

const cloneRoleSettings = (settings: RoleSettingsMap): RoleSettingsMap =>
  ROLE_OPTIONS.reduce((accumulator, role) => {
    const current = settings[role];
    accumulator[role] = { ...current };
    return accumulator;
  }, {} as RoleSettingsMap);

const membersEqual = (first: Member[], second: Member[]): boolean => {
  if (first.length !== second.length) return false;
  for (let index = 0; index < first.length; index += 1) {
    const a = first[index];
    const b = second[index];
    if (
      a.name !== b.name ||
      a.email !== b.email ||
      a.phone !== b.phone ||
      a.role !== b.role
    ) {
      return false;
    }
  }
  return true;
};

const roleSettingsEqual = (
  first: RoleSettingsMap,
  second: RoleSettingsMap,
): boolean =>
  ROLE_OPTIONS.every(
    (role) => first[role].label === second[role].label
  );

export default function Admin() {
  const [committedMembers, setCommittedMembers] = useState<Member[]>([]);
  const [draftMembers, setDraftMembers] = useState<Member[]>([]);
  const [roleMap, setRoleMap] = useState<Record<number, RoleKey>>({});

  const [roleSettings, setRoleSettings] = useState<RoleSettingsMap>(
    cloneRoleSettings(getDefaultRoleSettings()),
  );
  const [roleSettingsDraft, setRoleSettingsDraft] = useState<RoleSettingsMap>(
    cloneRoleSettings(getDefaultRoleSettings()),
  );

  const [selectedRole, setSelectedRole] = useState<RoleKey>("planner");
  const [openAdd, setOpenAdd] = useState(false);
  const [draft, setDraft] = useState<MemberFormValues>(() => createEmptyMemberFormValues());

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<MemberFormValues>(() => createEmptyMemberFormValues());
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [nextTempId, setNextTempId] = useState(-1);
  const [pendingCreates, setPendingCreates] = useState<
    { tempId: number; form: MemberFormValues; role: RoleKey }[]
  >([]);
  const [pendingUpdates, setPendingUpdates] = useState<Record<number, { password?: string }>>({});
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const currentUserRole = getCurrentUserRole()?.toLowerCase();
  const isAdmin = currentUserRole === "admin";

  const filteredMembers = useMemo(
    () => draftMembers.filter((member) => member.role === selectedRole),
    [draftMembers, selectedRole],
  );

  const currentRoleDraft = roleSettingsDraft[selectedRole];

  const isAddValid = useMemo(() => {
    return (
      draft.username.trim() !== "" &&
      draft.name.trim() !== "" &&
      draft.email.trim() !== "" &&
      draft.phone.trim() !== "" &&
      draft.password.trim() !== "" &&
      draft.confirmPassword.trim() !== "" &&
      validateUsername(draft.username) &&
      validateEmail(draft.email) &&
      validatePhone(draft.phone) &&
      validatePassword(draft.password) &&
      draft.password === draft.confirmPassword
    );
  }, [draft]);

  const isEditValid = useMemo(() => {
    const basicValid =
      editDraft.name.trim() !== "" &&
      editDraft.email.trim() !== "" &&
      editDraft.phone.trim() !== "" &&
      validateEmail(editDraft.email) &&
      validatePhone(editDraft.phone);

    // ถ้าใส่ password ใหม่ต้อง validate
    if (editDraft.password) {
      return (
        basicValid &&
        validatePassword(editDraft.password) &&
        editDraft.password === editDraft.confirmPassword
      );
    }

    return basicValid;
  }, [editDraft]);

  const hasUnsavedChangesForSelectedRole = useMemo(() => {
    if (roleSettings[selectedRole].label !== roleSettingsDraft[selectedRole].label) return true;

    const committedForRole = committedMembers.filter((m) => m.role === selectedRole);
    const draftForRole = draftMembers.filter((m) => m.role === selectedRole);

    if (draftForRole.some((m) => m.id <= 0)) return true;
    if (committedForRole.length !== draftForRole.length) return true;

    const committedById = committedForRole.reduce((acc, m) => {
      acc[m.id] = m;
      return acc;
    }, {} as Record<number, Member>);

    for (const dm of draftForRole) {
      const cm = committedById[dm.id];
      if (!cm) return true;
      if (cm.name !== dm.name || cm.email !== dm.email || cm.phone !== dm.phone) return true;
    }

    return false;
  }, [committedMembers, draftMembers, roleSettings, roleSettingsDraft, selectedRole]);

  const handleRoleSelect = (role: RoleKey) => {
    setSelectedRole(role);
    setDraft(createEmptyMemberFormValues());
    setEditIdx(null);
    setEditDraft(createEmptyMemberFormValues());
  };

  const handleAddMember = async () => {
    if (!isAddValid) return;

    const tempId = nextTempId;
    setNextTempId((id) => id - 1);

    const staged: Member = {
      id: tempId,
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      role: selectedRole,
    };

    setDraftMembers((existing) => existing.concat(staged));
    setPendingCreates((prev) => prev.concat({ tempId, form: draft, role: selectedRole }));

    setOpenAdd(false);
    setDraft(createEmptyMemberFormValues());
  };

  const openEdit = async (index: number) => {
    const current = filteredMembers[index];
    if (!current) return;

    setEditIdx(index);

    if (current.id <= 0) {
      const pending = pendingCreates.find((p) => p.tempId === current.id);
      setEditDraft({
        username: pending?.form.username ?? "",
        name: current.name,
        email: current.email,
        phone: current.phone,
        password: pending?.form.password ?? "",
        confirmPassword: pending?.form.confirmPassword ?? "",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/employee/${current.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee details");
      }
      const employeeData = await response.json();
      setEditDraft({
        username: employeeData.username || "",
        name: current.name,
        email: current.email,
        phone: current.phone,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setEditDraft({
        username: "",
        name: current.name,
        email: current.email,
        phone: current.phone,
        password: "",
        confirmPassword: "",
      });
    }
  };

  const saveEdit = async () => {
    if (editIdx === null) return;
    const current = filteredMembers[editIdx];
    if (!current) return;

    const roleIdEntry = Object.entries(roleMap).find(([k, v]) => v === selectedRole)?.[0];
    const role_id = roleIdEntry ? parseInt(roleIdEntry, 10) : undefined;

    const updateData: any = {
      fullname: editDraft.name.trim(),
      email: editDraft.email.trim(),
      phone: editDraft.phone.trim(),
      role_id,
    };
    if (editDraft.password && editDraft.password === editDraft.confirmPassword) {
      updateData.password = editDraft.password;
    }

    if (current.id > 0) {
      try {
        const res = await fetch(`http://localhost:4000/api/employee/${current.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        if (!res.ok) throw new Error("Failed updating member");

        const empRes = await fetch("http://localhost:4000/api/employee");
        if (!empRes.ok) throw new Error("Failed fetching employees");
        const empData = await empRes.json();

        const mapped: Member[] = (empData ?? []).map((e: any) => ({
          id: e.employee_id,
          name: e.fullname ?? e.name ?? e.username ?? "",
          email: e.email ?? "",
          phone: e.phone ?? "",
          role: roleMap[e.role_id] ?? "recorder",
        }));

        setCommittedMembers(cloneMembers(mapped));
        setDraftMembers(cloneMembers(mapped));
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    } else {
      const sanitized: Member = {
        ...current,
        name: editDraft.name.trim(),
        email: editDraft.email.trim(),
        phone: editDraft.phone.trim(),
        role: selectedRole,
      };
      setDraftMembers((existing) =>
        existing.map((member) => (member === current ? sanitized : member))
      );
    }

    setEditIdx(null);
    setEditDraft(createEmptyMemberFormValues());
  };

  const deleteMember = async () => {
    if (editIdx === null) return;
    const current = filteredMembers[editIdx];
    if (!current) return;

    if (current.id > 0) {
      setDeletedIds((prev) => [...prev, current.id]);
    } else {
      setPendingCreates((prev) => prev.filter((p) => p.tempId !== current.id));
    }

    setDraftMembers((existing) => existing.filter((m) => m.id !== current.id));
    setEditIdx(null);
    setEditDraft(createEmptyMemberFormValues());
  };

  const handleRoleLabelChange = (value: string) => {
    setRoleSettingsDraft((existing) => ({
      ...existing,
      [selectedRole]: {
        ...existing[selectedRole],
        label: value,
      },
    }));
  };

  const handleCancelChanges = () => {
    setDraftMembers(cloneMembers(committedMembers));
    setRoleSettingsDraft(cloneRoleSettings(roleSettings));
    setDraft(createEmptyMemberFormValues());
    setOpenAdd(false);
    setEditIdx(null);
    setEditDraft(createEmptyMemberFormValues());
  };

  const handleSaveChanges = async () => {
    if (!hasUnsavedChangesForSelectedRole) return;

    try {
      for (const id of deletedIds) {
        const res = await fetch(`http://localhost:4000/api/employee/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Failed deleting ${id}`);
      }

      for (const create of pendingCreates) {
        const roleIdEntry = Object.entries(roleMap).find(([k, v]) => v === create.role)?.[0];
        const role_id = roleIdEntry ? parseInt(roleIdEntry, 10) : undefined;

        const res = await fetch("http://localhost:4000/api/employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: create.form.username.trim(),
            fullname: create.form.name.trim(),
            email: create.form.email.trim(),
            phone: create.form.phone.trim(),
            password: create.form.password,
            role_id,
          }),
        });
        if (!res.ok) throw new Error(`Failed creating ${create.form.username}`);
      }

      const committedById = committedMembers.reduce((acc, m) => {
        acc[m.id] = m;
        return acc;
      }, {} as Record<number, Member>);

      for (const m of draftMembers) {
        if (m.id > 0) {
          const original = committedById[m.id];
          const changed =
            !original ||
            original.name !== m.name ||
            original.email !== m.email ||
            original.phone !== m.phone;

          const needPassword = pendingUpdates[m.id]?.password;

          if (changed || needPassword) {
            const updateData: any = {
              fullname: m.name.trim(),
              email: m.email.trim(),
              phone: m.phone.trim(),
            };
            if (needPassword) updateData.password = pendingUpdates[m.id].password;

            const res = await fetch(`http://localhost:4000/api/employee/${m.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updateData),
            });
            if (!res.ok) throw new Error(`Failed updating ${m.id}`);
          }
        }
      }

      const rolesRes = await fetch("http://localhost:4000/api/roles");
      if (!rolesRes.ok) throw new Error("Failed fetching roles");
      const rolesData: RoleApi[] = await rolesRes.json();
      const map: Record<number, RoleKey> = {};
      rolesData.forEach((r) => {
        const key = r.role_name.toLowerCase();
        if (key === "admin") map[r.role_id] = "admin";
        else if (key === "planner") map[r.role_id] = "planner";
        else if (key === "orderer") map[r.role_id] = "orderer";
        else map[r.role_id] = "recorder";
      });
      setRoleMap(map);

      const empRes = await fetch("http://localhost:4000/api/employee");
      if (!empRes.ok) throw new Error("Failed fetching employees");
      const empData = await empRes.json();
      const mapped: Member[] = (empData ?? []).map((e: any) => ({
        id: e.employee_id,
        name: e.fullname ?? e.name ?? e.username ?? "",
        email: e.email ?? "",
        phone: e.phone ?? "",
        role: map[e.role_id] ?? "recorder",
      }));

      setCommittedMembers(cloneMembers(mapped));
      setDraftMembers(cloneMembers(mapped));
      setPendingCreates([]);
      setPendingUpdates({});
      setDeletedIds([]);
      setNextTempId(-1);
    } catch (err) {
      console.error("Failed to save changes:", err);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rolesRes = await fetch("http://localhost:4000/api/roles");
        if (!rolesRes.ok) throw new Error(`HTTP ${rolesRes.status}`);
        const rolesData: RoleApi[] = await rolesRes.json();

        const map: Record<number, RoleKey> = {};
        rolesData.forEach((r) => {
          const key = r.role_name.toLowerCase();
          if (key === "admin") map[r.role_id] = "admin";
          else if (key === "planner") map[r.role_id] = "planner";
          else if (key === "orderer") map[r.role_id] = "orderer";
          else map[r.role_id] = "recorder";
        });
        if (!mounted) return;
        setRoleMap(map);

        const empRes = await fetch("http://localhost:4000/api/employee");
        if (!empRes.ok) throw new Error(`HTTP ${empRes.status}`);
        const empData = await empRes.json();

        const mapped: Member[] = (empData ?? []).map((e: any) => ({
          id: e.employee_id,
          name: e.fullname ?? e.name ?? e.username ?? "",
          email: e.email ?? "",
          phone: e.phone ?? "",
          role: map[e.role_id] ?? "recorder",
        }));

        setCommittedMembers(cloneMembers(mapped));
        setDraftMembers(cloneMembers(mapped));
      } catch (err) {
        console.error("Failed to load employees or roles:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  const canEditMember = (memberId: number): boolean => {
    if (isAdmin) return true;
    return memberId === currentUserId;
  };

  return (
    <Sidebar>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-6 text-white shadow">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <RoleSelector
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
            roleSettings={roleSettings}
            members={committedMembers}
          />
          
          <div className="rounded-lg border bg-white p-4 md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Edit Roles</div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleCancelChanges}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChangesForSelectedRole || !isAdmin}
                  className="disabled:bg-slate-300 disabled:text-slate-600"
                >
                  Save changes
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <input
                className="rounded border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-start))]"
                placeholder="Role Name"
                value={currentRoleDraft.label}
                onChange={(event) => handleRoleLabelChange(event.target.value)}
              />
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {filteredMembers.map((member, index) => (
                <MemberListItem
                  key={member.id}
                  member={member}
                  onEdit={() => openEdit(index)}
                  canEdit={canEditMember(member.id)}
                />
              ))}

              {isAdmin && (
                <AddMemberDialog
                  open={openAdd}
                  onOpenChange={setOpenAdd}
                  draft={draft}
                  onChange={(field, value) => setDraft({ ...draft, [field]: value })}
                  onAdd={handleAddMember}
                  isValid={isAddValid}
                />
              )}

              <EditMemberDialog
                open={editIdx !== null}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditIdx(null);
                    setEditDraft(createEmptyMemberFormValues());
                  }
                }}
                draft={editDraft}
                onChange={(field, value) =>
                  setEditDraft((current) => ({ ...current, [field]: value }))
                }
                onSave={saveEdit}
                onDelete={() => setOpenDeleteConfirm(true)}
                isValid={isEditValid}
                isAdmin={isAdmin}
              />

              <DeleteConfirmDialog
                open={openDeleteConfirm}
                onOpenChange={setOpenDeleteConfirm}
                onConfirm={() => {
                  deleteMember();
                  setOpenDeleteConfirm(false);
                }}
                memberName={editDraft.name}
              />
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
