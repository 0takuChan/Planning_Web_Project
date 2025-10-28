import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { MemberFormFields } from "./MemberFormFields";
import { MemberFormValues, MemberField } from "@/types/admin";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: MemberFormValues;
  onChange: (field: MemberField, value: string) => void;
  onAdd: () => void;
  isValid: boolean;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  draft,
  onChange,
  onAdd,
  isValid,
}: AddMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              invalid={{
                name: draft.name.trim() === "",
                email: draft.email.trim() === "",
                phone: draft.phone.trim() === "",
              }}
              onChange={onChange}
            />
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={onAdd} disabled={!isValid}>
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
  );
}