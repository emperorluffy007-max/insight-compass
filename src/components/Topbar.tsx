import { Upload, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur">
      <div className="flex flex-col">
        <h1 className="text-base font-semibold tracking-tight">Customer Review Intelligence</h1>
        <p className="text-xs text-muted-foreground">Real-time sentiment & anomaly monitoring</p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search reviews, products…"
            className="h-9 w-72 rounded-lg border border-input bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger animate-pulse" />
        </Button>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_20px_-6px_var(--primary)]">
          <Upload className="h-4 w-4" />
          Upload CSV / Connect API
        </Button>
      </div>
    </header>
  );
}
