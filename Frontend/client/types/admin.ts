export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: RoleKey;
}

export type RoleKey = "admin" | "planner" | "orderer" | "recorder";

export interface RoleSettings {
  label: string;
}

export interface RoleApi {
  role_id: number;
  role_name: string;
}

export type RoleSettingsMap = Record<RoleKey, RoleSettings>;

export type MemberFormValues = {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export type MemberField = keyof MemberFormValues;

export const ROLE_OPTIONS: RoleKey[] = ["admin", "planner", "orderer", "recorder"];

export const ROLE_DEFAULT_LABELS: Record<RoleKey, string> = {
  admin: "Admin",
  planner: "Planner",
  orderer: "Orderer",
  recorder: "Recorder",
};