"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDescription } from "@/components/ui/chart-description";

interface ChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

// Container for the large cumulative points chart at the top
export function LargeChartContainer({ 
  title, 
  description, 
  children, 
  className = ""
}: ChartContainerProps) {
  return (
    <Card className={`chart-card h-[445px] px-6 py-1 ${className}`}>
      <CardHeader className="pb-2 px-0 pt-4">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <ChartDescription className="text-sm text-muted-foreground">{description}</ChartDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[400px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

// Container for the smaller grid charts
export function ChartContainer({ 
  title, 
  description, 
  children, 
  className = ""
}: ChartContainerProps) {
  return (
    <Card className={`chart-card h-[580px] px-6 py-1 ${className}`}>
      <CardHeader className="pb-2 px-0 pt-4">
        {title && <CardTitle>{title}</CardTitle>}
        {description && <ChartDescription className="text-sm text-muted-foreground">{description}</ChartDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[350px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}