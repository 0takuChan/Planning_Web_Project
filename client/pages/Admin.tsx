import { useMemo, useState } from "react";
import { UserPen, UserPlus } from "lucide-react";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Member {
  name: string;
  email: string;
  phone: string;
  role: RoleKey;
}

type RoleKey = "admin" | "planner" | "orderer" | "recorder";
type PermissionLevel = "Read" | "Write" | "Manage";

interface RoleSettings {
  label: string;
  permission: PermissionLevel;
}

type RoleSettingsMap = Record<RoleKey, RoleSettings>;

type MemberFormValues = Pick<Member, "name" | "email" | "phone">;

type MemberField = keyof MemberFormValues;

const ROLE_OPTIONS: RoleKey[] = ["admin", "planner", "orderer", "recorder"];

const PERMISSION_OPTIONS: PermissionLevel[] = ["Read", "Write", "Manage"];

const ROLE_DEFAULT_LABELS: Record<RoleKey, string> = {
  admin: "Admin",
  planner: "Planner",
  orderer: "Orderer",
  recorder: "Recorder",
};

const INITIAL_ROLE_SETTINGS: RoleSettingsMap = {
  admin: { label: ROLE_DEFAULT_LABELS.admin, permission: "Manage" },
  planner: { label: ROLE_DEFAULT_LABELS.planner, permission: "Write" },
  orderer: { label: ROLE_DEFAULT_LABELS.orderer, permission: "Read" },
  recorder: { label: ROLE_DEFAULT_LABELS.recorder, permission: "Read" },
};

const initialMembers: Member[] = [
  {
    name: "Admin 01",
    email: "admin01@example.com",
    phone: "081-000-0001",
    role: "admin",
  },
  {
    name: "Tester 01",
    email: "tester01@example.com",
    phone: "081-000-0002",
    role: "planner",
  },
  {
    name: "Tester 02",
    email: "tester02@example.com",
    phone: "081-000-0003",
    role: "planner",
  },
  {
    name: "Tester 03",
    email: "tester03@example.com",
    phone: "081-000-0004",
    role: "recorder",
  },
];

const createEmptyMember = (role: RoleKey): Member => ({
  name: "",
  email: "",
  phone: "",
  role,
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
    (role) =>
      first[role].label === second[role].label &&
      first[role].permission === second[role].permission,
  );

const formatRoleLabel = (
  role: RoleKey,
  settings: RoleSettingsMap,
): string => settings[role]?.label ?? ROLE_DEFAULT_LABELS[role];

const normalizeRoleLabel = (role: RoleKey, value: string): string => {
  const trimmed = value.trim();
  return trimmed === "" ? ROLE_DEFAULT_LABELS[role] : trimmed;
};

const MemberFormFields = ({
  values,
  onChange,
}: {
  values: MemberFormValues;
  onChange: (field: MemberField, value: string) => void;
}) => (
  <div className="mt-6 space-y-4 text-sm">
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
      Name
      <input
        type="text"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-start))]"
        placeholder="Name"
        value={values.name}
        onChange={(event) => onChange("name", event.target.value)}
      />
    </label>
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
      Email
      <input
        type="email"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-start))]"
        placeholder="Email"
        value={values.email}
        onChange={(event) => onChange("email", event.target.value)}
      />
    </label>
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
      Phone Number
      <input
        type="tel"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-start))]"
        placeholder="Phone Number"
        value={values.phone}
        onChange={(event) => onChange("phone", event.target.value)}
      />
    </label>
  </div>
);

const computeCounts = (members: Member[]): Record<RoleKey, number> =>
  ROLE_OPTIONS.reduce((accumulator, role) => {
    accumulator[role] = members.filter((member) => member.role === role).length;
    return accumulator;
  }, {} as Record<RoleKey, number>);

export default function Admin() {
  const [committedMembers, setCommittedMembers] = useState<Member[]>(
    cloneMembers(initialMembers),
  );
  const [draftMembers, setDraftMembers] = useState<Member[]>(
    cloneMembers(initialMembers),
  );

  const [roleSettings, setRoleSettings] = useState<RoleSettingsMap>(
    cloneRoleSettings(INITIAL_ROLE_SETTINGS),
  );
  const [roleSettingsDraft, setRoleSettingsDraft] = useState<RoleSettingsMap>(
    cloneRoleSettings(INITIAL_ROLE_SETTINGS),
  );

  const [selectedRole, setSelectedRole] = useState<RoleKey>("planner");
  const [openAdd, setOpenAdd] = useState(false);
  const [draft, setDraft] = useState<Member>(() => createEmptyMember("planner"));

  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Member>(() =>
    createEmptyMember("planner"),
  );

  const committedCounts = useMemo(
    () => computeCounts(committedMembers),
    [committedMembers],
  );

  const filteredMembers = useMemo(
    () => draftMembers.filter((member) => member.role === selectedRole),
    [draftMembers, selectedRole],
  );

  const currentRoleDraft = roleSettingsDraft[selectedRole];

  const isAddValid =
    draft.name.trim() !== "" &&
    draft.email.trim() !== "" &&
    draft.phone.trim() !== "";

  const isEditValid =
    editDraft.name.trim() !== "" &&
    editDraft.email.trim() !== "" &&
    editDraft.phone.trim() !== "";

  const hasUnsavedChanges =
    !membersEqual(committedMembers, draftMembers) ||
    !roleSettingsEqual(roleSettings, roleSettingsDraft);

  const handleRoleSelect = (role: RoleKey) => {
    setSelectedRole(role);
    setDraft(createEmptyMember(role));
    setEditIdx(null);
    setEditDraft(createEmptyMember(role));
  };

  const handleAddMember = () => {
    if (!isAddValid) return;

    const sanitized = {
      ...draft,
      role: selectedRole,
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
    };

    setDraftMembers((existing) => existing.concat(sanitized));
    setOpenAdd(false);
    setDraft(createEmptyMember(selectedRole));
  };

  const openEdit = (index: number) => {
    const current = filteredMembers[index];
    if (!current) return;

    setEditIdx(index);
    setEditDraft({ ...current });
  };

  const saveEdit = () => {
    if (editIdx === null) return;
    const current = filteredMembers[editIdx];
    if (!current) return;

    const sanitized = {
      ...current,
      name: editDraft.name.trim(),
      email: editDraft.email.trim(),
      phone: editDraft.phone.trim(),
    };

    setDraftMembers((existing) =>
      existing.map((member) => (member === current ? sanitized : member)),
    );
    setEditIdx(null);
    setEditDraft(createEmptyMember(selectedRole));
  };

  const deleteMember = () => {
    if (editIdx === null) return;
    const current = filteredMembers[editIdx];
    if (!current) return;

    setDraftMembers((existing) => existing.filter((member) => member !== current));
    setEditIdx(null);
    setEditDraft(createEmptyMember(selectedRole));
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

  const handlePermissionChange = (value: PermissionLevel) => {
    setRoleSettingsDraft((existing) => ({
      ...existing,
      [selectedRole]: {
        ...existing[selectedRole],
        permission: value,
      },
    }));
  };

  const handleCancelChanges = () => {
    setDraftMembers(cloneMembers(committedMembers));
    setRoleSettingsDraft(cloneRoleSettings(roleSettings));
    setDraft(createEmptyMember(selectedRole));
    setOpenAdd(false);
    setEditIdx(null);
    setEditDraft(createEmptyMember(selectedRole));
  };

  const handleSaveChanges = () => {
    if (!hasUnsavedChanges) return;

    const normalizedMembers = draftMembers.map((member) => ({
      ...member,
      name: member.name.trim(),
      email: member.email.trim(),
      phone: member.phone.trim(),
    }));

    const normalizedRoleSettings = ROLE_OPTIONS.reduce((accumulator, role) => {
      const draftSetting = roleSettingsDraft[role];
      accumulator[role] = {
        label: normalizeRoleLabel(role, draftSetting.label),
        permission: draftSetting.permission,
      };
      return accumulator;
    }, {} as RoleSettingsMap);

    const committedClone = cloneMembers(normalizedMembers);
    const settingsClone = cloneRoleSettings(normalizedRoleSettings);

    setCommittedMembers(committedClone);
    setDraftMembers(cloneMembers(committedClone));
    setRoleSettings(settingsClone);
    setRoleSettingsDraft(cloneRoleSettings(settingsClone));
    setDraft(createEmptyMember(selectedRole));
    setEditIdx(null);
    setEditDraft(createEmptyMember(selectedRole));
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="rounded-xl bg-gradient-to-r from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-6 text-white shadow">
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-4">
            <div className="mb-2 font-semibold">Group</div>
            <div className="space-y-2 text-sm">
              {ROLE_OPTIONS.map((role) => {
                const isSelected = selectedRole === role;
                const label = formatRoleLabel(role, roleSettings);
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left transition hover:bg-slate-50 ${
                      isSelected ? "border-[hsl(var(--brand-start))] bg-slate-50" : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={isSelected ? "font-semibold" : "font-medium"}>
                        {label}
                      </span>
                      <span className="text-xs text-slate-400">
                        Permission: {roleSettings[role].permission}
                      </span>
                    </div>
                    <span className="text-slate-400">
                      • {committedCounts[role] ?? 0} {committedCounts[role] === 1 ? "Member" : "Members"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4 md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Edit Roles</div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleCancelChanges}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChanges}
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
              <select
                className="rounded border border-slate-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand-start))]"
                value={currentRoleDraft.permission}
                onChange={(event) =>
                  handlePermissionChange(event.target.value as PermissionLevel)
                }
              >
                {PERMISSION_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {filteredMembers.map((member, index) => (
                <div
                  key={`${member.email}-${member.phone}-${index}`}
                  className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">{member.name}</span>
                    <span className="text-xs text-slate-400">{member.email}</span>
                  </div>
                  <button
                    className="text-[hsl(var(--brand-start))]"
                    onClick={() => openEdit(index)}
                    type="button"
                  >
                    Edit
                  </button>
                </div>
              ))}
              <Dialog
                open={openAdd}
                onOpenChange={(open) => {
                  setOpenAdd(open);
                  if (!open) {
                    setDraft(createEmptyMember(selectedRole));
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="mt-2" type="button">
                    + Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl overflow-hidden border-0 p-0 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">
                    <div className="p-8">
                      <DialogHeader className="space-y-4 text-left">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white shadow-lg">
                          <UserPlus className="h-6 w-6" strokeWidth={1.8} />
                        </div>
                        <DialogTitle className="text-2xl font-semibold text-slate-900">
                          Add New Member
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                          Enter the details below to add a new member to your team.
                        </DialogDescription>
                      </DialogHeader>
                      <MemberFormFields
                        values={draft}
                        onChange={(field, value) =>
                          setDraft((current) => ({ ...current, [field]: value }))
                        }
                      />
                      <div className="mt-8 flex justify-end gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => setOpenAdd(false)}
                          type="button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddMember}
                          disabled={!isAddValid}
                          type="button"
                        >
                          Add Member
                        </Button>
                      </div>
                    </div>
                    <div className="hidden items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-8 md:flex">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                        <UserPlus className="h-16 w-16 text-white" strokeWidth={1.4} />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={editIdx !== null}
                onOpenChange={(open) => {
                  if (!open) {
                    setEditIdx(null);
                    setEditDraft(createEmptyMember(selectedRole));
                  }
                }}
              >
                <DialogContent className="max-w-3xl overflow-hidden border-0 p-0 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">
                    <div className="p-8">
                      <DialogHeader className="space-y-4 text-left">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] text-white shadow-lg">
                          <UserPen className="h-6 w-6" strokeWidth={1.8} />
                        </div>
                        <DialogTitle className="text-2xl font-semibold text-slate-900">
                          Edit Member
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                          Update the details below to edit this team member.
                        </DialogDescription>
                      </DialogHeader>
                      <MemberFormFields
                        values={editDraft}
                        onChange={(field, value) =>
                          setEditDraft((current) => ({ ...current, [field]: value }))
                        }
                      />
                      <div className="mt-8 flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center">
                        <Button
                          variant="destructive"
                          onClick={deleteMember}
                          type="button"
                        >
                          Delete
                        </Button>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setEditIdx(null);
                              setEditDraft(createEmptyMember(selectedRole));
                            }}
                            type="button"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={saveEdit}
                            disabled={!isEditValid}
                            type="button"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden items-center justify-center bg-gradient-to-br from-[hsl(var(--brand-start))] to-[hsl(var(--brand-end))] p-8 md:flex">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                        <UserPen className="h-16 w-16 text-white" strokeWidth={1.4} />
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
