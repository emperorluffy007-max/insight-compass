import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Bell, Sparkles, AlertOctagon, ArrowRight, TrendingUp, Bot, ShieldCheck, Brain, CheckCircle2, Activity, Clock, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceDot } from "recharts";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Intelligence Dashboard · ReadReview.ai" },
      { name: "description", content: "Real-time review intelligence: sentiment velocity, anomaly alerts, and AI-flagged reviews." },
    ],
  }),
});

function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <DashboardHeader />
      <div className="mx-auto grid max-w-[1600px] gap-5 px-5 py-5 lg:grid-cols-12">
        <aside className="lg:col-span-3 space-y-4">
          <SmartAssistant />
        </aside>
        <main className="lg:col-span-6 space-y-5">
          <CentralIntelligence />
        </main>
        <aside className="lg:col-span-3 space-y-4">
          <ContextPanel />
        </aside>
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40">
            <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight">ReadReview<span className="text-[var(--cyan)]">.ai</span></span>
        </Link>

        <div className="relative ml-4 hidden flex-1 max-w-xl md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search Product or Feature…"
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--pink)] animate-pulse" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] text-xs font-bold text-white ring-2 ring-background">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}

/* ---------- LEFT: Smart Assistant ---------- */
function SmartAssistant() {
  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-[var(--pink)]/40 bg-[image:var(--gradient-pink)] p-4">
        <div className="absolute inset-y-0 left-0 w-1 bg-[var(--pink)] animate-pulse-pink" />
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--pink)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--pink)] ring-1 ring-[var(--pink)]/40">
            🚨 P0 Alert
          </span>
        </div>
        <h3 className="mt-2 text-base font-bold tracking-tight">Battery Life</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-foreground/85">
          Complaints spiked <span className="font-semibold text-[var(--pink)]">38%</span> in the last 48 hours for{" "}
          <span className="font-semibold">Model X</span>.
        </p>
        <button className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--cyan)] px-3 py-2 text-xs font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan">
          Investigate Root Cause <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Decision Stack</h4>
        <div className="space-y-2">
          {[
            { icon: Bot, label: "Reviews Processed", value: "2.4k" },
            { icon: ShieldCheck, label: "Bot Filter Accuracy", value: "94%" },
            { icon: Brain, label: "Avg AI Confidence", value: "0.89" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2.5 transition-all hover:border-[var(--cyan)]/40">
              <div className="flex items-center gap-2.5">
                <s.icon className="h-3.5 w-3.5 text-[var(--cyan)]" />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</h4>
        <div className="space-y-1.5 text-xs">
          {["Re-run sentiment model", "Export today's anomalies", "Notify product team"].map((a) => (
            <button key={a} className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
              <span>{a}</span>
              <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- CENTER: Central Intelligence ---------- */
const trendData = [
  { t: "Mon", positive: 62, negative: 12 },
  { t: "Tue", positive: 65, negative: 14 },
  { t: "Wed", positive: 64, negative: 15 },
  { t: "Thu", positive: 60, negative: 18 },
  { t: "Fri", positive: 55, negative: 24 },
  { t: "Sat", positive: 48, negative: 38 },
  { t: "Sun", positive: 44, negative: 52 },
];

type Sent = "Negative" | "Positive" | "Mixed";
const reviews: { snippet: string; feature: string; sentiment: Sent; flag: string }[] = [
  { snippet: "Great screen but battery is terrible after the update…", feature: "Battery", sentiment: "Negative", flag: "⚠️ Sarcasm Detected" },
  { snippet: "Camera quality is outstanding, low-light shots are insane!", feature: "Camera", sentiment: "Positive", flag: "—" },
  { snippet: "Packaging arrived torn — GREAT quality control 🙄", feature: "Packaging", sentiment: "Negative", flag: "⚠️ Sarcasm Detected" },
  { snippet: "Battery life bahut kharaab hai, drains in 4 hrs.", feature: "Battery", sentiment: "Negative", flag: "🌐 Multi-lingual" },
  { snippet: "Decent phone, nothing special but does the job.", feature: "Overall", sentiment: "Mixed", flag: "Human Review" },
];

const pill: Record<Sent, string> = {
  Positive: "bg-[var(--cyan)]/15 text-[var(--cyan)] ring-[var(--cyan)]/40",
  Negative: "bg-[var(--pink)]/15 text-[var(--pink)] ring-[var(--pink)]/40",
  Mixed: "bg-muted text-muted-foreground ring-border",
};

function CentralIntelligence() {
  return (
    <>
      <section className="rounded-xl border border-border bg-card p-5">
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold">Sentiment Velocity · Trend Radar</h2>
            <p className="text-xs text-muted-foreground">Last 7 days · Battery feature on Model X</p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-[var(--pink)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--pink)] ring-1 ring-[var(--pink)]/30">
            <TrendingUp className="h-3 w-3" /> Negative +245%
          </div>
        </header>

        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="negFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--pink)" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="var(--pink)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="posFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 80]} />
              <Tooltip
                cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--foreground)" }}
              />
              <Area type="monotone" dataKey="positive" stroke="var(--cyan)" strokeWidth={2} fill="url(#posFill)" />
              <Area type="monotone" dataKey="negative" stroke="var(--pink)" strokeWidth={2.5} fill="url(#negFill)" activeDot={{ r: 5, fill: "var(--pink)", stroke: "var(--background)", strokeWidth: 2 }} />
              <ReferenceDot x="Sun" y={52} r={7} fill="var(--pink)" stroke="var(--background)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--cyan)]" /> Positive</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--pink)]" /> Negative</span>
          </div>
          <span className="font-medium text-[var(--pink)]">⚠ Anomaly: negative spike on Sun</span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Granular NLP Table</h2>
            <p className="text-xs text-muted-foreground">Feature-level extraction · sarcasm + multi-lingual aware</p>
          </div>
          <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-medium text-muted-foreground ring-1 ring-border">
            Live · 5 of 2,431
          </span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium w-[40%]">Raw Review Snippet</th>
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 font-medium">Sentiment</th>
                <th className="px-5 py-3 font-medium">AI Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-accent/50">
                  <td className="px-5 py-4 text-foreground/90 italic">"{r.snippet}"</td>
                  <td className="px-5 py-4 font-medium">{r.feature}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${pill[r.sentiment]}`}>
                      {r.sentiment}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{r.flag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* ---------- RIGHT: Context Panel ---------- */
const notifications = [
  { icon: ShieldCheck, color: "text-[var(--cyan)]", text: "Spam cluster of 15 reviews automatically removed.", time: "2m ago" },
  { icon: TrendingUp, color: "text-emerald-500", text: "Positive sentiment for 'Packaging' is trending up.", time: "12m ago" },
  { icon: AlertOctagon, color: "text-[var(--pink)]", text: "P0 Battery alert escalated to product team.", time: "23m ago" },
  { icon: Activity, color: "text-[var(--purple)]", text: "New cohort detected: Model X · EU region.", time: "41m ago" },
  { icon: CheckCircle2, color: "text-emerald-500", text: "Daily intake completed: 2,431 reviews.", time: "1h ago" },
];

function ContextPanel() {
  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Live Notifications</h4>
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>
        <ul className="space-y-3">
          {notifications.map((n, i) => (
            <li key={i} className="flex gap-2.5 text-xs">
              <n.icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.color}`} />
              <div className="min-w-0 flex-1">
                <p className="leading-relaxed text-foreground/90">{n.text}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--cyan)]/15 blur-3xl" />
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Impact Summary</h4>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[var(--cyan)]" />
              <span className="text-[11px] text-muted-foreground">Actionable Insights Found</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-gradient-cyan-purple">12</p>
          </div>
          <div className="rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[var(--purple)]" />
              <span className="text-[11px] text-muted-foreground">Time Saved vs Manual</span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums">14 <span className="text-base font-medium text-muted-foreground">hrs</span></p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-4">
        <p className="text-xs font-semibold">Need a deeper dive?</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Generate an executive PDF report from the last 7 days.</p>
        <button className="mt-3 w-full rounded-lg border border-[var(--cyan)]/40 bg-card px-3 py-2 text-xs font-semibold text-[var(--cyan)] hover:bg-[var(--cyan)]/10">
          Generate Report
        </button>
      </div>
    </>
  );
}
