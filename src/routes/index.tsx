import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { KpiRibbon } from "@/components/KpiRibbon";
import { AlertBanner } from "@/components/AlertBanner";
import { RecommendationsList } from "@/components/RecommendationsList";
import { SentimentTable } from "@/components/SentimentTable";
import { TrendChart } from "@/components/TrendChart";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard · ReviewIQ" },
      { name: "description", content: "Real-time customer review intelligence, anomaly detection, and AI recommendations." },
    ],
  }),
});

function Dashboard() {
  return (
    <DashboardLayout>
      <KpiRibbon />
      <AlertBanner />
      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecommendationsList />
        </div>
        <div className="xl:col-span-2">
          <TrendChart />
        </div>
      </div>
      <SentimentTable />
    </DashboardLayout>
  );
}
