import { WelcomeSection } from "@/components/home/welcome-section";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { FeaturedCharts } from "@/components/home/featured-charts";
import { RecentResults } from "@/components/dashboard/recent-results";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <WelcomeSection />
      <StatsCards />
      <FeaturedCharts />
      <RecentResults />
    </div>
  );
}