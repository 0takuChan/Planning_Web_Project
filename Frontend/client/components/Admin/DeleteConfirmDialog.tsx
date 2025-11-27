import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  memberName: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  memberName,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{memberName || 'this member'}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => onOpenChange(false)} type="button">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}