import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Zap, 
  Shield, 
  Activity, 
  AlertTriangle, 
  MessageSquareWarning, 
  RefreshCw, 
  TrendingDown 
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/")({
  component: ReadReviewApp,
});

function ReadReviewApp() {
  const [authState, setAuthState] = useState<'loggedOut' | 'loggedIn'>('loggedOut');
  const [dataState, setDataState] = useState<'empty' | 'analyzing' | 'complete'>('empty');

  const startAnalysis = () => {
    setDataState('analyzing');
    setTimeout(() => {
      setDataState('complete');
    }, 3500);
  };

  return (
    <div className="relative w-full min-h-screen font-sans text-foreground overflow-hidden">
      <AnimatedBackdrop />
      <Header 
        authState={authState} 
        setAuthState={setAuthState} 
        dataState={dataState} 
        setDataState={setDataState} 
      />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-20">
        <AnimatePresence mode="wait">
          {authState === 'loggedOut' && (
            <AuthView key="auth" onLogin={() => setAuthState('loggedIn')} />
          )}

          {authState === 'loggedIn' && dataState === 'empty' && (
            <IngestionView key="ingestion" onAnalyze={startAnalysis} />
          )}

          {authState === 'loggedIn' && dataState === 'analyzing' && (
            <LoadingView key="loading" />
          )}

          {authState === 'loggedIn' && dataState === 'complete' && (
            <DashboardView key="dashboard" />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Header({ authState, setAuthState, dataState, setDataState }: any) {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between px-6 py-5">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => { setAuthState('loggedOut'); setDataState('empty'); }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cyan)]/15 ring-1 ring-[var(--cyan)]/40 hover:bg-[var(--cyan)]/20 transition-colors">
          <Sparkles className="h-4 w-4 text-[var(--cyan)]" />
        </div>
        <span className="text-sm font-semibold tracking-tight">ReadReview<span className="text-[var(--cyan)]">.ai</span></span>
      </div>
      <div className="flex items-center gap-4">
        {authState === 'loggedIn' && dataState === 'complete' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setDataState('empty')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New Analysis
          </motion.button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

function AuthView({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-md pt-10"
    >
      <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-48 w-48 rounded-full bg-[var(--cyan)]/20 blur-[50px] transition-opacity group-hover:opacity-100 opacity-60" />
        <div className="relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--cyan)]/20 to-[var(--purple)]/20 border border-[var(--cyan)]/30 mb-8 shadow-inner">
            <Sparkles className="h-8 w-8 text-[var(--cyan)] animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Welcome to the Future</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">Sign in to decode the voice of your customer.</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email</label>
              <input type="email" placeholder="you@company.com" className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background/50 px-4 text-sm focus:ring-2 focus:ring-[var(--cyan)]/40 focus:outline-none focus:border-[var(--cyan)] transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workspace Name</label>
              <input type="text" placeholder="Acme Corp" className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background/50 px-4 text-sm focus:ring-2 focus:ring-[var(--cyan)]/40 focus:outline-none focus:border-[var(--cyan)] transition-all" />
            </div>
            
            <button 
              onClick={onLogin}
              className="w-full mt-6 h-12 rounded-xl bg-[var(--cyan)] flex items-center justify-center text-[oklch(0.18_0.04_260)] font-semibold gap-2 hover:brightness-110 active:scale-[0.98] transition-all glow-cyan"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IngestionView({ onAnalyze }: { onAnalyze: () => void }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
          Live · Processing 2.4k reviews/min
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl drop-shadow-sm">
          <span className="text-gradient-cyan-purple">Decode the Voice</span>
          <br />
          <span className="text-foreground">of Your Customer.</span>
          <br />
          <span className="text-gradient-cyan-purple">In Real-Time.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
          Instantly extract feature-level sentiment, detect anomalies, and flag sarcasm with {" "}
          <span className="font-semibold text-foreground">ReadReview.ai</span>.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="glass relative rounded-2xl p-6 shadow-2xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Option A · Paste a product URL
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              placeholder="Paste Product URL (Amazon, Shopify, App Store)…"
              className="h-12 flex-1 rounded-xl border border-border bg-background/60 px-4 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]/30 transition-all shadow-inner"
              defaultValue="https://amazon.com/dp/SmartPhone-Pro-X"
            />
            <button
              onClick={onAnalyze}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cyan)] px-6 text-sm font-semibold text-[oklch(0.18_0.04_260)] transition-all hover:brightness-110 active:scale[0.98] glow-cyan"
            >
              Analyze <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
          </div>

          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onAnalyze(); }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${dragOver ? "border-[var(--cyan)] bg-[var(--cyan)]/10 scale-[1.02]" : "border-border bg-background/30 hover:border-[var(--cyan)]/60 hover:bg-[var(--cyan)]/5"}`}
          >
            <UploadCloud className={`h-8 w-8 transition-colors ${dragOver ? "text-[var(--cyan)]" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium">Drop CSV / JSON Export Here</p>
            <p className="text-xs text-muted-foreground">Up to 100MB · We auto-detect schema</p>
            <input type="file" className="hidden" onChange={onAnalyze} />
          </label>
        </div>
      </div>
    </motion.div>
  );
}

function LoadingView() {
  const [step, setStep] = useState(0);
  const steps = [
    "Ingesting Data...",
    "Running NLP Sentiment Models...",
    "Detecting Anomalies...",
    "Generating Dashboard..."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStep(currentStep);
      }
    }, 850); // Timing matches ~3.5 seconds total exactly
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[40vh]"
    >
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border-4 border-muted/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-[var(--cyan)] border-r-[var(--cyan)]/50 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 rounded-full backdrop-blur-sm">
          <Zap className="h-8 w-8 text-[var(--cyan)] animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full bg-[var(--cyan)]/20 blur-[30px] animate-pulse" />
      </div>
      <div className="mt-10 text-center h-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-semibold tracking-wide text-foreground bg-clip-text text-transparent bg-gradient-to-r from-[var(--cyan)] to-[var(--cyan)]"
            style={{ WebkitTextFillColor: 'var(--foreground)' }} // fallback
          >
            {steps[step]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const trendData = [
  { time: "Mon", sentiment: 82, volume: 120 },
  { time: "Tue", sentiment: 78, volume: 150 },
  { time: "Wed", sentiment: 85, volume: 180 },
  { time: "Thu", sentiment: 60, volume: 340 },
  { time: "Fri", sentiment: 42, volume: 590 },
  { time: "Sat", sentiment: 45, volume: 550 },
  { time: "Sun", sentiment: 48, volume: 410 },
];

function DashboardView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      {/* Priority Alerts (Left) */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Priority Alerts</h3>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass rounded-xl p-5 border-l-4 border-l-[var(--pink)] relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-0 right-0 p-3 opacity-[0.03] rotate-12 transition-transform hover:rotate-6 hover:scale-110">
            <AlertTriangle className="h-24 w-24 text-[var(--pink)]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pink)]/15 text-[var(--pink)] shadow-inner">
                <TrendingDown className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-black text-[var(--pink)] uppercase tracking-wider">Critical Anomaly</span>
            </div>
            <p className="text-sm font-bold text-foreground leading-tight">38% spike in packaging complaints.</p>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">SmartPhone Pro X cases arriving scratched.</p>
            <div className="mt-4 flex gap-2">
              <button className="text-[11px] font-semibold text-[var(--pink)] hover:underline flex items-center gap-1">
                View 142 cases <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass rounded-xl p-5 border-l-4 border-l-[var(--warning)] shadow-md"
        >
           <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--warning)]/15 text-[var(--warning)] shadow-inner">
               <MessageSquareWarning className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-black text-[var(--warning)] uppercase tracking-wider">Sarcasm Detected</span>
          </div>
          <p className="text-sm font-bold text-foreground leading-tight">"Battery life is amazing... if you only use it for 10 minutes."</p>
          <p className="text-xs text-muted-foreground mt-1.5">Found in 45 recent reviews.</p>
        </motion.div>
      </div>

      {/* Main Chart (Center) */}
      <div className="col-span-1 md:col-span-6 space-y-4">
         <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Sentiment vs. Volume Trend</h3>
         
         <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-xl p-6 h-[400px] flex flex-col shadow-lg relative"
         >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--cyan)]/5 rounded-full blur-[80px] pointer-events-none" />
            <div className="mb-6 flex items-start justify-between relative z-10">
              <div>
                <h4 className="text-xl font-bold tracking-tight">SmartPhone Pro X</h4>
                <p className="text-xs font-medium text-muted-foreground mt-1">Last 7 days · 2,340 mentions</p>
              </div>
              <div className="flex gap-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]"></span> Rating
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--purple)] shadow-[0_0_8px_var(--purple)]"></span> Volume
                  </div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative min-h-0 z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--purple)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 600 }} 
                      dy={10} 
                    />
                    <YAxis 
                      yAxisId="left" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 600 }} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontWeight: 600 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--card)', 
                        borderColor: 'var(--border)', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        fontWeight: 600
                      }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="sentiment" 
                      stroke="var(--cyan)" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorSentiment)" 
                    />
                    <Area 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="var(--purple)" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </motion.div>
      </div>

      {/* Live Feed (Right) */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Feed</h3>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cyan)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--cyan)] shadow-[0_0_8px_var(--cyan)]"></span>
          </span>
        </div>
        
        <div className="space-y-3 relative">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-border/50 -z-10 hidden sm:block" />
          {[
            { tag: "Battery", color: "var(--success)", sentiment: 92, text: "Lasts all day, very impressed!" },
            { tag: "Packaging", color: "var(--pink)", sentiment: 12, text: "Box came completely crushed upon delivery.", alert: true },
            { tag: "Camera", color: "var(--cyan)", sentiment: 88, text: "Night mode is incredible." },
            { tag: "Screen", color: "var(--warning)", sentiment: 45, text: "A bit too reflective outside." },
          ].map((item, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
               className="glass rounded-xl p-4 shadow-sm border border-transparent hover:border-border transition-colors hover:bg-card/80 cursor-pointer" 
             >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm bg-background/80 border border-border" style={{ color: item.color }}>
                    {item.tag}
                  </span>
                  {item.alert && <AlertTriangle className="h-3.5 w-3.5 text-[var(--pink)] animate-pulse" />}
                </div>
                <p className="text-xs font-medium text-foreground mt-2 line-clamp-2 leading-relaxed">{item.text}</p>
             </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
