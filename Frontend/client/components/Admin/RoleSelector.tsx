import { RoleKey, RoleSettingsMap, ROLE_OPTIONS } from "@/types/admin";
import { formatRoleLabel, computeCounts } from "@/utils/adminHelpers";
import { Member } from "@/types/admin";

interface RoleSelectorProps {
  selectedRole: RoleKey;
  onRoleSelect: (role: RoleKey) => void;
  roleSettings: RoleSettingsMap;
  members: Member[];
}

export function RoleSelector({
  selectedRole,
  onRoleSelect,
  roleSettings,
  members,
}: RoleSelectorProps) {
  const counts = computeCounts(members);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-2 font-semibold">Group</div>
      <div className="space-y-2 text-sm">
        {ROLE_OPTIONS.map((role) => {
          const isSelected = selectedRole === role;
          const label = formatRoleLabel(role, roleSettings);
          return (
            <button
              key={role}
              onClick={() => onRoleSelect(role)}
              className={`flex w-full items-center justify-between rounded border px-3 py-2 text-left transition hover:bg-slate-50 ${
                isSelected
                  ? "border-[hsl(var(--brand-start))] bg-slate-50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex flex-col">
                <span className={isSelected ? "font-semibold" : "font-medium"}>
                  {label}
                </span>
              </div>
              <span className="text-slate-400">
                • {counts[role] ?? 0} {counts[role] === 1 ? "Member" : "Members"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}