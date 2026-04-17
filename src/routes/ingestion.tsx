import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/ingestion")({
  component: () => (
    <DashboardLayout>
      <Placeholder title="Review Ingestion" desc="Upload CSVs, connect APIs, and monitor review intake pipelines." />
    </DashboardLayout>
  ),
});

function Placeholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
