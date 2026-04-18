import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Link2, UploadCloud, ArrowRight, CheckCircle2,
  Loader2, FileText, X, Globe, ShoppingBag, Star,
  AlertTriangle, Wifi, WifiOff, Download,
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { Link } from "@tanstack/react-router";
import { runAnalysis, checkApiHealth, type AnalysisResult } from "@/lib/api";

export const Route = createFileRoute("/ingest")({
  component: IngestPage,
  head: () => ({
    meta: [
      { title: "Analyse Your Data · ReadReview.ai" },
      {
        name: "description",
        content: "Paste a product URL or upload a CSV / JSON file to start your review analysis.",
      },
    ],
  }),
});

type Step = "idle" | "analysing" | "done" | "error";

const STEPS = [
  "Connecting to pipeline…",
  "Parsing review corpus…",
  "Discovering product context…",
  "Running NLP extraction…",
  "Detecting sarcasm & bots…",
  "Building sentiment models…",
  "Generating insights…",
];



function IngestPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [url, setUrl]         = useState("");
  const [files, setFiles]     = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep]       = useState<Step>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError]     = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  const canAnalyse = url.trim().length > 0 || files.length > 0;

  /* Check backend health on mount */
  useEffect(() => {
    checkApiHealth().then(setApiOnline);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.name.endsWith(".csv") || f.name.endsWith(".json")
    );
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  }

  function removeFile(name: string) {
    setFiles((f) => f.filter((x) => x.name !== name));
  }

  async function startAnalysis() {
    if (!canAnalyse) return;
    setStep("analysing");
    setStepIdx(0);
    setError(null);

    const STEP_MS = 700; // ms per step — 7 steps × 700ms = 4.9s minimum

    // ── Run API call + step animation in parallel ──
    // We kick off the fetch immediately but drive the visual steps independently.
    const apiPromise: Promise<AnalysisResult> = (
      files.length > 0
        ? runAnalysis({ type: "file", file: files[0] })
        : runAnalysis({ type: "url", value: url.trim() })
    );

    // Walk through each step with a fixed delay so the user sees every stage.
    // We stop one short of the last step — that gets lit when we're truly done.
    try {
      for (let i = 1; i < STEPS.length - 1; i++) {
        await new Promise(r => setTimeout(r, STEP_MS));
        setStepIdx(i);
      }

      // By now at least (STEPS.length-2)*STEP_MS ms have elapsed.
      // Await the API — if it finished early we get the result instantly;
      // if it's still running we wait for it now.
      const result = await apiPromise;

      // Light up the final step and briefly hold so the user sees it complete.
      setStepIdx(STEPS.length - 1);
      await new Promise(r => setTimeout(r, 800));

      // Persist to sessionStorage
      const sourceInfo =
        files.length > 0
          ? { type: "file" as const, value: files.map(f => f.name).join(", ") }
          : { type: "url" as const, value: url.trim() };

      sessionStorage.setItem("rr_source",   JSON.stringify(sourceInfo));
      sessionStorage.setItem("rr_analysis", JSON.stringify(result));

      setStep("done");
      setTimeout(() => navigate({ to: "/dashboard" }), 1800);

    } catch (err: any) {
      setError((err as Error).message ?? "Analysis failed. Please try again.");
      setStep("error");
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      <AnimatedBackdrop />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40 shadow-lg">
            <Sparkles className="h-5 w-5 text-[var(--cyan)]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            ReadReview<span className="text-[var(--cyan)]">.ai</span>
          </span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cyan)] text-[oklch(0.18_0.04_260)] font-bold text-[10px]">✓</span>
          <span className="text-foreground font-medium">Account</span>
          <span className="h-px w-6 bg-border" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cyan)] text-[oklch(0.18_0.04_260)] font-bold text-[10px]">2</span>
          <span className="text-foreground font-medium">Data source</span>
          <span className="h-px w-6 bg-border" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground font-bold">3</span>
          <span>Dashboard</span>
        </div>

        {/* API status badge */}
        {apiOnline !== null && (
          <div className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${
            apiOnline
              ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30"
              : "bg-amber-500/10 text-amber-600 ring-amber-500/30"
          }`}>
            {apiOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {apiOnline ? "AI Backend online" : "Backend offline — using demo mode"}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-10 animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Connect your{" "}
            <span className="text-gradient-cyan-purple">data source</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Paste a product URL or upload a review export — the AI discovers the product and features automatically.
          </p>
        </div>

        {/* ─── Idle: input form ─── */}
        {step === "idle" && (
          <div className="glass rounded-2xl p-6 shadow-2xl space-y-6">
            {/* URL input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Option A · Paste a product URL
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="product-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://amazon.com/dp/… or App Store / Trustpilot URL"
                    className="h-12 w-full rounded-xl border border-border bg-background/60 pl-10 pr-3 text-sm placeholder:text-muted-foreground/60 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
                  />
                </div>
              </div>

            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              OR
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* File upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Option B · Upload CSV / JSON export
              </label>
              <label
                htmlFor="file-upload"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                  dragOver
                    ? "border-[var(--cyan)] bg-[var(--cyan)]/5"
                    : "border-border bg-background/30 hover:border-[var(--cyan)]/60 hover:bg-[var(--cyan)]/5"
                }`}
              >
                <UploadCloud className={`h-8 w-8 ${dragOver ? "text-[var(--cyan)]" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm font-semibold">
                    Drop files here or <span className="text-[var(--cyan)]">browse</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    CSV or JSON · Up to 100 MB · AI auto-detects product & features
                  </p>
                </div>
                <input
                  id="file-upload"
                  ref={fileRef}
                  type="file"
                  accept=".csv,.json"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files ?? []);
                    if (picked.length) setFiles((p) => [...p, ...picked]);
                  }}
                />
              </label>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((f) => (
                    <li key={f.name} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-3.5 w-3.5 text-[var(--cyan)] shrink-0" />
                        <span className="truncate font-medium">{f.name}</span>
                        <span className="shrink-0 text-muted-foreground">({(f.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => removeFile(f.name)} className="ml-2 shrink-0 text-muted-foreground hover:text-foreground">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            {/* AI discovery hint */}
            <div className="flex items-start gap-2.5 rounded-xl border border-[var(--cyan)]/20 bg-[var(--cyan)]/5 px-4 py-3 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--cyan)] shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Product-agnostic AI.</span>{" "}
                Upload blender reviews and it discovers "Motor Power" and "Blade Sharpness".
                Upload shoe reviews and it finds "Cushioning" and "Breathability" — automatically.
              </p>
            </div>

            {/* CTA */}
            <button
              id="analyse-btn"
              onClick={startAnalysis}
              disabled={!canAnalyse}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Run AI Analysis <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ─── Analysing ─── */}
        {step === "analysing" && (
          <div className="glass rounded-2xl p-10 shadow-2xl text-center animate-fade-in space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cyan)]/15 ring-2 ring-[var(--cyan)]/40">
              <Loader2 className="h-7 w-7 text-[var(--cyan)] animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Discovering product context…
              </h2>
              <p className="mt-2 text-sm text-[var(--cyan)] font-medium animate-pulse">
                {STEPS[stepIdx]}
              </p>
            </div>
            {/* Progress bar */}
            <div className="mx-auto max-w-xs">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-[var(--cyan)] transition-all duration-700"
                  style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Step {stepIdx + 1} of {STEPS.length}</p>
            </div>
            {/* Checklist */}
            <ul className="mx-auto max-w-xs space-y-2 text-left">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 text-xs transition-all ${
                  i < stepIdx ? "text-foreground" : i === stepIdx ? "text-[var(--cyan)] font-semibold" : "text-muted-foreground/50"
                }`}>
                  {i < stepIdx ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--cyan)]" />
                  ) : i === stepIdx ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="h-3.5 w-3.5 rounded-full border border-current inline-block" />
                  )}
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ─── Done ─── */}
        {step === "done" && (
          <div className="glass rounded-2xl p-10 shadow-2xl text-center animate-fade-in space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cyan)]/15 ring-2 ring-[var(--cyan)]/40">
              <CheckCircle2 className="h-8 w-8 text-[var(--cyan)]" />
            </div>
            <h2 className="text-xl font-bold">Analysis complete!</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting you to your intelligence dashboard…
            </p>
          </div>
        )}

        {/* ─── Error ─── */}
        {step === "error" && (
          <div className="glass rounded-2xl p-10 shadow-2xl text-center animate-fade-in space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pink)]/15 ring-2 ring-[var(--pink)]/40">
              <AlertTriangle className="h-8 w-8 text-[var(--pink)]" />
            </div>
            <h2 className="text-xl font-bold">Analysis failed</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => { setStep("idle"); setError(null); }}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium hover:bg-accent transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
