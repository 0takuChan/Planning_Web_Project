import { useMemo } from "react";

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
}

export default function MonthlyBarChart({
  title,
  data,
  valueSuffix = "",
}: MonthlyBarChartProps) {
  const maxValue = useMemo(() => {
    return Math.max(1, ...data);
  }, [data]);

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      <div className="mt-4 flex items-end gap-2">
        {data.map((value, index) => {
          const height = Math.max(6, Math.round((value / maxValue) * 100));
          return (
            <div key={MONTH_LABELS[index]} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[10px] text-slate-500">{value}{valueSuffix}</div>
              <div className="w-full h-40 flex items-end">
                <div
                  className="w-full rounded-md bg-sky-200"
                  style={{ height: `${height}%` }}
                  title={`${MONTH_LABELS[index]}: ${value}${valueSuffix}`}
                />
              </div>
              <div className="text-[10px] text-slate-500">{MONTH_LABELS[index]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
