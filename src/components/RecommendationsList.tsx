import { AlertOctagon, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";

type Priority = "P0" | "P1" | "P2";

type Rec = {
  priority: Priority;
  category: string;
  title: string;
  description: string;
  meta: string;
};

const recs: Rec[] = [
  {
    priority: "P0",
    category: "Operations",
    title: "Packaging Line Audit",
    description:
      "38% complaint spike in last 50 SmartPhone Pro X reviews. Investigate dispatch batch #SPX-Nov-04 immediately.",
    meta: "Estimated impact: 2,400+ orders at risk",
  },
  {
    priority: "P1",
    category: "Product Roadmap",
    title: "Battery Life",
    description:
      "Consistent negative signal (82% negative, 0.93 confidence) across 3 cohorts. Recommend engineering review of power management firmware.",
    meta: "3 cohorts · 0.93 confidence",
  },
  {
    priority: "P2",
    category: "Marketing",
    title: "Camera — Amplify in Campaign",
    description:
      "Camera quality sentiment: 97% positive. Strong candidate for featured USP in next campaign cycle.",
    meta: "Top performing attribute · 30 days",
  },
];

const styles: Record<
  Priority,
  { ring: string; bg: string; text: string; label: string; icon: typeof AlertOctagon; tag: string }
> = {
  P0: {
    ring: "ring-danger/40 hover:ring-danger/70",
    bg: "bg-danger/10",
    text: "text-danger",
    label: "P0 · Urgent",
    icon: AlertOctagon,
    tag: "bg-danger text-danger-foreground",
  },
  P1: {
    ring: "ring-warning/30 hover:ring-warning/60",
    bg: "bg-warning/10",
    text: "text-warning",
    label: "P1 · Warning",
    icon: AlertTriangle,
    tag: "bg-warning text-warning-foreground",
  },
  P2: {
    ring: "ring-success/30 hover:ring-success/60",
    bg: "bg-success/10",
    text: "text-success",
    label: "P2 · Opportunity",
    icon: Sparkles,
    tag: "bg-success text-success-foreground",
  },
};

export function RecommendationsList() {
  return (
    <section className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">Prioritized Recommendations</h2>
          <p className="text-xs text-muted-foreground">Auto-generated action queue · ranked by business impact</p>
        </div>
        <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
          {recs.length} active
        </span>
      </header>

      <ul className="divide-y divide-border">
        {recs.map((r) => {
          const s = styles[r.priority];
          const Icon = s.icon;
          return (
            <li
              key={r.title}
              className={`group relative flex cursor-pointer items-start gap-4 p-5 ring-inset transition-all hover:bg-surface/60 ring-0 hover:ring-1 ${s.ring}`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.bg} ring-1 ${s.ring}`}>
                <Icon className={`h-4.5 w-4.5 ${s.text}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${s.tag}`}>
                    {s.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.category}</span>
                </div>
                <h3 className="mt-1.5 text-sm font-semibold text-foreground">{r.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                <p className={`mt-2 text-xs font-medium ${s.text}`}>{r.meta}</p>
              </div>
              <ChevronRight className="mt-2 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
