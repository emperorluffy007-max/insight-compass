import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
