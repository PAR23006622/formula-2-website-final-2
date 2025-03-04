"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartDescription } from "@/components/ui/chart-description";

interface ChartContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  isLineChart?: boolean;
}

export function ChartContainer({ title, description, children, isLineChart = false }: ChartContainerProps) {
  return (
    <Card className={`chart-card ${isLineChart ? 'h-[600px]' : 'h-[480px]'}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <ChartDescription>{description}</ChartDescription>
      </CardHeader>
      <CardContent className="chart-content">
        <div className="chart-wrapper">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}