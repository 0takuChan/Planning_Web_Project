import { cn } from "@/lib/utils";
import { addDays, format, isToday } from "date-fns";
import { Fragment } from "react";
import { AlertTriangle } from "lucide-react";
import NewItemBadge from "@/components/common/NewItemBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Step = { key: string; color: string };
export type PlanningEventStatus = "working" | "delay" | "done";
export type StepEvent = {
  id: string;
  planning_id?: number;
  job_step_id?: number;
  minutesPerUnit?: number | null;
  dueDate?: string;
  isOverdue?: boolean;
  isNewAutoPlanned?: boolean;
  status?: PlanningEventStatus;
  loggedQty?: number;
  totalPlannedQty?: number;
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
  showStatusColors?: boolean;
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

function blendHexWithWhite(hex: string, blendRatio: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return hex;
  }

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);

  const mix = (channel: number) => Math.round(channel + (255 - channel) * blendRatio)
    .toString(16)
    .padStart(2, "0");

  return `#${mix(red)}${mix(green)}${mix(blue)}`;
}

export default function StepWeekGrid({
  steps,
  events,
  locatingPlanningId,
  startDate,
  viewMode = 'month',
  daysToShow,
  showStatusColors = false,
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

  const getStatusColor = (status?: PlanningEventStatus) => {
    if (status === "done") {
      return "linear-gradient(135deg, #ecfdf5 0%, #bbf7d0 100%)";
    }

    if (status === "working") {
      return "linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)";
    }

    if (status === "delay") {
      return "linear-gradient(135deg, #fff1f2 0%, #fecdd3 100%)";
    }

    return "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)";
  };

  const getStatusTextClass = (status?: PlanningEventStatus) => {
    if (status === "done") {
      return "text-emerald-950";
    }

    if (status === "working") {
      return "text-amber-950";
    }

    if (status === "delay") {
      return "text-red-950";
    }

    return "text-slate-700";
  };

  const getEventSurface = (stepKey: string, explicitColor?: string) => {
    const baseColor = getStepColor(stepKey, explicitColor);
    const lightColor = blendHexWithWhite(baseColor, 0.76);
    const darkColor = blendHexWithWhite(baseColor, 0.62);

    return `linear-gradient(180deg, ${lightColor} 0%, ${darkColor} 100%)`;
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
      className={cn(
        "w-full step-week-grid calendar-grid-container",
        `${viewMode}-view`,
        showStatusColors && "status-mode"
      )}
      style={{ maxWidth: isWeekView ? '100%' : '1750px' }}
    >
      <div className="calendar-grid-scroll">
        <div className={cn("calendar-grid-content", viewMode === 'month' ? "month-view" : "week-view")}>
          <div
            className="grid bg-slate-300 rounded-md p-px"
            style={{
              gridTemplateColumns: isWeekView
                ? `100px repeat(${actualDaysToShow}, minmax(0px, 1fr))`
                : `100px repeat(${actualDaysToShow}, 70px)`,
              gridTemplateRows: isWeekView ? `auto repeat(${steps.length}, minmax(0, 1fr))` : undefined,
              minWidth: isWeekView ? '100%' : `${100 + (actualDaysToShow * 70)}px`,
              height: isWeekView ? '400px' : undefined,
            }}
          >
            {/* Header row */}
            <div className="px-2 py-1 bg-slate-100 text-xs font-medium text-slate-600 sticky left-0 z-50 border-r border-slate-300 shadow-[2px_0_0_rgba(203,213,225,0.9)]">
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
                    "px-2 py-2 text-xs font-medium text-slate-600 bg-white sticky left-0 z-40 border-r border-b border-slate-300 shadow-[2px_0_0_rgba(203,213,225,0.9)]",
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
                  const cellEvents = events
                    .filter((ev) => ev.step === s.key && ev.date === cellDate)
                    .sort((left, right) => {
                      const leftPriority = left.isNewAutoPlanned ? 1 : 0;
                      const rightPriority = right.isNewAutoPlanned ? 1 : 0;

                      if (leftPriority !== rightPriority) {
                        return rightPriority - leftPriority;
                      }

                      return (right.planning_id ?? 0) - (left.planning_id ?? 0);
                    });
                  const visibleCellEvents = viewMode === 'month'
                    ? cellEvents.slice(0, 2)
                    : cellEvents;
                  const hiddenEventsCount = Math.max(0, cellEvents.length - visibleCellEvents.length);
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
                          ? 'h-[50px] max-h-[50px] overflow-auto p-[2px] gap-[2px] items-start justify-start' 
                          : 'h-full min-h-0 overflow-auto p-1 gap-1 items-start justify-start',
                        cellEvents.length === 0 && 'items-center justify-center',
                        isCurrentDay && 'bg-[hsl(var(--brand-start))]/10',
                        matchingLocatedEvent && 'is-locating relative z-[1] animate-pulse'
                      )}
                    >
                      {visibleCellEvents.map((ev) => (
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
                            "planning-event-chip rounded-md select-none cursor-move block transition-opacity hover:opacity-80 w-full overflow-hidden text-ellipsis",
                            viewMode === 'month' 
                              ? 'px-[5px] py-[3px] text-[9px] leading-tight' 
                              : 'px-1 py-0.5 text-[10px] whitespace-nowrap',
                            ev.isNewAutoPlanned && 'has-new-badge relative',
                            showStatusColors ? getStatusTextClass(ev.status) : 'text-slate-700',
                            showStatusColors && ev.status && `status-${ev.status}`,
                            showStatusColors && 'status-animated',
                            ev.isOverdue && 'is-overdue',
                            ev.planning_id === locatingPlanningId && 'is-locating animate-pulse'
                          )}
                          style={{
                            background:
                              showStatusColors
                                ? getStatusColor(ev.status)
                                : getEventSurface(ev.step, ev.color || s.color),
                          }}
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
                          title={`Drag to move • Click to delete\n${ev.jobId} - ${ev.step}\n${ev.qty} pieces on ${ev.date}${ev.minutesPerUnit != null ? `\n${ev.minutesPerUnit} min/piece` : ''}${ev.totalPlannedQty != null ? `\nProduction log: ${ev.loggedQty ?? 0}/${ev.totalPlannedQty}` : ''}${ev.status ? `\nStatus: ${ev.status}` : ''}${ev.isOverdue ? `\nOver due date (${ev.dueDate})` : ''}`}
                        >
                          {ev.isNewAutoPlanned && (
                            <NewItemBadge
                              forceShow
                              variant="square"
                              className="planning-new-badge-layer absolute right-1 top-1 z-20"
                            />
                          )}
                          <span className="flex items-center gap-1 overflow-hidden pr-6">
                            {ev.isOverdue && <AlertTriangle className="planning-overdue-icon h-[10px] w-[10px] shrink-0" />}
                            <span className="overflow-hidden text-ellipsis planning-chip-label">
                              {viewMode === 'month' 
                                ? `${ev.jobId.length > 10 ? ev.jobId.substring(0, 10) + '...' : ev.jobId} × ${ev.qty}`
                                : `${ev.jobId} × ${ev.qty}`
                              }
                            </span>
                          </span>
                        </span>
                      ))}
                      {hiddenEventsCount > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="planning-more-chip w-full rounded-md border border-slate-200 bg-slate-100 px-[5px] py-[2px] text-[9px] font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                              title={`${hiddenEventsCount} more planning record(s) on ${cellDate}`}
                            >
                              +{hiddenEventsCount} more
                            </button>
                          </PopoverTrigger>
                          <PopoverContent side="right" align="start" className="planning-more-popover w-72 p-3">
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold text-slate-900">Planning on {cellDate}</div>
                                <div className="text-xs text-slate-500">{s.key} • {cellEvents.length} records</div>
                              </div>
                            </div>
                            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                              {cellEvents.map((ev) => (
                                <div
                                  key={`${ev.id}-popover`}
                                  className="rounded-md border border-slate-200 bg-white/90 px-3 py-2 shadow-sm"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="truncate text-sm font-medium text-slate-800">{ev.jobId}</div>
                                      <div className="truncate text-[11px] text-slate-500">{ev.step} • {ev.date}</div>
                                    </div>
                                    <div className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                      {ev.qty}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
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
