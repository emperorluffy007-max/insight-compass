import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · ReadReview.ai" },
      { name: "description", content: "Sign in or create your ReadReview.ai account to decode the voice of your customer." },
    ],
  }),
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

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
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to your intelligence workspace." : "Start decoding customer reviews in minutes."}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-background/40 p-1">
            <button
              onClick={() => setMode("signin")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${mode === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${mode === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign up
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative mt-2 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[var(--cyan)] text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan"
            >
              Continue to ReadReview.ai
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="text-center text-[11px] text-muted-foreground">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
