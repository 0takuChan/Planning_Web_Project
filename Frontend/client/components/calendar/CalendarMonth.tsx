import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export type CalendarEvent = { id: string; date: Date; label: string; color?: string };
export type CalendarHighlightRange = { id: string; start: Date; end: Date; color?: string };

export interface CalendarMonthProps {
  month: Date;
  events?: CalendarEvent[];
  highlightRanges?: CalendarHighlightRange[];
  onDayClick?: (day: Date) => void;
  onDropEvent?: (day: Date, data: { step?: string; jobId?: string }) => void;
}

export default function CalendarMonth({ month, events = [], highlightRanges = [], onDayClick, onDropEvent }: CalendarMonthProps) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days = useMemo(() => eachDayOfInterval({ start, end }), [start.getTime(), end.getTime()]);

  const toRgba = (color: string | undefined, alpha: number) => {
    if (!color) {
      return `rgba(59, 130, 246, ${alpha})`;
    }

    const hexMatch = color.match(/^#([0-9a-fA-F]{6})$/);
    if (!hexMatch) {
      return color;
    }

    const hex = hexMatch[1];
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    const step = e.dataTransfer.getData("text/step");
    const jobId = e.dataTransfer.getData("text/job");
    onDropEvent?.(day, { step, jobId });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 text-xs text-slate-500">
        {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
          <div key={d} className="px-2 py-1 tracking-wide">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
        {days.map((day) => {
          const daysEvents = events.filter((ev) => isSameDay(ev.date, day));
          const inMonth = isSameMonth(day, month);
          const weekend = day.getDay() === 0 || day.getDay() === 6;
          const dayHighlight = highlightRanges.find((range) =>
            isWithinInterval(day, { start: range.start, end: range.end })
          );
          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick?.(day)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, day)}
              className={cn(
                "relative min-h-24 md:min-h-28 bg-white p-2 flex flex-col gap-1 cursor-pointer transition-colors",
                !inMonth && "bg-slate-50 text-slate-400",
                weekend && inMonth && "bg-slate-50/60",
                isToday(day) && "outline outline-1 outline-[hsl(var(--brand-end))]/40"
              )}
              style={
                inMonth && dayHighlight
                  ? { boxShadow: `inset 0 0 0 9999px ${toRgba(dayHighlight.color, 0.2)}` }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <div className={cn("text-[11px] font-medium", inMonth ? "text-slate-600" : "text-slate-400")}>{format(day, "d")}</div>
                {daysEvents.length > 0 && <span className="text-[10px] text-slate-400">{daysEvents.length}</span>}
              </div>
              <div className="flex flex-col gap-1">
                {daysEvents.map((ev) => (
                  <div
                    key={ev.id}
                    title={ev.label}
                    className={cn(
                      "truncate rounded-md px-1.5 py-0.5 text-[11px] shadow-sm",
                      ev.color ? "text-white border border-white/20" : "bg-primary/10 text-primary border border-primary/20"
                    )}
                    style={ev.color ? { backgroundColor: ev.color } : undefined}
                  >
                    {ev.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
