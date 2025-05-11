import { ProductivityInsightsSkeleton } from "@/components/dashboard/productivity-insights/productivity-insights";
import { StatisticsSkeleton } from "@/components/dashboard/statistics-overview/statistics";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen font-mono">
      <div className="container mx-auto pt-8">
        <main className="py-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="bg-muted mb-2 h-6 w-48 animate-pulse rounded" />
              <div className="bg-muted h-4 w-64 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-9 w-36 animate-pulse rounded" />
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <StatisticsSkeleton />
          </div>

          <ProductivityInsightsSkeleton />
        </main>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
