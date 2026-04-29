import { useMemo } from "react";
import { cn } from "@/lib/utils";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthlyBarChartProps {
  title: string;
  data: number[];
  valueSuffix?: string;
  className?: string;
}

function getChartPalette(title: string) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("quantity")) {
    return {
      badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
      bar: "from-cyan-500 via-sky-400 to-blue-300",
      barGlow: "shadow-[0_14px_28px_rgba(14,165,233,0.24)]",
      peakRing: "ring-cyan-200",
      peakLabel: "bg-cyan-50 text-cyan-700 border-cyan-200",
      grid: "border-cyan-100/80",
    };
  }

  return {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "from-emerald-500 via-teal-400 to-green-300",
    barGlow: "shadow-[0_14px_28px_rgba(16,185,129,0.24)]",
    peakRing: "ring-emerald-200",
    peakLabel: "bg-emerald-50 text-emerald-700 border-emerald-200",
    grid: "border-emerald-100/80",
  };
}

export default function MonthlyBarChart({
  title,
  data,
  valueSuffix = "",
  className,
}: MonthlyBarChartProps) {
  const palette = useMemo(() => getChartPalette(title), [title]);

  const maxValue = useMemo(() => {
    return Math.max(1, ...data);
  }, [data]);

  const totalValue = useMemo(() => {
    return data.reduce((sum, value) => sum + value, 0);
  }, [data]);

  const nonZeroMonths = useMemo(() => {
    return data.filter((value) => value > 0).length;
  }, [data]);

  const peakMonthIndex = useMemo(() => {
    return data.findIndex((value) => value === maxValue);
  }, [data, maxValue]);

  const yAxisTicks = useMemo(() => {
    const ticks = [maxValue, Math.round(maxValue * 0.66), Math.round(maxValue * 0.33), 0];
    return Array.from(new Set(ticks));
  }, [maxValue]);

  return (
    <div className={cn("rounded-2xl border border-slate-200 bg-white/95 p-5 h-full flex flex-col shadow-[0_12px_30px_rgba(15,23,42,0.06)]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          <div className="mt-1 text-xs text-slate-400">Monthly overview</div>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", palette.badge)}>
            Total {totalValue}{valueSuffix}
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            {nonZeroMonths} active months
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-1 gap-4 min-h-0">
        <div className="flex w-12 shrink-0 flex-col justify-between pb-6 text-[10px] text-slate-400">
          {yAxisTicks.map((tick) => (
            <div key={tick} className="text-right leading-none">
              {tick}{valueSuffix}
            </div>
          ))}
        </div>
        <div className="relative flex flex-1 min-h-0 border-l border-slate-100 pl-3">
          <div className="pointer-events-none absolute inset-0 bottom-6 left-3 flex flex-col justify-between">
            {yAxisTicks.map((tick) => (
              <div key={tick} className="relative border-t border-dashed border-slate-200">
                <span className="absolute -top-2 left-0 h-1.5 w-1.5 rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="relative z-10 flex flex-1 items-end gap-2 min-h-0">
          {data.map((value, index) => {
            const height = Math.max(6, Math.round((value / maxValue) * 100));
            const hasValue = value > 0;
            const isPeakMonth = index === peakMonthIndex && value > 0;

            return (
              <div key={MONTH_LABELS[index]} className="flex-1 flex flex-col items-center gap-2 min-w-0 h-full">
                <div className="h-5 flex items-end justify-center text-center">
                  {hasValue ? (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none",
                        isPeakMonth ? palette.peakLabel : "border-slate-200 bg-white text-slate-500"
                      )}
                    >
                      {value}{valueSuffix}
                    </span>
                  ) : null}
                </div>
                <div className="w-full flex-1 flex items-end justify-center min-h-[12rem]">
                  <div
                    className={cn(
                      "relative w-full max-w-[34px] rounded-t-[14px] bg-gradient-to-t transition-all duration-300",
                      palette.bar,
                      hasValue ? palette.barGlow : "shadow-none opacity-35",
                      isPeakMonth && `ring-2 ${palette.peakRing}`
                    )}
                    style={{ height: `${height}%` }}
                    title={`${MONTH_LABELS[index]}: ${value}${valueSuffix}`}
                  >
                    <div className="absolute inset-x-[18%] top-2 h-[28%] rounded-full bg-white/30 blur-[1px]" />
                  </div>
                </div>
                <div className={cn("text-[10px] font-medium", hasValue ? "text-slate-600" : "text-slate-300")}>{MONTH_LABELS[index]}</div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
