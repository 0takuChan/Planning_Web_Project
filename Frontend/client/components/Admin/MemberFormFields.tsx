import { MemberFormValues, MemberField } from "@/types/admin";
import { getEmailError, getPhoneError, getPasswordError, getUsernameError } from "@/lib/validation";

interface MemberFormFieldsProps {
  values: MemberFormValues;
  onChange: (field: MemberField, value: string) => void;
  invalid?: Partial<Record<MemberField, boolean>>;
  isEdit?: boolean;
}

export function MemberFormFields({
  values,
  onChange,
  invalid,
  isEdit = false,
}: MemberFormFieldsProps) {
  const base =
    "rounded-lg border px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:outline-none ";
  const ok = "border-slate-200 focus:ring-2 focus:ring-[hsl(var(--brand-start))] focus:border-transparent";
  const bad = "border-red-500 focus:ring-2 focus:ring-red-500";

  const usernameError = values.username ? getUsernameError(values.username) : "";
  const emailError = values.email ? getEmailError(values.email) : "";
  const phoneError = values.phone ? getPhoneError(values.phone) : "";
  const passwordError = values.password ? getPasswordError(values.password) : "";
  const confirmPasswordError = 
    values.password && values.confirmPassword && values.password !== values.confirmPassword
      ? "Passwords do not match"
      : "";

  return (
    <div className="mt-6 space-y-4 text-sm">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Username
        <input
          type="text"
          className={`${base} ${invalid?.username || usernameError ? bad : ok}`}
          placeholder="Username (at least 4 characters)"
          value={values.username}
          onChange={(event) => onChange("username", event.target.value)}
          disabled={isEdit}
        />
        {usernameError && (
          <span className="text-xs text-red-500">{usernameError}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Name
        <input
          type="text"
          className={`${base} ${invalid?.name ? bad : ok}`}
          placeholder="Full Name"
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Email
        <input
          type="email"
          className={`${base} ${invalid?.email || emailError ? bad : ok}`}
          placeholder="example@gmail.com"
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
        />
        {emailError && (
          <span className="text-xs text-red-500">{emailError}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        Phone Number
        <input
          type="tel"
          className={`${base} ${invalid?.phone || phoneError ? bad : ok}`}
          placeholder="0812345678 (10 digits)"
          value={values.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          maxLength={10}
        />
        {phoneError && (
          <span className="text-xs text-red-500">{phoneError}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        {isEdit ? "Change Password" : "Password"}
        <input
          type="password"
          className={`${base} ${invalid?.password || passwordError ? bad : ok}`}
          placeholder={isEdit ? "New Password (optional)" : "Password (min 8 chars, uppercase, lowercase, number)"}
          value={values.password}
          onChange={(event) => onChange("password", event.target.value)}
        />
        {passwordError && (
          <span className="text-xs text-red-500">{passwordError}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
        {isEdit ? "Confirm New Password" : "Confirm Password"}
        <input
          type="password"
          className={`${base} ${invalid?.confirmPassword || confirmPasswordError ? bad : ok}`}
          placeholder={isEdit ? "Confirm New Password" : "Confirm Password"}
          value={values.confirmPassword}
          onChange={(event) => onChange("confirmPassword", event.target.value)}
        />
        {confirmPasswordError && (
          <span className="text-xs text-red-500">{confirmPasswordError}</span>
        )}
      </label>
    </div>
  );
}