export function AnimatedBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-[var(--cyan)] opacity-20 blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-[var(--purple)] opacity-20 blur-3xl animate-float-slower" />
      <div className="absolute -bottom-40 left-1/4 h-[420px] w-[420px] rounded-full bg-[var(--pink)] opacity-15 blur-3xl animate-float-slow" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
    </div>
  );
}
