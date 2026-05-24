import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
}

export function LoadingDialog({ isOpen, message = "กำลังประมวลผล..." }: LoadingDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex flex-col items-center gap-4 border-none bg-black/80 text-white shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-center text-sm">{message}</p>
      </DialogContent>
    </Dialog>
  );
}
