import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceDot } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { batch: "Batch 1", rate: 7 },
  { batch: "Batch 2", rate: 9 },
  { batch: "Batch 3", rate: 8 },
  { batch: "Batch 4", rate: 11 },
  { batch: "Batch 5", rate: 38 },
];

export function TrendChart() {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold">Packaging Complaint Rate — Sliding Window</h2>
          <p className="text-xs text-muted-foreground">5 most recent batches · 50 reviews per batch</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-danger/10 px-2.5 py-1 text-[11px] font-semibold text-danger ring-1 ring-danger/30">
          <TrendingUp className="h-3 w-3" />
          +245% vs avg
        </div>
      </header>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--danger)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="batch" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 45]}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(v) => [`${v}%`, "Complaint rate"]}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="var(--danger)"
              strokeWidth={2.5}
              fill="url(#rateFill)"
              activeDot={{ r: 5, fill: "var(--danger)", stroke: "var(--background)", strokeWidth: 2 }}
            />
            <ReferenceDot
              x="Batch 5"
              y={38}
              r={7}
              fill="var(--danger)"
              stroke="var(--background)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Baseline 7–11%</span>
        <span className="font-medium text-danger">⚠ Anomaly detected at Batch 5</span>
      </div>
    </section>
  );
}
