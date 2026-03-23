import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type NewItemBadgeProps = {
  dateValue?: string | null;
  className?: string;
};

export const isRecentDate = (dateValue?: string | null, maxAgeMs = ONE_DAY_MS): boolean => {
  if (!dateValue) {
    return false;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  const elapsedMs = Date.now() - parsedDate.getTime();

  return elapsedMs >= 0 && elapsedMs < maxAgeMs;
};

export default function NewItemBadge({ dateValue, className }: NewItemBadgeProps) {
  if (!isRecentDate(dateValue)) {
    return null;
  }

  return (
    <Badge className={`gap-1 border-0 bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-emerald-500 ${className ?? ""}`.trim()}>
      <Sparkles className="h-3 w-3" />
      New
    </Badge>
  );
}