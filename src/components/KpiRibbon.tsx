import { Database, ShieldCheck, Gauge, Zap, type LucideIcon } from "lucide-react";

type Kpi = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  tone: "primary" | "success" | "warning" | "danger";
  trend?: string;
};

const kpis: Kpi[] = [
  { label: "Total Reviews Analyzed", value: "200+", sub: "across 3 categories", icon: Database, tone: "primary", trend: "+18% wk" },
  { label: "Bot / Spam Detection", value: "94.3%", sub: "accuracy on validation set", icon: ShieldCheck, tone: "success", trend: "+0.8%" },
  { label: "Avg Confidence Score", value: "0.89", sub: "weighted across features", icon: Gauge, tone: "warning" },
  { label: "Processing Time", value: "< 2s", sub: "per batch (50 reviews)", icon: Zap, tone: "success", trend: "1.4s avg" },
];

const toneRing: Record<Kpi["tone"], string> = {
  primary: "ring-primary/20 text-primary",
  success: "ring-success/20 text-success",
  warning: "ring-warning/25 text-warning",
  danger: "ring-danger/25 text-danger",
};

export function KpiRibbon() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div
            key={k.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-[image:var(--gradient-surface)] p-5 transition-all hover:border-border/80 hover:translate-y-[-1px] hover:shadow-[var(--shadow-elevated)]"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface ring-1 ${toneRing[k.tone]}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              {k.trend && (
                <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                  {k.trend}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{k.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
            </div>
            <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        );
      })}
    </div>
  );
}
