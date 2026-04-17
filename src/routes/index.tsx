import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight, UploadCloud, Zap, Shield, Activity } from "lucide-react";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "ReadReview.ai · Decode the Voice of Your Customer" },
      { name: "description", content: "AI-powered customer review intelligence — extract feature-level sentiment, detect anomalies, and flag sarcasm in real-time." },
      { property: "og:title", content: "ReadReview.ai · Decode the Voice of Your Customer" },
      { property: "og:description", content: "Real-time review intelligence with sentiment, anomaly detection, and sarcasm flagging." },
    ],
  }),
});

function LandingPage() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="relative min-h-screen w-full">
      <AnimatedBackdrop />

      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40">
            <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
          </div>
          <span className="text-sm font-semibold tracking-tight">ReadReview<span className="text-[var(--cyan)]">.ai</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/auth"
            className="hidden sm:inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--cyan)] px-3 text-sm font-semibold text-[oklch(0.18_0.04_260)] hover:brightness-110 glow-cyan"
          >
            Open Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-12 sm:pt-20">
        <div className="text-center animate-fade-in">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
            Live · Processing 2.4k reviews/min
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-gradient-cyan-purple">Decode the Voice</span>
            <br />
            <span className="text-foreground">of Your Customer.</span>
            <br />
            <span className="text-gradient-cyan-purple">In Real-Time.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Instantly extract feature-level sentiment, detect anomalies, and flag sarcasm with{" "}
            <span className="font-semibold text-foreground">ReadReview.ai</span>.
          </p>
        </div>

        {/* Ingestion box */}
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="glass relative rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-60"
              style={{
                background: "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 40%, transparent), transparent 40%, color-mix(in oklab, var(--purple) 40%, transparent))",
                filter: "blur(20px)",
                zIndex: -1,
              }}
            />

            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Option A · Paste a product URL
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                placeholder="Paste Product URL (Amazon, Shopify, App Store)…"
                className="h-12 flex-1 rounded-xl border border-border bg-background/60 px-4 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
              />
              <Link
                to="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] px-5 text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan"
              >
                Analyze <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              OR
              <span className="h-px flex-1 bg-border" />
            </div>

            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${dragOver ? "border-[var(--cyan)] bg-[var(--cyan)]/5" : "border-border bg-background/30 hover:border-[var(--cyan)]/60 hover:bg-[var(--cyan)]/5"}`}
            >
              <UploadCloud className={`h-7 w-7 ${dragOver ? "text-[var(--cyan)]" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium">Drop CSV / JSON Export Here</p>
              <p className="text-xs text-muted-foreground">Up to 100MB · We auto-detect schema</p>
              <input type="file" className="hidden" />
            </label>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Zap, label: "Sub-2s analysis", sub: "Per batch of 50 reviews" },
              { icon: Shield, label: "94.3% bot filter", sub: "Validated accuracy" },
              { icon: Activity, label: "Sarcasm-aware", sub: "Multi-lingual NLP" },
            ].map((f) => (
              <div key={f.label} className="glass flex items-center gap-3 rounded-xl p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--cyan)]/15 text-[var(--cyan)] ring-1 ring-[var(--cyan)]/30">
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="text-[11px] text-muted-foreground">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
