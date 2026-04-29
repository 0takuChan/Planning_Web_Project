import { APP_NAME, APP_SHORT_NAME, APP_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  showTagline?: boolean;
  className?: string;
};

export default function BrandLogo({ compact = false, showTagline = true, className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(var(--brand-start))] via-[hsl(var(--brand-end))] to-cyan-500 text-white shadow-[0_12px_24px_-16px_hsl(var(--brand-end)/0.85)] ring-1 ring-white/50">
        <svg viewBox="0 0 48 48" className="h-6 w-6" fill="none" aria-hidden="true">
          <path d="M12 10h14c6.627 0 12 5.373 12 12s-5.373 12-12 12H20v8H12V10Z" fill="currentColor" opacity="0.95" />
          <path d="M20 18h6.5a4 4 0 1 1 0 8H20v-8Z" fill="#0f172a" opacity="0.28" />
          <path d="M26 10h10L22 38H12l14-28Z" fill="white" opacity="0.92" />
        </svg>
      </div>

      {!compact && (
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-[0.18em] text-slate-900 uppercase">{APP_SHORT_NAME}</div>
          <div className="truncate text-[13px] font-medium text-slate-700">{APP_NAME}</div>
          {showTagline && <div className="truncate text-[11px] text-slate-500">{APP_TAGLINE}</div>}
        </div>
      )}
    </div>
  );
}
