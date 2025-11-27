import { Member, RoleKey, RoleSettings, RoleSettingsMap, ROLE_OPTIONS, ROLE_DEFAULT_LABELS, MemberFormValues } from "@/types/admin";

export const createEmptyMemberFormValues = (): MemberFormValues => ({
  username: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
});

export const cloneMembers = (members: Member[]): Member[] =>
  members.map((member) => ({ ...member }));

export const cloneRoleSettings = (settings: RoleSettingsMap): RoleSettingsMap =>
  ROLE_OPTIONS.reduce((accumulator, role) => {
    const current = settings[role];
    accumulator[role] = { ...current };
    return accumulator;
  }, {} as RoleSettingsMap);

export const membersEqual = (first: Member[], second: Member[]): boolean => {
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

export const roleSettingsEqual = (
  first: RoleSettingsMap,
  second: RoleSettingsMap,
): boolean =>
  ROLE_OPTIONS.every(
    (role) => first[role].label === second[role].label
  );

export const formatRoleLabel = (
  role: RoleKey,
  settings: RoleSettingsMap,
): string => settings[role]?.label ?? ROLE_DEFAULT_LABELS[role];

export const getDefaultRoleSettings = (): RoleSettingsMap =>
  ROLE_OPTIONS.reduce((accumulator, role) => {
    accumulator[role] = {
      label: ROLE_DEFAULT_LABELS[role],
    };
    return accumulator;
  }, {} as RoleSettingsMap);

export const computeCounts = (members: Member[]): Record<RoleKey, number> =>
  ROLE_OPTIONS.reduce((accumulator, role) => {
    accumulator[role] = members.filter((member) => member.role === role).length;
    return accumulator;
  }, {} as Record<RoleKey, number>);