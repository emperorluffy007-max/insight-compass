import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, User } from "lucide-react";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { ThemeToggle } from "@/components/ThemeToggle";
import { z } from "zod";

const authSearchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional().default("signin"),
});

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: "Sign in · ReadReview.ai" },
      {
        name: "description",
        content: "Sign in or create your ReadReview.ai account to decode the voice of your customer.",
      },
    ],
  }),
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode ?? "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Store basic user info so dashboard can personalise
    sessionStorage.setItem(
      "rr_user",
      JSON.stringify({ name: name || email.split("@")[0], email })
    );
    navigate({ to: "/ingest" });
  }

  return (
    <div className="relative min-h-screen w-full">
      <AnimatedBackdrop />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40 shadow-lg">
            <Sparkles className="h-6 w-6 text-[var(--cyan)]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            ReadReview<span className="text-[var(--cyan)]">.ai</span>
          </span>
        </Link>
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cyan)] text-[oklch(0.18_0.04_260)] font-bold text-[10px]">1</span>
          <span className="text-foreground font-medium">Account</span>
          <span className="h-px w-6 bg-border" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground font-bold">2</span>
          <span>Data source</span>
          <span className="h-px w-6 bg-border" />
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[10px] text-muted-foreground font-bold">3</span>
          <span>Dashboard</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <div className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to continue to your intelligence workspace."
                : "Start decoding customer reviews in minutes."}
            </p>
          </div>

          {/* Tab switcher */}
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (signup only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="full-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-[11px] text-[var(--cyan)] hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-border bg-background/60 pl-10 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30"
                />
              </div>
            </div>

            <button
              id="auth-submit"
              type="submit"
              className="group relative mt-2 inline-flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[var(--cyan)] text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 glow-cyan"
            >
              {mode === "signin" ? "Sign in" : "Create account"}{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <p className="text-center text-[11px] text-muted-foreground">
              By continuing you agree to our{" "}
              <span className="underline cursor-pointer">Terms</span> &{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
