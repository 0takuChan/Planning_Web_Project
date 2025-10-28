import { Member } from "@/types/admin";

interface MemberListItemProps {
  member: Member;
  onEdit: () => void;
  canEdit: boolean;
}

export function MemberListItem({ member, onEdit, canEdit }: MemberListItemProps) {
  return (
    <div className="flex items-center justify-between rounded border border-slate-200 px-3 py-2">
      <div className="flex flex-col">
        <span className="font-medium text-slate-700">{member.name}</span>
        <span className="text-xs text-slate-400">{member.email}</span>
      </div>
      {canEdit && (
        <button
          className="text-[hsl(var(--brand-start))]"
          onClick={onEdit}
          type="button"
        >
          Edit
        </button>
      )}
    </div>
  );
}