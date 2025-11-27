import { cn } from "@/lib/utils";
import { addDays, format, getDaysInMonth, isSameMonth, startOfWeek, startOfMonth } from "date-fns";
import { Fragment } from "react";

export type Step = { key: string; color: string };
export type StepEvent = {
  id: string;
  planning_id?: number;
  job_step_id?: number;
  step: string;
  day: number;
  jobId: string;
  qty: number;
  color?: string;
  date: string;
};

interface Props {
  steps: Step[];
  events: StepEvent[];
  startDate?: Date;
  viewMode?: 'week' | 'month';
  daysToShow?: number;
  onDrop?: (info: { step: string; day: number; jobId: string }) => void;
  onAskQuantity?: (
    info: { step: string; day: number; jobId: string; date: string },
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
  onMoveEvent?: (eventId: string, newStep: string, newDate: string) => void;
}

import "@/styles/step-week-grid.css";
import { useRef } from "react";

export default function StepWeekGrid({
  steps,
  events,
  startDate,
  viewMode = 'month',
  daysToShow,
  onDrop,
  onAskQuantity,
  onRemoveEvent,
  onAskDelete,
  onMoveEvent,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const actualDaysToShow = daysToShow || 7;
  const days = Array.from({ length: actualDaysToShow }, (_, i) => i + 1);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    target: { step: string; day: number },
  ) => {
    e.preventDefault();
    
    const eventId = e.dataTransfer.getData("text/eventId");
    const step = e.dataTransfer.getData("text/step") || target.step;
    const jobId = e.dataTransfer.getData("text/job");
    
    if (eventId && onMoveEvent) {
      const newDate = startDate
        ? format(addDays(startDate, target.day - 1), "yyyy-MM-dd")
        : "";
      onMoveEvent(eventId, target.step, newDate);
      return;
    }
    
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

  return (
    <div
      ref={containerRef}
      className={cn("w-full step-week-grid calendar-grid-container", `${viewMode}-view`)}
    >
      <div className="calendar-grid-scroll">
        <div className={cn("calendar-grid-content", viewMode === 'month' ? "month-view" : "week-view")}>
          <div
            className="grid bg-slate-300 rounded-md p-px"
            style={{
              gridTemplateColumns: `100px repeat(${actualDaysToShow}, minmax(${viewMode === 'month' ? '70px' : '100px'}, 1fr))`,
              minWidth: `${100 + (actualDaysToShow * (viewMode === 'month' ? 70 : 100))}px`,
            }}
          >
            {/* Header row */}
            <div className="px-2 py-1 bg-slate-100 text-xs font-medium text-slate-600 sticky left-0 z-20 border-r border-slate-300">
              Step
            </div>
            {days.map((d) => {
              const label = startDate
                ? format(addDays(startDate, d - 1), "d")
                : `${d}`;
              const dayName = startDate 
                ? format(addDays(startDate, d - 1), "EEE")
                : "";
              
              return (
                <div
                  key={d}
                  className="px-1 py-1 text-center text-xs border-r border-slate-300 last:border-r-0 bg-slate-100 text-slate-900"
                  data-swg-day-header={d}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-[10px] text-slate-400">{dayName}</div>
                </div>
              );
            })}

            {/* Step rows */}
            {steps.map((s, stepIndex) => (
              <Fragment key={s.key}>
                {/* Step name cell */}
                <div 
                  className="px-2 py-2 text-xs font-medium text-slate-600 bg-white sticky left-0 z-10 border-r border-b border-slate-300"
                >
                  {s.key}
                </div>
                
                {/* Step day cells */}
                {days.map((d) => {
                  const cellDate = startDate
                    ? format(addDays(startDate, d - 1), "yyyy-MM-dd")
                    : "";
                  const cellEvents = events.filter(
                    (ev) => ev.step === s.key && ev.date === cellDate
                  );
                  
                  return (
                    <div
                      key={`${s.key}-${d}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, { step: s.key, day: d })}
                      className={cn(
                        "border-r border-b border-slate-300 last:border-r-0 flex flex-wrap content-start bg-white hover:bg-slate-50 cursor-pointer",
                        viewMode === 'month' 
                          ? 'min-h-[50px] p-[2px] gap-[2px] items-start justify-start' 
                          : 'min-h-[50px] p-1 gap-1 items-center justify-center',
                        cellEvents.length === 0 && 'items-center justify-center'
                      )}
                    >
                      {cellEvents.map((ev) => (
                        <span
                          key={ev.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/eventId", ev.id);
                            e.dataTransfer.setData("text/step", ev.step);
                            e.dataTransfer.setData("text/job", ev.jobId);
                            e.dataTransfer.setData("text/qty", ev.qty.toString());
                            e.dataTransfer.effectAllowed = "move";
                            (e.currentTarget as HTMLElement).style.opacity = "0.5";
                          }}
                          onDragEnd={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = "1";
                          }}
                          className={cn(
                            "rounded text-white select-none cursor-move block transition-opacity hover:opacity-80 w-full overflow-hidden text-ellipsis",
                            viewMode === 'month' 
                              ? 'px-[3px] py-[1px] text-[9px] leading-tight' 
                              : 'px-1 py-0.5 text-[10px] whitespace-nowrap'
                          )}
                          style={{ backgroundColor: ev.color || s.color }}
                          onClick={(e) => {
                            e.stopPropagation();
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
                          title={`Drag to move • Click to delete\n${ev.jobId} - ${ev.step}\n${ev.qty} pieces on ${ev.date}`}
                        >
                          {viewMode === 'month' 
                            ? `${ev.jobId.length > 8 ? ev.jobId.substring(0, 8) + '...' : ev.jobId}×${ev.qty}`
                            : `${ev.jobId} × ${ev.qty}`
                          }
                        </span>
                      ))}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
