import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

type NewItemBadgeProps = {
  dateValue?: string | null; // ISO timestamp string for the order creation time
  className?: string;
  forceShow?: boolean;
  variant?: "default" | "square";
};

// localStorage key used to track the latest order that should show NEW
const LATEST_ORDER_STORAGE_KEY = "latestOrderBadge";

type LatestOrderRecord = {
  day?: string; // YYYY-MM-DD
  value?: string; // full ISO timestamp string used to identify the latest order for that day
};

function toDayKey(dateValue: string) {
  return dateValue.split("T")[0];
}

function readLatestOrder(): LatestOrderRecord {
  try {
    const raw = window.localStorage.getItem(LATEST_ORDER_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LatestOrderRecord;
  } catch (e) {
    return {};
  }
}

function writeLatestOrder(rec: LatestOrderRecord) {
  try {
    window.localStorage.setItem(LATEST_ORDER_STORAGE_KEY, JSON.stringify(rec));
  } catch (e) {
    // ignore
  }
}

export default function NewItemBadge({
  dateValue,
  className,
  forceShow = false,
  variant = "default",
}: NewItemBadgeProps) {
  // If no date provided, nothing to mark
  if (!dateValue && !forceShow) return null;

  const dayKey = dateValue ? toDayKey(dateValue) : undefined;
  const hasUpdatedRef = useRef(false);

  // Visible when storage points to this exact order (day + value)
  const stored = typeof window !== "undefined" ? readLatestOrder() : {};
  const visible = forceShow || (dayKey !== undefined && stored.day === dayKey && stored.value === dateValue);

  // On mount/update: ensure storage reflects the latest order logic:
  // - If no stored.day, set to this order's day/value
  // - If same day and this.value is newer than stored.value, update
  // - If this order's day is after stored.day (lexicographic YYYY-MM-DD), advance to the new day and set value
  useEffect(() => {
    if (!dateValue || hasUpdatedRef.current) return;

    try {
      const current = readLatestOrder();

      if (!current.day) {
        writeLatestOrder({ day: dayKey, value: dateValue });
        hasUpdatedRef.current = true;
        return;
      }

      if (current.day === dayKey) {
        // same day: keep the most recent timestamp as the "latest"
        if (!current.value || dateValue > current.value) {
          writeLatestOrder({ day: dayKey, value: dateValue });
          hasUpdatedRef.current = true;
        }
        return;
      }

      // different day: only advance if this day is later than stored day
      if (current.day && dayKey && dayKey > current.day) {
        // new day has an order -> clear previous day's NEW and point to this order
        writeLatestOrder({ day: dayKey, value: dateValue });
        hasUpdatedRef.current = true;
      }
    } catch (err) {
      // ignore errors
    }
  }, [dateValue]);

  if (!visible) return null;

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