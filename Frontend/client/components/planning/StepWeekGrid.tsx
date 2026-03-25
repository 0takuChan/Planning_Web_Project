import { cn } from "@/lib/utils";
import { addDays, format, isToday } from "date-fns";
import { Fragment } from "react";

export type Step = { key: string; color: string };
export type StepEvent = {
  id: string;
  planning_id?: number;
  job_step_id?: number;
  minutesPerUnit?: number | null;
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
  locatingPlanningId?: number | null;
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
  onLocatePlanningSeen?: (planningId: number) => void;
}

import "@/styles/step-week-grid.css";
import { useEffect, useRef } from "react";

const STEP_COLOR_FALLBACKS: Record<string, string> = {
  Cutting: "#86efac",
  Heating: "#fca5a5",
  Embroidering: "#fde68a",
  Sewing: "#a5b4fc",
  QC: "#67e8f9",
  Pack: "#f0abfc",
};

const generatedStepColors = new Map<string, string>();

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const normalizedHue = hue / 360;
  const normalizedSaturation = saturation / 100;
  const normalizedLightness = lightness / 100;

  const hueToRgb = (p: number, q: number, t: number) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };

  let red: number;
  let green: number;
  let blue: number;

  if (normalizedSaturation === 0) {
    red = normalizedLightness;
    green = normalizedLightness;
    blue = normalizedLightness;
  } else {
    const q = normalizedLightness < 0.5
      ? normalizedLightness * (1 + normalizedSaturation)
      : normalizedLightness + normalizedSaturation - normalizedLightness * normalizedSaturation;
    const p = 2 * normalizedLightness - q;
    red = hueToRgb(p, q, normalizedHue + 1 / 3);
    green = hueToRgb(p, q, normalizedHue);
    blue = hueToRgb(p, q, normalizedHue - 1 / 3);
  }

  const toHex = (value: number) => Math.round(value * 255).toString(16).padStart(2, "0");
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

export default function StepWeekGrid({
  steps,
  events,
  locatingPlanningId,
  startDate,
  viewMode = 'month',
  daysToShow,
  onDrop,
  onAskQuantity,
  onRemoveEvent,
  onAskDelete,
  onMoveEvent,
  onLocatePlanningSeen,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!locatingPlanningId || !containerRef.current) {
      return;
    }

    const targetChip = containerRef.current.querySelector<HTMLElement>(
      `[data-planning-chip-id="${locatingPlanningId}"]`
    );
    const targetCell = containerRef.current.querySelector<HTMLElement>(
      `[data-planning-cell-id="${locatingPlanningId}"]`
    );

    const scrollTarget = targetChip || targetCell;
    if (!scrollTarget) {
      return;
    }

    requestAnimationFrame(() => {
      const scrollFrame = containerRef.current?.parentElement;
      const frameRect = scrollFrame?.getBoundingClientRect();
      const targetRect = scrollTarget.getBoundingClientRect();

      if (scrollFrame && frameRect) {
        const nextScrollLeft =
          scrollFrame.scrollLeft +
          (targetRect.left - frameRect.left) -
          (frameRect.width / 2 - targetRect.width / 2);

        scrollFrame.scrollTo({
          left: Math.max(0, nextScrollLeft),
          behavior: "smooth",
        });
      }
    });
  }, [locatingPlanningId, viewMode, startDate]);

  const getStepColor = (stepKey: string, explicitColor?: string) => {
    if (explicitColor) {
      return explicitColor;
    }

    if (STEP_COLOR_FALLBACKS[stepKey]) {
      return STEP_COLOR_FALLBACKS[stepKey];
    }

    const cachedColor = generatedStepColors.get(stepKey);
    if (cachedColor) {
      return cachedColor;
    }

    let hash = 0;
    for (let index = 0; index < stepKey.length; index += 1) {
      hash = (hash * 31 + stepKey.charCodeAt(index)) % 360;
    }

    const generatedColor = hslToHex(hash, 72, 72);
    generatedStepColors.set(stepKey, generatedColor);
    return generatedColor;
  };
  
  const actualDaysToShow = daysToShow || 7;
  const days = Array.from({ length: actualDaysToShow }, (_, i) => i + 1);
  const isWeekView = viewMode === 'week';

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
      style={{ maxWidth: isWeekView ? '100%' : '1750px' }}
    >
      <div className="calendar-grid-scroll">
        <div className={cn("calendar-grid-content", viewMode === 'month' ? "month-view" : "week-view")}>
          <div
            className="grid bg-slate-300 rounded-md p-px"
            style={{
              gridTemplateColumns: `100px repeat(${actualDaysToShow}, minmax(${isWeekView ? '0px' : '70px'}, 1fr))`,
              gridTemplateRows: isWeekView ? `auto repeat(${steps.length}, minmax(0, 1fr))` : undefined,
              minWidth: isWeekView ? '100%' : `${100 + (actualDaysToShow * 70)}px`,
              height: isWeekView ? '400px' : undefined,
            }}
          >
            {/* Header row */}
            <div className="px-2 py-1 bg-slate-100 text-xs font-medium text-slate-600 sticky left-0 z-20 border-r border-slate-300">
              Step
            </div>
            {days.map((d) => {
              const date = startDate ? addDays(startDate, d - 1) : null;
              const label = date ? format(date, "d") : `${d}`;
              const dayName = date ? format(date, "EEE") : "";
              const isCurrentDay = date ? isToday(date) : false;
              
              return (
                <div
                  key={d}
                  className={cn(
                    "px-1 py-1 text-center text-xs border-r border-slate-300 last:border-r-0 bg-slate-100 text-slate-900",
                    isCurrentDay && "bg-[hsl(var(--brand-end))]/15 text-[hsl(var(--brand-end))] shadow-[inset_0_-2px_0_0_hsl(var(--brand-end))]"
                  )}
                  data-swg-day-header={d}
                >
                  <div className={cn("font-medium", isCurrentDay && "text-[hsl(var(--brand-end))]")}>{label}</div>
                  <div className={cn("text-[10px] text-slate-400", isCurrentDay && "text-[hsl(var(--brand-end))]/80")}>{dayName}</div>
                </div>
              );
            })}

            {/* Step rows */}
            {steps.map((s, stepIndex) => (
              <Fragment key={s.key}>
                {/* Step name cell */}
                <div 
                  className={cn(
                    "px-2 py-2 text-xs font-medium text-slate-600 bg-white sticky left-0 z-10 border-r border-b border-slate-300",
                    isWeekView && "flex items-center"
                  )}
                >
                  {s.key}
                </div>
                
                {/* Step day cells */}
                {days.map((d) => {
                  const cellDate = startDate
                    ? format(addDays(startDate, d - 1), "yyyy-MM-dd")
                    : "";
                  const isCurrentDay = startDate ? isToday(addDays(startDate, d - 1)) : false;
                  const cellEvents = events.filter(
                    (ev) => ev.step === s.key && ev.date === cellDate
                  );
                  const matchingLocatedEvent = locatingPlanningId
                    ? cellEvents.find((ev) => ev.planning_id === locatingPlanningId)
                    : undefined;
                  
                  return (
                    <div
                      key={`${s.key}-${d}`}
                      data-planning-cell-id={matchingLocatedEvent?.planning_id ?? undefined}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, { step: s.key, day: d })}
                      onMouseEnter={() => {
                        if (matchingLocatedEvent?.planning_id && onLocatePlanningSeen) {
                          onLocatePlanningSeen(matchingLocatedEvent.planning_id);
                        }
                      }}
                      className={cn(
                        "planning-day-cell border-r border-b border-slate-300 last:border-r-0 flex flex-wrap content-start bg-white hover:bg-slate-50 cursor-pointer",
                        viewMode === 'month' 
                          ? 'min-h-[50px] p-[2px] gap-[2px] items-start justify-start' 
                          : 'h-full min-h-0 overflow-y-auto p-1 gap-1 items-start justify-start',
                        cellEvents.length === 0 && 'items-center justify-center',
                        isCurrentDay && 'bg-[hsl(var(--brand-start))]/10',
                        matchingLocatedEvent && 'is-locating relative z-[1] animate-pulse'
                      )}
                    >
                      {cellEvents.map((ev) => (
                        <span
                          key={ev.id}
                          data-planning-chip-id={ev.planning_id ?? undefined}
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
                            "planning-event-chip rounded text-white select-none cursor-move block transition-opacity hover:opacity-80 w-full overflow-hidden text-ellipsis",
                            viewMode === 'month' 
                              ? 'px-[3px] py-[1px] text-[9px] leading-tight' 
                              : 'px-1 py-0.5 text-[10px] whitespace-nowrap',
                            ev.planning_id === locatingPlanningId && 'is-locating animate-pulse'
                          )}
                          style={{ backgroundColor: getStepColor(ev.step, ev.color || s.color) }}
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
                          title={`Drag to move • Click to delete\n${ev.jobId} - ${ev.step}\n${ev.qty} pieces on ${ev.date}${ev.minutesPerUnit != null ? `\n${ev.minutesPerUnit} min/piece` : ''}`}
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
