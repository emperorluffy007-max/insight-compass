import { AlertTriangle, ArrowRight } from "lucide-react";

export function AlertBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-danger/40 bg-[image:var(--gradient-danger)] p-5">
      <div className="absolute inset-y-0 left-0 w-1 bg-danger animate-pulse-danger" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/20 ring-1 ring-danger/40">
            <AlertTriangle className="h-5 w-5 text-danger animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-danger">🚨 System Alert Triggered</span>
              <span className="rounded-full bg-danger/20 px-2 py-0.5 text-[10px] font-semibold text-danger ring-1 ring-danger/40">
                P0 · ANOMALY
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/95">
              Packaging quality complaints for{" "}
              <span className="font-semibold text-foreground">'SmartPhone Pro X'</span> jumped from{" "}
              <span className="font-mono text-warning">8%</span> to{" "}
              <span className="font-mono font-semibold text-danger">38%</span> in the last 50 reviews
              (vs. prior 50). Likely linked to dispatch batch{" "}
              <span className="rounded bg-surface/80 px-1.5 py-0.5 font-mono text-xs ring-1 ring-border">
                #SPX-2024-Nov-04
              </span>
              .
            </p>
          </div>
        </div>
        <button className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-medium text-danger-foreground transition-all hover:bg-danger/90 hover:shadow-[0_8px_24px_-8px_var(--danger)]">
          Investigate Now
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
