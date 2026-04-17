import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Radar } from "lucide-react";

export const Route = createFileRoute("/radar")({
  component: () => (
    <DashboardLayout>
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card text-center">
        <Radar className="h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Trend Radar</h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">Emerging topics, sentiment shifts, and competitor benchmarking.</p>
      </div>
    </DashboardLayout>
  ),
});
