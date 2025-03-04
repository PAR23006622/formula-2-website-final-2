import { WelcomeSection } from "@/components/home/welcome-section";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { FeaturedCharts } from "@/components/home/featured-charts";
import { RecentResults } from "@/components/dashboard/recent-results";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="chart-card h-auto mb-8">
        <CardContent className="p-6">
          <WelcomeSection />
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card className="chart-card h-auto">
          <CardContent className="p-6">
            <StatsCards />
          </CardContent>
        </Card>

        <Card className="chart-card h-auto">
          <CardContent className="p-6">
            <FeaturedCharts />
          </CardContent>
        </Card>

        <Card className="chart-card h-auto">
          <CardContent className="p-6">
            <RecentResults />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}