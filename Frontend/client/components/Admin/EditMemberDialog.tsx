import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPen } from "lucide-react";
import { MemberFormFields } from "./MemberFormFields";
import { MemberFormValues, MemberField } from "@/types/admin";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: MemberFormValues;
  onChange: (field: MemberField, value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  isValid: boolean;
  isAdmin: boolean;
}

export function EditMemberDialog({
  open,
  onOpenChange,
  draft,
  onChange,
  onSave,
  onDelete,
  isValid,
  isAdmin,
}: EditMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              values={draft}
              invalid={{
                name: draft.name.trim() === "",
                email: draft.email.trim() === "",
                phone: draft.phone.trim() === "",
              }}
              onChange={onChange}
              isEdit={true}
            />
            <div className="mt-8 flex flex-col-reverse justify-between gap-3 md:flex-row md:items-center">
              {isAdmin && (
                <Button
                  variant="destructive"
                  onClick={onDelete}
                  type="button"
                >
                  Delete
                </Button>
              )}
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  disabled={!isValid}
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
  );
}