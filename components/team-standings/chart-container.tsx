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
    <Card className="dark:bg-[#1f2937] dark:border-gray-800">
      <CardHeader className="space-y-1 px-6 pt-6">
        <CardTitle className="dark:text-white">{title}</CardTitle>
        <ChartDescription className="dark:text-gray-300">{description}</ChartDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className={isLineChart ? 'h-[500px]' : 'h-[400px]'}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}