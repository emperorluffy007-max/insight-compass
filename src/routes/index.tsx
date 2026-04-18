import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight, UploadCloud, Zap, Shield, Activity, Star, TrendingUp, Users } from "lucide-react";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "ReadReview.ai · Decode the Voice of Your Customer" },
      {
        name: "description",
        content:
          "AI-powered customer review intelligence — extract feature-level sentiment, detect anomalies, and flag sarcasm in real-time.",
      },
      { property: "og:title", content: "ReadReview.ai · Decode the Voice of Your Customer" },
      {
        property: "og:description",
        content: "Real-time review intelligence with sentiment, anomaly detection, and sarcasm flagging.",
      },
    ],
  }),
});

const features = [
  { icon: Zap, label: "Sub-2s analysis", sub: "Per batch of 50 reviews" },
  { icon: Shield, label: "94.3% bot filter", sub: "Validated accuracy" },
  { icon: Activity, label: "Sarcasm-aware", sub: "Multi-lingual NLP" },
];

const stats = [
  { icon: Star, value: "2.4k+", label: "Reviews/min" },
  { icon: TrendingUp, value: "94.3%", label: "Bot accuracy" },
  { icon: Users, value: "8,200+", label: "Products analysed" },
];

function LandingPage() {
  const navigate = useNavigate();
  const goSignup = () => navigate({ to: "/auth" });

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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/auth"
            className="hidden sm:inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent"
          >
            Sign in
          </Link>
          <button
            onClick={goSignup}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--cyan)] px-3 text-sm font-semibold text-[oklch(0.18_0.04_260)] hover:brightness-110 glow-cyan"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-12 sm:pt-20">
        {/* Hero */}
        <div className="text-center animate-fade-in">

          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
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

          {/* CTA buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
            onClick={goSignup}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-[var(--cyan)] px-6 text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </button>
            <Link
              to="/auth"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-medium hover:bg-accent"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass flex flex-col items-center gap-1 rounded-xl p-4 text-center">
              <s.icon className="h-4 w-4 text-[var(--cyan)]" />
              <p className="text-xl font-extrabold tabular-nums text-gradient-cyan-purple">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature highlight teaser */}
        <div className="mx-auto mt-14 max-w-3xl">
          <div className="glass relative rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div
              className="pointer-events-none absolute -inset-px rounded-2xl opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--cyan) 40%, transparent), transparent 40%, color-mix(in oklab, var(--purple) 40%, transparent))",
                filter: "blur(20px)",
                zIndex: -1,
              }}
            />

            <div className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40">
                <UploadCloud className="h-6 w-6 text-[var(--cyan)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold">Drop a URL or CSV — get intelligence in seconds</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Supports Amazon, App Store, Trustpilot, Shopify and custom CSV/JSON exports.
                </p>
              </div>
              <button
                onClick={goSignup}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-[var(--cyan)] px-4 text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan"
              >
                Try it free <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Feature pills */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {features.map((f) => (
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
