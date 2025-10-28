import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";

export type Step = { key: string; color: string };
export type StepEvent = {
  id: string;
  step: string;
  day: number;      // ยังใช้สำหรับ popup
  jobId: string;
  qty: number;
  color?: string;
  date: string;     // yyyy-MM-dd ใช้สำหรับแสดงใน grid
};

interface Props {
  steps: Step[];
  events: StepEvent[];
  startDate?: Date;
  onDrop?: (info: { step: string; day: number; jobId: string }) => void;
  onAskQuantity?: (
    info: { step: string; day: number; jobId: string; date: string }, // <-- Add 'date'
    anchor: {
      left: number;
      top: number;
      containerLeft: number;
      containerRight: number;
    },
  ) => void;
  onRemoveEvent?: (id: string) => void;
  onAskDelete?: (
    ev: StepEvent,
    anchor: {
      left: number;
      top: number;
      containerLeft: number;
      containerRight: number;
    },
  ) => void;
}

import "@/styles/step-week-grid.css";
import { useRef } from "react";

export default function StepWeekGrid({
  steps,
  events,
  startDate,
  onDrop,
  onAskQuantity,
  onRemoveEvent,
  onAskDelete,
}: Props) {
  const days = [1, 2, 3, 4, 5, 6, 7];
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: { step: string; day: number },
  ) => {
    e.preventDefault();
    const step = e.dataTransfer.getData("text/step") || target.step;
    const jobId = e.dataTransfer.getData("text/job");
    if (!jobId) return;
    const headerEl = containerRef.current?.querySelector<HTMLElement>(
      `[data-swg-day-header="${target.day}"]`,
    );
    const containerRect = containerRef.current?.getBoundingClientRect();
    const headerRect = headerEl?.getBoundingClientRect();
    if (onAskQuantity && headerRect && containerRect) {
      onAskQuantity(
        {
          step,
          day: target.day,
          jobId,
          date: startDate
            ? format(addDays(startDate, target.day - 1), "yyyy-MM-dd")
            : "",
        },
        {
          left: headerRect.left,
          top: headerRect.bottom,
          containerLeft: containerRect.left,
          containerRight: containerRect.right,
        },
      );
    } else if (onDrop) {
      onDrop({ step, day: target.day, jobId });
    }
  };

  // Render grid
  for (let row = 0; row < steps.length; row++) {
    for (let col = 0; col < 7; col++) {
      const cellDate = startDate
        ? format(addDays(startDate, col), "yyyy-MM-dd")
        : "";
      const eventsInCell = events.filter(
        (ev) =>
          ev.step === steps[row].key &&
          ev.date === cellDate
      );
      // ...render eventsInCell ใน cell นี้...
    }
  }

  return (
    <div ref={containerRef} className="w-full step-week-grid">
      <div className="grid grid-cols-8 text-xs text-slate-500">
        <div className="px-2 py-1">Step</div>
        {days.map((d) => {
          const label = startDate
            ? format(addDays(startDate, d - 1), "EEE d")
            : `Day ${d}`;
          return (
            <div
              key={d}
              className="px-2 py-1 text-center"
              data-swg-day-header={d}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="space-y-px bg-slate-200 rounded-md p-px">
        {steps.map((s) => (
          <div key={s.key} className="grid grid-cols-8 bg-white rounded">
            <div className="px-2 py-2 text-xs font-medium text-slate-600">
              {s.key}
            </div>
            {days.map((d) => {
              const cellDate = startDate
                ? format(addDays(startDate, d - 1), "yyyy-MM-dd")
                : "";
              const cellEvents = events.filter(
                (ev) => ev.step === s.key && ev.date === cellDate
              );
              return (
                <div
                  key={d}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, { step: s.key, day: d })}
                  className={cn("swg-cell")}
                >
                  {cellEvents.map((ev) => (
                    <span
                      key={ev.id}
                      className="rounded px-1.5 py-0.5 text-[11px] text-white select-none cursor-pointer"
                      style={{ backgroundColor: ev.color || s.color }}
                      onClick={(e) => {
                        const chip = e.currentTarget as HTMLElement;
                        const containerRect =
                          containerRef.current?.getBoundingClientRect();
                        const chipRect = chip.getBoundingClientRect();
                        if (onAskDelete && containerRect) {
                          onAskDelete(ev, {
                            left: chipRect.right + 6,
                            top: chipRect.top,
                            containerLeft: containerRect.left,
                            containerRight: containerRect.right,
                          });
                        }
                      }}
                    >
                      {ev.jobId} × {ev.qty}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
