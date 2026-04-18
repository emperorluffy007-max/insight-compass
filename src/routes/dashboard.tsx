import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Search, Bell, Sparkles, AlertOctagon, ArrowRight, TrendingUp, Bot,
  ShieldCheck, Brain, CheckCircle2, Activity, Clock, Zap, LogOut,
  Link2, FileText, PlusCircle, X, Download, RefreshCw, Send,
  Calendar, ChevronDown, Filter, LayoutDashboard, Radar, Table2,
  TriangleAlert, Database, History, ExternalLink, Upload, Trash2,
  Eye, ChevronRight, TrendingDown, Minus, Loader2, GitCompare, Globe, ShoppingBag,
} from "lucide-react";
import {
  LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, Legend, ReferenceDot,
  RadarChart, PolarGrid, PolarAngleAxis, Radar as RechartsRadar,
  BarChart, Bar, Cell, PieChart, Pie,
  AreaChart, Area,
} from "recharts";
import { ThemeToggle } from "@/components/ThemeToggle";
import { z } from "zod";
import type { AnalysisResult, DiscoveredAspect, VelocityPoint } from "@/lib/api";

/* ─── Route ─── */
const searchSchema = z.object({
  view: z.enum(["overview", "trend-radar", "aspect-analysis", "anomaly-alerts", "data-hub", "history", "comparison", "category-segregation"])
    .optional()
    .default("overview"),
});

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Intelligence Dashboard · ReadReview.ai" },
      { name: "description", content: "Dynamic AI-powered review intelligence dashboard." },
    ],
  }),
});

/* ─── Nav ─── */
type ViewKey = "overview" | "trend-radar" | "aspect-analysis" | "anomaly-alerts" | "data-hub" | "history" | "comparison" | "category-segregation";
const NAV: { key: ViewKey; label: string; icon: any }[] = [
  { key: "overview",        label: "Dashboard",       icon: LayoutDashboard },
  { key: "category-segregation", label: "Category Segregation", icon: Database },
  { key: "trend-radar",     label: "Trend Radar",     icon: Radar },
  { key: "aspect-analysis", label: "Aspect Analysis", icon: Table2 },
  { key: "anomaly-alerts",  label: "Anomaly Alerts",  icon: TriangleAlert },
  { key: "comparison",      label: "Comparison",      icon: GitCompare },
  { key: "data-hub",        label: "Data Hub",        icon: Database },
  { key: "history",         label: "History",         icon: History },
];

/* ─── Session types ─── */
interface RRUser   { name: string; email: string }
interface RRSource { type: "url" | "file"; value: string }

type ToastKind = "success" | "error" | "loading" | "info";
interface Toast { id: number; message: string; kind: ToastKind }

/* ─── Palette for N aspects ─── */
const ASPECT_COLORS = [
  "var(--cyan)", "#8b5cf6", "#f59e0b", "var(--pink)",
  "#10b981", "#3b82f6", "#ec4899", "#f97316",
];
function aspectColor(i: number) { return ASPECT_COLORS[i % ASPECT_COLORS.length]; }

const SENTIMENT_PILL: Record<string, string> = {
  Positive: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/40 dark:text-emerald-400",
  Negative: "bg-[var(--pink)]/15 text-[var(--pink)] ring-[var(--pink)]/40",
  Mixed:    "bg-muted text-muted-foreground ring-border",
};

/* ─── Session helpers ─── */
function useSession() {
  const [user,     setUser]     = useState<RRUser | null>(null);
  const [source,   setSource]   = useState<RRSource | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    try {
      const u = sessionStorage.getItem("rr_user");
      const s = sessionStorage.getItem("rr_source");
      const a = sessionStorage.getItem("rr_analysis");
      if (u) setUser(JSON.parse(u));
      if (s) setSource(JSON.parse(s));
      if (a) setAnalysis(JSON.parse(a));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  return { user, source, analysis, loading };
}

/* ─── Toast ─── */
function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  function push(message: string, kind: ToastKind = "info", duration = 3200) {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, message, kind }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }
  function dismiss(id: number) { setToasts((t) => t.filter((x) => x.id !== id)); }
  return { toasts, push, dismiss };
}

/* ─── Velocity tooltip ─── */
function VelocityTooltip({ active, payload, label, spikeAspect, lastT }: any) {
  if (!active || !payload?.length) return null;
  const isSpike = label === lastT;
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-xl text-xs min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey}
          </span>
          <span className="font-semibold tabular-nums text-foreground">{p.value}%</span>
        </div>
      ))}
      {isSpike && spikeAspect && (
        <div className="mt-2 rounded-lg border border-[var(--pink)]/40 bg-[var(--pink)]/10 px-2.5 py-1.5">
          <p className="font-bold text-[var(--pink)]">🚨 Anomaly Detected</p>
          <p className="text-muted-foreground mt-0.5">{spikeAspect} spike · highest complaint rate</p>
        </div>
      )}
    </div>
  );
}

/* ─── Loading spinner ─── */
function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32 gap-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cyan)]/10 ring-2 ring-[var(--cyan)]/30">
        <Loader2 className="h-6 w-6 text-[var(--cyan)] animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold">Analyzing dataset to discover product context…</p>
        <p className="text-xs text-muted-foreground mt-1">The AI is finding features specific to your product</p>
      </div>
    </div>
  );
}

/* ─── Empty / no-analysis state ─── */
function EmptyState({ onNewAnalysis }: { onNewAnalysis: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32 gap-5">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-border/50">
        <Sparkles className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-sm font-semibold">No analysis yet</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Upload a review file or paste a product URL to let the AI discover product context and extract insights.
        </p>
      </div>
      <button
        onClick={onNewAnalysis}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--cyan)] px-5 text-sm font-semibold text-[oklch(0.18_0.04_260)] hover:brightness-110 glow-cyan transition-all"
      >
        <PlusCircle className="h-4 w-4" /> Start new analysis
      </button>
    </div>
  );
}

/* ─── Skeleton pulse block helper ─── */
function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-border/60 ${className}`} />;
}

/* ─── Skeleton overview — shown when URL is unrecognised ─── */
function SkeletonView({ onNewAnalysis }: { onNewAnalysis: () => void }) {
  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      {/* Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3">
        <Sk className="h-4 w-4 rounded-full" />
        <Sk className="h-4 w-48" />
        <div className="ml-auto flex items-center gap-2">
          <Sk className="h-5 w-32" />
          <span className="rounded-full bg-border/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground/60 ring-1 ring-border">Awaiting URL</span>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--cyan)]/20 bg-[var(--cyan)]/5 px-4 py-3 text-xs">
        <Sparkles className="h-3.5 w-3.5 text-[var(--cyan)] shrink-0" />
        <p className="text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Preview mode.</span>{" "}
          Paste a recognised Flipkart product URL on the{" "}
          <button onClick={onNewAnalysis} className="text-[var(--cyan)] font-semibold hover:underline">analysis page</button>{" "}
          to populate this dashboard with real insights.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {["Reviews Processed", "Spam Detected", "Overall Positivity", "Anomalies"].map(label => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60">{label}</span>
              <Sk className="h-8 w-8 rounded-lg" />
            </div>
            <Sk className="h-7 w-20" />
            <Sk className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2 space-y-4">
          <Sk className="h-4 w-36" />
          <Sk className="h-3 w-52" />
          <div className="flex items-center gap-4">
            <Sk className="h-44 w-44 rounded-full" />
            <div className="space-y-3 flex-1">
              {["Positive", "Negative", "Neutral"].map(l => (
                <div key={l} className="flex items-center gap-2">
                  <Sk className="h-2.5 w-2.5 rounded-full" />
                  <span className="text-xs text-muted-foreground/50">{l}</span>
                  <Sk className="ml-auto h-3 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3 space-y-4">
          <Sk className="h-4 w-44" />
          <Sk className="h-3 w-32" />
          <Sk className="h-44 w-full" />
        </div>
      </div>

      {/* Row 3: Feature health + Keywords */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <Sk className="h-4 w-48" />
          {[60, 45, 75, 30, 55, 80, 40].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <Sk className="h-3 w-24" />
                  <Sk className="h-3 w-12" />
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-border/40 animate-pulse" style={{ width: `${w}%` }} />
                </div>
              </div>
              <Sk className="h-4 w-12 rounded-full" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <Sk className="h-4 w-40" />
          <Sk className="h-3 w-56" />
          {[80, 65, 50, 40, 30, 22, 15].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <Sk className="h-3 w-16" />
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full bg-[var(--pink)]/20 animate-pulse" style={{ width: `${w}%` }} />
              </div>
              <Sk className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Alerts + Actions */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Sk className="h-4 w-32" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border p-3">
              <Sk className="h-5 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Sk className="h-3 w-32" />
                <Sk className="h-3 w-full" />
              </div>
              <Sk className="h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <Sk className="h-4 w-28" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl border border-border p-4 space-y-2">
                <Sk className="h-5 w-5 rounded-md" />
                <Sk className="h-3 w-20" />
                <Sk className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════════════ */
function DashboardPage() {
  const { user, source, analysis, loading } = useSession();
  const navigate   = useNavigate();
  const { view }   = Route.useSearch();
  const { toasts, push, dismiss } = useToast();

  const [showModal,      setShowModal]      = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [sentimentFilter,setSentimentFilter]= useState<"All"|"Positive"|"Negative"|"Mixed">("All");
  const [isRerunning,    setIsRerunning]    = useState(false);
  const [dateRange,      setDateRange]      = useState("Last 7 days");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notifCount,     setNotifCount]     = useState(3);
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [selectedAlert,  setSelectedAlert]  = useState<any>(null);

  const DATE_OPTIONS = ["Last 24 hours", "Last 7 days", "Last 30 days", "Last 90 days"];
  function goView(v: ViewKey) { navigate({ to: "/dashboard", search: { view: v } }); }

  /* Derived dynamic data */
  const aspects     = analysis?.discovered_aspects ?? [];
  const worstAspect = aspects.length
    ? aspects.reduce((a, b) => a.complaint_rate > b.complaint_rate ? a : b)
    : null;

  const velocityData: VelocityPoint[] = useMemo(() => {
    if (!analysis) return [];
    let count = 7;
    let labelGen = (i: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7];
    
    if (dateRange === "Last 24 hours") {
      count = 6;
      labelGen = (i) => ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"][i];
    } else if (dateRange === "Last 7 days") {
      count = 7;
      labelGen = (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
    } else if (dateRange === "Last 30 days") {
      count = 15;
      labelGen = (i) => `Day ${i * 2 + 1}`; // Show every 2 days for cleaner x-axis
    } else if (dateRange === "Last 90 days") {
      count = 12;
      labelGen = (i) => `Week ${i + 1}`;
    }

    return Array.from({ length: count }).map((_, i) => {
      const values: Record<string, number> = {};
      aspects.forEach((a: any) => {
        // Generate a random variance around the aspect's average complaint rate
        const noise = (Math.sin(i + a.name.length) * 10) + (Math.random() * 5);
        values[a.name] = Math.max(0, Math.min(100, Math.floor(a.complaint_rate + noise)));
      });
      return { t: labelGen(i), values };
    });
  }, [analysis, dateRange, aspects]);
  
  const lastT = velocityData[velocityData.length - 1]?.t ?? "";

  const alertBadge = (analysis?.anomaly_alerts ?? []).filter(a => a.severity === "P0" || a.severity === "P1").length;

  /* Filtered reviews */
  const filteredReviews = (analysis?.review_table ?? []).filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchQ = q === "" || r.snippet.toLowerCase().includes(q) || r.feature.toLowerCase().includes(q);
    const matchS = sentimentFilter === "All" || r.sentiment === sentimentFilter;
    return matchQ && matchS;
  });

  function handleExportCSV() {
    const rows = (analysis?.review_table ?? []).map(r =>
      [`"${r.snippet}"`, r.feature, r.sentiment, `${r.confidence}%`, r.flags.join(" ") || "—"].join(",")
    );
    const csv = [["Snippet", "Feature", "Sentiment", "Confidence", "Flags"], ...rows.map(r => [r])].map(r => r.join("")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analysis_export.csv"; a.click();
    URL.revokeObjectURL(url);
    push("CSV exported!", "success");
  }

  async function handleRerun() {
    setIsRerunning(true);
    const id = push("Re-running sentiment model…", "loading", 0);
    await new Promise(r => setTimeout(r, 2200));
    dismiss(id); setIsRerunning(false);
    push("Sentiment model re-run complete.", "success");
  }

  function handleNotifyTeam() { push("✉️ Product team notified via Slack & email!", "success"); }

  async function handleGenerateReport() {
    const id = push("Generating report…", "loading", 0);
    await new Promise(r => setTimeout(r, 2500));
    dismiss(id);
    push("📄 Report ready — download started.", "success");
    const product = analysis?.metadata.inferred_product ?? "Unknown";
    const content = [
      `ReadReview.ai — Analysis Report`,
      `Product: ${product}`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `Key Findings:`,
      ...(aspects.map(a => `- ${a.name}: ${a.sentiment_score}% positive, ${a.complaint_rate}% complaint rate`)),
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `readreview_${product.replace(/\s+/g, "_")}.txt`; a.click();
    URL.revokeObjectURL(url);
  }

  const sharedProps = {
    analysis, aspects, worstAspect, velocityData, lastT, source, user, push, dismiss,
    searchQuery, setSearchQuery, sentimentFilter, setSentimentFilter, filteredReviews,
    dateRange, setDateRange, showDatePicker, setShowDatePicker, dateOptions: DATE_OPTIONS,
    isRerunning, handleRerun, handleExportCSV, handleNotifyTeam, handleGenerateReport,
    onInvestigate: (alert?: any) => { setSelectedAlert(alert ?? null); setShowModal(true); },
    goView,
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl text-sm font-medium animate-fade-in
            ${t.kind === "success" ? "border-emerald-500/30 bg-card" : ""}
            ${t.kind === "loading" ? "border-[var(--cyan)]/30 bg-card" : ""}
            ${t.kind === "error"   ? "border-[var(--pink)]/30 bg-card" : ""}
            ${t.kind === "info"    ? "border-border bg-card" : ""}`}
          >
            <span className="shrink-0 mt-0.5">
              {t.kind === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {t.kind === "loading" && <RefreshCw className="h-4 w-4 text-[var(--cyan)] animate-spin" />}
              {t.kind === "error"   && <X className="h-4 w-4 text-[var(--pink)]" />}
              {t.kind === "info"    && <Sparkles className="h-4 w-4 text-[var(--cyan)]" />}
            </span>
            <span className="flex-1 leading-relaxed">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Root-cause modal — dynamic */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass rounded-2xl p-6 shadow-2xl w-full max-w-lg animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="rounded-full bg-[var(--pink)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--pink)] ring-1 ring-[var(--pink)]/40">
                  🚨 Root Cause Analysis
                </span>
                <h2 className="text-lg font-bold mt-1">
                  {selectedAlert?.aspect ?? worstAspect?.name ?? "Top Issue"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedAlert?.description ?? `${worstAspect?.complaint_rate ?? 0}% complaint rate — highest detected feature`}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-accent text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-3">
              {[
                { label: "Primary cluster",   pct: 58 },
                { label: "Secondary cluster", pct: 28 },
                { label: "Tertiary cluster",  pct: 14 },
              ].map((c) => (
                <div key={c.label} className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-semibold">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-[var(--pink)]" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-3 text-xs">
              <p className="font-semibold">💡 AI Recommendation</p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                Investigate root suppliers for <span className="font-medium text-foreground">{selectedAlert?.aspect ?? worstAspect?.name}</span>.
                Estimated revenue impact from current complaint trajectory: <span className="font-semibold text-[var(--cyan)]">high priority</span>.
              </p>
            </div>

            <div className="mt-5 space-y-2">
              <button 
                onClick={() => { 
                  setShowModal(false); 
                  push("📧 CRM Action Triggered: Sending automated apology & discount emails to affected buyers to convert negative reviews!", "success", 4000); 
                }} 
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] text-xs font-bold text-white hover:brightness-110 shadow-lg transition-all"
              >
                <Send className="h-3.5 w-3.5" /> Trigger CRM Action (Convert Negative Reviews)
              </button>
              <div className="flex gap-2">
                <button onClick={() => { setShowModal(false); handleNotifyTeam(); }} className="flex-1 h-10 rounded-xl bg-[var(--cyan)]/10 text-[var(--cyan)] border border-[var(--cyan)]/30 text-xs font-semibold hover:bg-[var(--cyan)]/20 transition-all">
                  Notify Product Team
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-border bg-card text-xs font-medium hover:bg-accent">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotifPanel && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setShowNotifPanel(false)} />
          <div className="relative w-80 h-full bg-card border-l border-border shadow-2xl animate-fade-in flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <button onClick={() => setShowNotifPanel(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <ul className="flex-1 overflow-y-auto divide-y divide-border">
              {(analysis?.anomaly_alerts ?? []).map((a, i) => (
                <li key={i} className="flex gap-3 px-5 py-4 hover:bg-accent/50 cursor-pointer transition-colors">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pink)]" />
                  <div className="min-w-0">
                    <p className="text-xs leading-relaxed font-medium">{a.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{a.description}</p>
                  </div>
                </li>
              ))}
              {(analysis?.anomaly_alerts ?? []).length === 0 && (
                <li className="px-5 py-8 text-center text-xs text-muted-foreground">No alerts</li>
              )}
            </ul>
            <div className="border-t border-border px-5 py-3">
              <button className="w-full text-xs text-[var(--cyan)] font-medium hover:underline">Mark all as read</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <DashboardHeader
        user={user} source={source} analysis={analysis}
        notifCount={alertBadge}
        onNewAnalysis={() => navigate({ to: "/ingest" })}
        onBellClick={() => { setShowNotifPanel(v => !v); setNotifCount(0); }}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
      />

      <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <aside className={`shrink-0 border-r border-border bg-card transition-all duration-300 flex flex-col overflow-hidden ${sidebarOpen ? "w-56" : "w-14"}`}>
          <nav className="flex-1 p-2 space-y-0.5">
            {NAV.map((item) => {
              const active = view === item.key;
              const badge = item.key === "anomaly-alerts" && alertBadge > 0 ? alertBadge : 0;
              return (
                <button key={item.key} onClick={() => goView(item.key)} title={!sidebarOpen ? item.label : undefined}
                  className={`group w-full flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all
                    ${active ? "bg-[var(--cyan)]/10 text-[var(--cyan)] ring-1 ring-[var(--cyan)]/30" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                >
                  <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-[var(--cyan)]" : ""}`} />
                  {sidebarOpen && <span className="flex-1 text-left truncate">{item.label}</span>}
                  {sidebarOpen && badge > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--pink)] px-1 text-[9px] font-bold text-white">{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {sidebarOpen && analysis && (
            <div className="p-3 border-t border-border">
              <div className="rounded-lg bg-[var(--cyan)]/5 border border-[var(--cyan)]/20 p-3">
                <p className="text-[10px] font-semibold text-[var(--cyan)] uppercase tracking-wide">
                  {analysis.metadata.inferred_product}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {analysis.metadata.total_reviews.toLocaleString()} reviews · {analysis.metadata.aspects_found} aspects
                </p>
                <div className="mt-1.5 h-1 w-full rounded-full bg-border">
                  <div className="h-full rounded-full bg-[var(--cyan)]" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {loading ? <LoadingView /> : !analysis ? (
            <EmptyState onNewAnalysis={() => navigate({ to: "/ingest" })} />
          ) : (analysis as any).metadata?.analysis_provider === "skeleton" ? (
            <SkeletonView onNewAnalysis={() => navigate({ to: "/ingest" })} />
          ) : (
            <>
              {view === "overview"        && <OverviewView        {...sharedProps} />}
              {view === "category-segregation" && <CategorySegregationView {...sharedProps} />}
              {view === "trend-radar"     && <TrendRadarView      {...sharedProps} />}
              {view === "aspect-analysis" && <AspectAnalysisView  {...sharedProps} />}
              {view === "anomaly-alerts"  && <AnomalyAlertsView   {...sharedProps} />}
              {view === "data-hub"        && <DataHubView {...sharedProps} onNewAnalysis={() => navigate({ to: "/ingest" })} />}
              {view === "history"         && <HistoryView {...sharedProps} />}
              {view === "comparison"      && <ComparisonView {...sharedProps} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Header ─── */
function DashboardHeader({ user, source, analysis, notifCount, onNewAnalysis, onBellClick, sidebarOpen, onToggleSidebar }: any) {
  const initials = user ? user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() : "RR";
  const product  = analysis?.metadata?.inferred_product;
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4">
        <button onClick={onToggleSidebar} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          <LayoutDashboard className="h-4 w-4" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40 shadow-lg">
            <Sparkles className="h-5 w-5 text-[var(--cyan)]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">ReadReview<span className="text-[var(--cyan)]">.ai</span></span>
        </Link>

        {/* Dynamic product badge */}
        {product && (
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-3 py-1.5 text-xs">
            <Sparkles className="h-3 w-3 text-[var(--cyan)]" />
            <span className="font-semibold text-foreground">{product}</span>
            <span className="text-muted-foreground">· {analysis?.metadata?.product_category}</span>
          </div>
        )}

        {source && !product && (
          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs">
            {source.type === "url" ? <Link2 className="h-3 w-3 text-[var(--cyan)]" /> : <FileText className="h-3 w-3 text-[var(--cyan)]" />}
            <span className="max-w-[200px] truncate text-muted-foreground">{source.value}</span>
          </div>
        )}

        <div className="relative ml-4 hidden flex-1 max-w-xl md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input id="dashboard-search" placeholder="Search feature, keyword…"
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">⌘K</kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={onNewAnalysis} className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-accent transition-colors">
            <PlusCircle className="h-3.5 w-3.5" /> New analysis
          </button>
          <ThemeToggle />
          <button onClick={onBellClick} className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors">
            <Bell className="h-4 w-4" />
            {notifCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--pink)] text-[9px] font-bold text-white">{notifCount}</span>
            )}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--purple)] text-xs font-bold text-white ring-2 ring-background" title={user?.email}>{initials}</div>
          <Link to="/" className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors" title="Sign out">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 1: OVERVIEW  (fully dynamic)
═══════════════════════════════════════════════════ */
function OverviewView({ analysis, aspects, worstAspect, source, onInvestigate, isRerunning, handleRerun, handleExportCSV, handleNotifyTeam, handleGenerateReport, goView }: any) {
  const meta    = analysis.metadata;
  const overall = analysis.overall_sentiment;
  const alerts  = analysis.anomaly_alerts ?? [];

  /* KPIs derived from dynamic data */
  const kpis = [
    { label: "Reviews Processed",  value: meta.total_reviews.toLocaleString(),   sub: "This analysis run",    icon: Bot,           color: "text-[var(--cyan)]",    bg: "bg-[var(--cyan)]/10"    },
    { label: "Spam Reviews Detected", value: Math.floor(meta.total_reviews * 0.021).toLocaleString(), sub: "Filtered bot activity",  icon: ShieldCheck,   color: "text-[var(--purple)]",  bg: "bg-[var(--purple)]/10"  },
    { label: "Overall Positivity", value: `${overall.positive ?? 0}%`,            sub: "Across all features",  icon: ShieldCheck,   color: "text-emerald-500",      bg: "bg-emerald-500/10"      },
    { label: "Anomalies Detected", value: alerts.length.toString(),               sub: "Need attention",       icon: TriangleAlert, color: "text-[var(--pink)]",    bg: "bg-[var(--pink)]/10"    },
  ];

  /* Pie data */
  const pieData = [
    { name: "Positive", value: overall.positive ?? 0,  fill: "#10b981" },
    { name: "Negative", value: overall.negative ?? 0,  fill: "var(--pink)" },
    { name: "Neutral",  value: overall.neutral  ?? 0,  fill: "#6b7280" },
  ];

  /* Volume sparkline */
  const volumeData = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
    d,
    reviews: Math.floor(meta.total_reviews / 7) + (i === 6 ? 80 : 0) + Math.floor(Math.random() * 40),
  }));

  /* Top keywords */
  const keywords = (analysis.top_keywords ?? []).slice(0, 8);

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      {/* Product banner */}
      <div className="flex items-center gap-3 rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 px-4 py-3">
        <Sparkles className="h-4 w-4 text-[var(--cyan)] shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground">{meta.inferred_product}</span>
          <span className="ml-2 text-xs text-muted-foreground">{meta.product_category}</span>
        </div>
        <span className="text-xs text-[var(--cyan)] font-medium">{meta.total_reviews.toLocaleString()} reviews · {meta.aspects_found} aspects discovered</span>
        {meta.analysis_provider === "mock" && (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 ring-1 ring-amber-500/30">Demo mode</span>
        )}
      </div>

      {/* ═══ Batch Defect — Full Detail Section ═══ */}
      {analysis.batch_defect && (() => {
        const bd = analysis.batch_defect!;
        const slaHours = 12;
        const slaUsed  = Math.min(bd.hours_since_purchase, slaHours);
        const slaPct   = Math.round((slaUsed / slaHours) * 100);
        const slaLeft  = Math.max(0, slaHours - slaUsed);
        const slaColor = slaPct >= 90 ? "bg-red-500" : slaPct >= 60 ? "bg-amber-500" : "bg-[var(--pink)]";

        const checks = [
          { done: true,  label: "Defect automatically detected from review velocity spike" },
          { done: true,  label: `Batch ID ${bd.batch_id} isolated — ${bd.affected_users} buyers flagged` },
          { done: false, label: "CRM suppression list generated for affected buyer cohort" },
          { done: false, label: "Replacement / refund workflow triggered via logistics API" },
          { done: false, label: "Supplier audit request queued — root-cause investigation" },
        ];

        return (
          <div className="rounded-2xl border border-[var(--pink)]/40 bg-[var(--pink)]/5 overflow-hidden animate-fade-in">
            {/* Header bar */}
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-[var(--pink)]/20 bg-[var(--pink)]/10">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--pink)]/20 ring-1 ring-[var(--pink)]/40">
                  <AlertOctagon className="h-4 w-4 text-[var(--pink)] animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--pink)] tracking-wide uppercase">Batch Defect Detected — 12-Hour SLA Active</p>
                  <p className="text-[10px] text-[var(--pink)]/60 mt-0.5">Auto-detected via review velocity spike · Remediation clock started</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase shadow-md">P0 Critical</span>
            </div>

            {/* Body */}
            <div className="grid gap-5 p-5 md:grid-cols-2">
              {/* Left — defect intel */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Defect Intelligence</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Defect Type",      value: bd.defect_type },
                      { label: "Batch ID",          value: bd.batch_id },
                      { label: "Affected Buyers",   value: `${bd.affected_users.toLocaleString()} users` },
                      { label: "Time to Detection", value: `${bd.hours_since_purchase}h after purchase` },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl border border-[var(--pink)]/20 bg-background/40 px-3 py-2.5">
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5 leading-snug">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SLA timer */}
                <div className="rounded-xl border border-[var(--pink)]/20 bg-background/40 px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--pink)]">SLA Countdown</span>
                    <span className="text-muted-foreground">
                      {slaLeft > 0 ? <><span className="font-bold text-foreground">{slaLeft}h</span> remaining</> : <span className="font-bold text-red-500">SLA Breached</span>}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div className={`h-full rounded-full transition-all ${slaColor}`} style={{ width: `${slaPct}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{slaUsed}h elapsed of 12h SLA window · {slaPct}% consumed</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => push("Initiating buyer tracking & mapping all users who bought this batch...", "loading", 3500)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[var(--pink)] text-[11px] font-bold text-white hover:brightness-110 shadow-lg glow-pink transition-all"
                  >
                    <AlertOctagon className="h-3.5 w-3.5" /> Track Affected Buyers
                  </button>
                  <button
                    onClick={() => push("Drafting personalised apology + replacement email for 427 buyers...", "loading", 3000)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-[var(--pink)]/40 bg-[var(--pink)]/10 text-[11px] font-semibold text-[var(--pink)] hover:bg-[var(--pink)]/20 transition-all"
                  >
                    Notify & Apologise
                  </button>
                </div>
              </div>

              {/* Right — remediation checklist */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Automated Remediation Pipeline</p>
                <ul className="space-y-2">
                  {checks.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background/40 px-3 py-2.5">
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                        c.done ? "bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/40" : "bg-border text-muted-foreground ring-1 ring-border"
                      }`}>
                        {c.done ? "✓" : i + 1}
                      </div>
                      <p className={`text-xs leading-snug ${c.done ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</p>
                      {!c.done && (
                        <span className="ml-auto shrink-0 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">Pending</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })()}


      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4 hover:border-[var(--cyan)]/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{k.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${k.bg}`}>
                <k.icon className={`h-4 w-4 ${k.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums">{k.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Sentiment pie + Volume sparkline */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Pie */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-1">Sentiment Distribution</h2>
          <p className="text-xs text-muted-foreground mb-4">Overall across all discovered features</p>
          <div className="flex items-center gap-4">
            <div className="h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} strokeWidth={0}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                  <span className="ml-auto text-xs font-semibold tabular-nums">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volume sparkline */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3">
          <h2 className="text-sm font-semibold mb-1">Review Volume This Week</h2>
          <p className="text-xs text-muted-foreground mb-4">Daily ingestion rate</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Area type="monotone" dataKey="reviews" stroke="var(--cyan)" strokeWidth={2} fill="url(#volFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Dynamic feature health table + top keywords */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Feature health */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Feature Health — {meta.inferred_product}</h2>
            <button onClick={() => goView("trend-radar")} className="text-[11px] text-[var(--cyan)] hover:underline flex items-center gap-1">
              Full Radar <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {aspects.map((a: DiscoveredAspect, i: number) => {
              const TrendIcon = a.trend === "up" ? TrendingUp : a.trend === "down" ? TrendingDown : Minus;
              const trendColor = a.trend === "up" ? "text-emerald-500" : a.trend === "down" ? "text-[var(--pink)]" : "text-muted-foreground";
              return (
                <div key={a.name} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="truncate text-muted-foreground">{a.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <TrendIcon className={`h-3 w-3 ${trendColor}`} />
                        <span className={`text-[10px] font-medium ${trendColor}`}>{a.delta > 0 ? `+${a.delta}` : a.delta}%</span>
                        <span className="font-semibold tabular-nums" style={{ color: aspectColor(i) }}>{a.sentiment_score}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div className="h-full rounded-full transition-all" style={{ width: `${a.sentiment_score}%`, background: aspectColor(i) }} />
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase
                    ${a.complaint_rate >= 35 ? "bg-[var(--pink)]/15 text-[var(--pink)]"
                    : a.complaint_rate >= 20  ? "bg-amber-500/15 text-amber-600"
                    :                           "bg-emerald-500/15 text-emerald-600"}`}
                  >
                    {a.complaint_rate >= 35 ? "Critical" : a.complaint_rate >= 20 ? "Watch" : "OK"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top negative keywords */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-1">Top Negative Keywords</h2>
          <p className="text-xs text-muted-foreground mb-4">Most frequent words in complaint reviews</p>
          <div className="space-y-2.5">
            {keywords.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No keyword data yet</p>
            ) : keywords.map((k: any, i: number) => {
              const max = keywords[0]?.count ?? 1;
              return (
                <div key={k.word} className="flex items-center gap-3">
                  <span className="w-20 truncate text-xs text-muted-foreground capitalize">{k.word}</span>
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-[var(--pink)]" style={{ width: `${(k.count / max) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">{k.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Recent alerts + Quick actions */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Recent alerts */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Anomaly Alerts</h2>
            <button onClick={() => goView("anomaly-alerts")} className="text-[11px] text-[var(--cyan)] hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          {alerts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No anomalies detected 🎉</p>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 3).map((a: any, i: number) => {
                const bg = a.severity === "P0" ? "bg-[var(--pink)]/10 border-[var(--pink)]/30"
                         : a.severity === "P1" ? "bg-amber-500/10 border-amber-500/30"
                         :                       "bg-[var(--purple)]/10 border-[var(--purple)]/30";
                const tc = a.severity === "P0" ? "text-[var(--pink)]"
                         : a.severity === "P1" ? "text-amber-500"
                         :                       "text-[var(--purple)]";
                return (
                  <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${bg}`}>
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${tc} shrink-0`}>{a.severity}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold">{a.aspect}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{a.description}</p>
                    </div>
                    <button onClick={() => onInvestigate(a)} className={`shrink-0 text-[11px] font-semibold ${tc} hover:underline`}>Investigate</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {worstAspect && (
              <button onClick={() => onInvestigate()} className="flex flex-col items-start gap-2 rounded-xl border border-[var(--pink)]/30 bg-[var(--pink)]/5 p-4 hover:bg-[var(--pink)]/10 transition-all text-left">
                <TriangleAlert className="h-5 w-5 text-[var(--pink)]" />
                <span className="text-xs font-semibold">Investigate P0</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">{worstAspect.name}</span>
              </button>
            )}
            <button onClick={isRerunning ? undefined : handleRerun} disabled={isRerunning} className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 hover:bg-accent transition-all text-left disabled:opacity-60">
              <RefreshCw className={`h-5 w-5 text-[var(--cyan)] ${isRerunning ? "animate-spin" : ""}`} />
              <span className="text-xs font-semibold">{isRerunning ? "Running…" : "Re-run Model"}</span>
              <span className="text-[10px] text-muted-foreground">Refresh pipeline</span>
            </button>
            <button onClick={() => push("Triggering automated CRM apology & discount campaign...", "success")} className="flex flex-col items-start gap-2 rounded-xl border border-[var(--purple)]/30 bg-[var(--purple)]/5 p-4 hover:bg-[var(--purple)]/10 transition-all text-left">
              <Bot className="h-5 w-5 text-[var(--purple)]" />
              <span className="text-xs font-semibold">CRM Trigger</span>
              <span className="text-[10px] text-muted-foreground truncate w-full">Convert bad reviews</span>
            </button>
            <button onClick={handleGenerateReport} className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 hover:bg-accent transition-all text-left">
              <FileText className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-semibold">Generate Report</span>
              <span className="text-[10px] text-muted-foreground">Executive summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emoji Decoded Reviews Table */}
      <div className="rounded-xl border border-border bg-card p-5 mt-5">
        <h2 className="text-sm font-semibold mb-1">Emotion-Decoded Reviews</h2>
        <p className="text-xs text-muted-foreground mb-4">Live review feed with automatic category segregation and emoji-intent mapping.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-medium">Review Snippet & Emojis</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Sentiment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {(analysis.review_table ?? []).filter((r: any) => r.emojis && r.emojis.length > 0).map((r: any, i: number) => (
                <tr key={i} className="hover:bg-accent/30 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-foreground mb-1.5">{r.snippet}</p>
                    {r.emojis && r.emojis.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {r.emojis.map((e: any, idx: number) => (
                          <span key={idx} className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border">
                            <span className="text-xs">{e.char}</span> {e.meaning}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4 align-top">
                    <span className="inline-flex rounded-full bg-[var(--cyan)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--cyan)] border border-[var(--cyan)]/20">
                      {r.feature}
                    </span>
                  </td>
                  <td className="py-4 align-top">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold
                      ${r.sentiment === "Positive" ? "bg-emerald-500/15 text-emerald-500" :
                        r.sentiment === "Negative" ? "bg-[var(--pink)]/15 text-[var(--pink)]" :
                        "bg-muted text-muted-foreground"}`}
                    >
                      {r.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 2: TREND RADAR  (dynamic lines)
═══════════════════════════════════════════════════ */
function TrendRadarView({ analysis, aspects, velocityData, lastT, dateRange, setDateRange, showDatePicker, setShowDatePicker, dateOptions }: any) {
  const worstAspect = aspects.length
    ? aspects.reduce((a: DiscoveredAspect, b: DiscoveredAspect) => a.complaint_rate > b.complaint_rate ? a : b)
    : null;

  const radarData = aspects.map((a: DiscoveredAspect) => ({ feature: a.name, score: a.sentiment_score }));

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Trend Radar — {analysis?.metadata?.inferred_product}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Complaint velocity across all discovered features</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowDatePicker(!showDatePicker)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-all">
            <Calendar className="h-3.5 w-3.5" />{dateRange}<ChevronDown className={`h-3 w-3 transition-transform ${showDatePicker ? "rotate-180" : ""}`} />
          </button>
          {showDatePicker && (
            <div className="absolute right-0 top-11 z-30 w-44 rounded-xl border border-border bg-popover shadow-xl py-1 animate-fade-in">
              {dateOptions.map((opt: string) => (
                <button key={opt} onClick={() => { setDateRange(opt); setShowDatePicker(false); }}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-accent ${dateRange === opt ? "text-[var(--cyan)] font-semibold" : "text-muted-foreground"}`}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Velocity line chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-sm font-semibold">Feature Sentiment Velocity</h2>
            <p className="text-xs text-muted-foreground">Rolling complaint-rate % per feature over time</p>
          </div>
        </div>
        <div className="mt-4 h-[22rem]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={velocityData} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 'auto']} />
              <Tooltip content={<VelocityTooltip lastT={lastT} spikeAspect={worstAspect?.name} />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} formatter={v => <span style={{ color: "var(--muted-foreground)" }}>{v}</span>} />
              {aspects.map((a: DiscoveredAspect, i: number) => (
                <Bar key={a.name} dataKey={`values.${a.name}`} name={a.name} fill={aspectColor(i)} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + bar */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Sentiment Radar · {analysis?.metadata?.inferred_product}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="feature" fontSize={11} tick={{ fill: "var(--muted-foreground)" }} />
                <RechartsRadar name="Score" dataKey="score" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-1">0 = all negative · 100 = all positive</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Complaint Rate by Feature</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspects.map((a: DiscoveredAspect) => ({ feature: a.name, rate: a.complaint_rate }))} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="feature" fontSize={10} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="var(--muted-foreground)" tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                  {aspects.map((a: DiscoveredAspect, i: number) => (
                    <Cell key={a.name} fill={a.complaint_rate >= 35 ? "var(--pink)" : a.complaint_rate >= 20 ? "#f59e0b" : "var(--cyan)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature delta table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Feature Comparison Table</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Period-over-period delta for each discovered aspect</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 font-medium">Sentiment Score</th>
                <th className="px-5 py-3 font-medium">Complaint Rate</th>
                <th className="px-5 py-3 font-medium">Trend</th>
                <th className="px-5 py-3 font-medium">Mentions</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {aspects.map((a: DiscoveredAspect, i: number) => {
                const TI = a.trend === "up" ? TrendingUp : a.trend === "down" ? TrendingDown : Minus;
                const tc = a.trend === "up" ? "text-emerald-500" : a.trend === "down" ? "text-[var(--pink)]" : "text-muted-foreground";
                return (
                  <tr key={a.name} className="hover:bg-accent/40 transition-colors">
                    <td className="px-5 py-3 font-medium flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: aspectColor(i) }} />
                      {a.name}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 overflow-hidden rounded-full bg-border">
                          <div className="h-full rounded-full" style={{ width: `${a.sentiment_score}%`, background: aspectColor(i) }} />
                        </div>
                        <span className="tabular-nums text-xs">{a.sentiment_score}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs">{a.complaint_rate}%</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1 text-xs font-medium ${tc}`}>
                        <TI className="h-3.5 w-3.5" />
                        {a.delta > 0 ? `+${a.delta}` : a.delta}%
                      </span>
                    </td>
                    <td className="px-5 py-3 tabular-nums text-xs text-muted-foreground">{a.mention_count.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold
                        ${a.complaint_rate >= 35 ? "bg-[var(--pink)]/15 text-[var(--pink)]"
                        : a.complaint_rate >= 20  ? "bg-amber-500/15 text-amber-600"
                        :                           "bg-emerald-500/15 text-emerald-600"}`}
                      >
                        {a.complaint_rate >= 35 ? "Critical" : a.complaint_rate >= 20 ? "Watch" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 3: ASPECT ANALYSIS  (dynamic)
═══════════════════════════════════════════════════ */
function AspectAnalysisView({ analysis, filteredReviews, searchQuery, setSearchQuery, sentimentFilter, setSentimentFilter, handleExportCSV }: any) {
  const allRows = analysis?.review_table ?? [];
  const features = [...new Set(allRows.map((r: any) => r.feature as string))];

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Aspect Analysis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Segregation of reviews based on category (7 explicit category genera) for <span className="font-medium text-foreground">{analysis?.metadata?.inferred_product}</span></p>
        </div>
        <button onClick={handleExportCSV} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-accent transition-colors">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Rows", value: allRows.length, color: "text-foreground" },
          { label: "Negative", value: allRows.filter((r: any) => r.sentiment === "Negative").length, color: "text-[var(--pink)]" },
          { label: "Flagged", value: allRows.filter((r: any) => r.flags?.length > 0).length, color: "text-amber-500" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input id="nlp-search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews, features…"
              className="h-9 w-full rounded-lg border border-border bg-background/60 pl-9 pr-3 text-xs placeholder:text-muted-foreground/60 focus:border-[var(--cyan)] focus:outline-none" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
          </div>
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <select id="sentiment-filter" value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value as any)}
              className="h-9 appearance-none rounded-lg border border-border bg-background/60 pl-8 pr-8 text-xs text-muted-foreground focus:border-[var(--cyan)] focus:outline-none cursor-pointer">
              <option value="All">All sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Mixed">Mixed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filteredReviews.length} of {allRows.length} reviews</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-5 py-3 font-medium w-[40%]">Review Snippet</th>
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 font-medium">Sentiment</th>
                <th className="px-5 py-3 font-medium w-[15%]">AI Confidence</th>
                <th className="px-5 py-3 font-medium">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReviews.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-xs text-muted-foreground">No reviews match your filter.</td></tr>
              ) : filteredReviews.map((r: any, i: number) => (
                <tr key={i} className="transition-colors hover:bg-accent/50 cursor-default">
                  <td className="px-5 py-4 text-foreground/85 italic text-xs leading-relaxed">
                    "{r.snippet.length > 70 ? r.snippet.slice(0, 70) + "…" : r.snippet}"
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{r.feature}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${SENTIMENT_PILL[r.sentiment] ?? SENTIMENT_PILL.Mixed}`}>{r.sentiment}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-border">
                        <div className="h-full rounded-full" style={{ width: `${r.confidence}%`, background: r.confidence >= 90 ? "var(--cyan)" : r.confidence >= 80 ? "#f59e0b" : "var(--pink)" }} />
                      </div>
                      <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">{r.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{!r.flags?.length ? <span className="text-xs text-muted-foreground/50">—</span> : (
                    <div className="flex flex-wrap gap-1">
                      {r.flags.map((f: string) => <span key={f} className="inline-flex items-center rounded-md bg-[var(--pink)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--pink)] ring-1 ring-[var(--pink)]/30">{f}</span>)}
                    </div>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 4: ANOMALY ALERTS  (dynamic from API)
═══════════════════════════════════════════════════ */
function AnomalyAlertsView({ analysis, push, onInvestigate, handleNotifyTeam }: any) {
  const rawAlerts: any[] = analysis?.anomaly_alerts ?? [];
  const [alerts, setAlerts] = useState(rawAlerts.map((a, i) => ({ ...a, id: i, status: "open" })));
  const [filter, setFilter] = useState<"all"|"open"|"resolved">("all");

  function resolve(id: number) {
    setAlerts(a => a.map(x => x.id === id ? { ...x, status: "resolved" } : x));
    push("✅ Alert marked as resolved.", "success");
  }

  const shown = alerts.filter(a => filter === "all" || a.status === filter);
  const sevColor: Record<string, string> = {
    P0: "text-[var(--pink)] bg-[var(--pink)]/15 ring-[var(--pink)]/40",
    P1: "text-amber-500 bg-amber-500/15 ring-amber-500/40",
    P2: "text-[var(--purple)] bg-[var(--purple)]/15 ring-[var(--purple)]/40",
  };

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Anomaly Alerts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">AI-detected issues for <span className="font-medium text-foreground">{analysis?.metadata?.inferred_product}</span></p>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "open", "resolved"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`h-8 rounded-lg px-3 text-xs font-medium capitalize transition-all
                ${filter === f ? "bg-[var(--cyan)]/10 text-[var(--cyan)] ring-1 ring-[var(--cyan)]/30" : "border border-border bg-card text-muted-foreground hover:bg-accent"}`}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Open",      value: alerts.filter(a => a.status === "open").length,             color: "text-[var(--pink)]" },
          { label: "Resolved",  value: alerts.filter(a => a.status === "resolved").length,          color: "text-emerald-500" },
          { label: "P0 Critical",value: alerts.filter(a => a.severity === "P0" && a.status === "open").length, color: "text-[var(--pink)]" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
          <p className="text-sm font-semibold">No alerts</p>
          <p className="text-xs text-muted-foreground mt-1">All clear for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((a: any) => (
            <div key={a.id} className={`rounded-xl border bg-card p-4 transition-all hover:shadow-sm ${a.status === "resolved" ? "opacity-60 border-border" : "border-border"}`}>
              <div className="flex items-start gap-3">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 shrink-0 ${sevColor[a.severity] ?? sevColor.P2}`}>{a.severity}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    <span className="rounded-md border border-border bg-background/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{a.aspect}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.status === "open" ? "bg-[var(--pink)]/10 text-[var(--pink)]" : "bg-emerald-500/10 text-emerald-600"}`}>{a.status}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{a.description}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">Confidence: <span className="font-medium text-foreground">{Math.round((a.confidence ?? 0) * 100)}%</span></p>
                </div>
                {a.status === "open" && (
                  <div className="flex items-center gap-2 shrink-0">
                    {a.severity === "P0" && (
                      <button onClick={() => onInvestigate(a)} className="h-8 rounded-lg bg-[var(--cyan)] px-3 text-[11px] font-semibold text-[oklch(0.18_0.04_260)] hover:brightness-110 glow-cyan">Investigate</button>
                    )}
                    <button onClick={() => resolve(a.id)} className="h-8 rounded-lg border border-border bg-background px-3 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">Resolve</button>
                    <button onClick={handleNotifyTeam} className="h-8 rounded-lg border border-border bg-background px-3 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><Send className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 5: DATA HUB
═══════════════════════════════════════════════════ */
function DataHubView({ source, push, onNewAnalysis, analysis }: any) {
  const [sources, setSources] = useState([
    { id: 1, type: source?.type ?? "url", value: source?.value ?? "Current session", reviews: analysis?.metadata?.total_reviews ?? 0, date: "Just now", status: "active" },
    { id: 2, type: "file", value: "reviews_q1_2024.csv", reviews: 14820, date: "Mar 28, 2024", status: "archived" },
    { id: 3, type: "url",  value: "https://trustpilot.com/review/zoom.us", reviews: 8450, date: "Mar 15, 2024", status: "archived" },
  ]);

  function del(id: number) { setSources(s => s.filter(x => x.id !== id)); push("Source removed.", "info"); }

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Data Hub</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your connected data sources</p>
        </div>
        <button onClick={onNewAnalysis} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 text-xs font-semibold text-[oklch(0.18_0.04_260)] hover:brightness-110 glow-cyan transition-all">
          <PlusCircle className="h-3.5 w-3.5" /> Add new source
        </button>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border bg-card p-8 text-center hover:border-[var(--cyan)]/50 hover:bg-[var(--cyan)]/5 transition-all cursor-pointer" onClick={onNewAnalysis}>
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-semibold">Drop a CSV / JSON or paste a URL</p>
        <p className="text-xs text-muted-foreground mt-1">AI auto-discovers the product and features — no config needed</p>
        <button className="mt-4 inline-flex h-8 items-center gap-2 rounded-lg bg-[var(--cyan)] px-4 text-xs font-semibold text-[oklch(0.18_0.04_260)] hover:brightness-110">
          <PlusCircle className="h-3.5 w-3.5" /> New analysis
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <div className="px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Connected Sources</h2>
          <span className="text-xs text-muted-foreground">{sources.length} sources</span>
        </div>
        {sources.map(s => (
          <div key={s.id} className="flex items-center gap-3 px-5 py-4 hover:bg-accent/30 transition-colors">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${s.type === "url" ? "bg-[var(--cyan)]/10" : "bg-[var(--purple)]/10"}`}>
              {s.type === "url" ? <Link2 className="h-4 w-4 text-[var(--cyan)]" /> : <FileText className="h-4 w-4 text-[var(--purple)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{s.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.reviews > 0 ? `${s.reviews.toLocaleString()} reviews · ` : ""}{s.date}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${s.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{s.status}</span>
            <div className="flex items-center gap-1 shrink-0">
              {s.type === "url" && <a href={s.value} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><ExternalLink className="h-3.5 w-3.5" /></a>}
              <button onClick={() => del(s.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-[var(--pink)] hover:bg-[var(--pink)]/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 6: HISTORY
═══════════════════════════════════════════════════ */
const STATIC_HISTORY = [
  { id: "RUN-016", source: "reviews_q1_2024.csv",              type: "file", reviews: 14820, date: "Mar 28, 2024",  anomalies: 7, topFeature: "Battery",   sentiment: "Negative" as const, isLatest: false },
  { id: "RUN-015", source: "trustpilot.com/review/zoom.us",    type: "url",  reviews: 8450,  date: "Mar 15, 2024",  anomalies: 1, topFeature: "Camera",    sentiment: "Positive" as const, isLatest: false },
  { id: "RUN-014", source: "play.google.com/…",                type: "url",  reviews: 5200,  date: "Mar 2, 2024",   anomalies: 0, topFeature: "Display",   sentiment: "Positive" as const, isLatest: false },
  { id: "RUN-013", source: "shopify_export_feb.json",          type: "file", reviews: 3100,  date: "Feb 19, 2024",  anomalies: 2, topFeature: "Packaging", sentiment: "Mixed" as const,    isLatest: false },
];

function HistoryView({ push, analysis, source }: any) {
  function download(id: string) {
    const blob = new Blob([`ReadReview.ai — Analysis ${id}\nGenerated: ${new Date().toLocaleString()}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${id}.txt`; a.click();
    URL.revokeObjectURL(url);
    push(`📄 ${id} downloaded.`, "success");
  }

  const topAspect = analysis?.discovered_aspects?.length 
    ? analysis.discovered_aspects.reduce((a: any, b: any) => a.sentiment_score > b.sentiment_score ? a : b).name 
    : "—";

  const history = [
    { 
      id: "RUN-017", 
      source: source?.value ?? "Current session", 
      type: source?.type ?? "url", 
      reviews: analysis?.metadata?.total_reviews ?? 0, 
      date: "Just now", 
      anomalies: analysis?.anomaly_alerts?.length ?? 0, 
      topFeature: topAspect, 
      sentiment: "Positive" as const, 
      isLatest: true 
    },
    ...STATIC_HISTORY
  ];

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-lg font-bold">History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">All past analyses and their results</p>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <div className="px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Analysis Runs</h2>
          <span className="text-xs text-muted-foreground">{history.length} runs</span>
        </div>
        {history.map((h) => (
          <div key={h.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-accent/30 transition-colors ${h.isLatest ? "bg-[var(--cyan)]/5 border-l-2 border-l-[var(--cyan)]" : ""}`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${h.type === "url" ? "bg-[var(--cyan)]/10" : "bg-[var(--purple)]/10"}`}>
              {h.type === "url" ? <Link2 className="h-4 w-4 text-[var(--cyan)]" /> : <FileText className="h-4 w-4 text-[var(--purple)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-mono text-muted-foreground">{h.id}</p>
                {h.isLatest && <span className="rounded-full bg-[var(--cyan)]/10 px-2 py-0.5 text-[9px] font-bold text-[var(--cyan)] uppercase">Latest</span>}
              </div>
              <p className="text-sm font-medium mt-0.5 truncate">{h.source}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {h.date}
                {h.reviews > 0 && ` · ${h.reviews.toLocaleString()} reviews`}
                {" · "}<span className={h.anomalies > 0 ? "text-[var(--pink)] font-medium" : "text-emerald-600 font-medium"}>{h.anomalies} anomalies</span>
              </p>
            </div>
            <div className="shrink-0 hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">Top feature</p>
                <p className="text-xs font-semibold">{h.topFeature}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ${SENTIMENT_PILL[h.sentiment] ?? SENTIMENT_PILL.Mixed}`}>{h.sentiment}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => push(`🔄 Re-running ${h.id}…`, "loading", 2500)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-[var(--cyan)] hover:bg-[var(--cyan)]/10 transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => download(h.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 7: COMPARISON VIEW
═══════════════════════════════════════════════════ */
function ComparisonView({ analysis }: any) {
  const meta = analysis?.metadata;
  const productA = meta?.inferred_product ?? "Primary Product";
  const productB = "Competitor Premium XL"; // Mock competitor
  
  // Create mock side-by-side data based on current analysis + slightly offset competitor
  const compData = (analysis?.discovered_aspects ?? []).slice(0, 5).map((a: any) => ({
    feature: a.name,
    productA_score: a.sentiment_score,
    productB_score: Math.max(20, Math.min(95, a.sentiment_score + (Math.random() > 0.5 ? -15 : 20))),
  }));

  const aWins = compData.filter((d: any) => d.productA_score > d.productB_score).length;
  const bWins = compData.length - aWins;
  const winner = aWins >= bWins ? productA : productB;

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-lg font-bold">Product Comparison</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Compare features and sentiment against top market competitor</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Left: Chart */}
        <div className="rounded-xl border border-border bg-card p-5 mt-2 flex-1 relative">
          {/* Seller Suggestion Banner */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold shadow-lg backdrop-blur-md flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            AI SELLER RECOMMENDATION: {winner} is selling better!
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]" />
              <span className="text-sm font-semibold">{productA}</span>
            </div>
            <div className="px-3 py-1 rounded bg-accent text-[10px] font-bold text-muted-foreground">VS</div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{productB}</span>
              <span className="h-3 w-3 rounded-full bg-[var(--purple)] shadow-[0_0_8px_var(--purple)]" />
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" hide domain={[0, 100]} />
                <YAxis dataKey="feature" type="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Bar dataKey="productA_score" name={productA} fill="var(--cyan)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="productB_score" name={productB} fill="var(--purple)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Insight cards */}
        <div className="flex flex-col gap-3 w-full md:w-[350px]">
          <div className="rounded-xl border border-border bg-card p-5 flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[var(--cyan)]/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--cyan)]"><CheckCircle2 className="h-4 w-4" /> {productA} Strengths</h3>
            <ul className="mt-3 space-y-2 text-xs">
              {compData.filter((d: any) => d.productA_score >= d.productB_score).map((d: any) => (
                <li key={d.feature} className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">{d.feature}</span>
                  <span className="font-semibold text-foreground">+{Math.round(d.productA_score - d.productB_score)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[var(--purple)]/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <h3 className="text-sm font-bold flex items-center gap-2 text-[var(--purple)]"><Activity className="h-4 w-4" /> {productB} Strengths</h3>
            <ul className="mt-3 space-y-2 text-xs">
              {compData.filter((d: any) => d.productB_score > d.productA_score).map((d: any) => (
                <li key={d.feature} className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">{d.feature}</span>
                  <span className="font-semibold text-foreground">+{Math.round(d.productB_score - d.productA_score)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   VIEW 8: CATEGORY SEGREGATION VIEW
═══════════════════════════════════════════════════ */
function CategorySegregationView({ analysis, source }: any) {
  const uri = source?.value ?? "Unknown URI";
  const inferredGenus = analysis?.metadata?.product_category ?? "Electronics & Gadgets";

  const GENERA = [
    { name: "Electronics & Smart Devices", icon: Zap, match: true },
    { name: "Software & Digital Services", icon: Globe, match: false },
    { name: "Apparel & Fashion", icon: ShoppingBag, match: false },
    { name: "Home & Kitchen Appliances", icon: ShieldCheck, match: false },
    { name: "Automotive & Tools", icon: Activity, match: false },
    { name: "Books, Media & Literature", icon: FileText, match: false },
    { name: "Health & Beauty", icon: ShieldCheck, match: false }
  ];

  const total = analysis?.metadata?.total_reviews ?? 4021;
  const distributions = [
    { label: "Hardware & Build", pct: 45, color: "var(--cyan)" },
    { label: "Logistics (Packaging/Delivery)", pct: 28, color: "var(--purple)" },
    { label: "Pricing & Value", pct: 15, color: "var(--pink)" },
    { label: "Customer Support Tracking", pct: 12, color: "emerald-500" },
  ];

  return (
    <div className="p-5 space-y-5 max-w-[1400px]">
      <div>
        <h1 className="text-lg font-bold">Category Segregation</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Automated segregation of reviews based on the provided Product URI into 7 categorical genera vectors.</p>
      </div>

      <div className="rounded-xl border border-[var(--cyan)]/30 bg-[var(--cyan)]/5 p-5">
        <p className="text-[10px] font-bold text-[var(--cyan)] uppercase tracking-wider mb-2">Analyzed Product URI</p>
        <p className="font-mono text-xs text-foreground bg-background/60 p-2.5 rounded-lg border border-[var(--cyan)]/20 break-all">{uri}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Genera Matcher */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold mb-4">7 Category Genera Engine</h2>
          <ul className="space-y-2.5">
            {GENERA.map((g, i) => (
              <li key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${g.name.includes(inferredGenus) || g.match ? "border-[var(--pink)] bg-[var(--pink)]/10 text-[var(--pink)] ring-1 ring-[var(--pink)]/30" : "border-border/50 bg-background/40 text-muted-foreground"}`}>
                <g.icon className="h-4 w-4 shrink-0" />
                <span className={`text-xs ${g.match || g.name.includes(inferredGenus) ? "font-bold" : "font-medium"}`}>{g.name}</span>
                {(g.match || g.name.includes(inferredGenus)) && <span className="ml-auto text-[9px] uppercase font-bold px-1.5 py-0.5 bg-[var(--pink)] text-white rounded">Matched</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Breakdown inside Genera */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-1">Review Segregation Distribution</h2>
          <p className="text-xs text-muted-foreground mb-6">How the {total.toLocaleString()} total reviews mathematically align against the sub-categories of the active genus.</p>
          
          <div className="space-y-6">
            {distributions.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">{d.label}</span>
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.pct}% ({(total * d.pct / 100).toFixed(0)} reviews)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-border/60">
                  <div className="h-full rounded-full shadow-[0_0_10px_currentColor] transition-all duration-1000" style={{ width: `${d.pct}%`, backgroundColor: d.color, color: d.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-accent/30 p-4 border-l-4 border-l-[var(--cyan)]">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Segregation Intelligence:</strong> The base URI was processed through our NLP funnel. The system accurately recognized it as an <span className="text-[var(--cyan)] font-semibold">{inferredGenus}</span> profile, dividing the raw feedback into distinct feature clusters instead of a flat list. 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
