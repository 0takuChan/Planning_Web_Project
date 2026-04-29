import { Badge } from "@/components/ui/badge";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type NewItemBadgeProps = {
  dateValue?: string | null;
  className?: string;
  forceShow?: boolean;
  variant?: "default" | "square";
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

export default function NewItemBadge({
  dateValue,
  className,
  forceShow = false,
  variant = "default",
}: NewItemBadgeProps) {
  if (!forceShow && !isRecentDate(dateValue)) {
    return null;
  }

  if (variant === "square") {
    return (
      <Badge
        title="New"
        className={[
          "justify-center rounded-sm border border-white/80 bg-red-500 px-1 text-[7px] font-black uppercase tracking-[0.14em] text-white shadow-[0_4px_10px_rgba(239,68,68,0.35)] hover:bg-red-500",
          "h-4 min-w-[24px] leading-none",
          className ?? "",
        ].join(" ").trim()}
      >
        NEW
      </Badge>
    );
  }

  return (
    <Badge className={`gap-1 border-0 bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-emerald-500 ${className ?? ""}`.trim()}>
      New
    </Badge>
  );
}