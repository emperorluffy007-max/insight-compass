import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: () => (
    <DashboardLayout>
      <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card text-center">
        <Settings className="h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Settings</h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">Configure detection thresholds, integrations, and team access.</p>
      </div>
    </DashboardLayout>
  ),
});
