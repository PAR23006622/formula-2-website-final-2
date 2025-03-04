"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WelcomeSection() {
  return (
    <div className="space-y-6">
      <Card className="chart-card h-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Formula 2 Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-6">
            Your comprehensive platform for Formula 2 championship statistics, driver performance analysis, and real-time race insights.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="chart-card h-auto">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Driver Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Detailed performance metrics and championship progress for every driver
            </p>
          </CardContent>
        </Card>

        <Card className="chart-card h-auto">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Team Statistics</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive team standings and performance comparisons
            </p>
          </CardContent>
        </Card>

        <Card className="chart-card h-auto">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Race Analysis</h3>
            <p className="text-sm text-muted-foreground">
              In-depth race results and performance breakdowns
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}